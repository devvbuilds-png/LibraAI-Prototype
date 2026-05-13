import { useState } from 'react'
import { ActivityProvider, useActivity } from '../context/ActivityContext'
import ChatTab from './ChatTab'
import ActivityTab from './ActivityTab'

const LibraLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
         style={{ background: 'linear-gradient(135deg, #ff6839, #ff8c5a)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <polygon points="1,11 6,1 11,11" fill="#1a0a04" />
      </svg>
    </div>
    <span className="text-sm font-semibold text-t-primary">Libra AI</span>
  </div>
)

function TabButton({ active, onClick, children, badge }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
      style={{
        color: active ? '#1a0a04' : '#d9dbe7',
        background: active ? '#ff6839' : 'transparent',
        border: active ? '1px solid rgba(255,104,57,0.55)' : '1px solid transparent',
        boxShadow: active ? '0 0 18px rgba(255,104,57,0.22)' : 'none',
      }}
    >
      {children}
      {badge > 0 && (
        <span className="w-4 h-4 rounded-full text-xs font-semibold flex items-center justify-center"
              style={{ background: active ? '#1a0a04' : '#ff6839', color: active ? '#ff6839' : '#fff', fontSize: 10 }}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}

function DashboardInner() {
  const [activeTab, setActiveTab] = useState('chat')
  const { state, dispatch } = useActivity()

  const handleActivityTab = () => {
    setActiveTab('activity')
    dispatch({ type: 'CLEAR_NEW_BADGE' })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f1117' }}>
      {/* Top bar */}
      <nav className="sticky top-0 z-30 flex flex-col items-center gap-3 px-4 sm:px-6 py-3"
           style={{
             background: 'rgba(15,17,23,0.92)',
             backdropFilter: 'blur(10px)',
             borderBottom: '1px solid rgba(255,255,255,0.07)',
           }}>
        <div className="w-full max-w-3xl flex items-center justify-center sm:justify-between">
          <LibraLogo />
        </div>
        <div
          className="w-full max-w-sm flex gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
            Chat
          </TabButton>
          <TabButton active={activeTab === 'activity'} onClick={handleActivityTab}
                     badge={state.newActivityCount}>
            Activity
          </TabButton>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div style={{ display: activeTab === 'chat' ? 'block' : 'none' }}>
          <ChatTab />
        </div>
        <div style={{ display: activeTab === 'activity' ? 'block' : 'none' }}>
          <ActivityTab />
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ActivityProvider>
      <DashboardInner />
    </ActivityProvider>
  )
}
