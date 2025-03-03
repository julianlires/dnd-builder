'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './chat.module.css';
import type { Components } from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'server';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setIsConnecting(true);
    setConnectionError(null);
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_WEBSOCKET_URL}/ws/chat`);

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    };

    ws.onmessage = (event) => {
      addMessage(event.data, 'server');
    };

    ws.onclose = () => {
      setIsConnected(false);
      setConnectionError(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnecting(false);
      setConnectionError('Failed to connect to server');
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
    setConnectionError(null);
  };

  const addMessage = (text: string, sender: 'user' | 'server') => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      text,
      sender,
      timestamp: new Date()
    }]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current) return;

    wsRef.current.send(inputMessage);
    addMessage(inputMessage, 'user');
    setInputMessage('');
  };

  const MarkdownComponents: Components = {
    code(props) {
      const { children, className, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const isInline = !className;

      return isInline ? (
        <code className={styles.inlineCode} {...rest}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h1>Chat</h1>
          <div className={styles.headerRight}>
            {connectionError ? (
              <div className={`${styles.connectionStatus} ${styles.error}`}>
                {connectionError}
              </div>
            ) : isConnected ? (
              <div className={`${styles.connectionStatus} ${styles.success}`}>
                Connected
              </div>
            ) : isConnecting ? (
              <div className={styles.connectionStatus}>
                Connecting...
              </div>
            ) : null}
            <button
              onClick={isConnected ? disconnect : connect}
              className={`${styles.connectButton} ${isConnected ? styles.connected : ''}`}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.sender]}`}
            >
              <div className={styles.messageContent}>
                {message.sender === 'server' ? (
                  <div className={styles.markdown}>
                    <ReactMarkdown components={MarkdownComponents}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.text}</p>
                )}
                <span className={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className={styles.inputContainer}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className={styles.sendButton}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
