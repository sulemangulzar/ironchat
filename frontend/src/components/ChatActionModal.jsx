import { useEffect, useState } from 'react'

function ChatActionModal({ action, isLoading, onClose, onConfirm }) {
  const [title, setTitle] = useState(action?.chat?.title || '')

  useEffect(() => {
    setTitle(action?.chat?.title || '')
  }, [action])

  if (!action) return null

  const isDelete = action.type === 'delete'
  const chatTitle = action.chat?.title || 'New Chat'

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim()) return
    onConfirm(title.trim())
  }

  const handleDelete = () => {
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl dark:border-white/10 dark:bg-[#2f2f2f] dark:text-white"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
              {isDelete ? 'Delete chat' : 'Edit chat'}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {isDelete ? 'Delete this conversation?' : 'Update chat title'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-3 py-2 text-lg font-black text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {isDelete ? (
          <p className="leading-7 text-slate-600 dark:text-slate-300">
            This will permanently remove <strong>{chatTitle}</strong> and its messages from your dashboard.
          </p>
        ) : (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Chat title
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isLoading}
              autoFocus
              placeholder="Enter chat title"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#212121] dark:text-white"
            />
          </label>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type={isDelete ? 'button' : 'submit'}
            onClick={isDelete ? handleDelete : undefined}
            disabled={isLoading || (!isDelete && !title.trim())}
            className={`rounded-2xl px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDelete
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100'
            }`}
          >
            {isLoading ? 'Working...' : isDelete ? 'Delete chat' : 'Save title'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatActionModal
