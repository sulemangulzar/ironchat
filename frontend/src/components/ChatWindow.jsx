import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Logo from './Logo'
import MessageInput from './MessageInput'
import ResearchStatus from './ResearchStatus'
import WebEvidence from './WebEvidence'

function ChatWindow({ activeChat, isActionLoading, isChatLoading, isLoading, message, messages, sendMessage, setMessage, stopMessage, enableSearch, setEnableSearch, onInputFocus }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

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
                    Ask IronChat anything. You can use it to brainstorm ideas, write code, or analyze complex topics. 
                    <br/><br/>
                    <strong>Pro tip:</strong> Enable <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">Web Research</span> below to search the internet for real-time news, live data, and up-to-date facts.
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {messages.map((item, index) => (
                  <MessageBubble key={`${item.role}-${index}`} message={item} />
                ))}

                {isLoading && (
                  <div className="flex justify-center mt-2">
                    <button 
                      onClick={stopMessage}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:bg-[#2f2f2f] dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                      Stop generating
                    </button>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>
      </div>

      <MessageInput
        disabled={isChatLoading || isActionLoading}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
        onFocus={onInputFocus}
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
        {!isUser && message.research && message.research.usedWeb && (
          <ResearchStatus research={message.research} />
        )}
        
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <MarkdownMessage content={message.content} />
            {message.research && message.research.usedWeb && (message.research.status === 'done' || message.research.status === 'error') && message.research.sources && message.research.sources.length > 0 && (
              <WebEvidence sources={message.research.sources} />
            )}
          </>
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
  // Preprocess content to convert [1] to markdown links that our custom renderer can catch
  // Regex looks for [1], [2], etc that are not inside markdown links already.
  // This is a simple regex that assumes standard spacing.
  const processedContent = (content || '').replace(/\[(\d+)\]/g, '[$1](#citation-source-$1)')

  return (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => {
            const href = props.href || ''
            if (href.startsWith('#citation-source-')) {
              const id = href.replace('#citation-source-', '')
              return (
                <a
                  {...props}
                  href={href}
                  className="inline-flex h-4 min-w-4 cursor-pointer items-center justify-center rounded-full bg-indigo-100 px-1 text-[10px] font-bold text-indigo-700 no-underline transition-colors hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30"
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.getElementById(`citation-source-${id}`)
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-[#1e1e1e]')
                      setTimeout(() => {
                        el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-[#1e1e1e]')
                      }, 2000)
                    }
                  }}
                >
                  {id}
                </a>
              )
            }
            return <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400" />
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

export default ChatWindow
