import Logo from './Logo'

function Sidebar({
  activeChat,
  chats,
  onCreateChat,
  onDeleteChat,
  onUpdateChatTitle,
  onSelectChat,
  sidebarOpen,
  setSidebarOpen,
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
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-[#f9f9f9] p-3 text-slate-950 transition duration-300 dark:bg-[#171717] dark:text-white lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <Logo size="sm" showText />

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-white/10 lg:hidden"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateChat}
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <span className="text-lg">＋</span>
          New chat
        </button>

        <div className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto">
          {chats.length === 0 && (
            <div className="rounded-xl px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
              No chats yet.
            </div>
          )}

          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-1 rounded-xl pr-1 transition ${
                activeChat?.id === chat.id
                  ? 'bg-slate-200 font-semibold dark:bg-[#2f2f2f]'
                  : 'hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectChat(chat)}
                className="min-w-0 flex-1 truncate px-3 py-3 text-left text-sm"
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
                className="flex-none rounded-lg px-2 py-1 text-xs text-slate-500 opacity-0 transition hover:bg-white hover:text-slate-950 group-hover:opacity-100 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
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
                className="flex-none rounded-lg px-2 py-1 text-xs text-red-500 opacity-0 transition hover:bg-red-50 group-hover:opacity-100 dark:hover:bg-red-500/10"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 px-2 py-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          Markdown supported with headings, lists, tables, and code blocks.
        </div>
      </aside>
    </>
  )
}

export default Sidebar
