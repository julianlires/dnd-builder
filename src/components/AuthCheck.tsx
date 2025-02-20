'use client';

import { useState, useEffect } from 'react';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  if (isLoading) {
    return null;
  }
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production' && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4">Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            placeholder="Enter site password"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return children;
}
