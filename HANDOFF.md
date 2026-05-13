# HANDOFF.md — Libra AI Agent Activity Feed (V2)

This document is a complete handoff for the V2 implementation. Read this before touching any code.

---

## What This Is

A **job application demo** built for Libra AI (trylibra.ai) — an agentic WorkOS that connects to Gmail, Calendar, Notion, Jira, Drive, and Slack, and acts autonomously on the user's behalf.

The core thesis: **when an AI agent acts without supervision, you need a trust layer** — a transparent log of every action it took, why, and how to reverse it. This demo builds that layer as a product concept.

The demo has two functional parts:
1. **A chat interface** that mimics Libra's command bar — user types a task, Libra confirms it was done, and a new activity card appears in the feed.
2. **An activity feed** — a timeline of every agent action with full reasoning chains, data sources accessed, before/after diffs, and undo capability.

The audience is Libra's founder. The evaluation criterion (their words): "strong aesthetic sensibility and logical clarity." This needs to look and feel like it could ship inside their actual product tomorrow.

---

## How to Run

```bash
cd "D:\AI projects\Libra AI"
npm install           # first time only
npm run dev           # starts at http://localhost:5173 (or 5174 if 5173 is busy)
npm run build         # production build — currently passes with zero errors
```

**To enable live OpenAI API mode:**
Create a file called `.env` in the project root with:
```
VITE_OPENAI_API_KEY=sk-...
```
Without this file, the app uses a keyword-matching fallback system that works fully and produces realistic responses. The fallback is the default demo mode.

---

## Tech Stack

- **React 18** — functional components, hooks only
- **Vite 5** — dev server and build
- **Tailwind CSS 3** — layout utilities + custom design tokens in `tailwind.config.js`
- **Lucide React** — icons (Send, Check, X, ChevronDown, ThumbsUp, ThumbsDown, RotateCcw)
- **CSS variables** — for `rgba()` color values Tailwind can't express cleanly (defined in `index.css`)
- **OpenAI API** (`gpt-4o-mini`) — via direct `fetch`, no SDK
- No router, no backend, no database, no authentication

Styling approach: **hybrid**. Tailwind handles all structural layout (flex, grid, padding, gap, rounded, etc.). CSS variables handle the rgba transparency colors. Inline styles handle per-element dynamic values (e.g., `borderLeft` color driven by status).

---

## File Structure

```
D:\AI projects\Libra AI\
├── index.html                    # Google Fonts: Inter + Instrument Serif
├── vite.config.js                # Standard @vitejs/plugin-react
├── tailwind.config.js            # Design tokens + custom animations
├── postcss.config.js             # tailwindcss + autoprefixer
├── package.json                  # v2.0.0
├── .env.example                  # VITE_OPENAI_API_KEY=sk-...
├── .gitignore                    # node_modules, dist, .env
├── CLAUDE.md                     # Build instructions + progress log (V1 and V2)
├── SPEC.md                       # Original product spec (V1 — superseded by PROMPT.md)
├── PROMPT.md                     # V2 architecture spec — THIS IS THE SOURCE OF TRUTH
├── HANDOFF.md                    # This file
│
└── src/
    ├── main.jsx                  # Mounts <App /> into #root
    ├── App.jsx                   # Switches between LandingPage and Dashboard
    ├── index.css                 # @tailwind directives + CSS variables + global resets
    │
    ├── data/
    │   └── activities.js         # TOOLS map, INITIAL_ACTIVITIES (6 cards), WEEKLY_STATS
    │
    ├── utils/
    │   └── helpers.js            # formatTime(), getStatus(), STATUS_CONFIG
    │
    ├── context/
    │   └── ActivityContext.jsx   # useReducer state, ActivityProvider, useActivity hook
    │
    ├── hooks/
    │   └── useLibraChat.js       # OpenAI API call + fallback system + dispatch ADD_ACTIVITY
    │
    └── components/
        ├── LandingPage.jsx       # Screen 1: landing with serif headline, stat pills, CTA
        ├── Dashboard.jsx         # Top bar (logo + tabs) + wraps ActivityProvider
        ├── ChatTab.jsx           # Connected tools strip + chat area + suggestions + input
        ├── ChatMessage.jsx       # Individual message bubble + ThinkingIndicator export
        ├── ActivityTab.jsx       # WeeklySummary + FilterBar + card list + DetailPanel
        ├── ActivityCard.jsx      # Feed card with left-border, approve/reject, slide-in anim
        ├── DetailPanel.jsx       # Right slide-over (480px) with full reasoning/diff/undo
        ├── WeeklySummary.jsx     # Collapsible card at top of Activity tab
        ├── FilterBar.jsx         # Tool + status filter pills, reads/writes context
        └── StatusBadge.jsx       # Colored pill with dot (completed/awaiting/undone/failed)
```

