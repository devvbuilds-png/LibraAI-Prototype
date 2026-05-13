const PROOF_POINTS = [
  { label: 'Problem', text: 'Autonomous agents act, but users need to see the trail.' },
  { label: 'Solution', text: 'A live activity feed showing what Libra did, why, and what data it used.' },
]

const LibraLogo = () => (
  <div className="flex items-center gap-2.5">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #ff6839, #ff8c5a)' }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <polygon points="1,11 6,1 11,11" fill="#1a0a04" />
      </svg>
    </div>
    <span className="text-sm font-semibold text-t-primary">Libra AI</span>
  </div>
)

export default function LandingPage({ onEnter }) {
  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{
        background: '#0f1117',
        backgroundImage: 'var(--dot-grid)',
        backgroundSize: '24px 24px',
      }}
    >
      <nav
        className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <LibraLogo />
        <span className="text-xs text-t-tertiary tracking-wide whitespace-nowrap">Built by Dev</span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-5 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--accent-bg)', border: '1px solid rgba(255,104,57,0.22)', color: '#ff6839' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              AI PM Intern demo
            </div>

            <h1
              className="font-serif text-t-primary leading-tight sm:leading-none"
              style={{ fontSize: 'clamp(40px, 10vw, 56px)', fontWeight: 400 }}
            >
              Hi, I&apos;m Dev.
              <br />
              <em style={{ color: '#ff6839' }}>I built Libra&apos;s activity trail.</em>
            </h1>

            <p className="text-t-secondary leading-relaxed max-w-xl" style={{ fontSize: 16 }}>
              A focused product demo for the AI PM Intern role: run a few agent tasks, then see the live record of
              what changed, why it happened, and which tools were touched.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
            {PROOF_POINTS.map(point => (
              <div
                key={point.label}
                className="rounded-xl px-4 py-3 text-left"
                style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-xs font-semibold text-accent uppercase tracking-widest block mb-1">
                  {point.label}
                </span>
                <p className="text-sm text-t-secondary leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onEnter}
              className="px-8 py-3.5 rounded-lg text-sm font-semibold text-white transition-all duration-150"
              style={{ background: '#ff6839', boxShadow: '0 0 22px rgba(255,104,57,0.3)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ff7a50'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,104,57,0.44)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ff6839'
                e.currentTarget.style.boxShadow = '0 0 22px rgba(255,104,57,0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Open demo
            </button>
            <span className="text-xs text-t-tertiary">No login. Mock data. Built to show product thinking fast.</span>
          </div>
        </div>
      </main>

      <footer
        className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-center sm:text-left"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs text-t-tertiary">For <span className="text-accent">trylibra.ai</span></span>
        <span className="text-xs text-t-tertiary">Dev . devvbuilds@gmail.com</span>
      </footer>
    </div>
  )
}
