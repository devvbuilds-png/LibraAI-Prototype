import { useState } from 'react'
import { ChevronDown, ChevronUp, Database, RotateCcw } from 'lucide-react'
import { WEEKLY_STATS } from '../data/activities'
import { useActivity } from '../context/ActivityContext'

const TOOL_COLORS = { emails: '#ea4335', meetings: '#4285f4', docs: '#e0e0e0', automations: '#ff6839' }

export default function WeeklySummary() {
  const [open, setOpen] = useState(false)
  const { state } = useActivity()

  const total = state.activities.length
  const reversible = state.activities.filter(a => a.reversible).length
  const sourceCount = state.activities.reduce((sum, a) => sum + (a.dataTouched?.length || 0), 0)

  return (
    <div className="card overflow-hidden" style={{ border: '1px solid rgba(255, 104, 57, 0.18)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start sm:items-center justify-between px-4 sm:px-5 py-3.5 text-left gap-3"
      >
        <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-col sm:flex-row sm:flex-wrap text-sm">
          <span className="font-semibold text-t-primary">
            This week: <span className="text-accent">{total} actions logged</span>
          </span>
          <span className="text-t-tertiary text-xs">~{WEEKLY_STATS.timeSaved} hrs saved</span>
          <span className="flex gap-2.5 text-xs flex-wrap">
            <span className="inline-flex items-center gap-1 text-t-secondary"><RotateCcw size={12} /> {reversible} can undo</span>
            <span className="text-t-tertiary">.</span>
            <span className="inline-flex items-center gap-1 text-t-secondary"><Database size={12} /> {sourceCount} sources used</span>
          </span>
        </div>
        <span className="text-t-tertiary flex-shrink-0">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      <div style={{ maxHeight: open ? 280 : 0, overflow: 'hidden', transition: 'max-height 220ms ease' }}>
        <div className="section-divider" />
        <div className="px-4 sm:px-5 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(WEEKLY_STATS.breakdown).map(([key, val]) => (
              <div
                key={key}
                className="flex flex-col gap-1.5 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)' }}
              >
                <span className="text-2xl font-semibold leading-none text-t-primary">{val}</span>
                <span className="text-xs text-t-secondary capitalize leading-tight">{key}</span>
                <div className="h-0.5 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(val / 10) * 100}%`, background: TOOL_COLORS[key] }} />
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg"
            style={{ background: 'var(--accent-bg)', border: '1px solid rgba(255,104,57,0.15)' }}
          >
            <span className="text-accent text-xs">*</span>
            <span className="text-xs text-accent italic">
              Every activity keeps the important trail: what Libra changed, why it acted, and which tools or docs it touched.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