**Dead files (V1 leftovers — not imported by anything, safe to delete):**
- `src/components/ActivityFeed.jsx` — replaced by `ActivityTab.jsx`
- `src/components/ActivityDetail.jsx` — replaced by `DetailPanel.jsx`
- `src/components/WeeklyImpact.jsx` — replaced by `WeeklySummary.jsx`

---

## Architecture

### Top-level flow

```
App (useState: 'landing' | 'dashboard')
├── view === 'landing' → <LandingPage onEnter={() => setView('dashboard')} />
└── view === 'dashboard' → <Dashboard />
    └── <ActivityProvider>          ← useReducer context, wraps everything
        └── <DashboardInner>
            ├── sticky <nav>        ← Libra logo + Chat / Activity tabs
            └── <main>
                ├── activeTab === 'chat'     → <ChatTab />
                └── activeTab === 'activity' → <ActivityTab />
                                                 └── <DetailPanel /> (fixed position, always rendered)
```

`ActivityProvider` is instantiated inside `Dashboard`, so the context is destroyed and reset if the user somehow navigates back to the landing page. That's intentional — fresh state each demo session.

### State (ActivityContext)

```js
{
  activities: Activity[],       // starts with INITIAL_ACTIVITIES (6 items)
  toolFilter: string,           // 'all' | 'email' | 'calendar' | 'docs' | 'automations'
  statusFilter: string,         // 'all' | 'awaiting' | 'completed' | 'failed'
  selectedActivity: Activity | null,  // null = panel closed
  newActivityCount: number,     // badge on Activity tab, cleared on tab switch
}
```

**All dispatch actions:**

| Action type | Payload/id | Effect |
|---|---|---|
| `ADD_ACTIVITY` | `payload: Activity` | Prepends to activities[], increments newActivityCount |
| `APPROVE_ACTIVITY` | `id: number` | Sets status → 'completed' (also updates selectedActivity if open) |
| `REJECT_ACTIVITY` | `id: number` | Sets status → 'undone' (also updates selectedActivity if open) |
| `UNDO_ACTIVITY` | `id: number` | Sets status → 'undone' (also updates selectedActivity if open) |
| `SET_TOOL_FILTER` | `payload: string` | Updates toolFilter |
| `SET_STATUS_FILTER` | `payload: string` | Updates statusFilter |
| `SELECT_ACTIVITY` | `payload: Activity` | Opens detail panel |
| `CLOSE_DETAIL` | — | Closes detail panel |
| `CLEAR_NEW_BADGE` | — | Resets newActivityCount to 0 |

APPROVE/REJECT/UNDO all mirror their status update into `selectedActivity` so the panel header and undo button stay in sync without requiring a re-select.

---

## Data Layer

### `TOOLS` (src/data/activities.js)

```js
{
  gmail:    { name: 'Gmail',    color: '#ea4335', letter: 'G', filterKey: 'email' },
  calendar: { name: 'Calendar', color: '#4285f4', letter: 'C', filterKey: 'calendar' },
  notion:   { name: 'Notion',   color: '#e0e0e0', letter: 'N', filterKey: 'docs' },
  jira:     { name: 'Jira',     color: '#0052cc', letter: 'J', filterKey: 'automations' },
  drive:    { name: 'Drive',    color: '#34a853', letter: 'D', filterKey: 'docs' },
  slack:    { name: 'Slack',    color: '#e01e5a', letter: 'S', filterKey: 'automations' },
}
```

