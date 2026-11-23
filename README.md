# Libra AI: Agent Activity Feed

**A trust layer for autonomous AI agents: a transparent timeline of every action the agent took, why it took it, what data it touched, and how to undo it.**

## What it is / why I built it

I built this product demo as part of a job application to [Libra AI](https://trylibra.ai), an agentic WorkOS that connects to your email, calendar, docs and meetings and acts on your behalf. That kind of autonomy is the value proposition, but it is also the anxiety: once an agent acts without supervision, users have no single view of what it did, why, or whether it got it right. That trust gap blocks enterprise adoption.

My answer is an **Agent Activity Feed**, which works like a Git commit log for your AI coworker. Every action is atomic, traceable and reversible. The prototype pairs a Libra-style command chat with the feed, so you can give the agent a task and immediately see the audit trail it leaves behind.

## Features

- **Landing page**: a short problem statement with research-backed stat callouts and a "Try the demo" CTA
- **Chat tab**: a Libra-style command interface with a connected-tools strip (Gmail, Calendar, Notion, Jira, Drive, Slack) and preset task prompts. Running a task shows a thinking state, a confirmation, and a new card in the feed.
- **Activity tab**: a reverse-chronological timeline of agent actions with tool, plain-English action, one-line reason, relative time and status
- **Filters**: by tool category (email, calendar, docs, automations) and by status
- **Detail panel**: a slide-over showing the step-by-step reasoning, data sources accessed, before/after diff, an undo flow with confirmation, and thumbs-up/down feedback
- **Weekly summary**: a collapsible roll-up at the top of the feed
- New-activity badge on the Activity tab, and chat state preserved when switching tabs
- Responsive layout for mobile

All data is mocked client-side. There is no backend and no real integrations.

## Tech stack

- React 18 + Vite 5
- Tailwind CSS 3 with custom design tokens
- Lucide React icons
- State in React Context + `useReducer`

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview the build
```

No environment variables are required.

## Project structure

```
src/
  components/   LandingPage, Dashboard, ChatTab, ActivityTab, ActivityCard, DetailPanel, FilterBar, WeeklySummary, ToolLogo
  context/      ActivityContext (reducer + provider)
  data/         mock activities, tools, command prompts, weekly stats
  utils/        time formatting + status helpers
```

`SPEC.md` (v1 product spec), `PROMPT.md` (v2 architecture) and `HANDOFF.md` capture the product thinking and build history.

## Status

Prototype, complete as a demo concept.
