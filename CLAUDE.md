# CLAUDE.md — Build Instructions

Read SPEC.md first for full product context. This file covers how to build it.

---

## Build Progress Log

### ✅ DONE — V2 Rebuild per PROMPT.md (2026-05-13)

Full rebuild complete. Clean Vite build (`npm run build` passes). Dev server confirmed at `http://localhost:5174`.

**Architecture:** Two-tab Dashboard (Chat + Activity) with shared useReducer context. OpenAI API integration with keyword-matching fallback. Slide-over detail panel.

**New files:**
- `package.json` — React 18 + Vite 5 + Tailwind CSS 3 + Lucide React
- `tailwind.config.js` — design tokens (colors, fonts, animations)
- `postcss.config.js`
- `.env.example` — `VITE_OPENAI_API_KEY=sk-...`
- `.gitignore`
- `src/index.css` — Tailwind directives + CSS vars + global styles
- `src/App.jsx` — Landing/Dashboard switcher
- `src/data/activities.js` — 6 pre-loaded activities, TOOLS, WEEKLY_STATS
- `src/utils/helpers.js` — formatTime, getStatus, STATUS_CONFIG
- `src/context/ActivityContext.jsx` — useReducer context, all dispatch actions
- `src/hooks/useLibraChat.js` — OpenAI API integration + 6 fallback tool responses
- `src/components/LandingPage.jsx` — Minimal, builder-voice landing
- `src/components/Dashboard.jsx` — Sticky nav, Chat/Activity tabs, badge
- `src/components/ChatTab.jsx` — Connected tools strip, chat, suggestions, input
- `src/components/ChatMessage.jsx` + ThinkingIndicator
- `src/components/ActivityTab.jsx` — WeeklySummary + FilterBar + cards + DetailPanel
- `src/components/ActivityCard.jsx` — Left-border status, approve/reject, slide-in anim
- `src/components/DetailPanel.jsx` — Right slide-over (480px), full reasoning/diff/undo
- `src/components/WeeklySummary.jsx` — Collapsible, live counts from context
- `src/components/FilterBar.jsx` — Tool + status filters, AND logic
- `src/components/StatusBadge.jsx` — Status pill

**All 7 interactions working:**
1. Landing → Dashboard (CTA)
2. Chat tab: send message → Libra responds → activity created in feed
3. Activity tab badge increments when chat creates activities
4. Filter tabs (tool + status, AND logic)
5. Card click → slide-over detail panel (escape/backdrop to close)
6. Approve / Reject on awaiting cards
7. Undo (confirm → done) + thumbs up/down feedback

**Context actions:** ADD_ACTIVITY, APPROVE_ACTIVITY, REJECT_ACTIVITY, UNDO_ACTIVITY, SET_TOOL_FILTER, SET_STATUS_FILTER, SELECT_ACTIVITY, CLOSE_DETAIL, CLEAR_NEW_BADGE

### 🔲 TODO — Next Steps
- [ ] Add VITE_OPENAI_API_KEY to .env to enable live API mode
- [ ] Test all interactions end-to-end in browser
- [ ] Vercel deployment: `npx vercel --prod`

---

## Project Overview

Interactive demo of an "Agent Activity Feed" for Libra AI (trylibra.ai) — an agentic WorkOS that connects to calendar, email, docs, and meetings. This demo shows a trust/transparency layer: a real-time timeline of every action the AI agent takes, with full reasoning chains and undo capability.

**This is a job application artifact.** It needs to look like it belongs inside Libra's actual product — polished, intentional, production-grade. No placeholder feel. No "demo" jank.

---

## Tech Stack

- **React** (single-page app, functional components + hooks)
- **Tailwind CSS** via CDN or utility classes — keep it clean, no component library
- **No backend** — all data is hardcoded mock data in a constants file
- **Vite** for dev/build
- **Deploy to Vercel** (static export)

---

## Brand & Design Tokens

