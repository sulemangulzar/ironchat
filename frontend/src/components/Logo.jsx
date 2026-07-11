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
        className={`${sizes[size]} drop-shadow-md`}
        role="img"
        aria-label="IronChat logo"
      >
        <defs>
          <linearGradient id="ironchat-gradient" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f172a" />
            <stop offset="0.5" stopColor="#155e75" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="ironchat-bolt" x1="25" y1="20" x2="40" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#f8fafc" />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="18" fill="url(#ironchat-gradient)" />
        <path
          d="M17 27.5C17 21.7 21.7 17 27.5 17h9C42.3 17 47 21.7 47 27.5v5C47 38.3 42.3 43 36.5 43H31l-8.2 5.6c-1.5 1-3.5-.1-3.5-1.9V42.2C16.1 40.5 14 37.2 14 33.5V31c0-1.1.9-2 2-2h1v-1.5Z"
          fill="white"
          fillOpacity="0.96"
        />
        <path
          d="M34.8 20.5 24.8 34H32l-2.8 9.5 10.4-14H33l1.8-9Z"
          fill="url(#ironchat-bolt)"
        />
        <circle cx="25.5" cy="29.5" r="2" fill="#0f172a" />
        <circle cx="39" cy="29.5" r="2" fill="#0f172a" />
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
