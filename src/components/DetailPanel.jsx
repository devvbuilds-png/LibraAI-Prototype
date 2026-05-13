import { useEffect, useState } from 'react'
import { RotateCcw, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { TOOLS } from '../data/activities'
import { formatTime } from '../utils/helpers'
import { useActivity } from '../context/ActivityContext'
import ToolLogo from './ToolLogo'

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold text-t-tertiary uppercase tracking-widest">{title}</span>
      {children}
    </div>
  )
}

export default function DetailPanel() {
  const { state, dispatch } = useActivity()
  const activity = state.selectedActivity
  const [undoState, setUndoState] = useState('idle')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setUndoState('idle')
    setFeedback(null)
  }, [activity?.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') dispatch({ type: 'CLOSE_DETAIL' })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dispatch])

  const handleUndo = () => {
    if (undoState === 'idle') {
      setUndoState('confirm')
      return
    }
    if (undoState === 'confirm') {
      if (activity) dispatch({ type: 'UNDO_ACTIVITY', id: activity.id })
      setUndoState('done')
    }
  }

  const isOpen = !!activity

  return (
    <>
      <div
        onClick={() => dispatch({ type: 'CLOSE_DETAIL' })}
        className="fixed inset-0 z-40 transition-opacity duration-250"
        style={{
          background: 'rgba(0,0,0,0.55)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: 'min(480px, 100vw)',
          background: '#1a1b2e',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {activity && (
          <PanelContent
            activity={activity}
            undoState={undoState}
            feedback={feedback}
            onUndo={handleUndo}
            onFeedback={setFeedback}
            onClose={() => dispatch({ type: 'CLOSE_DETAIL' })}
          />
        )}
      </div>
    </>
  )
}

function PanelContent({ activity, undoState, feedback, onUndo, onFeedback, onClose }) {
  const tool = TOOLS[activity.tool]
  const { detail } = activity

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div
        className="flex items-start justify-between gap-4 px-4 sm:px-6 py-5"
        style={{ borderBottom: '1px solid var(--section-border)' }}
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${tool.color}55` }}
            >
              <ToolLogo toolKey={activity.tool} size={19} />
            </span>
            <span className="text-xs text-t-secondary font-medium">{tool.name} . {formatTime(activity.time)}</span>
          </div>
          <h2 className="text-base font-semibold text-t-primary leading-snug">{activity.action}</h2>
          <p className="text-xs text-t-secondary leading-relaxed">{activity.outcome || 'Action logged with reasoning'}</p>
        </div>
        <button onClick={onClose} className="text-t-tertiary hover:text-t-primary transition-colors p-1 flex-shrink-0">
          <X size={17} />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-4 sm:px-6 py-5">
        <Section title="Why Libra did this">
          <ol className="flex flex-col gap-2.5">
            {(detail.reasoning || []).map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="w-5 h-5 rounded flex-shrink-0 inline-flex items-center justify-center text-xs font-semibold mt-0.5"
                  style={{ background: 'var(--accent-bg)', color: '#ff6839' }}
                >
                  {i + 1}
                </span>
                <span className="text-xs text-t-secondary leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <div className="section-divider" />

        <Section title="Data sources accessed">
          <div className="flex flex-col gap-1.5">
            {(activity.dataTouched || []).map((src, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-t-secondary">
                <span className="text-t-tertiary">-</span>
                {src}
              </div>
            ))}
          </div>
        </Section>

        {(detail.before || detail.after) && (
          <>
            <div className="section-divider" />
            <Section title="Before -> After">
              <div className="flex flex-col gap-2">
                {detail.before && (
                  <div
                    className="p-3 rounded-lg text-xs leading-relaxed"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
                  >
                    <span className="text-xs font-medium opacity-60 block mb-1">BEFORE</span>
                    {detail.before}
                  </div>
                )}
                {detail.after && (
                  <div
                    className="p-3 rounded-lg text-xs leading-relaxed"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#4ade80' }}
                  >
                    <span className="text-xs font-medium opacity-60 block mb-1">AFTER</span>
                    {detail.after}
                  </div>
                )}
              </div>
            </Section>
          </>
        )}

        {detail.alternativeConsidered && (
          <>
            <div className="section-divider" />
            <Section title="What Libra considered but did not do">
              <p className="text-xs text-t-tertiary italic leading-relaxed">{detail.alternativeConsidered}</p>
            </Section>
          </>
        )}

        <div className="section-divider" />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-t-tertiary">Was this useful?</span>
            {feedback ? (
              <span className="text-xs text-accent font-medium">Thanks</span>
            ) : (
              <div className="flex gap-1.5">
                {[
                  ['up', ThumbsUp, '#4ade80', 'var(--green-bg)', 'rgba(34,197,94,0.2)'],
                  ['down', ThumbsDown, '#f87171', 'var(--red-bg)', 'rgba(239,68,68,0.2)'],
                ].map(([val, Icon, color, bg, hover]) => (
                  <button
                    key={val}
                    onClick={() => onFeedback(val)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150"
                    style={{ color, background: bg, border: `1px solid ${color}33` }}
                    onMouseEnter={e => { e.currentTarget.style.background = hover }}
                    onMouseLeave={e => { e.currentTarget.style.background = bg }}
                  >
                    <Icon size={11} /> {val === 'up' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(activity.reversible || undoState === 'done') && (
            <button
              onClick={onUndo}
              disabled={undoState === 'done'}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150"
              style={{
                color: undoState === 'done' ? '#9ca3af' : undoState === 'confirm' ? '#f87171' : '#8b8fa3',
                background: undoState === 'confirm' ? 'var(--red-bg)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${undoState === 'confirm' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <RotateCcw size={11} />
              {undoState === 'idle' && 'Undo action'}
              {undoState === 'confirm' && 'Confirm undo'}
              {undoState === 'done' && 'Undo logged'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
