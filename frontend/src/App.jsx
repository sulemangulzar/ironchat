import { useEffect, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-slate-950 transition-colors duration-300 dark:bg-[#080b12] dark:text-white">
      <Header isDark={isDark} setIsDark={setIsDark} />
      <Hero />
      <Footer />
    </div>
  )
}

export default App
