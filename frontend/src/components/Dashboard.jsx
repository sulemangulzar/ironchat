import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'

function Dashboard({
  activeChat,
  appError,
  chats,
  isDark,
  isActionLoading,
  isChatLoading,
  isDashboardLoading,
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
          isActionLoading={isActionLoading}
          isDashboardLoading={isDashboardLoading}
          onCreateChat={onCreateChat}
          onDeleteChat={onDeleteChat}
          onUpdateChatTitle={onUpdateChatTitle}
          onSelectChat={onSelectChat}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setPage={setPage}
        />

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 flex-none items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-md dark:border-white/5 dark:bg-[#121212]/80 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-full p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
              aria-label="Open sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="14" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex min-w-0 flex-col justify-center">
              {isDashboardLoading ? (
                <div className="h-5 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-[#2f2f2f]" />
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="truncate text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    {activeChat?.title || 'IronChat'}
                  </h1>
                  {activeChat && !isDashboardLoading && (
                    <div className="flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onUpdateChatTitle(activeChat)}
                        disabled={isActionLoading}
                        className="rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteChat(activeChat)}
                        disabled={isActionLoading}
                        className="rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Workspace
              </span>
              <span className="max-w-[150px] truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isDashboardLoading ? 'Loading...' : user?.username}
              </span>
            </div>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
            
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            
            <button
              type="button"
              onClick={() => setPage('landing')}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white sm:block"
            >
              Home
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-bold text-white shadow-sm ring-1 ring-slate-900/10 transition-all hover:bg-slate-800 hover:shadow dark:bg-white dark:text-slate-900 dark:ring-white/10 dark:hover:bg-slate-100"
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
          isActionLoading={isActionLoading}
          isChatLoading={isDashboardLoading || isChatLoading}
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
