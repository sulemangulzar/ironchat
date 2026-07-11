function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6 sm:w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur transition ${getToastClasses(toast.type)}`}
          role="status"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-sm font-black">
              {getToastIcon(toast.type)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">{toast.title}</p>
              {toast.message && <p className="mt-1 text-sm leading-5 opacity-80">{toast.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg px-2 py-1 text-sm font-black opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function getToastClasses(type) {
  if (type === 'success') {
    return 'border-emerald-200 bg-emerald-50/95 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/15 dark:text-emerald-100'
  }

  if (type === 'error') {
    return 'border-red-200 bg-red-50/95 text-red-900 dark:border-red-400/20 dark:bg-red-500/15 dark:text-red-100'
  }

  return 'border-slate-200 bg-white/95 text-slate-900 dark:border-white/10 dark:bg-[#2f2f2f]/95 dark:text-white'
}

function getToastIcon(type) {
  if (type === 'success') return '✓'
  if (type === 'error') return '!'
  return 'i'
}

export default ToastContainer
