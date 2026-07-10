import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const ChatApp = () => {
  const { user, token, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch all chats on load
  useEffect(() => {
    fetchChats();
  }, [token]);

  // Fetch messages when currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    } else {
      setMessages([]);
    }
  }, [currentChatId, token]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
        if (data.length > 0 && !currentChatId) {
          setCurrentChatId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch chats', err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(`${apiUrl}/chat/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const newChat = await res.json();
        setChats([newChat, ...chats]);
        setCurrentChatId(newChat.id);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to create new chat', err);
    }
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${apiUrl}/chat/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setChats(chats.filter(c => c.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete chat', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    let targetChatId = currentChatId;

    // If no chat selected, create one first
    if (!targetChatId) {
      try {
        const res = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const newChat = await res.json();
          setChats([newChat, ...chats]);
          targetChatId = newChat.id;
          setCurrentChatId(targetChatId);
        } else {
          return;
        }
      } catch (err) {
        console.error('Failed to create chat for message', err);
        return;
      }
    }

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat/${targetChatId}/message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userText }),
      });

      if (response.ok) {
        const assistantMsg = await response.json();
        setMessages(prev => [...prev, assistantMsg]);
        
        // Refresh chats list to get the generated title if it was the first message
        if (messages.length === 0) {
          setTimeout(fetchChats, 2000); // Give Groq a second to generate the title
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Cannot reach the backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 flex flex-col bg-slate-950 border-r border-slate-800/50 shrink-0">
        <div className="p-4">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium border border-slate-700/50"
          >
            <span className="text-xl leading-none">+</span> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1 custom-scrollbar">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                currentChatId === chat.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-lg opacity-70">💬</span>
                <span className="truncate text-sm font-medium">
                  {chat.title || 'New Conversation'}
                </span>
              </div>
              <button 
                onClick={(e) => deleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all px-2"
                title="Delete Chat"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-900/50 rounded-xl">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="truncate text-sm font-medium">{user?.name}</span>
            </div>
            <button onClick={logout} className="text-xs text-slate-500 hover:text-slate-300 uppercase tracking-wider font-bold p-1">
              Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 relative">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/30 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold tracking-tight gradient-text">⚡ IronChat</div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            
            {!currentChatId || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center mt-32 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl border border-slate-700/50">⚡</div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">How can I help you today?</h2>
                <p className="text-slate-400 max-w-md">Send a message to start a new conversation. I can help with coding, writing, or just answering questions.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 text-sm shadow-sm mt-1">
                      ⚡
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-slate-800/80 text-slate-200 rounded-bl-sm border border-slate-700/50'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-sm shadow-sm mt-1">
                      👤
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 text-sm shadow-sm mt-1">
                  ⚡
                </div>
                <div className="bg-slate-800/80 px-5 py-4 rounded-2xl rounded-bl-sm border border-slate-700/50 shadow-sm typing-indicator flex items-center">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4"></div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-transparent shrink-0">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="Message IronChat..."
              disabled={isLoading}
              className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-2xl pl-5 pr-14 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-lg backdrop-blur-md"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              ↑
            </button>
          </div>
          <div className="text-center text-xs text-slate-500 mt-3 font-medium">
            IronChat can make mistakes. Check important info.
          </div>
        </div>

      </main>
    </div>
  );
};

export default ChatApp;
