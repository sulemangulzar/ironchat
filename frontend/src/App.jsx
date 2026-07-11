import { useEffect, useMemo, useState } from 'react'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import './App.css'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8001').replace(/\/$/, '')

const defaultChat = {
  id: 'general',
  title: 'General Chat',
  preview: 'Ask anything you want...',
}

function App() {
  const [page, setPage] = useState('landing')
  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChat, setActiveChat] = useState(defaultChat)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to IronChat. Ask me anything and I will help you with a clear answer.',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sessionId = useMemo(() => {
    const savedSessionId = localStorage.getItem('ironchat_session_id')

    if (savedSessionId) {
      return savedSessionId
    }

    const newSessionId = globalThis.crypto?.randomUUID?.() || `session-${Date.now()}`
    localStorage.setItem('ironchat_session_id', newSessionId)
    return newSessionId
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = { role: 'user', content: message.trim() }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: userMessage.content }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Backend error. Please try again.')
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.reply }])
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: error.message || 'I could not reach the backend. Please check your deployment.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (page === 'login' || page === 'signup') {
    return <AuthPage type={page} isDark={isDark} setIsDark={setIsDark} setPage={setPage} />
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        activeChat={activeChat}
        isDark={isDark}
        isLoading={isLoading}
        message={message}
        messages={messages}
        sendMessage={sendMessage}
        setActiveChat={setActiveChat}
        setIsDark={setIsDark}
        setMessage={setMessage}
        setPage={setPage}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-slate-950 transition-colors duration-300 dark:bg-[#080b12] dark:text-white">
      <Header isDark={isDark} setIsDark={setIsDark} setPage={setPage} />
      <Hero setPage={setPage} />
      <Footer />
    </div>
  )
}

export default App
