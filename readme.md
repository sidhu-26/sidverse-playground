# SID//OS — Personal Command Center

> **CYBERCORE PERSONAL COMMAND CENTER & ADVANCED OPERATING SYSTEM**
> Futuristic, minimal, and precise personal productivity command console designed for high-performance engineers.

---

## ⚡ Architecture & Technology

- **Framework**: Next.js 16 (App Router with Partial Prerendering & Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with bespoke Cybercore design tokens
- **Icons**: Lucide Icons
- **Typography**: 
  - Primary: `Space Grotesk`
  - Display / Numeric: `Orbitron`
  - Technical / Metadata: `IBM Plex Mono`
- **PWA Ready**: `public/manifest.json` configured for standalone installation
- **Backend Ready**: Decoupled API abstraction layer in `src/lib/api/` (ready for direct FastAPI connection)

---

## 🖥️ System Routes & Modules

| Route | Module | Purpose |
|---|---|---|
| `/today` | **Today Command Center** | Greeting, Orbitron time clock, KPI summary, Next Up card, timeline, and pending work triage |
| `/schedule` | **Schedule Matrix** | Day & Week views, interactive hourly timeline with live "NOW" horizontal indicator |
| `/tasks` | **Task Inventory** | Comprehensive task queue with status, project, and search filters |
| `/calendar` | **Master Calendar** | Monthly matrix with scheduled event badges and deadline markers |
| `/projects` | **Strategic Projects** | High-level initiatives overview with task completion progress bars |
| `/projects/[id]` | **Project Detail** | Dedicated workstream console with Overview, Tasks, Schedule, Notes, and Activity tabs |
| `/goals` | **Goals & Milestones** | Personal benchmarks with interactive milestone checklist |
| `/duties` | **Recurring Duties** | Cadence protocols with streak counters and completion history |
| `/deadlines` | **Critical Deadlines** | Real-time countdown clock in Orbitron (Days, Hours, Mins, Secs) categorized by priority |
| `/history` | **Audit History Stream** | Immutable chronological activity telemetry |
| `/review/daily` | **Daily Review** | Lightweight closing assessment: What went well, What remains, Tomorrow focus |
| `/review/weekly` | **Weekly Review** | Aggregate cycle metrics, active project breakdown, and upcoming commitments |
| `/notifications`| **Notification Center** | Categorized alerts (Reminders, Deadlines, System) with mark-all-read |
| `/settings` | **System Preferences** | Node appearance, scheduling defaults, keyboard shortcut sheet, and JSON snapshot export |

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘ + K` / `Ctrl + K` | Global Command Palette & Fuzzy Search |
| `N` | Quick Task Creation Modal |
| `E` | Quick Calendar Event Registration |
| `D` | Navigate to `/today` |
| `S` | Navigate to `/schedule` |
| `T` | Navigate to `/tasks` |
| `ESC` | Dismiss Active Modals / Drawers |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build
npm run build
```
