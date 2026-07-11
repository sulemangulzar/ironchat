import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'

function Dashboard({
  activeChat,
  appError,
  chats,
  isDark,
  isLoading,
  message,
  messages,
  onCreateChat,
  onDeleteChat,
  onLogout,
  onUpdateChatTitle,
  sendMessage,
  onSelectChat,
  setIsDark,
  setMessage,
  setPage,
  setSidebarOpen,
  sidebarOpen,
  user,
}) {
  return (
    <main className="flex h-screen overflow-hidden bg-white text-slate-950 dark:bg-[#212121] dark:text-white">
      <Sidebar
        activeChat={activeChat}
        chats={chats}
        onCreateChat={onCreateChat}
        onDeleteChat={onDeleteChat}
        onUpdateChatTitle={onUpdateChatTitle}
        onSelectChat={onSelectChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-[#212121] sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
            >
              ☰
            </button>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-base font-semibold">{activeChat?.title || 'IronChat'}</h1>
              {activeChat && (
                <div className="flex flex-none items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateChatTitle(activeChat)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteChat(activeChat)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-44 truncate text-sm text-slate-500 dark:text-slate-400 sm:block">
              {user?.username || 'Workspace'}
            </span>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <button
              type="button"
              onClick={() => setPage('landing')}
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 sm:block"
            >
              Home
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              Logout
            </button>
          </div>
        </header>

        {appError && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 sm:px-6">
            {appError}
          </div>
        )}

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
