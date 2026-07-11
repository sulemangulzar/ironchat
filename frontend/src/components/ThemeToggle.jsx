function ThemeToggle({ isDark, setIsDark }) {
  return (
    <button
      type="button"
      onClick={() => setIsDark((value) => !value)}
      className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

export default ThemeToggle
