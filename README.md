# 🎛️ dev-deck

<div align="center">

![dev-deck Banner](https://img.shields.io/badge/dev--deck-Developer%20Command%20Center-06b6d4?style=for-the-badge&logo=electron&logoColor=white)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)
[![Local First](https://img.shields.io/badge/Storage-100%25%20Local--First-purple.svg?style=flat-square)](#architecture)

**A highly customizable, modular web dashboard for developers to track GitHub metrics, server statuses, and daily productivity workflows in one place.**

[Key Features](#-key-features) • [Quick Start](#-quick-start) • [Modular Widgets](#-modular-widgets) • [Themes & Workspaces](#-themes--workspace-presets) • [Command Palette](#-keyboard-command-palette) • [Configuration](#-backup--restore)

</div>

---

## 🌟 Overview

**dev-deck** consolidates the fragmented tools engineers context-switch between all day into a unified, responsive developer command center. 

Instead of juggling 15 browser tabs across GitHub, cloud consoles, status monitors, Jira/Linear, Postman, terminal scratchpads, and Pomodoro timers, **dev-deck** gives you a cohesive cockpit designed with dark-mode aesthetic precision, instantaneous local responsiveness, and zero mandatory backend requirements.

```
+----------------------------------------------------------------------------------------------------+
|  [>_] dev-deck v1.0.0   [Deck: Full-Stack Command]  [Theme: Cyberpunk Neon]  [Ctrl+K] [Customize]  |
|  LOCAL: 11:45:20 | UTC: 06:15:20 | PST: 22:15:20 | GMT: 06:15:20                                   |
+----------------------------------------------------------------------------------------------------+
|  [ GitHub Repos: Live Pulse ] [ Infra SLA: 99.98% ] [ Sprint: 4/6 Done ] [ Modules: 9/9 Active ]   |
+----------------------------------------------------------------------------------------------------+
|                                  |                                                                 |
|   1. GITHUB METRICS & STREAMS    |   2. INFRASTRUCTURE & SERVICE HEALTH                            |
|   - Profile: @username           |   - Prod API Gateway  [42ms]  [■■■■■■■]  99.99%                 |
|   - Repos: Stars, Forks, Issues  |   - OAuth Auth Engine [28ms]  [■■■■■■■]  99.95%                 |
|   - Real-time Activity feed      |   - Staging K8s Pod   [215ms] [■■■■■■■]  98.42%                 |
|   - Rate-limit quota inspector   |   - Redis Broker      [ 4ms]  [■■■■■■■] 100.00%                 |
|                                  |   - SSL Expiry Tracker + Instant Ping                           |
+----------------------------------+-----------------------------------------------------------------+
|                                  |                                                                 |
|   3. AGILE SPRINT KANBAN         |   4. DEVELOPER SCRATCHPAD & VAULT                               |
|   [Backlog] [In Progress] [PR]   |   - Multi-tab (Daily notes, SQL, K8s cheatsheet, Env)           |
|   [Done] -> Confetti + Audio!    |   - Instant code copy, line/word count, auto-saved to storage   |
|   - Branch name helpers          |                                                                 |
+----------------------------------+-----------------------------------------------------------------+
|   5. DEVELOPER TOOLBOX           |   6. FOCUS POMODORO   |   7. SYSTEM VITALS                      |
|   - JSON Beautifier & Minifier   |   - 25m / 5m / 15m    |   - CPU Cores Concurrency           |
|   - JWT Token Inspector & Expiry |   - SVG Progress Ring |   - Memory JS Heap Monitor          |
|   - Base64 / URL Transformer     |   - Synthesized Chime |   - Network Bandwidth & RTT         |
|   - Epoch Converter & UUIDv4     |   - Linked to Sprint  |                                     |
+----------------------------------+-----------------------+-----------------------------------------+
|   8. CLOUD & LAUNCHER HUB        |   9. DAILY STANDUP SYNTHESIZER                                  |
|   - AWS, Vercel, Supabase, Local |   - Automatically compiles Done, In-Flight, and Blockers        |
|   - Quick port launch (3000/8080)|   - 1-Click Copy formatted Markdown for Slack, Discord & Teams  |
+----------------------------------------------------------------------------------------------------+
```

---

## ⚡ Key Features

- **🐙 GitHub Metrics & Stream Hub**:
  - Live GitHub REST API client with anonymous quota tracking and personal token (PAT) authentication.
  - Seamless fallback to an interactive demo dataset when offline or rate-limited.
  - Direct user lookup: inspect any developer or organization (`torvalds`, `facebook`, `vercel`, or your own).
  - Repository vitals: stars, forks, open issues, language badges, and direct links.
  - Live commit stream and pull request activity.

- **📡 Infrastructure & Service Health Radar**:
  - Real-time latency pingers with multi-ping historical sparklines (response time ms trends).
  - Overall SLA uptime percentage gauges.
  - SSL certificate validity and expiry counter.
  - Multi-environment tagging (`production`, `staging`, `internal`, `local`).
  - Add, edit, remove custom endpoints on the fly.
  - Optional included lightweight proxy (`npm run proxy`) to ping internal services without CORS hurdles.

- **📋 Sprint Flow Kanban Board**:
  - 4 agile status columns: `Backlog`, `In Progress`, `Review & PR`, and `Completed`.
  - Priority flags: `P0 - Blocker`, `P1 - High`, `P2 - Medium`, and `P3 - Low`.
  - Git branch generator and copy tool (`feat/auth-service-jwt`, `fix/ws-heartbeat`).
  - Tag filtering: filter by `Frontend`, `Backend`, `DevOps`, `Security`, etc.
  - Interactive celebration: completing a ticket triggers **canvas confetti particles** and synthesized success chimes!

- **📝 Developer Scratchpad & Code Vault**:
  - Multi-tab document manager (Daily Sprint Notes, SQL Queries, Docker/K8s cheatsheets, Env drafts).
  - Real-time auto-saving to local storage.
  - Instant snippet copy and one-click file download.
  - Live character, word, and line count statistics.

- **🧰 Developer Utilities Toolbox**:
  - **JSON Formatter**: Format (2-space indent), minify, and error locator.
  - **JWT Inspector**: Decode headers and payloads client-side with expiration time status.
  - **Base64 / URL Encoder & Decoder**: Bidirectional instant conversion.
  - **Epoch Converter**: Live UTC timestamp, human-readable date to epoch and vice versa.
  - **UUIDv4 Generator**: Cryptographic UUID generator with bulk generation.

- **⏱️ Deep Work Focus & Pomodoro Timer**:
  - Cycles: 25-minute Work, 5-minute Short Break, 15-minute Rest.
  - Radial SVG countdown ring with active mode indicator.
  - Synthesized Web Audio alerts (no audio assets required).
  - Binds directly to the active Kanban task.

- **🖥️ System Telemetry & Vitals**:
  - Logical CPU concurrency cores (`navigator.hardwareConcurrency`).
  - Browser memory JS heap gauge (`performance.memory`).
  - Network state (Online/Offline, Downlink Mbps, RTT latency).

- **🚀 Cloud & Localhost Launcher Hub**:
  - One-click launcher for AWS Console, Vercel, Supabase, Linear, Sentry.
  - Fast localhost shortcuts for ports `3000`, `5173`, `8080`, and custom URLs.

- **🗣️ Daily Standup Synthesizer**:
  - Auto-synthesizes completed tickets, in-flight work, and blockers into structured markdown.
  - Ready to paste into Slack, Discord, Microsoft Teams, or Linear.

---

## 🎨 Themes & Workspace Presets

### Six Built-in Aesthetic Themes
1. **Cyberpunk Neon**: High-contrast deep night `#070a13` with electric cyan `#00f2fe` and purple glow.
2. **Stealth Obsidian**: Gunmetal minimal `#09090b` with emerald green `#10b981` accents.
3. **Nordic Frost**: Arctic polar night `#242933` with frost blue `#88c0d0`.
4. **Retro Matrix Terminal**: Phosphor green `#22c55e` CRT terminal style.
5. **Midnight Violet**: Deep indigo `#0b0f19` and violet `#818cf8`.
6. **Minimal Carbon**: Monochromatic slate and zinc for distraction-free coding.

### Workspace Presets
- **Full-Stack Command Deck**: Balanced arrangement with git, server monitoring, sprint board, and notes.
- **SRE & DevOps Radar**: Maximizes server health monitors, telemetry gauges, quick links, and error trackers.
- **Deep Work & Sprint Focus**: Streamlined for pure coding with Pomodoro, Kanban sprint, and scratchpad.

---

## ⌨️ Keyboard Command Palette

Press **`Ctrl + K`** (or **`Cmd + K`** on macOS) anywhere on the dashboard to open the Command Engine:

- Search and toggle any widget on or off.
- Switch themes instantly (`Theme: Cyberpunk`, `Theme: Stealth`, etc.).
- Switch workspace presets.
- Run quick actions: `Ping all server endpoints`, `Customize Deck Layout`, `Open Settings`.
- Quick-open bookmarked tools and repositories.
- Use **`↑` / `↓`** arrows to navigate, **`Enter`** to execute, and **`Esc`** to exit.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Snigdhendu-Chhotaray-28/dev-deck.git
   cd dev-deck
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static assets will be in `dist/`.

5. **(Optional) Run the Health-Check Ping Proxy:**
   ```bash
   npm run proxy
   ```
   Runs a local proxy on port `3001` for pinging arbitrary internal microservices without browser CORS constraints.

---

## 📂 Project Structure

```
dev-deck/
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Project configuration & scripts
├── tsconfig.json                # TypeScript bundler compiler configuration
├── vite.config.ts               # Vite configuration with React & Tailwind v4
├── server/
│   └── proxy.js                 # Optional HTTP ping proxy for internal endpoints
└── src/
    ├── main.tsx                 # React application mounting
    ├── App.tsx                  # Root app layout & footer
    ├── index.css                # Tailwind CSS v4 imports & theme CSS variables
    ├── types/
    │   └── index.ts             # Complete TypeScript interfaces & types
    ├── data/
    │   └── initialData.ts       # Default widgets, servers, tasks, notes, links
    ├── context/
    │   └── DashboardContext.tsx # Central dashboard state, storage sync, and actions
    ├── utils/
    │   ├── githubApi.ts         # GitHub REST API client with mock fallback
    │   ├── sound.ts             # Web Audio API synthesized notification chimes
    │   └── confetti.ts          # Particle canvas confetti animation
    └── components/
        ├── ui/
        │   ├── WidgetCard.tsx   # Modular widget container with resize/reorder
        │   └── Icons.tsx        # Vector icons (including GitHub octocat)
        ├── layout/
        │   ├── Header.tsx       # Navigation bar, world clocks, preset & theme select
        │   └── DashboardGrid.tsx# Responsive 12-column grid engine
        ├── modals/
        │   ├── CustomizeDeckModal.tsx # Widget catalog, order, & width manager
        │   ├── SettingsModal.tsx      # Tokens, preferences, & backup/restore
        │   └── CommandPalette.tsx     # Ctrl+K command search palette
        └── widgets/
            ├── GitHubWidget.tsx         # GitHub metrics, repos & activity stream
            ├── ServerStatusWidget.tsx   # Server & API health monitoring
            ├── KanbanWidget.tsx         # Sprint task flow with confetti celebration
            ├── ScratchpadWidget.tsx     # Markdown & code snippet notes vault
            ├── DevToolsWidget.tsx       # JSON, JWT, Base64, Epoch & UUID tools
            ├── PomodoroWidget.tsx       # Deep work focus timer with audio cues
            ├── SystemTelemetryWidget.tsx# Concurrency cores, heap & network stats
            ├── QuickLinksWidget.tsx     # Cloud & Localhost bookmark launchpad
            └── StandupWidget.tsx        # Daily standup report synthesizer
```

---

## 🔒 Security & Privacy (100% Local-First)

- **Local Storage Isolation**: All your notes, sprint tasks, endpoints, and layout preferences are stored exclusively in your browser's `localStorage`.
- **Zero Third-Party Tracking**: No telemetry, tracking beacons, or analytics scripts are bundled.
- **GitHub Token Safety**: If you provide a GitHub Personal Access Token, it is stored only in your local browser storage and sent directly to `https://api.github.com`. When exporting configuration backups, tokens are intentionally omitted to prevent accidental leakage.

---

## 💾 Backup & Restore

You can transfer your complete developer setup across workstations or browsers:
1. Click the **Settings (⚙️)** icon in the header.
2. Under **Backup & Restore**, click **Export Backup (.json)**.
3. On another machine or browser, open `dev-deck`, click **Import Backup**, and choose your JSON file.
4. Your entire dashboard layout, servers, sprint tickets, notes, and quicklinks will be restored instantly.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern component architecture, hooks & responsive UI |
| **TypeScript** | Strict compile-time type safety across all metrics & configs |
| **Vite 8** | Sub-second HMR and blazing-fast production bundling |
| **Tailwind CSS v4** | Next-generation utility-first styling with CSS variables |
| **Lucide Icons** | Clean, consistent developer icon set |
| **Web Audio API** | Pure browser-synthesized notification chimes |
| **HTML5 Canvas** | Custom particle confetti animation engine |

---

## 🤝 Contributing

Contributions are warmly welcome! Whether it's adding new developer utilities, additional widgets, or theme palettes:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feat/amazing-widget`).
3. Commit your changes (`git commit -m 'feat: add docker container widget'`).
4. Push to the branch (`git push origin feat/amazing-widget`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it, customize it, and deploy it for your personal or team workflows.