### Libra AI Brand
- Primary accent: `#ff6839` (Libra orange)
- Light orange: `#fff4f0`
- Dark orange (text on light bg): `#cc4a22`
- Logo: Use a simple circle with a bolt/lightning icon as placeholder — or just the text "Libra" in the brand font
- Brand theme color from their meta tags: `#ff6839`

### Design System

**CRITICAL: This is a DARK THEME app.** Libra's entire product is dark mode — dark backgrounds, light text, orange accents. Match their visual language exactly. Reference the screenshots in /mnt/user-data/uploads/ for the real Libra UI.

- **Aesthetic direction:** Premium dark UI, dense and information-rich. Think Linear's dark mode meets Vercel's dashboard. The Libra site uses a deep dark background with subtle orange dot-grid patterns, glass-morphism cards, and confident typography. Our demo should feel like it lives inside their product.
- **Typography:**
  - Use `"Inter"` for body text and UI, with `system-ui, sans-serif` fallback
  - For the landing page headline, use a serif or display font for contrast — try `"Instrument Serif"` or `"Playfair Display"` from Google Fonts (Libra uses a thin serif-like display font for hero text). Fallback: `Georgia, serif`
  - Font weights: 400 (body), 500 (labels/emphasis), 600 (headings only)
  - Body text: 14px, line-height 1.5
  - Small labels: 12px
  - Card headings: 15px
  - Page headings: 36-48px on landing, 24px on feed
