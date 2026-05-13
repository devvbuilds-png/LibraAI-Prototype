import { useActivity } from '../context/ActivityContext'
import { TOOLS } from '../data/activities'
import { Info } from 'lucide-react'
import WeeklySummary from './WeeklySummary'
import FilterBar from './FilterBar'
import ActivityCard from './ActivityCard'
import DetailPanel from './DetailPanel'

export default function ActivityTab() {
  const { state } = useActivity()

  const filtered = state.activities.filter(a => {
    const toolMatch = state.toolFilter === 'all' || TOOLS[a.tool].filterKey === state.toolFilter
    return toolMatch
  })

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative p-4 sm:p-5 rounded-xl flex gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(255,104,57,0.16), rgba(255,255,255,0.045))',
          border: '1px solid rgba(255,104,57,0.28)',
          boxShadow: '0 0 0 1px rgba(255,104,57,0.08)',
        }}
      >
        <span
          className="absolute -top-2 left-5 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest"
          style={{ background: '#ff6839', color: '#1a0a04' }}
        >
          Start here
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: 'rgba(255,104,57,0.14)', border: '1px solid rgba(255,104,57,0.25)', color: '#ff6839' }}
        >
          <Info size={16} />
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <h1 className="text-lg font-semibold text-t-primary">Your Libra activity</h1>
          <p className="text-sm text-t-secondary leading-relaxed">
            This is the live record of everything Libra has done for you. New tasks appear here automatically.
            Click any item to inspect the reasoning, data sources, before/after changes, and undo option when it exists.
          </p>
        </div>
      </div>

      <WeeklySummary />
      <FilterBar />

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-xs text-t-tertiary">
            No activities match this filter.
          </div>
        ) : (
          filtered.map(a => <ActivityCard key={a.id} activity={a} />)
        )}
      </div>

      <DetailPanel />
    </div>
  )
}
