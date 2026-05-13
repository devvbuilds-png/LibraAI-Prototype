import { useActivity } from '../context/ActivityContext'

const TOOL_TABS = [
  { key: 'all', label: 'All' },
  { key: 'email', label: 'Email' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'docs', label: 'Docs' },
  { key: 'automations', label: 'Automations' },
]

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 whitespace-nowrap"
      style={{
        color: active ? '#f0f0f0' : '#8b8fa3',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        border: active ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
      }}
    >
      {children}
    </button>
  )
}

export default function FilterBar() {
  const { state, dispatch } = useActivity()

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1">
      {/* Tool filters */}
      <div className="flex gap-1 flex-shrink-0">
        {TOOL_TABS.map(t => (
          <Pill key={t.key} active={state.toolFilter === t.key}
                onClick={() => dispatch({ type: 'SET_TOOL_FILTER', payload: t.key })}>
            {t.label}
          </Pill>
        ))}
      </div>
    </div>
  )
}
