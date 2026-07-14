import { useRef, useEffect } from 'react'

function MessageInput({ disabled, message, setMessage, sendMessage, isLoading, enableSearch, setEnableSearch }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="bg-transparent px-4 pb-6 pt-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="group relative flex flex-col rounded-[24px] border border-slate-200/80 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-slide-up dark:border-white/10 dark:bg-[#1e1e1e]/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:focus-within:border-white/20 dark:focus-within:bg-[#222]">
          {/* Textarea row */}
          <div className="flex items-end gap-3 px-4 pt-3.5 pb-2">
            <textarea
              ref={textareaRef}
              value={message}
              rows={1}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage()
                }
              }}
              disabled={disabled || isLoading}
              placeholder={disabled ? 'Please wait...' : 'Message IronChat...'}
              className="no-scrollbar max-h-[200px] min-h-[24px] w-full resize-none bg-transparent px-2 py-1 text-[15px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed transition-[height] duration-200 ease-out dark:text-white"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={disabled || isLoading || !message.trim()}
              className="grid h-9 w-9 flex-none place-items-center rounded-full bg-slate-900 font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              aria-label="Send message"
            >
              {isLoading ? '…' : '↑'}
            </button>
          </div>

          {/* Toolbar row */}
          <div className="flex items-center gap-2 px-5 pb-3">
            <button
              type="button"
              onClick={() => setEnableSearch((prev) => !prev)}
              disabled={disabled}
              className={`
                inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200
                ${enableSearch
                  ? 'border-indigo-500/60 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'border-slate-200 bg-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-slate-200'
                }
                disabled:cursor-not-allowed disabled:opacity-40
              `}
              title={enableSearch ? 'Web Research is ON — click to disable' : 'Web Research is OFF — click to enable'}
            >
              <svg
                className={`h-3.5 w-3.5 ${enableSearch ? 'text-indigo-500' : 'text-slate-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {enableSearch ? 'Web Research ON' : 'Web Research'}
              {enableSearch && (
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
          IronChat can make mistakes. Check important information.
        </p>
      </div>
    </div>
  )
}

export default MessageInput
