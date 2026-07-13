import ChatPreview from './ChatPreview'
import Features from './Features'
import { hasSession } from '../lib/storage'

function Hero({ setPage }) {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main id="home" className="relative overflow-hidden bg-white dark:bg-[#212121]">
      <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10" />
      <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-slate-400/10 blur-3xl dark:bg-white/5" />

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-cyan-400" /> AI chatbot project
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            A simple and elegant AI chatbot.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            IronChat is a clean AI chatbot made for quick questions, helpful answers, and smooth conversations. It is simple, responsive, and easy to use.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setPage(hasSession() ? 'dashboard' : 'signup')}
              className="rounded-2xl bg-slate-950 px-7 py-4 text-center font-bold text-white transition hover:-translate-y-1 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {hasSession() ? 'Go to Dashboard' : 'Get Started'}
            </button>
            <button
              type="button"
              onClick={scrollToFeatures}
              className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-bold text-slate-800 transition hover:-translate-y-1 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Explore Features
            </button>
          </div>
        </div>

        <ChatPreview />
      </section>

      <Features />
    </main>
  )
}

export default Hero