- **Colors — DARK THEME:**
  - Page background: `#0f1117` (very dark, almost black — Libra's base)
  - Secondary background: `#1a1b2e` (slightly lighter, for sections)
  - Card background: `rgba(255, 255, 255, 0.04)` (subtle glass effect) with `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Card hover: `rgba(255, 255, 255, 0.06)`
  - Text primary: `#f0f0f0` (off-white)
  - Text secondary: `#8b8fa3` (muted gray)
  - Text tertiary: `#5a5e72` (subtle)
  - Borders: `rgba(255, 255, 255, 0.08)` (very subtle)
  - Accent (Libra orange): `#ff6839`
  - Accent hover: `#ff7a50`
  - Accent background (for badges/pills): `rgba(255, 104, 57, 0.12)`
  - Accent text: `#ff6839`
  - Status colors:
    - Completed: `#22c55e` (green) — badge bg: `rgba(34, 197, 94, 0.12)`, text: `#4ade80`
    - Awaiting approval: `#f59e0b` (amber) — badge bg: `rgba(245, 158, 11, 0.12)`, text: `#fbbf24`
    - Undone: `#6b7280` (gray) — badge bg: `rgba(107, 114, 128, 0.12)`, text: `#9ca3af`
    - Failed: `#ef4444` (red) — badge bg: `rgba(239, 68, 68, 0.12)`, text: `#f87171`
- **Background texture:** Libra uses a subtle dot-grid pattern (orange-tinted dots on dark bg). Add this as a CSS radial-gradient pattern on the landing page background: `radial-gradient(circle, rgba(255, 104, 57, 0.07) 1px, transparent 1px)` with `background-size: 24px 24px`. Use sparingly — landing page only, not on the feed.
- **Spacing:** 8px grid. Use multiples: 8, 12, 16, 24, 32, 48.
- **Border radius:** 12px for cards (Libra uses generous rounding), 8px for buttons/badges, 50% for avatars/status dots
- **Shadows:** No box-shadows. Use border glow for emphasis: `box-shadow: 0 0 0 1px rgba(255, 104, 57, 0.2)` on hover for interactive cards.
- **Transitions:** 150ms ease for hovers, 200ms for expansions. Subtle, not flashy.
- **Icons:** Use Lucide React icons (clean, consistent). If not available, use simple unicode or SVG.
- **Libra logo:** Render as a rounded-square (12px radius) with orange gradient background (`linear-gradient(135deg, #ff6839, #ff8c5a)`), containing a simple triangle/play icon in dark color. Next to it, text "Libra AI" in white, weight 600.

### Layout
- Max width: 720px, centered
- Padding: 24px horizontal on desktop
- The whole app is a single column — no sidebar, no complex grid
- Cards stack vertically with 12px gap

---

## File Structure

```
libra-activity-feed/
├── CLAUDE.md          (this file)
├── SPEC.md            (product spec — read first)
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css           (global styles, Tailwind imports, CSS variables)
│   ├── data/
│   │   └── activities.js   (all mock data — activities, stats, tool definitions)
│   ├── components/
│   │   ├── LandingPage.jsx      (Screen 1: problem statement + CTA)
│   │   ├── ActivityFeed.jsx     (Screen 2: main feed with filters)
│   │   ├── ActivityCard.jsx     (individual feed card)
│   │   ├── ActivityDetail.jsx   (Screen 3: expanded reasoning view)
│   │   ├── WeeklyImpact.jsx     (Screen 4: collapsible summary card)
│   │   ├── FilterBar.jsx        (tool + status filter tabs)
│   │   └── StatusBadge.jsx      (reusable status pill)
│   └── utils/
│       └── helpers.js           (any formatting utils)
```

---

## Screen-by-Screen Build Notes

### Landing Page (`LandingPage.jsx`)
- Full viewport height, centered content
- Dark background (#0f1117) with the subtle orange dot-grid pattern (same as Libra's site)
- Headline in serif/display font (like Libra's hero "The AI coworker that gets your work done") — large, light-colored text
- Stats displayed as glass-morphism cards with semi-transparent backgrounds: "67%" in big orange text, small white label underneath
- Use 3 stat cards in a row
- One paragraph explaining the solution (2-3 sentences max) in secondary text color
- CTA button in Libra orange (#ff6839), white text, rounded (border-radius 8px), with hover glow effect
- Libra logo (orange rounded square + "Libra AI" text) at top left — match the nav style from screenshot 2
- "Built by Dev" or similar subtle credit at bottom in tertiary text color
- Clicking CTA transitions to the feed (use React state to switch views — no router needed)
- The whole page should feel like it could be a section on trylibra.ai — same energy, same polish

### Activity Feed (`ActivityFeed.jsx`)
- Weekly Impact Summary card pinned at top (collapsible)
- Filter bar below it
- Then the card list
- Cards should have a left-border accent color matching their status (2-3px colored left border)
- Awaiting approval cards should feel slightly elevated — subtle amber left border + `rgba(245, 158, 11, 0.05)` background tint
- All cards use the glass-morphism style: `rgba(255,255,255,0.04)` bg, `rgba(255,255,255,0.08)` border
- Clicking anywhere on a card opens the detail view

### Activity Card (`ActivityCard.jsx`)
- Compact: tool icon + action text + timestamp on one row, reason + status below
- Tool icons: use small colored circles (10px) with the tool's brand color, or Lucide icons
- Status badge: small pill with semi-transparent colored background + colored text (use the status color tokens from design system)
- For "awaiting approval" cards: show Approve (green) + Reject (red) ghost buttons inline
- Hover state: card bg shifts to `rgba(255,255,255,0.06)`, subtle border glow
- Click handler to open detail

### Activity Detail (`ActivityDetail.jsx`)
- Opens as a modal or slide-over panel (modal is simpler — go with modal)
- Modal should be 600px wide, vertically scrollable
- Modal background: `#1a1b2e` (solid dark, slightly lighter than page bg) with `1px solid rgba(255,255,255,0.1)` border
- Backdrop: `rgba(0, 0, 0, 0.7)` overlay
- Close button (X) top right, using muted text color
- Sections inside:
  1. Header: tool icon + action text + status + timestamp
  2. "Why Libra did this" — numbered reasoning chain steps (numbers in orange)
  3. "Data sources accessed" — list with file/tool icons
  4. "Before → After" — side by side or stacked diff (only for applicable actions). Use subtle red/green tinted backgrounds for before/after: `rgba(239,68,68,0.08)` / `rgba(34,197,94,0.08)`
  5. "What Libra considered but didn't do" — italic one-liner in secondary text color
  6. Feedback: thumbs up / thumbs down buttons (toggle state on click, show "Thanks!" after)
  7. Undo button (shows confirmation state: "Are you sure?" → "Undone ✓")
- Each section separated by `rgba(255,255,255,0.06)` borders

### Weekly Impact Summary (`WeeklyImpact.jsx`)
- Card at top of feed, collapsible
- Default state: show headline row "This week: 23 actions · ~3.2 hrs saved" with a chevron to expand
- Expanded state: show breakdown grid (4 metric boxes: emails, meetings, docs, automations) + insight line
- Smooth expand/collapse animation (max-height transition)

---

## Mock Data Guidelines (`data/activities.js`)

All data is static. Define:

1. **TOOLS** — object mapping tool keys to { name, icon, color }
   - gmail, calendar, notion, jira, drive, slack

2. **ACTIVITIES** — array of 8-10 activity objects, each with:
   - id, tool (key), action (string), reason (string), time (string), status (enum)
   - dataTouched: string[] of data sources
   - detail: { reasoning: string[], before?: string, after?: string, alternativeConsidered: string }

3. **WEEKLY_STATS** — object with totalActions, completed, needsApproval, undone, timeSaved, breakdown, insight

Make the data feel real and specific to an Indian startup PM context:
- Use Indian names (Ankit, Priya, Ravi, Nisha)
- Use ₹ for currency
- Reference realistic tools (Notion, Jira, Google Drive, Gmail, Slack)
- Reference realistic docs (Q3 Pricing Sheet, Product Brief, Roadmap)
- Mix of mundane (updating a doc) and high-stakes (client pricing email)

---

## Interactions to Implement

1. **Landing → Feed transition:** Click CTA button, switch view (useState)
2. **Filter tabs:** Click to filter activity list by tool or status
3. **Card click → Modal open:** Click card, show detail modal
4. **Approve/Reject:** Click on awaiting-approval cards, update status visually
5. **Undo:** Click undo in detail view, show confirmation, update card status to "undone"
6. **Feedback:** Thumbs up/down in detail view, toggle state
7. **Weekly Summary collapse/expand:** Click chevron, toggle expanded state

All state is local (useState/useReducer). No persistence needed.

---

## Quality Bar

This is a portfolio piece that will be judged by a founder who said "I measure for vibes: strong aesthetic sensibility and logical clarity." Every detail matters:

- **Reference the Libra screenshots** in `/mnt/user-data/uploads/` — the demo must feel like it belongs inside Libra's product
- No lorem ipsum anywhere — all copy is real and considered
- Transitions should feel smooth, not janky
- Spacing should be consistent (8px grid)
- Text hierarchy should be clear at a glance — white headings, gray body, orange accents
- The dark theme must be cohesive — no accidentally light elements, no contrast issues
- Glass-morphism cards should feel subtle, not frosted-glass-heavy
- The whole thing should feel like it could ship in Libra's product tomorrow
- Test at 1440px width — that's the likely review viewport

---

## What NOT to Do

- Don't add a sidebar or navigation — single column, single flow
- Don't use a light theme — Libra is dark mode, this must be dark mode
- Don't add loading spinners or skeleton states — data is instant
- Don't add tooltips or onboarding tours — the UI should be self-explanatory
- Don't add a chatbot or conversational element
- Don't use generic placeholder data — every string should feel real
- Don't over-animate — this is a professional tool, not a consumer app
- Don't use heavy frosted-glass blur effects — keep glass-morphism subtle (just transparency + border)
- Don't use pure white (#fff) for text — use off-white (#f0f0f0)
- Don't use pure black (#000) for backgrounds — use the deep navy (#0f1117)
