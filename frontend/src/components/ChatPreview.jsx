function ChatPreview() {
  return (
    <div id="preview" className="relative">
      <div className="rounded-[1.5rem] border border-slate-200 bg-[#f9f9f9] p-3 shadow-sm dark:border-white/10 dark:bg-[#171717]">
        <div className="rounded-[1.25rem] bg-white p-4 text-slate-950 shadow-sm dark:bg-[#212121] dark:text-white">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">IC</span>
              <div>
                <p className="font-black">IronChat</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Online and ready</p>
              </div>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">Live</span>
          </div>

          <div className="space-y-4">
            <Bubble text="What is IronChat?" />
            <Bubble bot text="IronChat is a simple AI chatbot with a beautiful and easy-to-use interface." />
            <Bubble text="Can it save messages?" />
            <Bubble bot text="Yes. It is designed to keep conversations organized by session." />
            <div className="w-36 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 dark:bg-[#2f2f2f]">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bubble({ text, bot = false }) {
  return (
    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${bot ? 'rounded-bl-md bg-slate-100 text-slate-700 dark:bg-[#2f2f2f] dark:text-slate-200' : 'ml-auto rounded-br-md bg-slate-950 text-white dark:bg-white dark:text-slate-950'}`}>
      {text}
    </div>
  )
}

export default ChatPreview