`filterKey` maps tool → which filter tab shows it. `notion` and `drive` both map to `'docs'`. `jira` and `slack` both map to `'automations'`.

### Activity object shape

```js
{
  id: number,                   // unique, Date.now() for chat-generated
  tool: 'gmail' | 'calendar' | 'notion' | 'jira' | 'drive' | 'slack',
  action: string,               // short description shown on the card
  reason: string,               // one-line "why" shown on the card
  time: string,                 // ISO timestamp
  status: 'awaiting' | 'completed' | 'failed' | 'undone',
  isNew: boolean,               // true = slide-in + glow animation on card
  dataTouched: string[],        // shown in detail panel "Data sources accessed"
  detail: {
    reasoning: string[],        // numbered steps in "Why Libra did this"
    before: string | null,      // shown in Before/After diff (red block)
    after: string | null,       // shown in Before/After diff (green block)
    alternativeConsidered: string,  // italic line at bottom of panel
  }
}
```

### Pre-loaded cards (6 total)

| # | Tool | Status | Action |
|---|---|---|---|
| 1 | Gmail | awaiting | Drafted reply to Ankit Sharma re: Q3 pricing (flagged — ₹5L threshold) |
| 2 | Calendar | completed | Rescheduled 1:1 with Priya Menon 3 PM → 4:30 PM |
| 3 | Jira | completed | Created bug ticket from Slack — Android 14 login failure |
| 4 | Notion | completed | Updated standup doc with yesterday's action items |
| 5 | Slack | completed | Flagged stale #product thread, sent nudge |
| 6 | Gmail | failed | Failed to send weekly digest — SMTP 503 |

All 6 have full `detail` objects with 4-6 reasoning steps, dataTouched arrays, before/after where applicable, and an alternativeConsidered line.

---

## OpenAI Integration (useLibraChat.js)

### How it works

1. User sends a message → added to `messages` state immediately
2. `isLoading` set to `true` → ThinkingIndicator appears
3. Random delay (900–1500ms) to feel human
4. **If `VITE_OPENAI_API_KEY` is set:** calls `https://api.openai.com/v1/chat/completions` with `gpt-4o-mini`, temp 0.7, max_tokens 350
5. **If no API key:** keyword-matching fallback runs synchronously
6. Response parsed — split on `---ACTIVITY_DATA---`
7. Chat text → displayed as Libra's message bubble
8. JSON block → dispatched as `ADD_ACTIVITY` with `isNew: true`

### System prompt summary

Libra is instructed to:
- Confirm the task in 2-3 sentences, warm but professional
- Always mention which tool it used
- Append a `---ACTIVITY_DATA---` JSON block with: `tool`, `action`, `reason`, `status`, `reasoning[]`, `dataTouched[]`, `alternativeConsidered`

If JSON parsing fails (malformed response), the chat message still shows but no activity is created.

### Fallback system (no API key)

`detectTool(msg)` uses regex keyword matching in priority order:
1. `jira|ticket|bug|issue|sprint` → jira
2. `calendar|schedule|reschedule|meeting|1:1|standup|call|tomorrow` → calendar
3. `notion|doc|note|summary|brief|summarize|page` → notion
4. `slack|channel|thread|message|dm` → slack
5. `drive|share|folder|file|roadmap` → drive
6. Default → gmail

Each tool has a canned `{ chat, activity }` response in `FALLBACK_RESPONSES`. The gmail fallback is notable: it always produces an `awaiting` status (not `completed`) and references the ₹5L approval threshold — demonstrating the trust layer concept.

### Suggestion pills (in ChatTab)

4 clickable prompts that pre-fill the input (user must still hit send):
- "Send Ankit a follow-up on Q3 pricing" → routes to gmail fallback
- "Reschedule my 3 PM 1:1 to tomorrow" → routes to calendar fallback
- "Create a Jira ticket for the Android login bug" → routes to jira fallback
- "Summarize the product brief in Notion" → routes to notion fallback

