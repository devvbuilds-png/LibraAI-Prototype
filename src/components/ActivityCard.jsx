import { RotateCcw } from 'lucide-react'
import { TOOLS } from '../data/activities'
import { formatTime } from '../utils/helpers'
import { useActivity } from '../context/ActivityContext'
import ToolLogo from './ToolLogo'

export default function ActivityCard({ activity }) {
  const { dispatch } = useActivity()
  const tool = TOOLS[activity.tool]

  const open = () => dispatch({ type: 'SELECT_ACTIVITY', payload: activity })

  return (
    <div
      onClick={open}
      className={`card card-hover cursor-pointer flex gap-3 p-3.5 sm:p-4 transition-all duration-150 ${activity.isNew ? 'animate-slide-down animate-new-glow' : ''}`}
      style={{ borderLeft: `3px solid ${tool.color}` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${tool.color}55` }}
      >
        <ToolLogo toolKey={activity.tool} size={22} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-medium text-t-secondary">{tool.name}</span>
            <span className="text-t-tertiary text-xs">.</span>
            <span className="text-xs text-t-tertiary whitespace-nowrap">{formatTime(activity.time)}</span>
          </div>
          {activity.reversible && (
            <span className="inline-flex items-center gap-1.5 text-xs text-t-tertiary whitespace-nowrap mt-0.5 sm:mt-0">
              <RotateCcw size={11} />
              Can undo
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-t-primary leading-snug">{activity.action}</p>
          <p className="text-xs text-t-secondary leading-relaxed">{activity.reason}</p>
        </div>
      </div>
    </div>
  )
}
