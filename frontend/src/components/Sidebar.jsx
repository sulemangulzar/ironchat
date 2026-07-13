import Logo from './Logo'

function Sidebar({
  activeChat,
  chats,
  isActionLoading,
  isDashboardLoading,
  onCreateChat,
  onDeleteChat,
  onUpdateChatTitle,
  onSelectChat,
  sidebarOpen,
  setSidebarOpen,
  setPage,
}) {
  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col border-r border-slate-200/60 bg-[#fbfbfb] p-3 text-slate-900 shadow-2xl transition-transform duration-400 ease-out dark:border-white/5 dark:bg-[#121212] dark:text-slate-100 lg:static lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <button
            type="button"
            onClick={() => setPage('landing')}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <Logo size="sm" showText />
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateChat}
          disabled={isActionLoading || isDashboardLoading}
          className="group mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-md hover:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1a1a1a] dark:ring-white/10 dark:hover:bg-[#222] dark:hover:ring-white/20"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-lg transition-colors group-hover:bg-slate-200 dark:bg-white/5 dark:group-hover:bg-white/10">
              {isActionLoading ? '…' : '＋'}
            </span>
            {isActionLoading ? 'Working...' : 'New chat'}
          </span>
        </button>

        <div className="no-scrollbar mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {isDashboardLoading && <SidebarSkeleton />}

          {!isDashboardLoading && chats.length === 0 && (
            <div className="px-3 py-3 text-sm font-medium text-slate-400 dark:text-slate-500">
              No chats yet.
            </div>
          )}

          {!isDashboardLoading && chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-1 rounded-xl pr-1 transition-all duration-200 ${
                activeChat?.id === chat.id
                  ? 'bg-slate-200/50 font-semibold shadow-sm dark:bg-[#252525]'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectChat(chat)}
                disabled={isActionLoading}
                className={`min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed ${
                  activeChat?.id === chat.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {chat.title || 'New Chat'}
              </button>

              <button
                type="button"
                title="Edit title"
                onClick={(event) => {
                  event.stopPropagation()
                  onUpdateChatTitle(chat)
                }}
                disabled={isActionLoading}
                className="flex-none rounded-md px-2 py-1 text-xs font-bold text-slate-400 opacity-0 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-[#333] dark:hover:text-white"
              >
                ✎
              </button>

              <button
                type="button"
                title="Delete chat"
                onClick={(event) => {
                  event.stopPropagation()
                  onDeleteChat(chat)
                }}
                disabled={isActionLoading}
                className="flex-none rounded-md px-2 py-1 text-xs font-bold text-red-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-slate-100/50 p-3 text-[11px] font-medium leading-relaxed text-slate-500 dark:bg-white/5 dark:text-slate-400">
          Markdown supported with headings, lists, tables, and code blocks.
        </div>
      </aside>
    </>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 animate-pulse" aria-label="Loading chats">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 rounded-xl px-3 py-3">
          <div className="h-4 flex-1 rounded-full bg-slate-200 dark:bg-[#2f2f2f]" />
          <div className="h-4 w-8 rounded-full bg-slate-200 dark:bg-[#2f2f2f]" />
        </div>
      ))}
    </div>
  )
}

export default Sidebar
