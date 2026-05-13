export default function ToolLogo({ toolKey, size = 22 }) {
  if (toolKey === 'gmail') {
    return (
      <svg viewBox="0 0 32 24" width={size} height={Math.round(size * 0.82)} aria-hidden="true">
        <path d="M3 3h26v18H3z" fill="#fff" opacity="0.96" />
        <path d="M3 5.2 16 15 29 5.2V21H3z" fill="#fff" />
        <path d="M3 5.2 16 15 29 5.2" fill="none" stroke="#ea4335" strokeWidth="4" strokeLinejoin="round" />
        <path d="M3 5.2V21" stroke="#fbbc04" strokeWidth="4" strokeLinecap="round" />
        <path d="M29 5.2V21" stroke="#34a853" strokeWidth="4" strokeLinecap="round" />
        <path d="M3 5.2 16 15 29 5.2" fill="none" stroke="#4285f4" strokeWidth="1.4" opacity="0.55" />
      </svg>
    )
  }

  if (toolKey === 'calendar') {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
        <rect x="3" y="4" width="22" height="21" rx="3" fill="#fff" />
        <path d="M3 9h22V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v2z" fill="#4285f4" />
        <path d="M6 25h16a3 3 0 0 0 3-3v-5H3v5a3 3 0 0 0 3 3z" fill="#34a853" opacity="0.16" />
        <path d="M3 12h22v4H3z" fill="#fbbc04" opacity="0.28" />
        <text x="14" y="21" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a73e8">31</text>
      </svg>
    )
  }

  if (toolKey === 'notion') {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
        <rect x="4" y="3" width="20" height="22" rx="3" fill="#f7f7f7" />
        <path d="M7 6.5 10.8 5h10.4L24 7.3v15.4L20.9 25H7.8L4 22.5V7.9z" fill="none" stroke="#111" strokeWidth="1.6" />
        <path d="M10 19V9.5h2.6l5.2 7.6V9.5H20V19h-2.5l-5.3-7.8V19z" fill="#111" />
      </svg>
    )
  }

  if (toolKey === 'jira') {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
        <path d="M14 3 25 14 14 25 3 14z" fill="#2684ff" />
        <path d="M14 3 25 14H14L8.5 8.5z" fill="#0052cc" />
        <path d="M14 25 3 14h11l5.5 5.5z" fill="#0065ff" />
        <path d="M14 8.8 19.2 14 14 19.2 8.8 14z" fill="#deebff" opacity="0.95" />
      </svg>
    )
  }

  if (toolKey === 'drive') {
    return (
      <svg viewBox="0 0 30 26" width={Math.round(size * 1.1)} height={size} aria-hidden="true">
        <path d="M11.2 1.5h7.6l9.4 16.2h-7.6z" fill="#fbbc04" />
        <path d="M1.8 17.7 11.2 1.5l3.8 6.6-5.6 9.6z" fill="#34a853" />
        <path d="M9.4 17.7h18.8l-3.8 6.6H5.6z" fill="#4285f4" />
        <path d="M9.4 17.7 15 8.1l5.6 9.6z" fill="#e8f0fe" opacity="0.96" />
      </svg>
    )
  }

  if (toolKey === 'slack') {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
        <rect x="11" y="2" width="5" height="11" rx="2.5" fill="#36c5f0" />
        <rect x="2" y="11" width="11" height="5" rx="2.5" fill="#36c5f0" />
        <rect x="15" y="2" width="5" height="11" rx="2.5" transform="rotate(90 17.5 7.5)" fill="#2eb67d" />
        <rect x="15" y="15" width="11" height="5" rx="2.5" fill="#2eb67d" />
        <rect x="12" y="15" width="5" height="11" rx="2.5" fill="#ecb22e" />
        <rect x="2" y="12" width="11" height="5" rx="2.5" transform="rotate(90 7.5 14.5)" fill="#e01e5a" />
      </svg>
    )
  }

  return null
}
