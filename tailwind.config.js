/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'base': '#0f1117',
        'secondary': '#1a1b2e',
        'accent': '#ff6839',
        'accent-h': '#ff7a50',
        't-primary': '#f0f0f0',
        't-secondary': '#8b8fa3',
        't-tertiary': '#5a5e72',
        'status-green': '#4ade80',
        'status-amber': '#fbbf24',
        'status-red': '#f87171',
        'status-gray': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(255, 104, 57, 0)' },
          '50%': { boxShadow: '0 0 0 2px rgba(255, 104, 57, 0.35)' },
        },
        pulse3: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'slide-down': 'slideDown 0.25s ease forwards',
        'slide-in-right': 'slideInRight 0.25s ease-out forwards',
        'new-glow': 'glow 1.2s ease 0.1s 2',
        'dot-pulse': 'pulse3 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
