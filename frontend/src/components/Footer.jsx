function Footer() {
  return (
    <footer id="about" className="border-t border-slate-200 px-5 py-8 dark:border-white/10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>
          Built with <span className="font-black text-slate-800 dark:text-white">React</span>,{' '}
          <span className="font-black text-slate-800 dark:text-white">Tailwind</span>,{' '}
          <span className="font-black text-slate-800 dark:text-white">FastAPI</span>, and{' '}
          <span className="font-black text-slate-800 dark:text-white">Neon</span>.
        </p>
        <p>© 2026 IronChat. Simple AI chatbot project.</p>
      </div>
    </footer>
  )
}

export default Footer
