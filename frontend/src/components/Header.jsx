import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

function Header({ isDark, setIsDark, setPage }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-[#212121]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="flex items-center gap-3">
          <Logo size="md" showText />
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Features</a>
          <a href="#preview" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Preview</a>
          <a href="#about" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">About</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          <button
            type="button"
            onClick={() => setPage('login')}
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 sm:block"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setPage('signup')}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
