import { useState } from 'react';
import './App.css';

const botName = 'IronChat';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: 'Sorry, I could not find a reply. Please try again.' },
        ]);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'I cannot reach the server right now. Please check the backend.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-page">
      <section className="chat-card">
        <header className="chat-header">
          <div className="bot-avatar">⚡</div>
          <div>
            <h1>{botName}</h1>
            <p>Your friendly AI helper for quick answers.</p>
          </div>
        </header>

        <div className="chat-window">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Start a conversation</h2>
              <p>Ask me anything and I will do my best to help.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}>
              <div className="message-name">{msg.role === 'user' ? 'You' : botName}</div>
              <div className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row bot-row">
              <div className="message-name">{botName}</div>
              <div className="message-bubble bot-bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            Send
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
