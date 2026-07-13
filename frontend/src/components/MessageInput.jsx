import { useRef, useEffect } from 'react'

function MessageInput({ disabled, message, setMessage, sendMessage, isLoading }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly measure scrollHeight when deleting text
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="bg-transparent px-4 pb-6 pt-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="group relative flex items-end gap-3 rounded-[24px] border border-slate-200/80 bg-white/60 px-4 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-slide-up dark:border-white/10 dark:bg-[#1e1e1e]/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:focus-within:border-white/20 dark:focus-within:bg-[#222]">
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
            placeholder={disabled ? 'Create a chat to start messaging...' : 'Message IronChat...'}
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
        <p className="mt-3 text-center text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
          IronChat can make mistakes. Check important information.
        </p>
      </div>
    </div>
  )
}

export default MessageInput
