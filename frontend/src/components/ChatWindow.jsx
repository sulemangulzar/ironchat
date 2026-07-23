import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Logo from './Logo'
import MessageInput from './MessageInput'
import ResearchStatus from './ResearchStatus'
import WebEvidence from './WebEvidence'

function ChatWindow({
  activeChat,
  isActionLoading,
  isChatLoading,
  isLoading,
  message,
  messages,
  sendMessage,
  setMessage,
  stopMessage,
  enableSearch,
  setEnableSearch,
  onInputFocus,
  onFileUpload,
  isUploadingFile,
  activeDocument,
}) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-slate-950 dark:bg-[#212121] dark:text-white">
      {activeDocument && (
        <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50/70 px-4 py-2 text-xs font-semibold text-indigo-900 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
          <div className="flex items-center gap-2">
            <span>📄</span>
            <span>Attached Document: <strong>{activeDocument.filename}</strong></span>
          </div>
          <span className="rounded bg-indigo-200/60 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-indigo-800 dark:bg-indigo-500/30 dark:text-indigo-200">
            Document Q&A Active
          </span>
        </div>
      )}

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
          {isChatLoading ? (
            <ChatSkeleton />
          ) : (
            <>
              {messages.length <= 1 && (
                <div className="flex flex-1 flex-col items-center justify-center text-center animate-slide-up">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 animate-pulse-slow rounded-full bg-violet-500/20 blur-xl dark:bg-fuchsia-500/20" />
                    <div className="relative rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-900/5 glass dark:bg-[#121212]/50 dark:ring-white/10">
                      <Logo size="lg" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                    How can I help you today?
                  </h1>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                    Ask IronChat anything. Attach a PDF, DOCX, or TXT file using the paperclip button below to chat directly with your document!
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
        activeChat={activeChat}
        disabled={isChatLoading || isActionLoading}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
        onFocus={onInputFocus}
        onFileUpload={onFileUpload}
        isUploadingFile={isUploadingFile}
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
            ? 'max-w-[85%] rounded-[24px] rounded-tr-[8px] bg-gradient-to-br from-violet-600 to-fuchsia-600 px-6 py-3.5 text-[15px] leading-relaxed text-white shadow-md shadow-violet-500/10 dark:from-violet-500 dark:to-fuchsia-600'
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
          ? 'bg-gradient-to-br from-violet-200 to-fuchsia-200 text-violet-900 ring-violet-500/20 dark:from-violet-500/20 dark:to-fuchsia-500/20 dark:text-violet-200 dark:ring-violet-400/20'
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
