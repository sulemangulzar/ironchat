export default function WebEvidence({ sources }) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
      <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Web Research ({sources.length} sources)
      </h3>
      <div className="flex flex-col gap-4">
        {sources.map((src, idx) => {
          const id = src.id || idx + 1
          const domain = src.url ? new URL(src.url).hostname.replace(/^www\./, '') : 'source'
          const dateStr = src.published_date ? new Date(src.published_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null
          
          return (
            <a
              key={`source-${id}`}
              id={`citation-source-${id}`}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-white/10 dark:bg-[#1e1e1e] dark:hover:border-indigo-500/50"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-indigo-100 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {id}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h4 className="truncate text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {src.title || 'Untitled Source'}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="truncate">{domain}</span>
                    {dateStr && (
                      <>
                        <span>&middot;</span>
                        <span>Published: {dateStr}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-none pt-1">
                  <svg className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
              
              <div className="pl-9 pr-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
                {src.content}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
