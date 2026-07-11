function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center text-center">
        <span className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
          React + Tailwind CSS
        </span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          IronChat frontend is ready
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          This Vite React app is configured with Tailwind CSS using JavaScript files only.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://react.dev"
            target="_blank"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Learn React
          </a>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Learn Tailwind
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