---

## Design System

### Color tokens (defined as Tailwind custom colors in `tailwind.config.js`)

| Tailwind class | Hex | Use |
|---|---|---|
| `bg-base` / `text-base` | `#0f1117` | Page background |
| `bg-secondary` | `#1a1b2e` | Detail panel background |
| `text-accent` / `bg-accent` | `#ff6839` | Libra orange — primary accent |
| `text-t-primary` | `#f0f0f0` | Main text (off-white, not pure white) |
| `text-t-secondary` | `#8b8fa3` | Body / secondary text |
| `text-t-tertiary` | `#5a5e72` | Labels, timestamps, muted |
| `text-status-green` | `#4ade80` | Completed status |
| `text-status-amber` | `#fbbf24` | Awaiting approval status |
| `text-status-red` | `#f87171` | Failed status |
| `text-status-gray` | `#9ca3af` | Undone status |

### CSS variables (defined in `src/index.css`)

| Variable | Value | Use |
|---|---|---|
| `--card-bg` | `rgba(255,255,255,0.04)` | Glass-morphism card background |
| `--card-bg-hover` | `rgba(255,255,255,0.06)` | Card hover state |
| `--card-border` | `rgba(255,255,255,0.08)` | Subtle card border |
| `--accent-bg` | `rgba(255,104,57,0.12)` | Orange pill/badge backgrounds |
| `--green-bg` | `rgba(34,197,94,0.12)` | Green badge backgrounds |
| `--amber-bg` | `rgba(245,158,11,0.12)` | Amber badge backgrounds |
| `--red-bg` | `rgba(239,68,68,0.12)` | Red badge backgrounds |
| `--gray-bg` | `rgba(107,114,128,0.12)` | Gray badge backgrounds |
| `--section-border` | `rgba(255,255,255,0.06)` | Dividers inside panels |
| `--dot-grid` | radial-gradient(...) | Landing page background texture |

### Shared CSS classes (defined in `@layer components` in `index.css`)

- `.card` — glass card: `var(--card-bg)` bg + `var(--card-border)` border + `border-radius: 12px`
- `.card-hover:hover` — hover: `var(--card-bg-hover)` bg + orange border glow `0 0 0 1px rgba(255,104,57,0.15)`
- `.section-divider` — 1px horizontal rule, `var(--section-border)` color
- `.thinking-dot` — animated gray dot for the ThinkingIndicator (CSS keyframe `pulse3`)

### Typography

- Body/UI font: `Inter` (loaded from Google Fonts in `index.html`)
- Landing headline: `Instrument Serif` (italic for "for Libra." in orange)
- Font weights: 400 body, 500 labels, 600 headings only
- Tailwind class aliases: `font-sans` = Inter, `font-serif` = Instrument Serif

### Status color logic (src/utils/helpers.js)

```js
STATUS_CONFIG = {
  completed: { label: 'Completed',        color: '#4ade80', bg: 'var(--green-bg)', border: '#22c55e' },
  awaiting:  { label: 'Awaiting approval', color: '#fbbf24', bg: 'var(--amber-bg)', border: '#f59e0b' },
  undone:    { label: 'Undone',            color: '#9ca3af', bg: 'var(--gray-bg)',  border: '#6b7280' },
  failed:    { label: 'Failed',            color: '#f87171', bg: 'var(--red-bg)',   border: '#ef4444' },
}
```

`border` is used for the left-border accent on ActivityCard. `color` is text color for the badge. `bg` is the badge background.

### Animations (in `tailwind.config.js`)

- `animate-slide-down` — new activity cards: slide down 10px + fade in over 250ms
- `animate-new-glow` — new activity cards: orange border glow pulses 2x then fades
- `animate-slide-in-right` — defined but not currently applied (DetailPanel uses CSS transform directly)
- `animate-dot-pulse` — thinking dots: the `.thinking-dot` CSS class uses `@keyframes pulse3` defined in `index.css`

---

## Screen-by-Screen Breakdown

