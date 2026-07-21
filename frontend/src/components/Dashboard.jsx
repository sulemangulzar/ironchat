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
  stopMessage,
  enableSearch,
  setEnableSearch,
  onInputFocus,
  onSelectChat,
  setIsDark,
  setMessage,
  setPage,
  setSidebarOpen,
  sidebarOpen,
  user,
}) {
  return (
    <main className="flex h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#0f0f11] dark:text-white">
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
        <header className="sticky top-0 z-10 flex h-16 flex-none items-center justify-between border-b border-transparent bg-white/60 px-3 glass dark:bg-[#0f0f11]/60 sm:px-6 before:absolute before:inset-x-0 before:-bottom-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-violet-500/20 before:to-transparent">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 pr-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-full p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
              aria-label="Open sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="14" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              {isDashboardLoading ? (
                <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-[#2f2f2f] sm:w-48" />
              ) : (
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <h1 className="truncate text-base font-black tracking-tight text-slate-900 dark:text-white sm:text-lg">
                    {activeChat?.title || 'IronChat'}
                  </h1>
                  {activeChat && !isDashboardLoading && (
                    <div className="flex flex-none items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onUpdateChatTitle(activeChat)}
                        disabled={isActionLoading}
                        className="rounded-md px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white sm:px-2 sm:text-[11px]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteChat(activeChat)}
                        disabled={isActionLoading}
                        className="rounded-md px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 sm:px-2 sm:text-[11px]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-none items-center gap-2 sm:gap-4">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Workspace
              </span>
              <span className="max-w-[150px] truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isDashboardLoading ? 'Loading...' : user?.username}
              </span>
            </div>
            
            <div className="hidden h-8 w-px bg-slate-200 dark:bg-white/10 sm:block"></div>
            
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
              className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 hover:shadow-violet-500/25 sm:px-4 sm:text-sm"
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
          stopMessage={stopMessage}
          setMessage={setMessage}
          enableSearch={enableSearch}
          setEnableSearch={setEnableSearch}
          onInputFocus={onInputFocus}
        />
      </section>
    </main>
  )
}

export default Dashboard
