import { hasSession } from '../lib/storage'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

function Header({ isDark, setIsDark, setPage }) {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-transparent bg-white/70 glass dark:bg-[#121212]/70 before:absolute before:inset-x-0 before:-bottom-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-violet-500/20 before:to-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button type="button" onClick={() => setPage('landing')} className="flex items-center gap-3">
          <Logo size="md" showText />
        </button>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <button type="button" onClick={() => scrollToSection('features')} className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Features</button>
          <button type="button" onClick={() => scrollToSection('preview')} className="transition hover:text-cyan-600 dark:hover:text-cyan-300">Preview</button>
          <button type="button" onClick={() => scrollToSection('about')} className="transition hover:text-cyan-600 dark:hover:text-cyan-300">About</button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          {hasSession() ? (
            <button
              type="button"
              onClick={() => setPage('dashboard')}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Dashboard
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