### Screen 1: LandingPage.jsx

Single-column, centered, max-width ~520px. Dark background with orange dot-grid texture (`--dot-grid`).

**Content top to bottom:**
- Nav: Libra logo (left) + "Agent Activity Feed — Demo" (right, tertiary)
- Orange pill badge: "Demo · Agent Activity Feed"
- Serif headline (38px, Instrument Serif, weight 400): "I built the missing trust layer / *for Libra.*" — italic "for Libra." is orange
- Two paragraphs of body text (15px, secondary color) explaining what the demo does
- Three inline stat pills + "Writer, 2026" source pill (horizontal row)
- CTA button: "Try the demo →" — orange, 8px radius, glow shadow, hover lifts 1px
- Footer: "Built for trylibra.ai" + "Dev · devvbuilds@gmail.com"

Clicking CTA sets `App`'s view state to `'dashboard'`.

### Screen 2: Dashboard.jsx (top bar)

Sticky `position: sticky; top: 0; z-index: 30`. Background `rgba(15,17,23,0.92)` with `backdrop-filter: blur(10px)`. The blur creates a subtle frosted effect as cards scroll under it.

Contains:
- Libra logo (orange gradient square with triangle icon + "Libra AI" text)
- Two tab buttons: "Chat" and "Activity"
- Activity tab shows an orange number badge when `state.newActivityCount > 0`
- Clicking Activity tab: sets active tab + dispatches `CLEAR_NEW_BADGE`

The `ActivityProvider` wraps `DashboardInner` (not `Dashboard` itself) so context is initialized before the inner component reads it.

### Screen 3: ChatTab.jsx

Two sections stacked:

**Connected tools strip** (`.card`):
- "CONNECTED TOOLS" label (11px, uppercase, tertiary)
- 6 tool chips in a row: circular colored icon (letter inside) + tool name below (10px)

**Chat area** (`.card`, fixed height 420px):
- Scrollable message list (flex-col, gap-3, overflow-y-auto)
- Welcome message from Libra appears on load
- `ThinkingIndicator` (three animated dots) appears while `isLoading`
- Suggestion pills row (4 pills, separated from messages by `--section-border`)
- Input bar: dark rounded container, text input, send button (orange when input is non-empty)
- Enter key sends (Shift+Enter does not)
- Input is disabled while `isLoading`

**ChatMessage.jsx:** User messages are right-aligned with orange-tinted background. Libra messages are left-aligned with glass-card background. Libra messages include the triangle-in-orange-circle avatar. Both show relative timestamps (formatTime).

**useLibraChat hook** manages its own `messages` state (separate from context). It reads `dispatch` from `useActivity()` to push ADD_ACTIVITY when a response arrives.

### Screen 4: ActivityTab.jsx

Three stacked sections:
1. `<WeeklySummary />` — collapsible card at top
2. `<FilterBar />` — filter pills
3. Card list — `filtered` array mapped to `<ActivityCard />`
4. `<DetailPanel />` — always rendered (fixed position), controlled by `state.selectedActivity`

**Filtering logic (ActivityTab.jsx):**
```js
const filtered = state.activities.filter(a => {
  const toolMatch = state.toolFilter === 'all' || TOOLS[a.tool].filterKey === state.toolFilter
  const statusMatch = state.statusFilter === 'all' || a.status === state.statusFilter
  return toolMatch && statusMatch  // AND logic
})
```

**WeeklySummary.jsx:** Collapsed by default (one row). Expands to show 4 metric boxes (emails/meetings/docs/automations) with mini bars, then an insight line. The live `completed` and `awaiting` counts read from context state, so they update as the user approves/rejects cards.

**FilterBar.jsx:** Two groups of pills. Left group: All / Email / Calendar / Docs / Automations. Right group: All / Needs approval / Completed / Failed. Separated by a 1px vertical divider. Active pill: `rgba(255,255,255,0.1)` bg + `rgba(255,255,255,0.14)` border.

### Screen 5: ActivityCard.jsx

