# PROMPT.md — v2 Architecture Override

**Read CLAUDE.md and SPEC.md first for design tokens and brand guidelines. This file overrides the layout, screens, and interaction model. Where this file conflicts with the older specs, this file wins.**

---

## What Changed (Summary for Claude Code)

The app is no longer a static activity feed. It's now a **two-tab dashboard** with a working chat interface powered by OpenAI API. The chat mimics Libra's actual product — user gives commands, Libra confirms the action, and the Activity Feed updates in real time.

---

## Architecture

**4 surfaces total:**

1. **Landing Page** — minimal, 5 seconds to read, frames the demo
2. **Chat Tab** (default after landing) — Libra chat interface with connected tools display
3. **Activity Feed Tab** — pre-loaded with 6 demo activities + new ones from chat
4. **Detail Panel** — slide-over from right when clicking any activity card

**No sidebar.** Single column. Two tabs in the top bar.

---

## Layout

```
Top bar: [Libra AI logo]                    [Chat] [Activity •] tabs
─────────────────────────────────────────────────────────────
Content area (switches based on active tab)
Max-width: 800px, centered
```

The Activity tab shows a notification dot/badge when new activities are added via chat.

---

## Screen 1: Landing Page

**Purpose:** Tell the reviewer exactly what this is. Not a sales pitch. A builder explaining their work.

**Content (top to bottom, centered, max-width 560px):**

1. Libra logo (small)
2. Small orange pill: "Demo · Agent Activity Feed"
3. Headline (serif font, 36-40px):
   "I built the missing trust layer for Libra."
4. Body text (secondary color, 15px, 4-5 lines max):
   "Libra's agents work across your email, calendar, docs, and Slack. But when an AI acts autonomously, you need to see what it did and why.

   This demo has two parts: a chat bar that mimics Libra's command interface, and an activity feed that tracks every action with full reasoning, data sources, and undo. Type a command — watch it appear in the feed."
5. Three small stat pills in a row (not big cards — compact, inline):
   "67% had AI data leaks · 36% can't supervise agents · 35% can't stop a rogue agent"
   All in one line or two, small text, secondary color. Source: Writer, 2026. These are supporting context, not the hero.
6. CTA button: "Try the demo →" (solid orange)
7. Footer: "Built by Dev · devvbuilds@gmail.com" (tertiary text)

**Key difference from v1:** This reads like a person explaining what they built, not like a marketing page. It tells you exactly what the demo does before you click in.

---

## Screen 2: Chat Tab

**This is the default tab after clicking the CTA.**

### Connected Tools Strip
At the top of the chat area, a horizontal row of connected tool icons:
- Gmail (red G) · Calendar (blue C) · Notion (gray N) · Jira (blue J) · Drive (green D) · Slack (pink S)
- Each is a small colored circle with the letter, plus the tool name below in 11px text
- This strip is static — just shows what Libra is "connected to"
- Subtle label above: "Connected tools" in section-header style (11px, uppercase)

### Chat Area
- Scrollable message area
- Start with a welcome message from Libra:
  "Hi! I'm Libra. I'm connected to your Gmail, Calendar, Notion, Jira, Drive, and Slack. Tell me what you need — I'll handle it and log everything in your Activity Feed."
- Messages alternate: user (right-aligned, orange-tinted bg) and Libra (left-aligned, card bg)
- Libra's avatar: small orange circle with the Libra triangle icon

### Chat Input Bar
- Fixed at bottom of chat area
- Placeholder text: "Ask Libra to do something..."
- Send button (orange arrow/send icon) on the right
- Microphone icon optional (non-functional, just visual)
- Match the style of Libra's actual input bar from their homepage screenshot (dark bg, subtle border, rounded)

### What Happens When User Sends a Message

1. User message appears in chat (right side)
2. Show "Libra is thinking..." indicator (3 animated dots, 1.5 second delay)
3. Make API call to OpenAI
4. Libra's response appears in chat (left side)
5. Simultaneously: a new activity card is created and added to the Activity Feed tab
6. The Activity tab's notification badge increments (show a small orange dot or number)

### OpenAI API Integration

