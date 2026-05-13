import { useEffect, useRef, useState } from 'react'
import { COMMAND_PROMPTS, TOOLS } from '../data/activities'
import { useActivity } from '../context/ActivityContext'
import ToolLogo from './ToolLogo'

const WELCOME = {
  id: 'welcome',
  role: 'libra',
  content: "Hi, I'm Libra. I'm connected to your Gmail, Calendar, Notion, Jira, Drive, and Slack. Pick a task below and I'll handle it, then log the full activity trail for you.",
}

function ToolChip({ toolKey }) {
  const tool = TOOLS[toolKey]
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${tool.color}55` }}
      >
        <ToolLogo toolKey={toolKey} size={20} />
      </div>
      <span className="text-xs text-t-tertiary" style={{ fontSize: 10 }}>{tool.name}</span>
    </div>
  )
}

function LibraAvatar() {
  return (
    <span
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #ff6839, #ff8c5a)' }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <polygon points="1,9 5,1 9,9" fill="#1a0a04" />
      </svg>
    </span>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <LibraAvatar />}
      <div
        className="max-w-[86%] sm:max-w-[78%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed"
        style={{
          background: isUser ? 'var(--accent-bg)' : 'rgba(255,255,255,0.04)',
          border: isUser ? '1px solid rgba(255,104,57,0.22)' : '1px solid var(--card-border)',
          color: isUser ? '#f0f0f0' : '#d9dbe7',
          borderTopRightRadius: isUser ? 4 : 12,
          borderTopLeftRadius: isUser ? 12 : 4,
        }}
      >
        {message.content}
      </div>
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-2.5 justify-start">
      <LibraAvatar />
      <div
        className="px-3.5 py-3 rounded-xl flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)' }}
      >
        <span className="thinking-dot" />
        <span className="thinking-dot" style={{ animationDelay: '120ms' }} />
        <span className="thinking-dot" style={{ animationDelay: '240ms' }} />
      </div>
    </div>
  )
}

function buildConfirmation(prompt) {
  const tool = TOOLS[prompt.tool].name
  return `Done. I handled that in ${tool} and added the full activity trail to the Activity tab: reasoning, data sources, before/after state, and undo context are all logged.`
}

export default function ChatTab() {
  const { dispatch } = useActivity()
  const [messages, setMessages] = useState([WELCOME])
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const runPrompt = (prompt) => {
    if (isThinking) return

    const now = Date.now()
    setMessages(prev => [
      ...prev,
      { id: `u-${now}`, role: 'user', content: prompt.prompt },
    ])
    setIsThinking(true)

    window.setTimeout(() => {
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: Date.now(),
          tool: prompt.tool,
          action: prompt.action,
          reason: prompt.reason,
          time: new Date().toISOString(),
          status: 'completed',
          outcome: prompt.outcome,
          reversible: prompt.reversible,
          isNew: true,
          dataTouched: prompt.dataTouched,
          detail: prompt.detail,
        },
      })

      setMessages(prev => [
        ...prev,
        { id: `l-${Date.now()}`, role: 'libra', content: buildConfirmation(prompt) },
      ])
      setIsThinking(false)
    }, 850)
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="card p-3 sm:p-4">
        <span className="text-xs font-semibold text-t-tertiary uppercase tracking-widest block mb-2 sm:mb-3">
          Connected tools
        </span>
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-1">
          {Object.keys(TOOLS).map(k => <ToolChip key={k} toolKey={k} />)}
        </div>
      </div>

      <div className="card flex flex-col overflow-hidden h-[calc(100svh-248px)] min-h-[430px] max-h-[560px] sm:h-[calc(100vh-250px)] sm:min-h-[420px] sm:max-h-[520px]">
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3">
          {messages.map(message => <MessageBubble key={message.id} message={message} />)}
          {isThinking && <ThinkingIndicator />}
          <div ref={bottomRef} />
        </div>

        <div
          className="px-3 sm:px-4 py-3 grid grid-flow-col auto-cols-[78%] sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 gap-2 overflow-x-auto sm:overflow-visible"
          style={{ borderTop: '1px solid var(--section-border)' }}
        >
          {COMMAND_PROMPTS.map(prompt => (
            <button
              key={prompt.title}
              onClick={() => runPrompt(prompt)}
              disabled={isThinking}
              className="text-left text-sm sm:text-xs px-4 sm:px-3 py-3 sm:py-2 rounded-xl sm:rounded-lg transition-all duration-150 disabled:opacity-50 leading-snug min-h-[54px] sm:min-h-0"
              style={{
                color: '#d9dbe7',
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f0f0f0'
                e.currentTarget.style.borderColor = 'rgba(255,104,57,0.3)'
                e.currentTarget.style.background = 'rgba(255,104,57,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#d9dbe7'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
            >
              {prompt.prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
