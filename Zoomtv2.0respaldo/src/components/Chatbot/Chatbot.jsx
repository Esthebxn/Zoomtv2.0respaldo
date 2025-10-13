import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CHATBOT_CONFIG, generatePrompt, getApiConfig } from './chatbotConfig';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: CHATBOT_CONFIG.MESSAGES.WELCOME,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Configuración de Gemini
  const apiConfig = getApiConfig();
  const genAI = new GoogleGenerativeAI(apiConfig.apiKey);
  const model = genAI.getGenerativeModel({ model: apiConfig.model });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus en el input cuando se abre el chat
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const prompt = generatePrompt(userMessage.text);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = {
        id: Date.now() + 1,
        text: text,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta de Gemini:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: CHATBOT_CONFIG.MESSAGES.ERROR,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window dark:chatbot-window-dark">
          <div className="flex flex-col h-[400px]">
            {/* Header */}
            <div className="chatbot-header">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                  {CHATBOT_CONFIG.MESSAGES.CHAT_TITLE}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="chatbot-online-indicator text-xs px-2 py-1 rounded-full">
                    {CHATBOT_CONFIG.MESSAGES.ONLINE_STATUS}
                  </div>
                  <button 
                    onClick={toggleChat}
                    className="chatbot-close-button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="chatbot-messages" id="chatDisplay">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chatbot-message-container ${
                    message.isUser ? 'chatbot-message-user-container' : 'chatbot-message-bot-container'
                  }`}
                >
                  <div
                    className={`${
                      message.isUser
                        ? 'chatbot-message-user'
                        : 'chatbot-message-bot'
                    }`}
                  >
                    <div className="chatbot-message-text">{message.text}</div>
                    <div className="chatbot-message-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="chatbot-message-container chatbot-message-bot-container">
                  <div className="chatbot-message-bot">
                    <div className="chatbot-loading-container">
                      <div className="chatbot-loading-dots">
                        <div className="chatbot-loading-dot"></div>
                        <div className="chatbot-loading-dot"></div>
                        <div className="chatbot-loading-dot"></div>
                      </div>
                      <span className="chatbot-loading-text">{CHATBOT_CONFIG.MESSAGES.LOADING}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="chatbot-input-area dark:chatbot-input-area-dark">
              <div className="flex gap-2">
                <input 
                  ref={inputRef}
                  placeholder={CHATBOT_CONFIG.MESSAGES.PLACEHOLDER} 
                  className="chatbot-input dark:chatbot-input-dark flex-1" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  type="text" 
                />
                <button 
                  className="chatbot-send-button"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  {isLoading ? CHATBOT_CONFIG.MESSAGES.SEND_LOADING : CHATBOT_CONFIG.MESSAGES.SEND_BUTTON}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`chatbot-floating-button ${isOpen ? 'chat-open' : ''}`}
        aria-label="Open chat"
      >
      </button>
    </div>
  );
};

export default Chatbot;
