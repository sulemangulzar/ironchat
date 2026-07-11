function MessageInput({ disabled, message, setMessage, sendMessage, isLoading }) {
  return (
    <div className="bg-white px-4 pb-5 pt-3 dark:bg-[#212121] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-3 rounded-[1.75rem] border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-[#303030]">
          <textarea
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
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={disabled || isLoading || !message.trim()}
            className="grid h-10 w-10 flex-none place-items-center rounded-full bg-slate-950 font-black text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950"
            aria-label="Send message"
          >
            {isLoading ? '…' : '↑'}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          IronChat can make mistakes. Check important information.
        </p>
      </div>
    </div>
  )
}

export default MessageInput
