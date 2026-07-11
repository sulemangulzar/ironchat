import ThemeToggle from './ThemeToggle'

function Header({ isDark, setIsDark, setPage }) {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="#home" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-xl text-white shadow-lg shadow-cyan-500/20 dark:bg-white dark:text-slate-950">
          ⚡
        </span>
        <span className="text-xl font-black tracking-tight">IronChat</span>
      </a>

      <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
        <a href="#features" className="transition hover:text-cyan-500">Features</a>
        <a href="#preview" className="transition hover:text-cyan-500">Preview</a>
        <a href="#about" className="transition hover:text-cyan-500">About</a>
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        <button
          type="button"
          onClick={() => setPage('login')}
          className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10 sm:block"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setPage('signup')}
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
          Sign up
        </button>
      </div>
    </header>
  )
}

export default Header
