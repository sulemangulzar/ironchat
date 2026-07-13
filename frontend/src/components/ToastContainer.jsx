function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-max max-w-[280px] flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl border px-3 py-2 shadow-lg backdrop-blur transition ${getToastClasses(toast.type)}`}
          role="status"
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full text-xs font-black">
              {getToastIcon(toast.type)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">{toast.title}</p>
              {toast.message && <p className="mt-0.5 text-[11px] leading-4 opacity-80">{toast.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md px-1.5 py-0.5 text-xs font-black opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
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
