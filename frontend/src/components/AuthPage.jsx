import ThemeToggle from './ThemeToggle'

function AuthPage({ type, isDark, setIsDark, setPage }) {
  const isSignup = type === 'signup'

  const handleSubmit = (event) => {
    event.preventDefault()
    setPage('dashboard')
  }

  return (
    <main className="grid min-h-screen bg-[#f8f5ef] text-slate-950 dark:bg-[#080b12] dark:text-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <button type="button" onClick={() => setPage('landing')} className="relative z-10 flex items-center gap-3 text-left">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400 text-xl text-slate-950">⚡</span>
          <span className="text-2xl font-black">IronChat</span>
        </button>

        <div className="relative z-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            {isSignup ? 'Create account' : 'Welcome back'}
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-tight">
            {isSignup ? 'Start chatting with a clean AI assistant.' : 'Continue your conversations beautifully.'}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
            A simple project flow: landing page, authentication screen, then your chat dashboard.
          </p>
        </div>

        <p className="relative z-10 text-sm text-slate-500">Simple • Responsive • Elegant</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <button type="button" onClick={() => setPage('landing')} className="font-black text-slate-800 dark:text-white">
              ← IronChat
            </button>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-white/10 sm:p-8">
            <h2 className="text-3xl font-black">{isSignup ? 'Create your account' : 'Login to your account'}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {isSignup ? 'Sign up to open the chat dashboard.' : 'Login to continue to the dashboard.'}
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {isSignup && <FormInput label="Full name" placeholder="Suleman Gulzar" />}
              <FormInput label="Email address" type="email" placeholder="you@example.com" />
              <FormInput label="Password" type="password" placeholder="••••••••" />

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-950 py-4 font-black text-white transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-cyan-400 dark:text-slate-950"
              >
                {isSignup ? 'Sign up and open dashboard' : 'Login and open dashboard'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
              {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
              <button
                type="button"
                onClick={() => setPage(isSignup ? 'login' : 'signup')}
                className="font-black text-cyan-500"
              >
                {isSignup ? 'Login' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function FormInput({ label, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  )
}

export default AuthPage
