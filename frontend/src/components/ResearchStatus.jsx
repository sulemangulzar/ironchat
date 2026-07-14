export default function ResearchStatus({ research }) {
  if (!research || !research.usedWeb) return null

  const isComplete = research.status === 'done' || research.status === 'error'
  const timeline = research.timeline || []

  if (isComplete) {
    if (!research.sources || research.sources.length === 0) {
      return null
    }
    // Return a simple completed badge at the top
    return (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-[#2f2f2f] dark:text-slate-300">
        <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        Web researched \u00B7 {research.sources.length} sources
      </div>
    )
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 animate-pulse text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Researching...</span>
      </div>
      
      <div className="flex flex-col gap-2 pl-2">
        {timeline.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {step}
            </span>
          </div>
        ))}
        {research.error && (
          <div className="flex items-center gap-2.5">
            <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-xs font-medium text-red-500">
              {research.error}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