Left border color = status's `border` hex (from STATUS_CONFIG). Awaiting cards get `rgba(245,158,11,0.03)` background tint.

**Card structure:**
- Row 1: ToolIcon (letter in colored rounded square) + tool name + timestamp + StatusBadge (right-aligned)
- Row 2: Action text (14px, medium weight, primary color)
- Row 3: Reason (12px, secondary color)
- Row 4 (awaiting only): Approve (green) + Reject (red) + View details ghost buttons

New cards (`.isNew === true`) get `animate-slide-down` + `animate-new-glow` Tailwind animation classes. Note: `isNew` is never set back to false — the animation plays once on mount (CSS `forwards` fill mode).

Click anywhere on the card dispatches `SELECT_ACTIVITY`. Approve/Reject buttons call `stopPropagation()` to prevent also opening the panel.

### Screen 6: DetailPanel.jsx

**Architecture:** Always in the DOM (rendered inside `ActivityTab`). Open/closed state is driven by `state.selectedActivity` from context — null = closed, any activity object = open.

```js
const isOpen = !!activity
// Panel uses CSS transform:
transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
transition: 'transform 250ms cubic-bezier(0.32, 0.72, 0, 1)'
```

The backdrop is a fixed full-screen div (z-40) that transitions opacity. Panel is z-50. Clicking backdrop dispatches `CLOSE_DETAIL`. Escape key also closes (event listener on `document`).

**Panel content (PanelContent component):**
1. Header: ToolIcon + tool name + relative time + action text (h2) + StatusBadge + X button
2. "WHY LIBRA DID THIS" — numbered reasoning steps, orange number squares (`--accent-bg` bg)
3. `section-divider`
4. "DATA SOURCES ACCESSED" — list with `—` prefix
5. `section-divider` (only if before/after exists)
6. "BEFORE → AFTER" — conditional; red block for before, green block for after
7. `section-divider` (only if alternativeConsidered exists)
8. "WHAT LIBRA CONSIDERED BUT DIDN'T DO" — italic tertiary text
9. `section-divider`
10. Feedback row: "Was this the right call?" + Yes/No thumbs buttons → "Thanks ✓" on click
11. Undo button (only if `activity.status === 'completed'`): idle → "Undo this action" / confirm → "Are you sure?" (red) / done → "Undone ✓" (gray, non-interactive)