**API call setup:**
```javascript
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You are Libra AI, an agentic WorkOS that connects to users' Gmail, Calendar, Notion, Jira, Google Drive, and Slack. The user gives you tasks and you execute them across their connected tools.

Your job: Respond confirming you completed the task. Be concise (2-3 sentences max). Always mention which tool you used. Sound professional but warm.

IMPORTANT: You must also return structured data for the activity feed. After your natural response, add a JSON block in this exact format:

---ACTIVITY_DATA---
{
  "tool": "gmail|calendar|notion|jira|drive|slack",
  "action": "Short description of what was done (max 80 chars)",
  "reason": "Why this action was taken (max 120 chars)",
  "status": "completed",
  "reasoning": [
    "Step 1 of what Libra did",
    "Step 2",
    "Step 3"
  ],
  "dataTouched": ["Source 1", "Source 2"],
  "alternativeConsidered": "What Libra considered but didn't do (one sentence)"
}

Always include the ---ACTIVITY_DATA--- block. The tool must be one of: gmail, calendar, notion, jira, drive, slack.`
      },
      { role: "user", content: userMessage }
    ]
  })
});
```

**Parsing the response:**
- Split the response on `---ACTIVITY_DATA---`
- First part = chat message to display
- Second part = JSON to parse and create a new activity card
- If parsing fails (no JSON block), still show the chat message, just don't create an activity card

**API key handling:**
- Store the API key in a `.env` file: `VITE_OPENAI_API_KEY=sk-...`
- Access via `import.meta.env.VITE_OPENAI_API_KEY`
- Add `.env` to `.gitignore`
- If no API key is set, fall back to pre-scripted responses (keyword matching on "email", "calendar", "slack", etc.)

### Suggested Prompts
Below the chat input, show 3-4 clickable suggestion pills that pre-fill the input:
- "Send Ankit a follow-up on Q3 pricing"
- "Reschedule my 3 PM 1:1 to tomorrow"
- "Create a Jira ticket for the Android login bug"
- "Summarize the product brief in Notion"

These help the reviewer know what to type. On click, they fill the input bar (user still has to hit send).

---

## Screen 3: Activity Feed Tab

### Weekly Impact Summary (collapsible card at top)
- Collapsed by default: single row showing "This week: **23 actions** · ~3.2 hrs saved · 19 completed · 4 need approval"
- Chevron to expand
- Expanded: shows tool breakdown (small horizontal bars), insight line
- Numbers update in real time as activities change state

### Filter Bar (single row)
- Left group: All · Email · Calendar · Docs · Automations
- Right group: All · Needs approval · Completed · Failed
- Separated by a subtle divider or extra gap
- Active pill: orange bg. Inactive: ghost.
- Both groups apply simultaneously (AND logic)

### Activity Cards
- Pre-loaded with 6 demo activities (see data below)
- New activities from chat appear at the top with a subtle slide-in animation and brief highlight glow
- Card structure same as CLAUDE.md spec: left accent border, tool icon, action, reason, status badge, action buttons for awaiting cards
- Click opens Detail Panel

### Pre-loaded Demo Activities (6 cards)

1. **(Gmail, Awaiting)** "Drafted reply to Ankit Sharma re: Q3 pricing proposal"
   - "Flagged — pricing discussion exceeds ₹5L threshold"
2. **(Calendar, Completed)** "Rescheduled 1:1 with Priya from 3 PM to 4:30 PM"
   - "Investor call historically overruns by 60-90 min"
3. **(Jira, Completed)** "Created bug ticket from Slack thread — Android 14 login failure"
   - "12 replies, 3 engineers confirmed — no existing ticket"
4. **(Notion, Completed)** "Updated standup doc with yesterday's action items"
   - "Doc was 3 days stale — pulled 4 items from Jira"
5. **(Slack, Completed)** "Flagged stale thread in #product — 48 hrs unanswered"
   - "Matches your 'flag stale threads' rule"
6. **(Gmail, Failed)** "Failed to send weekly digest — SMTP error"
   - "Gmail API returned 503 — retry scheduled in 30 min"

---

## Screen 4: Detail Panel

Same as CLAUDE.md spec — slide-over from right, 480px. Contains:
- Header + status
- "Why Libra did this" — reasoning timeline with orange numbered circles
- "Data sources accessed" — chips
- "Before → After" — diff blocks (when applicable)
- "What Libra considered" — one line italic
- Feedback (thumbs up/down)
- Undo button (for completed actions)

**For activities generated from chat:** Use the reasoning/dataTouched/alternativeConsidered from the OpenAI API response to populate the detail panel.

---

## State Management

Use `useReducer` in a context provider (ActivityContext) so both Chat and Activity tabs share state:

```
Actions:
- ADD_ACTIVITY (from chat → adds to feed)
- APPROVE_ACTIVITY
- REJECT_ACTIVITY
- UNDO_ACTIVITY
- GIVE_FEEDBACK
- SET_FILTER
- SELECT_ACTIVITY (opens detail panel)
- CLOSE_DETAIL
```

---

## File Structure Update

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── context/
│   └── ActivityContext.jsx    (useReducer + context provider)
├── data/
│   └── activities.js          (pre-loaded demo data + tool definitions)
├── components/
│   ├── LandingPage.jsx
│   ├── Dashboard.jsx          (top bar + tab switching)
│   ├── ChatTab.jsx            (connected tools + chat + input)
│   ├── ChatMessage.jsx        (individual message bubble)
│   ├── ActivityTab.jsx        (weekly summary + filters + card list)
│   ├── ActivityCard.jsx
│   ├── DetailPanel.jsx        (slide-over)
│   ├── WeeklySummary.jsx      (collapsible card)
│   ├── FilterBar.jsx
│   └── StatusBadge.jsx
├── hooks/
│   └── useLibraChat.js        (handles API calls, response parsing, activity creation)
```

---

## Claude Code Kickoff Prompt

Paste this into Claude Code to start the build:

```
Read CLAUDE.md, SPEC.md, and PROMPT.md in the project root. PROMPT.md is the latest — it overrides layout and screens from the older files. Keep the design tokens (colors, typography, brand) from CLAUDE.md.

Build the project step by step:
1. Scaffold Vite + React + Tailwind project
2. Set up the design tokens in tailwind.config.js and index.css
3. Build the data layer (activities.js + ActivityContext.jsx)
4. Build LandingPage.jsx
5. Build Dashboard.jsx with tab switching
6. Build ChatTab.jsx with the OpenAI integration (useLibraChat hook)
7. Build ActivityTab.jsx with pre-loaded data, filters, and cards
8. Build DetailPanel.jsx slide-over
9. Wire everything together — chat creates activities, tabs share state
10. Polish: animations, hover states, transitions

The OpenAI API key will be in .env as VITE_OPENAI_API_KEY. Use gpt-4o-mini model.
```

---

## What NOT to Build
- No authentication / login screen
- No mobile layout (desktop only)
- No dark/light mode toggle (dark only)
- No actual tool integrations
- No multi-turn memory in chat (each message is independent)
- No loading skeletons
- No onboarding tour
