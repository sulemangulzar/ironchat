import { useState } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

function AuthPage({ type, isDark, setIsDark, setPage, onAuth }) {
  const isSignup = type === 'signup'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onAuth(type, form)
    } catch (authError) {
      setError(authError.message || 'Authentication failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-white text-slate-950 dark:bg-[#212121] dark:text-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden border-r border-slate-200 bg-[#f9f9f9] p-10 dark:border-white/10 dark:bg-[#171717] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-slate-400/10 blur-3xl dark:bg-white/5" />

        <button type="button" onClick={() => setPage('landing')} className="relative z-10 text-left">
          <Logo size="md" showText />
        </button>

        <div className="relative z-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">
            {isSignup ? 'Create account' : 'Welcome back'}
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-slate-950 dark:text-white">
            {isSignup ? 'Start chatting with a clean AI assistant.' : 'Continue your conversations beautifully.'}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-slate-600 dark:text-slate-300">
            A simple project flow: landing page, authentication screen, then your chat dashboard.
          </p>
        </div>

        <p className="relative z-10 text-sm text-slate-500 dark:text-slate-400">Simple • Responsive • Elegant</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <button type="button" onClick={() => setPage('landing')} className="flex items-center gap-2 font-black text-slate-800 dark:text-white">
              <Logo size="sm" />
              <span>IronChat</span>
            </button>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#2f2f2f] sm:p-8">
            <h2 className="text-3xl font-black">{isSignup ? 'Create your account' : 'Login to your account'}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {isSignup ? 'Sign up to open the chat dashboard.' : 'Login to continue to the dashboard.'}
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {isSignup && (
                <FormInput
                  label="Full name"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Suleman Gulzar"
                />
              )}
              <FormInput
                label="Email address"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
              />
              <FormInput
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
              />

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                {isSubmitting ? 'Please wait...' : isSignup ? 'Sign up and open dashboard' : 'Login and open dashboard'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
              {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
              <button
                type="button"
                onClick={() => setPage(isSignup ? 'login' : 'signup')}
                className="font-black text-cyan-600 dark:text-cyan-300"
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

function FormInput({ label, name, onChange, placeholder, type = 'text', value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 dark:border-white/10 dark:bg-[#212121] dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  )
}

export default AuthPage
