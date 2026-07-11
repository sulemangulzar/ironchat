const chatItems = [
  { id: 'general', title: 'General Chat', preview: 'Ask anything you want...' },
  { id: 'coding', title: 'Coding Help', preview: 'Debug, explain, and build...' },
  { id: 'ideas', title: 'Project Ideas', preview: 'Brainstorm and improve...' },
]

function Sidebar({ activeChat, setActiveChat, sidebarOpen, setSidebarOpen }) {
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
        className={`fixed inset-y-0 left-0 z-40 flex w-80 transform flex-col border-r border-slate-200 bg-white p-4 transition duration-300 dark:border-white/10 dark:bg-[#0d111c] lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 font-black text-slate-950">
              ⚡
            </span>
            <div>
              <p className="font-black">IronChat</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chat dashboard</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          className="mt-6 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white transition hover:-translate-y-0.5 dark:bg-cyan-400 dark:text-slate-950"
        >
          + New Chat
        </button>

        <div className="mt-6 space-y-2">
          {chatItems.map((chat) => (
            <button
              type="button"
              key={chat.id}
              onClick={() => {
                setActiveChat(chat)
                setSidebarOpen(false)
              }}
              className={`w-full rounded-2xl p-4 text-left transition ${
                activeChat.id === chat.id
                  ? 'bg-cyan-400/20 ring-1 ring-cyan-400/30'
                  : 'hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <p className="font-black">{chat.title}</p>
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{chat.preview}</p>
            </button>
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-black">Tip</p>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Ask short, clear questions for better answers.
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
