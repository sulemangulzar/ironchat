import ChatPreview from './ChatPreview'
import Features from './Features'
import { hasSession } from '../lib/storage'

function Hero({ setPage }) {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main id="home" className="relative overflow-hidden bg-white dark:bg-[#121212]">
      <div className="animate-float absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/15" />
      <div className="animate-pulse-slow absolute right-0 top-52 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-500/10" />

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" /> AI chatbot project
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            A simple and elegant <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">AI chatbot.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            IronChat is a clean AI chatbot made for quick questions, helpful answers, and smooth conversations. It is simple, responsive, and easy to use.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setPage(hasSession() ? 'dashboard' : 'signup')}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-4 text-center font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-violet-500/25 dark:from-violet-500 dark:to-fuchsia-500"
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
