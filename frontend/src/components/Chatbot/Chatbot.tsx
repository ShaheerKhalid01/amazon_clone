import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    return currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')
      ? 'http://localhost:5000/api'
      : `${currentOrigin}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBaseUrl();

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Gemini ko conversation history bhi bhejte hain taake context yaad rahe
      // NOTE: Pehla greeting message ("Hi! How can I help...") sirf UI ke liye hai,
      // Gemini ko history mein nahi bhejna — kyunke Gemini history 'user' role se
      // shuru honi chahiye, 'model' se nahi.
      const history = newMessages.slice(1, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch(`${API_BASE}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const json = await res.json();

      if (json.success) {
        setMessages(prev => [...prev, { role: 'bot', text: json.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not process that. Please try again.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Could not connect to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-amazon-orange hover:bg-amazon-orange-dark text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-105"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <FaTimes size={20} /> : <FaComments size={20} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-amazon-navy text-white px-4 py-3 rounded-t-xl">
            <h3 className="font-semibold">Chat Assistant</h3>
            <p className="text-xs text-gray-300">Ask me anything</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-amazon-orange text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                  <FaSpinner className="animate-spin text-gray-400" size={14} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-amazon-orange hover:bg-amazon-orange-dark text-white p-2.5 rounded-full disabled:opacity-40 transition-colors"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;