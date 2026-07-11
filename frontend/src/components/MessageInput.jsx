function MessageInput({ message, setMessage, sendMessage, isLoading }) {
  return (
    <div className="border-t border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-[#0d111c]/80 sm:p-5">
      <div className="mx-auto flex max-w-4xl gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage()
            }
          }}
          disabled={isLoading}
          placeholder="Type your message..."
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={isLoading || !message.trim()}
          className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default MessageInput