Undo dispatches `UNDO_ACTIVITY` which updates both the activities array AND selectedActivity in context simultaneously (keeping the panel's status badge in sync).

`undoState` and `feedback` are local panel state, reset via `useEffect` when `activity.id` changes (panel opened for a different activity).

---

## Interactions Checklist

| Interaction | Where | How |
|---|---|---|
| Landing → Dashboard | LandingPage CTA | `App` `useState` |
| Send chat message | ChatTab input / Enter | `useLibraChat.sendMessage()` |
| API call with live key | useLibraChat | `fetch` to OpenAI, parse `---ACTIVITY_DATA---` |
| Fallback response (no key) | useLibraChat | `detectTool()` + `FALLBACK_RESPONSES[tool]()` |
| Activity appears in feed | useLibraChat → context | `dispatch({ type: 'ADD_ACTIVITY' })` |
| Activity tab badge | Dashboard | `state.newActivityCount`, cleared on tab switch |
| Suggestion pill → pre-fill | ChatTab | `setInput(s)` + `focus()` |
| Filter by tool | FilterBar | `dispatch({ type: 'SET_TOOL_FILTER' })` |
| Filter by status | FilterBar | `dispatch({ type: 'SET_STATUS_FILTER' })` |
| Open detail panel | ActivityCard click | `dispatch({ type: 'SELECT_ACTIVITY' })` |
| Close panel (X) | DetailPanel header | `dispatch({ type: 'CLOSE_DETAIL' })` |
| Close panel (backdrop) | Backdrop click | `dispatch({ type: 'CLOSE_DETAIL' })` |
| Close panel (Escape) | Document keydown | `dispatch({ type: 'CLOSE_DETAIL' })` |
| Approve awaiting card | ActivityCard button | `dispatch({ type: 'APPROVE_ACTIVITY' })` |
| Reject awaiting card | ActivityCard button | `dispatch({ type: 'REJECT_ACTIVITY' })` |
| Undo completed action | DetailPanel | Local `undoState` machine → `dispatch UNDO_ACTIVITY` |
| Thumbs feedback | DetailPanel | Local `feedback` state → "Thanks ✓" |
| Weekly summary expand | WeeklySummary | Local `useState(false)`, `max-height` CSS transition |
| New card slide-in | ActivityCard | Tailwind `animate-slide-down` + `animate-new-glow` (isNew flag) |

---

## Known Issues / What Still Needs Work

### Functional
- **`isNew` flag never clears.** When a new card is added, `isNew: true` stays on the activity object permanently. The animation only fires once on mount so it's not a visual bug, but it's slightly dirty state. Fix: dispatch a `MARK_SEEN` action after the animation completes (250ms timeout).
- **No multi-turn memory in chat.** Each `sendMessage` call only sends `[systemPrompt, userMessage]` — no prior conversation history. The OpenAI model has no memory of what it said before. This is intentional per PROMPT.md ("No multi-turn memory") but worth knowing.
- **Chat state resets on tab switch.** `useLibraChat` is instantiated inside `ChatTab`. Switching tabs and switching back does NOT reset it (React keeps the component mounted), but if the component unmounts for any reason, messages are lost. This is fine for a demo.
- **WEEKLY_STATS numbers are hardcoded.** The `totalActions: 23`, `breakdown` values, and `insight` string in `WEEKLY_STATS` are static. Only the `completed` and `awaiting` counts in the collapsed row are live (computed from context). The expanded breakdown grid still shows static numbers. Could make them dynamic.

### Visual
- **Chat area fixed height (420px).** Works fine at 1440px viewport but could feel cramped at non-standard sizes. The height is hardcoded as `style={{ height: 420 }}`.
- **No empty state for chat.** If the welcome message is somehow gone, the chat area is just blank. Not a real scenario but worth noting.
- **The detail panel renders inside ActivityTab.** If an activity is selected while on the Chat tab and the user somehow navigates... actually this can't happen because selecting an activity requires being on the Activity tab. Non-issue.

### Deploy
- **Not yet deployed to Vercel.** Command when ready: `npx vercel --prod` from the project root. The build output is in `dist/` (standard Vite static export).

---

## Design Decisions Worth Preserving

1. **No sidebar.** Single column throughout. The layout is intentionally constrained — `max-w-3xl` (768px) centered.

2. **Hybrid Tailwind + inline styles.** Don't fight this. The `rgba()` values can't cleanly go through Tailwind's opacity system without making the code worse. Use Tailwind for layout, CSS vars for transparency colors, inline styles for dynamic per-element values.

3. **Context inside Dashboard, not App.** The `ActivityProvider` wraps `DashboardInner`, not the whole app. Landing page doesn't need the context and it's cleaner to initialize it only when the dashboard mounts.

4. **DetailPanel always in DOM.** The panel uses CSS `transform` for show/hide rather than conditional rendering. This means the panel's scroll position and local state (undoState, feedback) persist while it's "closed." When it re-opens for a *different* activity, `useEffect` resets local state. This is intentional and correct.

5. **Fallback produces `awaiting` status for Gmail.** This is the most important design decision in the fallback system. An email about pricing is flagged rather than sent — demonstrating the trust layer concept even without a live API key. Don't change this to `completed`.

6. **ThinkingIndicator is its own export from ChatMessage.jsx.** Named export `ThinkingIndicator` from the same file as `ChatMessage`. Don't move it to its own file — it's closely related and the file is small.

---

## Reference Docs

- `PROMPT.md` — V2 architecture spec. Source of truth for layout, screens, and interactions. Read this if anything is unclear.
- `CLAUDE.md` — Design tokens, brand guidelines, and build history. Source of truth for colors, typography, and visual style.
- `SPEC.md` — V1 product spec. Largely superseded but has good context on the problem being solved.
