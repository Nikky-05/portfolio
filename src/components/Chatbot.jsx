import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { chatbotResponses } from '../data/portfolio';
import './Chatbot.css';

const suggestions = ['skills', 'projects', 'experience', 'contact', 'about', 'rag', 'ocr'];

function getBotResponse(message) {
  const lower = message.toLowerCase();
  const words = lower.split(/\s+/);

  for (const word of words) {
    for (const [key, response] of Object.entries(chatbotResponses)) {
      if (word.includes(key) || key.includes(word)) {
        return response;
      }
    }
  }

  return "I'm not sure about that, but feel free to ask about my skills, projects, experience, or contact info!";
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hey! I'm Nikky's AI assistant. Ask me anything about skills, projects, or experience!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { type: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(msg);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section id="chatbot" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        AI Chatbot
      </motion.h2>

      <motion.div
        className="chatbot-container glass-card"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
      >
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <FiMessageCircle className="chat-header-icon" />
            <div>
              <h3>NB Assistant</h3>
              <span className="chat-status">
                <span className="online-dot" /> Online
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`chat-msg ${msg.type}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {msg.type === 'bot' && <span className="msg-avatar">NB</span>}
              <div className={`msg-bubble ${msg.type}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="chat-msg bot">
              <span className="msg-avatar">NB</span>
              <div className="msg-bubble bot typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        <div className="chat-suggestions">
          {suggestions.map(s => (
            <motion.button
              key={s}
              className="suggestion-chip"
              onClick={() => sendMessage(s)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <motion.button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!input.trim()}
          >
            <FiSend />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
