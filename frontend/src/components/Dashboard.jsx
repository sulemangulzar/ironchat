import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'

function Dashboard({
  activeChat,
  isDark,
  isLoading,
  message,
  messages,
  sendMessage,
  setActiveChat,
  setIsDark,
  setMessage,
  setPage,
  setSidebarOpen,
  sidebarOpen,
}) {
  return (
    <main className="flex h-screen overflow-hidden bg-slate-100 text-slate-950 dark:bg-[#080b12] dark:text-white">
      <Sidebar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-[#0d111c]/80 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
            >
              ☰
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black sm:text-xl">{activeChat.title}</h1>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">IronChat assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <button
              type="button"
              onClick={() => setPage('landing')}
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-slate-100 sm:block"
            >
              Home
            </button>
          </div>
        </header>

        <ChatWindow
          activeChat={activeChat}
          isLoading={isLoading}
          message={message}
          messages={messages}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </section>
    </main>
  )
}

export default Dashboard
