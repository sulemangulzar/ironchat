import ThemeToggle from './ThemeToggle'

function Header({ isDark, setIsDark }) {
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

      <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
    </header>
  )
}

export default Header
