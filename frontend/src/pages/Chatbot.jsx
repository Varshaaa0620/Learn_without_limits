import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatAPI } from '../services/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Study Assistant. I can help you with questions about Java, Python, programming concepts, or any course-related topics. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage, messages);
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.response?.data?.message || 'Failed to get response. Please try again.');
      
      // Add error message as assistant message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI Study Assistant. I can help you with questions about Java, Python, programming concepts, or any course-related topics. How can I help you today?'
      }
    ]);
    setError('');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>AI Study Assistant</h1>
          <p style={styles.subtitle}>Ask me anything about your courses</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={clearChat} style={styles.clearButton}>
            Clear Chat
          </button>
          <Link to="/" style={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Chat Container */}
      <div style={styles.chatContainer}>
        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage)
              }}
            >
              <div style={styles.messageAvatar}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={styles.messageContent}>
                <div style={styles.messageText}>{message.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, ...styles.assistantMessage }}>
              <div style={styles.messageAvatar}>🤖</div>
              <div style={styles.messageContent}>
                <div style={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            style={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              ...styles.sendButton,
              ...(loading || !input.trim() ? styles.sendButtonDisabled : {})
            }}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      {/* Suggested Questions */}
      <div style={styles.suggestionsContainer}>
        <p style={styles.suggestionsTitle}>Suggested questions:</p>
        <div style={styles.suggestions}>
          {[
            'What is object-oriented programming?',
            'Explain Java inheritance with examples',
            'How do Python decorators work?',
            'What are the differences between Java and Python?',
            'Help me understand recursion'
          ].map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              style={styles.suggestionButton}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  headerContent: {
    flex: 1
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '600'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#aaa',
    fontSize: '0.95rem'
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  clearButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  backLink: {
    backgroundColor: '#e94560',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  chatContainer: {
    flex: 1,
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 350px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  message: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  userMessage: {
    flexDirection: 'row-reverse'
  },
  assistantMessage: {
    flexDirection: 'row'
  },
  messageAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0
  },
  messageContent: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    wordWrap: 'break-word'
  },
  messageText: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: '#333'
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '8px 0'
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#e94560',
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem'
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  sendButton: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  suggestionsContainer: {
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    padding: '0 20px 20px'
  },
  suggestionsTitle: {
    margin: '0 0 10px 0',
    color: '#666',
    fontSize: '0.9rem'
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  suggestionButton: {
    backgroundColor: '#fff',
    color: '#e94560',
    border: '1px solid #e94560',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

// Add CSS animation for typing indicator
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes typing {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .typing-indicator span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #999;
    border-radius: 50%;
    animation: typing 1s infinite;
  }
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
document.head.appendChild(styleSheet);

export default Chatbot;
