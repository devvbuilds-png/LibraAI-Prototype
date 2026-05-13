# Libra AI — Agent Activity Feed
## Product Spec

---

## The Problem

Libra AI is an agentic WorkOS — it connects to your calendar, email, docs, and meetings, then acts autonomously on your behalf. The product is powerful. But there's a trust gap that blocks enterprise adoption:

**When an AI agent acts autonomously, users have no unified view of what it did, why it did it, and whether it got it right.**

This isn't hypothetical. Industry data confirms it:

- 67% of executives believe their company has already had a data leak from AI tools (Writer, 2026)
- 36% of companies have no formal plan for supervising AI agents (Writer, 2026)
- 35% admit they couldn't immediately "pull the plug" on a rogue agent (Writer, 2026)
- 75% of executives say their AI strategy is "more for show" than real guidance (Writer, 2026)
- Only 23% of organizations see significant ROI from AI agents (Writer, 2026)
- Security and risk concerns are the #1 barrier to scaling agentic AI — ahead of regulatory uncertainty or technical limitations (McKinsey, 2026)

Libra's own founder told applicants: "Drop me a line — Libra has access to my inbox and would take over from there." That's the value prop AND the anxiety in one sentence.

**The Activity Feed is the trust layer that makes Libra's autonomy safe.**

---

## The Solution

An **Agent Activity Feed** — a real-time, transparent timeline of every action Libra takes across connected tools. Think of it as the Git commit log for your AI coworker. Every action is atomic, traceable, and reversible.

---

## Screens

### Screen 1: Landing Page
The first thing users see when they open the demo. Brief, punchy, establishes the problem and invites them into the solution.

**Content structure:**
- Headline: Something like "Your AI agent is working. Can you see what it's doing?"
- 3-4 stat callouts from the research above (the 67%, 36%, 35% numbers) — styled as quick-scan pills or cards, not paragraphs
- One-liner on the solution: "We built the trust layer for Libra's autonomous agents — a transparent activity feed that shows every action, every reason, every data source."
- A prominent CTA button: "Try the demo →"
- Subtle Libra branding (orange accent, clean aesthetic)

**Design notes:**
- This is NOT a marketing page with hero images and testimonials. It's a brief, confident problem statement + invitation.
- Should feel like a product person wrote it, not a marketer
- Max 15 seconds to read everything above the fold
- The stats should hit hard visually — large numbers, small labels

### Screen 2: Activity Feed (Main View)
The core screen. A vertical timeline of agent actions, most recent first.

**Each activity card contains:**
- **Action** — plain English description ("Drafted reply to Ankit Sharma's email about Q3 pricing")
- **Tool icon + label** — which integration (Gmail, Calendar, Notion, Jira, Drive, Slack)
- **Reasoning** — one-line "why" ("Matched your rule: auto-handle vendor follow-ups under ₹10L")
- **Timestamp** — relative ("12 min ago", "2 hours ago")
- **Status badge** — one of four states:
  - `Completed` (green) — Libra acted, done
  - `Awaiting approval` (amber/yellow) — Libra wants to act, waiting for user OK
  - `Undone` (gray) — User reversed a completed action
  - `Failed` (red) — Libra tried, something went wrong
- **Quick actions** — contextual:
  - Completed cards: "View details" + "Undo"
  - Awaiting approval cards: "Approve" + "Reject" + "View details"

**Filter bar at top:**
- Tool filters: All | Emails | Calendar | Docs | Automations
- Status filters: All | Needs approval | Completed | Undone

**Mock data — 8-10 cards covering a realistic PM workday:**
1. (Gmail, Awaiting approval) Drafted reply to client about Q3 pricing — flagged because it involves pricing above ₹5L
2. (Calendar, Completed) Rescheduled 1:1 with Priya from 3 PM to 4:30 PM — investor call historically overruns
3. (Jira, Completed) Created ticket from Slack thread — Ravi reported login bug in #engineering
4. (Notion, Completed) Updated weekly standup doc with yesterday's action items
5. (Gmail, Completed) Sent meeting recap to 4 attendees after product review call
6. (Drive, Completed) Shared Q3 roadmap doc with marketing team (they requested access)
7. (Calendar, Completed) Blocked 90 min focus time tomorrow morning — detected 3 deep-work tasks due
8. (Slack, Completed) Flagged an unanswered thread in #product from 48 hours ago — nudged you
9. (Gmail, Failed) Attempted to send weekly digest to team — SMTP error, will retry in 30 min
10. (Notion, Completed) Summarized 12-page product brief into 3-paragraph executive summary

### Screen 3: Action Detail (Expanded View)
When user clicks "View details" on any card, this view opens (could be a modal, slide-over, or inline expansion — decide during build based on what feels best).

**Contains:**
- Full action description (same as card, but can be longer)
- **Reasoning chain** — step-by-step numbered list of what Libra did:
  1. "Detected new email from Ankit Sharma (vendor, tagged in CRM)"
  2. "Subject matched vendor follow-up pattern"
  3. "Pulled Q3 pricing sheet — rates within approved range (₹8.2L vs ₹10L cap)"
  4. "Checked your past replies to Ankit — tone is direct, semi-formal"
  5. "Drafted reply confirming base tier, asking about unresolved volume discount"
  6. "Flagged for approval — email contains pricing discussion above ₹5L"
- **Data sources accessed** — list with links:
  - "Last 3 email threads with Ankit Sharma"
  - "Q3 Pricing Sheet (Google Drive)"
  - "Vendor policy doc (Notion)"
- **Before / After diff** (where applicable):
  - Before: "Original meeting: 3:00 PM–3:30 PM"
  - After: "Moved to: 4:30 PM–5:00 PM"
- **Alternatives considered** — one-liner on what Libra chose NOT to do:
  - "Considered replying directly but flagged for approval — pricing discussion above ₹5L threshold"
  - OR "Considered cancelling the meeting but rescheduled instead — no cancellation pattern in your history"
- **Feedback** — thumbs up / thumbs down ("Was this the right call?")
- **Undo button** — with confirmation state

### Screen 4: Weekly Impact Summary
A compact, collapsible card pinned to the top of the Activity Feed screen (above the timeline).

**Contains:**
- Headline stat: "This week: Libra took 23 actions"
- Secondary stats in a row: "19 completed · 4 needed approval · 0 undone"
- Time saved estimate: "~3.2 hours saved"
- Breakdown by tool (small bar chart or icon row):
  - Emails handled: 8
  - Meetings rescheduled: 3
  - Docs updated: 5
  - Automations run: 7
- Insight line: "You approved 95% of suggestions this week — your trust in Libra is growing"
- Collapsible — default state is collapsed showing just the headline stat + time saved

---

## User Flow

1. User opens demo → **Landing Page** (reads problem, clicks "Try the demo")
2. Lands on **Activity Feed** with Weekly Impact Summary card at top
3. Scrolls through feed, sees mix of completed/awaiting/failed cards
4. Clicks on the amber "Awaiting approval" card → sees **Action Detail** with reasoning
5. Approves or rejects the action
6. Clicks on a completed card → sees full reasoning chain, data sources, before/after
7. Optionally gives thumbs up/down feedback
8. Optionally clicks Undo on a completed action

---

## What This Is NOT

- Not a real product with API integrations — all data is mock/static
- Not a mobile app — desktop-first
- Not a login/auth flow — jumps straight into the experience
- Not a settings or permissions page — purely the activity/transparency layer
- Not a chatbot or conversational interface — it's a structured feed
