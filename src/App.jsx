import React, { useState } from 'react';

const Icons = {
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  ShoppingCart: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for future AWS Bedrock integration
  const sendMessageToAI = async (message) => {
    try {
      const response = await fetch(
        "https://bsqk8gu8cc.execute-api.us-east-1.amazonaws.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }, 
          body: JSON.stringify({ message }),
        }
      );
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API error:", error);
      return { text: "Server error." };
    }
  };
  

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(inputValue);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response.text
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .tool-item:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        .send-btn:hover:not(:disabled) {
          background-color: #3CB371 !important;
          color: white !important;
        }
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .icon-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <button className="icon-btn" style={{...styles.iconBtn, ...styles.profileBtn}}>
            <Icons.User />
          </button>
          <button className="icon-btn" style={styles.iconBtn}>
            <Icons.Settings />
          </button>
        </div>

        <div>
          <h3 style={styles.toolsTitle}>Tools</h3>
          <button className="tool-item" style={styles.toolItem}>
            <Icons.Clock />
            <span>Order History</span>
          </button>
          <button className="tool-item" style={styles.toolItem}>
            <Icons.Upload />
            <span>Upload List</span>
          </button>
          <button className="tool-item" style={styles.toolItem}>
            <Icons.MapPin />
            <span>Store Map</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Super Awesome Shopper Helper</h1>
          <div style={styles.cartIcon}>
            <Icons.ShoppingCart />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </div>
        </header>

        {/* Chat Area */}
        <div style={{...styles.chatArea, justifyContent: messages.length === 0 ? 'center' : 'flex-start' }}>
          {messages.length === 0 ? (
            <div style={styles.welcomeContainer}>
              <h2 style={styles.welcomeTitle}>What are we craving today?</h2>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Let's stock up..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={styles.chatInput}
                />
                <button 
                  className="send-btn"
                  style={styles.sendBtn}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <Icons.MessageSquare />
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.conversationContainer}>
              <div style={styles.messagesContainer}>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{
                      ...styles.messageRow,
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      ...styles.messageBubble,
                      ...(message.type === 'user' ? styles.userBubble : styles.assistantBubble),
                    }}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{...styles.messageRow, justifyContent: 'flex-start'}}>
                    <div style={{...styles.messageBubble, ...styles.assistantBubble, ...styles.loadingDots}}>
                      <span style={{...styles.dot, animationDelay: '-0.32s'}}></span>
                      <span style={{...styles.dot, animationDelay: '-0.16s'}}></span>
                      <span style={styles.dot}></span>
                    </div>
                  </div>
                )}
              </div>
              
              <div style={styles.conversationInputWrapper}>
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Ask away..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={styles.chatInput}
                  />
                  <button 
                    className="send-btn"
                    style={styles.sendBtn}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Icons.MessageSquare />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: '220px',
    minWidth: '220px',
    backgroundColor: '#3CB371',
    padding: '20px 15px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  toolsTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  toolItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 15px',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    cursor: 'pointer',
    borderRadius: '8px',
    marginBottom: '5px',
    textAlign: 'left',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 40px',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  cartIcon: {
    position: 'relative',
    color: '#3CB371',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#FF4444',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '30px',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '25px',
    padding: '8px 15px',
    width: '100%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  chatInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '10px 5px',
    color: '#1a1a1a',
    backgroundColor: 'transparent',
  },
  sendBtn: {
    backgroundColor: 'white',
    border: '2px solid #3CB371',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#3CB371',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '800px',
    height: '100%',
    margin: '0 auto',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    padding: '15px 20px',
    borderRadius: '20px',
    fontSize: '15px',
    lineHeight: '1.5',
    maxWidth: '70%',
  },
  userBubble: {
    backgroundColor: '#FFF8DC',
    borderBottomRightRadius: '5px',
  },
  assistantBubble: {
    backgroundColor: '#FFD5D5',
    borderBottomLeftRadius: '5px',
  },
  loadingDots: {
    display: 'flex',
    gap: '5px',
    padding: '20px',
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#666',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
  conversationInputWrapper: {
    paddingTop: '20px',
  },
};