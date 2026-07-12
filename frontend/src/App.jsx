import { useCallback, useEffect, useState } from 'react'
import AuthPage from './components/AuthPage'
import ChatActionModal from './components/ChatActionModal'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import ToastContainer from './components/ToastContainer'
import {
  clearActiveChatId,
  clearTokens,
  getActiveChatId,
  hasSession,
  saveActiveChatId,
  saveTokens,
} from './lib/storage'
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

const sortChatsDescending = (chatList) => {
  return [...chatList].sort((firstChat, secondChat) => {
    const firstDate = new Date(firstChat.updated_at || firstChat.created_at || 0).getTime()
    const secondDate = new Date(secondChat.updated_at || secondChat.created_at || 0).getTime()

    return secondDate - firstDate
  })
}

const pageRoutes = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
}

const getPageFromPath = () => {
  // Handle OAuth redirect — tokens arrive as URL params before first render
  const params = new URLSearchParams(window.location.search)
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')

  if (accessToken && refreshToken) {
    saveTokens({ access_token: accessToken, refresh_token: refreshToken })
    window.history.replaceState(null, '', pageRoutes.dashboard)
    return 'dashboard'
  }

  if (window.location.pathname === pageRoutes.login) return 'login'
  if (window.location.pathname === pageRoutes.signup) return 'signup'
  if (window.location.pathname === pageRoutes.dashboard) return hasSession() ? 'dashboard' : 'login'

  return 'landing'
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

function App() {
  const [page, setPage] = useState(getPageFromPath)
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
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [appError, setAppError] = useState('')
  const [toasts, setToasts] = useState([])
  const [chatAction, setChatAction] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const navigate = useCallback((nextPage, options = {}) => {
    const nextPath = pageRoutes[nextPage] || pageRoutes.landing
    const historyAction = options.replace ? 'replaceState' : 'pushState'

    if (window.location.pathname !== nextPath) {
      window.history[historyAction](null, '', nextPath)
    }

    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (window.location.pathname === pageRoutes.dashboard && !hasSession()) {
      navigate('login', { replace: true })
    }
  }, [navigate])

  const showToast = useCallback((toast) => {
    const id = crypto.randomUUID()
    setToasts((currentToasts) => [...currentToasts, { id, type: 'info', ...toast }])

    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((item) => item.id !== id))
    }, 3500)
  }, [])

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter((item) => item.id !== toastId))
  }, [])

  const loadDashboard = useCallback(async ({ showLoader = true } = {}) => {
    setAppError('')

    if (showLoader) {
      setIsDashboardLoading(true)
      setIsChatLoading(true)
    }

    try {
      const [currentUser, chatList] = await Promise.all([getCurrentUser(), getChats()])
      setUser(currentUser)

      if (chatList.length > 0) {
        const sortedChats = sortChatsDescending(chatList)
        const savedChatId = getActiveChatId()
        const selectedChat = sortedChats.find((chat) => chat.id === savedChatId) || sortedChats[0]

        setChats(sortedChats)
        setActiveChat(selectedChat)
        saveActiveChatId(selectedChat.id)

        const chatMessages = await getChatMessages(selectedChat.id)
        setMessages(formatChatMessages(chatMessages))
        return
      }

      const firstChat = await createChat()
      setChats([firstChat])
      setActiveChat(firstChat)
      saveActiveChatId(firstChat.id)
    } catch (error) {
      const errorMessage = error.message || 'Could not load dashboard.'
      setAppError(errorMessage)
      showToast({
        type: 'error',
        title: 'Dashboard failed to load',
        message: errorMessage,
      })
      if (!hasSession()) {
        navigate('login', { replace: true })
      }
    } finally {
      if (showLoader) {
        setIsDashboardLoading(false)
        setIsChatLoading(false)
      }
    }
  }, [navigate, showToast])

  useEffect(() => {
    if (page === 'dashboard' && hasSession()) {
      loadDashboard()
    }
  }, [loadDashboard, page])

  const handleAuth = async (type, form) => {
    if (type === 'signup') {
      await signupUser(form)
    }

    await loginUser({ email: form.email, password: form.password })
    showToast({
      type: 'success',
      title: type === 'signup' ? 'Account created' : 'Welcome back',
      message: 'Opening your IronChat dashboard.',
    })
    navigate('dashboard')
  }

  const handleLogout = () => {
    clearTokens()
    setUser(null)
    setChats([])
    setActiveChat(null)
    clearActiveChatId()
    setMessages([
      {
        role: 'assistant',
        content: 'Welcome to IronChat. Login, start a chat, and ask me anything.',
      },
    ])
    navigate('landing')
    showToast({
      type: 'success',
      title: 'Logged out',
      message: 'You have safely left your dashboard.',
    })
  }

  const handleSelectChat = async (chat) => {
    if (activeChat?.id === chat.id) {
      setSidebarOpen(false)
      return
    }

    setActiveChat(chat)
    saveActiveChatId(chat.id)
    setSidebarOpen(false)
    setAppError('')
    setMessage('')
    setMessages([])
    setIsChatLoading(true)

    try {
      const chatMessages = await getChatMessages(chat.id)
      setMessages(formatChatMessages(chatMessages))
    } catch (error) {
      const errorMessage = error.message || 'Could not load chat messages.'
      setAppError(errorMessage)
      showToast({
        type: 'error',
        title: 'Chat failed to load',
        message: errorMessage,
      })
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleCreateChat = async () => {
    if (isActionLoading) return

    setAppError('')
    setIsActionLoading(true)

    try {
      const newChat = await createChat()
      setChats((currentChats) => sortChatsDescending([newChat, ...currentChats]))
      setActiveChat(newChat)
      saveActiveChatId(newChat.id)
      setMessages([
        {
          role: 'assistant',
          content: 'New chat started. What would you like to talk about?',
        },
      ])
      setSidebarOpen(false)
      showToast({
        type: 'success',
        title: 'New chat created',
        message: 'Your new conversation is ready.',
      })
    } catch (error) {
      const errorMessage = error.message || 'Could not create chat.'
      setAppError(errorMessage)
      showToast({
        type: 'error',
        title: 'Could not create chat',
        message: errorMessage,
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUpdateChatTitle = (chat) => {
    if (isActionLoading) return
    setChatAction({ type: 'edit', chat })
  }

  const confirmUpdateChatTitle = async (title) => {
    if (!chatAction?.chat || isActionLoading) return

    const chat = chatAction.chat

    setAppError('')
    setIsActionLoading(true)

    try {
      const updatedChat = await updateChatTitle(chat.id, title.trim())
      setChats((currentChats) =>
        sortChatsDescending(currentChats.map((item) => (item.id === chat.id ? updatedChat : item))),
      )
      setActiveChat((current) => (current?.id === chat.id ? updatedChat : current))
      setChatAction(null)
      showToast({
        type: 'success',
        title: 'Title updated',
        message: 'Your chat title was saved.',
      })
    } catch (error) {
      const errorMessage = error.message || 'Could not update chat title.'
      setAppError(errorMessage)
      showToast({
        type: 'error',
        title: 'Could not update title',
        message: errorMessage,
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteChat = (chat) => {
    if (isActionLoading) return
    setChatAction({ type: 'delete', chat })
  }

  const confirmDeleteChat = async () => {
    if (!chatAction?.chat || isActionLoading) return

    const chat = chatAction.chat

    setAppError('')
    setIsActionLoading(true)

    try {
      await deleteChat(chat.id)
      const remainingChats = sortChatsDescending(chats.filter((item) => item.id !== chat.id))
      setChats(remainingChats)

      if (activeChat?.id === chat.id) {
        const nextChat = remainingChats[0] || null
        setActiveChat(nextChat)

        if (nextChat) {
          saveActiveChatId(nextChat.id)
          setMessages([])
          setIsChatLoading(true)

          try {
            const chatMessages = await getChatMessages(nextChat.id)
            setMessages(formatChatMessages(chatMessages))
          } finally {
            setIsChatLoading(false)
          }
        } else {
          clearActiveChatId()
          setMessages([
            {
              role: 'assistant',
              content: 'Chat deleted. Create a new chat to begin.',
            },
          ])
        }
      }
      setChatAction(null)
      showToast({
        type: 'success',
        title: 'Chat deleted',
        message: 'The conversation was removed.',
      })
    } catch (error) {
      const errorMessage = error.message || 'Could not delete chat.'
      setAppError(errorMessage)
      showToast({
        type: 'error',
        title: 'Could not delete chat',
        message: errorMessage,
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading || isChatLoading || isActionLoading || !activeChat) return

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
      const errorMessage = error.message || 'I could not reach the backend. Please check your deployment.'
      setMessages([
        ...nextMessages.slice(0, -1),
        {
          role: 'assistant',
          content: errorMessage,
        },
      ])
      showToast({
        type: 'error',
        title: 'Message failed',
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
      loadDashboard({ showLoader: false })
    }
  }

  if (page === 'login' || page === 'signup') {
    return (
      <>
        <AuthPage
          type={page}
          isDark={isDark}
          setIsDark={setIsDark}
          setPage={navigate}
          onAuth={handleAuth}
          onToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  if (page === 'dashboard') {
    return (
      <>
        <Dashboard
          activeChat={activeChat}
          appError={appError}
          chats={chats}
          isDark={isDark}
          isActionLoading={isActionLoading}
          isChatLoading={isChatLoading}
          isDashboardLoading={isDashboardLoading}
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
          setPage={navigate}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          user={user}
        />
        <ChatActionModal
          action={chatAction}
          isLoading={isActionLoading}
          onClose={() => setChatAction(null)}
          onConfirm={chatAction?.type === 'delete' ? confirmDeleteChat : confirmUpdateChatTitle}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-[#212121] dark:text-white">
        <Header isDark={isDark} setIsDark={setIsDark} setPage={navigate} />
        <Hero setPage={navigate} />
        <Footer />
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

export default App
