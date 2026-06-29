# FlowState

**Stop Thinking. Start Doing.**

A dark-themed, no-excuses productivity web app that combines task management, habit tracking, a Pomodoro focus timer, motivation videos, and analytics in one deployable package.

---

## Features

- **Dashboard** — Greeting, day-of-year progress ring, streak counter, daily goal, top tasks, quote, habit status row, weekly mini chart
- **Tasks** — Full CRUD, priority/category/due date, subtasks, brain-dump mode, drag-and-drop reorder, filters, bulk actions, confetti on completion
- **Focus** — 3 × Dan Martell motivation videos, animated SVG Pomodoro timer, full-screen focus mode, procedural ambient noise (white/brown, no external files)
- **Habits** — Daily checklist, weekly grid, streak flames, "Perfect Day" badge, drag reorder
- **Stats** — Summary cards, weekly bar chart, category donut chart, monthly contribution heatmap, habit rate week-over-week
- **Settings** — Name, Pomodoro durations, sound toggles, first day of week, JSON export, selective + nuclear reset

All data is stored in `localStorage` — zero backend, works offline instantly.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS — dark zinc palette |
| Animations | Framer Motion |
| State | Zustand + localStorage persistence |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Ambient Noise | Web Audio API (procedural, no files) |
| Fonts | Geist Sans + Geist Mono |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Install and run locally

```bash
git clone https://github.com/your-username/flowstate.git
cd flowstate
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

---

## Deploy

### Option A — Vercel (recommended, ~5 min)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Framework is auto-detected as **Next.js**. Click **Deploy**.
4. Done — live URL in under 60 seconds.
5. (Optional) Add a custom domain under **Settings → Domains**.

No environment variables are needed for v1 (local-only storage).

---

### Option B — Coolify (self-hosted)

**Prerequisites:** A VPS with [Coolify](https://coolify.io) installed (Ubuntu 22.04+, 2 GB RAM min).

1. In Coolify dashboard → **New Resource → Application**.
2. Connect your GitHub repo, select branch `main`.
3. Build command: `npm run build`
4. Start command: `node server.js`  ← works because `output: "standalone"` is set in `next.config.ts`
5. Set port to **3000**.
6. Add your domain and enable SSL (Coolify handles Traefik + Let's Encrypt automatically).
7. Click **Deploy**.

Alternatively, Coolify can build and run the provided `Dockerfile` directly — select **Dockerfile** as the build type in Coolify settings.

---

## Folder Structure

```
flowstate/
├── app/
│   ├── layout.tsx            ← Root layout (sidebar + global styles)
│   ├── globals.css
│   ├── page.tsx              ← Redirect → /dashboard
│   ├── dashboard/page.tsx
│   ├── tasks/page.tsx
│   ├── focus/page.tsx
│   ├── habits/page.tsx
│   ├── stats/page.tsx
│   └── settings/page.tsx
│
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   └── index.tsx         ← Button, Modal, Input, Textarea, Select, Checkbox, Badge
│   ├── dashboard/
│   │   ├── DashboardWidgets.tsx
│   │   ├── WeeklyMiniChart.tsx
│   │   └── PomodoroMiniWidget.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── SubTaskList.tsx
│   │   └── BrainDump.tsx
│   ├── focus/
│   │   ├── VideoGrid.tsx
│   │   ├── YouTubeEmbed.tsx
│   │   ├── PomodoroTimer.tsx
│   │   ├── FocusModeOverlay.tsx
│   │   └── AmbientSounds.tsx
│   ├── habits/
│   │   ├── HabitList.tsx
│   │   ├── HabitRow.tsx
│   │   ├── HabitWeekGrid.tsx
│   │   └── HabitForm.tsx
│   └── stats/
│       ├── StatsCards.tsx
│       ├── WeeklyBarChart.tsx
│       ├── CategoryPieChart.tsx
│       ├── MonthHeatmap.tsx
│       └── HabitRateCompare.tsx
│
├── lib/
│   ├── store.ts              ← Zustand global store
│   ├── timerStore.ts         ← Ephemeral timer state
│   ├── usePomodoroEngine.ts  ← Pomodoro tick + phase logic
│   ├── useHydrated.ts        ← SSR hydration guard
│   ├── types.ts              ← TypeScript interfaces
│   ├── utils.ts              ← Helpers: dates, streaks, classnames
│   ├── quotes.ts             ← 20 motivational quotes + rotator
│   ├── defaults.ts           ← Default habits + category constants
│   └── noise.ts              ← Web Audio ambient noise generator
│
├── public/
├── Dockerfile
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## Roadmap (Phase 4 — Optional)

- [ ] Supabase backend (multi-device sync, Google/GitHub auth)
- [ ] PWA manifest (install as desktop app)
- [ ] AI daily briefing via Claude API
- [ ] Keyboard shortcuts (N = new task, F = focus mode)
- [ ] Export tasks to CSV
- [ ] Push notifications for habit reminders

---

## License

MIT — do whatever you want with it.
