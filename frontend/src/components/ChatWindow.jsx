import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Logo from './Logo'
import MessageInput from './MessageInput'

function ChatWindow({ activeChat, isActionLoading, isChatLoading, isLoading, message, messages, sendMessage, setMessage }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-slate-950 dark:bg-[#212121] dark:text-white">
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
          {isChatLoading ? (
            <ChatSkeleton />
          ) : (
            <>
              {messages.length <= 1 && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <Logo size="lg" className="mb-5" />
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    How can I help you today?
                  </h1>
                  <p className="mt-4 max-w-xl leading-7 text-slate-500 dark:text-slate-400">
                    Ask IronChat anything. Responses are formatted with headings, lists, tables, and code blocks when useful.
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {messages.map((item, index) => (
                  <MessageBubble key={`${item.role}-${index}`} message={item} />
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar role="assistant" />
                    <div className="pt-2">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <MessageInput
        disabled={!activeChat || isChatLoading || isActionLoading}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}

function ChatSkeleton() {
  return (
    <div className="space-y-10 pt-4 animate-pulse" aria-label="Loading chat messages">
      <div className="flex gap-5">
        <div className="h-9 w-9 flex-none rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
        <div className="flex-1 space-y-4 pt-1.5">
          <div className="h-4 w-2/3 rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
          <div className="h-4 w-full rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
          <div className="h-4 w-5/6 rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="h-16 w-2/3 rounded-3xl rounded-tr-md bg-slate-200/80 dark:bg-[#2f2f2f] sm:w-1/2" />
      </div>

      <div className="flex gap-5">
        <div className="h-9 w-9 flex-none rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
        <div className="flex-1 space-y-4 pt-1.5">
          <div className="h-4 w-full rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
          <div className="h-4 w-3/4 rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
          <div className="h-4 w-1/2 rounded-full bg-slate-200/80 dark:bg-[#2f2f2f]" />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`animate-slide-up flex gap-5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <Avatar role="assistant" />}

      <div
        className={
          isUser
            ? 'max-w-[85%] rounded-[24px] rounded-tr-[8px] bg-slate-900 px-6 py-3.5 text-[15px] leading-relaxed text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
            : 'min-w-0 flex-1 px-1 pt-1 text-[15px] leading-8 text-slate-800 dark:text-slate-200'
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownMessage content={message.content} />
        )}
      </div>

      {isUser && <Avatar role="user" />}
    </div>
  )
}

function Avatar({ role }) {
  return (
    <div
      className={`grid h-9 w-9 flex-none place-items-center rounded-full text-xs font-black shadow-sm ring-1 ring-inset ${
        role === 'user'
          ? 'bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 ring-black/5 dark:ring-white/10'
          : 'bg-transparent ring-transparent'
      }`}
    >
      {role === 'user' ? 'ME' : <Logo size="sm" />}
    </div>
  )
}

function MarkdownMessage({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

export default ChatWindow
