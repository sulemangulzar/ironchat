const features = [
  {
    title: 'Beautiful interface',
    description: 'A clean and modern design with soft cards, readable spacing, and a polished chat preview.',
    icon: '✨',
  },
  {
    title: 'Helpful AI replies',
    description: 'Ask questions, get clear answers, and use the chatbot as a friendly assistant for learning and building.',
    icon: '🤖',
  },
  {
    title: 'Conversation history',
    description: 'Chats are organized by session so conversations feel more natural and easy to continue.',
    icon: '💬',
  },
  {
    title: 'Responsive layout',
    description: 'The interface looks smooth on mobile phones, tablets, and desktop screens.',
    icon: '📱',
  },
  {
    title: 'Dark and light mode',
    description: 'Switch between a clean light theme and a focused dark theme with one click.',
    icon: '🌗',
  },
  {
    title: 'Simple experience',
    description: 'The project keeps the user flow focused: open the chatbot, type a message, and get a helpful reply.',
    icon: '🧩',
  },
]

function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Features</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Everything needed for a simple chatbot.
        </h2>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          IronChat focuses on a beautiful design, helpful responses, and an easy experience.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-slate-50 dark:border-white/10 dark:bg-[#2f2f2f] dark:hover:bg-[#343434]"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl dark:bg-white/10">
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
