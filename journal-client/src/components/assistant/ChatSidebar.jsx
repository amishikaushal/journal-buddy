import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/assistant.css';

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const isHidden = location.pathname === '/login' || location.pathname === '/signup';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Close chat sidebar when switching to login/register
    if (isHidden) {
      setIsOpen(false);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5050/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.message || 'Sorry, I could not process that request.'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, there was an error processing your message.'
      }]);
    }
  };

  // Only hide visually, don't unmount the component
  return (
    <div 
      className={`chat-sidebar ${isOpen ? 'open' : ''}`} 
      style={{ display: isHidden ? 'none' : 'block' }}
    >
      <button 
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '→' : '←'}
      </button>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.type}`}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="chat-input"
          />
          <button type="submit" className="chat-send">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
