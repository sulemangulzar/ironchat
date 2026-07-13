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
        className={`${sizes[size]} drop-shadow-sm transition-transform duration-300 hover:scale-105`}
        role="img"
        aria-label="IronChat logo"
      >
        <defs>
          <linearGradient id="ironchat-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f172a" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="ironchat-accent" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0891b2" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Outer Hexagon Shield Container */}
        <path 
          d="M32 4L56 18v28L32 60L8 46V18L32 4z" 
          fill="url(#ironchat-bg)" 
          className="drop-shadow-lg"
        />
        
        {/* Inner Abstract Chat Bubble / Anvil */}
        <path 
          d="M40 24H24c-2.2 0-4 1.8-4 4v12c0 2.2 1.8 4 4 4h4v6l7-6h5c2.2 0 4-1.8 4-4V28c0-2.2-1.8-4-4-4z" 
          fill="url(#ironchat-accent)" 
        />
        
        {/* Tech Nodes */}
        <circle cx="28" cy="34" r="2.5" fill="#f8fafc" />
        <circle cx="36" cy="34" r="2.5" fill="#f8fafc" />
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
