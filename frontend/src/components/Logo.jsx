function Logo({ size = 'md', showText = false, className = '' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className={`${sizes[size]} drop-shadow-lg`}
        role="img"
        aria-label="IronChat logo"
      >
        <defs>
          <linearGradient id="ironchat-gradient" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="0.48" stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <filter id="ironchat-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0891b2" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect width="64" height="64" rx="20" fill="url(#ironchat-gradient)" filter="url(#ironchat-shadow)" />
        <path
          d="M18 27.5C18 21.7 22.7 17 28.5 17h7C41.3 17 46 21.7 46 27.5v5C46 38.3 41.3 43 35.5 43H31l-8.2 5.6c-1.5 1-3.5-.1-3.5-1.9V42C16.1 40.2 14 36.8 14 33v-1.5c0-1.1.9-2 2-2h2v-2Z"
          fill="white"
          fillOpacity="0.96"
        />
        <path
          d="M34.5 20 25 34h7l-2.5 10L40 29h-7l1.5-9Z"
          fill="#0f172a"
          fillOpacity="0.92"
        />
        <circle cx="25" cy="29" r="2" fill="#22d3ee" />
        <circle cx="39" cy="29" r="2" fill="#a855f7" />
      </svg>

      {showText && (
        <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
          IronChat
        </span>
      )}
    </div>
  )
}

export default Logo
