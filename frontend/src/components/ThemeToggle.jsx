function ThemeToggle({ isDark, setIsDark }) {
  return (
    <button
      type="button"
      onClick={() => setIsDark((value) => !value)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white/80 text-base shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/10 sm:h-auto sm:w-auto sm:rounded-full sm:px-4 sm:py-2 sm:text-sm sm:font-bold"
    >
      <span className="sm:hidden">{isDark ? '☀️' : '🌙'}</span>
      <span className="hidden sm:inline">{isDark ? '☀️ Light' : '🌙 Dark'}</span>
    </button>
  )
}

export default ThemeToggle
