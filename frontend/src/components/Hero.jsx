import ChatPreview from './ChatPreview'
import Features from './Features'

function Hero() {
  return (
    <main id="home" className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/15" />
      <div className="absolute right-0 top-48 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-700 dark:text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-400" /> AI chatbot project
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            A simple and elegant AI chatbot.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            IronChat is a clean full-stack chatbot built with React, Tailwind CSS, FastAPI, Groq, and Neon. It is designed to be beginner-friendly, responsive, and easy to understand.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#preview"
              className="rounded-2xl bg-cyan-400 px-7 py-4 text-center font-black text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              View Preview
            </a>
            <a
              href="#features"
              className="rounded-2xl border border-slate-200 bg-white/70 px-7 py-4 text-center font-black text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Stat number="React" label="Frontend" />
            <Stat number="FastAPI" label="Backend" />
            <Stat number="Neon" label="Database" />
          </div>
        </div>

        <ChatPreview />
      </section>

      <Features />
    </main>
  )
}

function Stat({ number, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <p className="text-lg font-black text-slate-950 dark:text-white">{number}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export default Hero
