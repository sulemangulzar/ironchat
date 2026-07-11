import MessageInput from './MessageInput'

function ChatWindow({ activeChat, isLoading, message, messages, sendMessage, setMessage }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-500">Current chat</p>
            <h2 className="mt-2 text-2xl font-black">{activeChat?.title || 'No chat selected'}</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {activeChat ? 'Start typing below to talk with IronChat.' : 'Create a new chat from the sidebar to begin.'}
            </p>
          </div>

          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-5 py-4 leading-7 shadow-sm sm:max-w-[72%] ${
                  item.role === 'user'
                    ? 'rounded-br-md bg-cyan-400 text-slate-950'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100'
                }`}
              >
                {item.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-3xl rounded-bl-md border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/10">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <MessageInput
        disabled={!activeChat}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ChatWindow
