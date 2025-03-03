'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './chat.module.css';

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
    console.log(process.env.NEXT_PUBLIC_API_WEBSOCKET_URL);
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_WEBSOCKET_URL}/ws/chat`);
    console.log(ws);

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      addMessage('Connected to server', 'server');
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      addMessage(event.data, 'server');
    };

    ws.onclose = () => {
      setIsConnected(false);
      addMessage('Disconnected from server', 'server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnecting(false);
      addMessage('Error connecting to server', 'server');
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
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

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h1>Chat</h1>
          <button
            onClick={isConnected ? disconnect : connect}
            className={`${styles.connectButton} ${isConnected ? styles.connected : ''}`}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.sender]}`}
            >
              <div className={styles.messageContent}>
                <p>{message.text}</p>
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
