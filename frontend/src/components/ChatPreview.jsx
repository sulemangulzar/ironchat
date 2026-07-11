function ChatPreview() {
  return (
    <div id="preview" className="relative">
      <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-white/10">
        <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-inner dark:bg-black/40">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-slate-950">⚡</span>
              <div>
                <p className="font-black">IronChat</p>
                <p className="text-xs text-slate-400">Online and ready</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">Live</span>
          </div>

          <div className="space-y-4">
            <Bubble text="What is IronChat?" />
            <Bubble bot text="IronChat is a simple AI chatbot with a beautiful and easy-to-use interface." />
            <Bubble text="Can it save messages?" />
            <Bubble bot text="Yes. It is designed to keep conversations organized by session." />
            <div className="w-36 rounded-2xl rounded-bl-md bg-white/10 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:240ms]" />
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
    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${bot ? 'rounded-bl-md bg-white/10 text-slate-200' : 'ml-auto rounded-br-md bg-cyan-400 text-slate-950'}`}>
      {text}
    </div>
  )
}

export default ChatPreview
