const features = [
  {
    title: 'Beautiful UI',
    description: 'A clean landing page with soft colors, rounded cards, and a polished chatbot preview.',
    icon: '✨',
  },
  {
    title: 'AI backend',
    description: 'FastAPI connects the frontend with Groq so users can send prompts and receive AI replies.',
    icon: '🤖',
  },
  {
    title: 'Message storage',
    description: 'Neon PostgreSQL support is added for saving chat sessions and conversation messages.',
    icon: '🗄️',
  },
  {
    title: 'Responsive design',
    description: 'The layout works smoothly on mobile, tablet, and desktop screens using Tailwind CSS.',
    icon: '📱',
  },
  {
    title: 'Dark and light mode',
    description: 'Users can switch between a modern dark theme and a soft light theme.',
    icon: '🌗',
  },
  {
    title: 'Beginner friendly',
    description: 'The frontend is split into simple components so the code is easy to read and extend.',
    icon: '🧩',
  },
]

function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-500">Features</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Everything needed for a simple chatbot project.</h2>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          IronChat keeps the design simple while still showing important full-stack concepts.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[1.5rem] border border-slate-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/15 text-2xl">
              {feature.icon}
            </div>
            <h3 className="text-xl font-black">{feature.title}</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Features
