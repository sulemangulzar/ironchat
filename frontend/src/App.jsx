import { useEffect, useState } from 'react'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import { clearTokens, hasSession } from './lib/storage'
import {
  createChat,
  deleteChat,
  getChats,
  getCurrentUser,
  getChatMessages,
  loginUser,
  sendChatMessage,
  signupUser,
  updateChatTitle,
} from './lib/api'
import './App.css'

function App() {
  const [page, setPage] = useState(hasSession() ? 'dashboard' : 'landing')
  const [isDark, setIsDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChat, setActiveChat] = useState(null)
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to IronChat. Login, start a chat, and ask me anything.',
    },
  ])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [appError, setAppError] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    if (page === 'dashboard' && hasSession()) {
      loadDashboard()
    }
  }, [page])

  const loadDashboard = async () => {
    setAppError('')

    try {
      const [currentUser, chatList] = await Promise.all([getCurrentUser(), getChats()])
      setUser(currentUser)

      if (chatList.length > 0) {
        setChats(chatList)
        setActiveChat((current) => current || chatList[0])
        return
      }

      const firstChat = await createChat()
      setChats([firstChat])
      setActiveChat(firstChat)
    } catch (error) {
      setAppError(error.message || 'Could not load dashboard.')
      if (!hasSession()) {
        setPage('login')
      }
    }
  }

  const handleAuth = async (type, form) => {
    if (type === 'signup') {
      await signupUser(form)
    }

    await loginUser({ email: form.email, password: form.password })
    setPage('dashboard')
  }

  const handleLogout = () => {
    clearTokens()
    setUser(null)
    setChats([])
    setActiveChat(null)
    setMessages([
      {
        role: 'assistant',
        content: 'Welcome to IronChat. Login, start a chat, and ask me anything.',
      },
    ])
    setPage('landing')
  }

  const formatChatMessages = (chatMessages) => {
    if (chatMessages.length === 0) {
      return [
        {
          role: 'assistant',
          content: 'This chat is empty. Ask your first question to begin.',
        },
      ]
    }

    return chatMessages.map((chatMessage) => ({
      role: chatMessage.role,
      content: chatMessage.content,
    }))
  }

  const handleSelectChat = async (chat) => {
    setActiveChat(chat)
    setSidebarOpen(false)
    setAppError('')
    setIsLoading(true)

    try {
      const chatMessages = await getChatMessages(chat.id)
      setMessages(formatChatMessages(chatMessages))
    } catch (error) {
      setAppError(error.message || 'Could not load chat messages.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChat = async () => {
    setAppError('')

    try {
      const newChat = await createChat()
      setChats([newChat, ...chats])
      setActiveChat(newChat)
      setMessages([
        {
          role: 'assistant',
          content: 'New chat started. What would you like to talk about?',
        },
      ])
      setSidebarOpen(false)
    } catch (error) {
      setAppError(error.message || 'Could not create chat.')
    }
  }

  const handleUpdateChatTitle = async (chat) => {
    const title = window.prompt('Update chat title', chat.title || 'New Chat')

    if (!title?.trim()) return

    setAppError('')

    try {
      const updatedChat = await updateChatTitle(chat.id, title.trim())
      setChats((currentChats) =>
        currentChats.map((item) => (item.id === chat.id ? updatedChat : item)),
      )
      setActiveChat((current) => (current?.id === chat.id ? updatedChat : current))
    } catch (error) {
      setAppError(error.message || 'Could not update chat title.')
    }
  }

  const handleDeleteChat = async (chat) => {
    const shouldDelete = window.confirm(`Delete "${chat.title || 'New Chat'}"?`)

    if (!shouldDelete) return

    setAppError('')

    try {
      await deleteChat(chat.id)
      const remainingChats = chats.filter((item) => item.id !== chat.id)
      setChats(remainingChats)

      if (activeChat?.id === chat.id) {
        const nextChat = remainingChats[0] || null
        setActiveChat(nextChat)

        if (nextChat) {
          const chatMessages = await getChatMessages(nextChat.id)
          setMessages(formatChatMessages(chatMessages))
        } else {
          setMessages([
            {
              role: 'assistant',
              content: 'Chat deleted. Create a new chat to begin.',
            },
          ])
        }
      }
    } catch (error) {
      setAppError(error.message || 'Could not delete chat.')
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading || !activeChat) return

    const userMessage = { role: 'user', content: message.trim() }
    const assistantMessage = { role: 'assistant', content: '' }
    const nextMessages = [...messages, userMessage, assistantMessage]

    setMessages(nextMessages)
    setMessage('')
    setIsLoading(true)
    setAppError('')

    try {
      await sendChatMessage(activeChat.id, userMessage.content, (_, fullText) => {
        setMessages([...nextMessages.slice(0, -1), { role: 'assistant', content: fullText }])
      })
    } catch (error) {
      setMessages([
        ...nextMessages.slice(0, -1),
        {
          role: 'assistant',
          content: error.message || 'I could not reach the backend. Please check your deployment.',
        },
      ])
    } finally {
      setIsLoading(false)
      loadDashboard()
    }
  }

  if (page === 'login' || page === 'signup') {
    return (
      <AuthPage
        type={page}
        isDark={isDark}
        setIsDark={setIsDark}
        setPage={setPage}
        onAuth={handleAuth}
      />
    )
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        activeChat={activeChat}
        appError={appError}
        chats={chats}
        isDark={isDark}
        isLoading={isLoading}
        message={message}
        messages={messages}
        onCreateChat={handleCreateChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        onUpdateChatTitle={handleUpdateChatTitle}
        sendMessage={sendMessage}
        onSelectChat={handleSelectChat}
        setIsDark={setIsDark}
        setMessage={setMessage}
        setPage={setPage}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        user={user}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-[#212121] dark:text-white">
      <Header isDark={isDark} setIsDark={setIsDark} setPage={setPage} />
      <Hero setPage={setPage} />
      <Footer />
    </div>
  )
}

export default App
