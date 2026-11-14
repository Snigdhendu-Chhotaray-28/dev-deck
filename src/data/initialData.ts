import { WidgetConfig, ServerEndpoint, KanbanTask, QuickLinkItem, ScratchpadTab, WorkspacePreset } from '../types';

export const INITIAL_WIDGETS: WidgetConfig[] = [
  {
    id: 'github',
    title: 'GitHub Command & CI/CD',
    description: 'Repository vitals, open pull requests, stars, and real-time commit activity stream.',
    category: 'git',
    enabled: true,
    colSpan: 2,
    order: 1,
  },
  {
    id: 'servers',
    title: 'Infrastructure & Service Health',
    description: 'Real-time HTTP/HTTPS latency pingers, SLA uptime meters, and service status monitors.',
    category: 'monitoring',
    enabled: true,
    colSpan: 2,
    order: 2,
  },
  {
    id: 'kanban',
    title: 'Active Sprint & Task Flow',
    description: 'Agile developer Kanban board with priority flags, tags, and git branch helpers.',
    category: 'productivity',
    enabled: true,
    colSpan: 2,
    order: 3,
  },
  {
    id: 'scratchpad',
    title: 'Developer Scratchpad & Vault',
    description: 'Persistent markdown & code notes with syntax highlighting and instant snippet copy.',
    category: 'productivity',
    enabled: true,
    colSpan: 2,
    order: 4,
  },
  {
    id: 'devtools',
    title: 'Developer Toolbox',
    description: 'Instant JSON beautifier, JWT debugger, Base64/URL converter, and Unix timestamp tools.',
    category: 'utilities',
    enabled: true,
    colSpan: 2,
    order: 5,
  },
  {
    id: 'pomodoro',
    title: 'Deep Work Focus Timer',
    description: 'Pomodoro timer with session tracking, task link, and Web Audio chime cues.',
    category: 'productivity',
    enabled: true,
    colSpan: 1,
    order: 6,
  },
  {
    id: 'system',
    title: 'Local Telemetry & Concurrency',
    description: 'System concurrency cores, heap metrics, downlink bandwidth, and connection status.',
    category: 'monitoring',
    enabled: true,
    colSpan: 1,
    order: 7,
  },
  {
    id: 'quicklinks',
    title: 'Cloud & Local Launcher Hub',
    description: 'Fast-access bookmarks for AWS, Vercel, Supabase, Localhost ports, and monitoring.',
    category: 'utilities',
    enabled: true,
    colSpan: 2,
    order: 8,
  },
  {
    id: 'standup',
    title: 'Daily Standup Synthesizer',
    description: 'Generates markdown formatted daily standup updates ready for Slack / Teams / Discord.',
    category: 'productivity',
    enabled: true,
    colSpan: 2,
    order: 9,
  },
];

export const INITIAL_SERVERS: ServerEndpoint[] = [
  {
    id: 'srv-1',
    name: 'Production API Gateway',
    url: 'https://api.github.com',
    status: 'healthy',
    statusCode: 200,
    latency: 42,
    latencyHistory: [45, 52, 48, 41, 46, 50, 42, 44, 43, 40, 42],
    uptimePercent: 99.99,
    lastChecked: 'Just now',
    sslDaysRemaining: 184,
    environment: 'production',
  },
  {
    id: 'srv-2',
    name: 'Primary Auth Service (OAuth2)',
    url: 'https://auth.devdeck.internal',
    status: 'healthy',
    statusCode: 200,
    latency: 28,
    latencyHistory: [32, 30, 29, 28, 27, 31, 28, 28, 26, 29, 28],
    uptimePercent: 99.95,
    lastChecked: 'Just now',
    sslDaysRemaining: 89,
    environment: 'production',
  },
  {
    id: 'srv-3',
    name: 'Staging Kubernetes Cluster',
    url: 'https://staging.devdeck.internal',
    status: 'degraded',
    statusCode: 200,
    latency: 215,
    latencyHistory: [70, 85, 110, 160, 195, 220, 240, 215, 230, 215],
    uptimePercent: 98.42,
    lastChecked: '1m ago',
    sslDaysRemaining: 45,
    environment: 'staging',
  },
  {
    id: 'srv-4',
    name: 'Redis Cache & Queue Broker',
    url: 'tcp://cache.redis.internal:6379',
    status: 'healthy',
    statusCode: 200,
    latency: 4,
    latencyHistory: [3, 4, 4, 3, 5, 4, 3, 4, 4, 3, 4],
    uptimePercent: 100.0,
    lastChecked: 'Just now',
    environment: 'production',
  },
  {
    id: 'srv-5',
    name: 'Local Vite Dev Server (:3000)',
    url: 'http://localhost:3000',
    status: 'healthy',
    statusCode: 200,
    latency: 2,
    latencyHistory: [2, 2, 3, 2, 2, 2, 1, 2, 2, 2, 2],
    uptimePercent: 100.0,
    lastChecked: 'Just now',
    environment: 'local',
  },
  {
    id: 'srv-6',
    name: 'Webhook Event Ingestion',
    url: 'https://events.devdeck.internal/hook',
    status: 'healthy',
    statusCode: 200,
    latency: 64,
    latencyHistory: [68, 65, 62, 67, 71, 64, 69, 63, 66, 64],
    uptimePercent: 99.88,
    lastChecked: 'Just now',
    sslDaysRemaining: 210,
    environment: 'production',
  },
];

export const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Migrate auth service tokens to Ed25519 asymmetric keys',
    description: 'Deprecate RS256 signing keys and roll out EdDSA keypair rotation in Auth0/Vault.',
    status: 'in_progress',
    priority: 'p0',
    tags: ['Security', 'Backend', 'Crypto'],
    branchName: 'feat/ed25519-jwt-signing',
    storyPoints: 5,
    createdAt: '2026-11-08',
    dueDate: '2026-11-12',
  },
  {
    id: 'task-2',
    title: 'Implement WebSocket heartbeat retry for telemetry widget',
    description: 'Add exponential backoff jitter when reconnecting after network sleep/hibernation.',
    status: 'in_progress',
    priority: 'p1',
    tags: ['Frontend', 'Reliability'],
    branchName: 'fix/ws-heartbeat-jitter',
    storyPoints: 3,
    createdAt: '2026-11-09',
    dueDate: '2026-11-10',
  },
  {
    id: 'task-3',
    title: 'Audit Postgres connection pool saturation under peak load',
    description: 'Configure PgBouncer transaction-mode pooling with max client limit at 1500.',
    status: 'review',
    priority: 'p1',
    tags: ['Database', 'DevOps', 'SRE'],
    branchName: 'ops/pgbouncer-tuning',
    storyPoints: 8,
    createdAt: '2026-11-07',
    dueDate: '2026-11-11',
  },
  {
    id: 'task-4',
    title: 'Benchmark Docker build caching using BuildKit GitHub Cache action',
    description: 'Reduced multi-stage image build duration from 8m40s down to 1m12s.',
    status: 'done',
    priority: 'p2',
    tags: ['CI/CD', 'Docker'],
    branchName: 'ci/buildkit-gha-cache',
    storyPoints: 3,
    createdAt: '2026-11-06',
  },
  {
    id: 'task-5',
    title: 'Add GraphQL schema deprecation notices for v1 billing queries',
    description: 'Mark v1 Invoice fields as deprecated and provide migration guidance to v2 API.',
    status: 'backlog',
    priority: 'p2',
    tags: ['API', 'GraphQL'],
    branchName: 'chore/deprecate-v1-invoice',
    storyPoints: 2,
    createdAt: '2026-11-09',
  },
  {
    id: 'task-6',
    title: 'Support custom CSS theme tokens & dark matrix mode',
    description: 'Allow developers to customize primary neon accents and font ligatures.',
    status: 'done',
    priority: 'p3',
    tags: ['Frontend', 'Theme'],
    branchName: 'feat/theme-system',
    storyPoints: 2,
    createdAt: '2026-11-08',
  },
];

export const INITIAL_NOTES: ScratchpadTab[] = [
  {
    id: 'note-1',
    title: 'Daily Scratchpad',
    syntax: 'markdown',
    content: `# Daily Sprint Notes 🚀
- [x] Review pull request #142 (Docker layer caching)
- [ ] Profile p99 latency spikes on /v2/analytics
- [ ] Discuss schema migration rollout with team at 2 PM

### Environment Variables quick-check:
\`\`\`bash
DATABASE_URL="postgresql://postgres:secret@127.0.0.1:5432/devdeck"
REDIS_URL="redis://127.0.0.1:6379/0"
API_PORT=4000
\`\`\`
`,
    updatedAt: 'Just now',
  },
  {
    id: 'note-2',
    title: 'Docker & K8s Cheatsheet',
    syntax: 'markdown',
    content: `### Handy Commands
\`\`\`bash
# Force prune dangling containers & build cache
docker system prune -a --volumes --force

# Inspect Pod logs with timestamps
kubectl logs -n production -l app=api-gateway -f --tail=100 --timestamps

# Port forward internal Postgres pod
kubectl port-forward svc/postgres-master 5432:5432 -n database
\`\`\`
`,
    updatedAt: 'Yesterday',
  },
  {
    id: 'note-3',
    title: 'SQL Snippets',
    syntax: 'sql',
    content: `-- Active connections and long-running queries
SELECT pid, now() - query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC
LIMIT 10;
`,
    updatedAt: '2 days ago',
  },
];

export const INITIAL_QUICKLINKS: QuickLinkItem[] = [
  {
    id: 'ql-1',
    title: 'GitHub Repos',
    url: 'https://github.com',
    category: 'devtools',
    icon: 'Github',
    badge: 'Code',
  },
  {
    id: 'ql-2',
    title: 'Vercel Dashboard',
    url: 'https://vercel.com/dashboard',
    category: 'cloud',
    icon: 'Triangle',
    badge: 'Deploy',
  },
  {
    id: 'ql-3',
    title: 'AWS Console',
    url: 'https://console.aws.amazon.com',
    category: 'cloud',
    icon: 'Cloud',
    badge: 'Infra',
  },
  {
    id: 'ql-4',
    title: 'Supabase Studio',
    url: 'https://supabase.com/dashboard',
    category: 'cloud',
    icon: 'Database',
    badge: 'DB',
  },
  {
    id: 'ql-5',
    title: 'Linear Issues',
    url: 'https://linear.app',
    category: 'devtools',
    icon: 'CheckSquare',
    badge: 'Agile',
  },
  {
    id: 'ql-6',
    title: 'Sentry Error Tracking',
    url: 'https://sentry.io',
    category: 'monitoring',
    icon: 'AlertOctagon',
    badge: 'Errors',
  },
  {
    id: 'ql-7',
    title: 'Localhost:3000',
    url: 'http://localhost:3000',
    category: 'local',
    icon: 'Terminal',
    badge: 'App',
  },
  {
    id: 'ql-8',
    title: 'Localhost:8080 (API)',
    url: 'http://localhost:8080',
    category: 'local',
    icon: 'Server',
    badge: 'Backend',
  },
];

export const WORKSPACE_PRESETS: WorkspacePreset[] = [
  {
    id: 'preset-fullstack',
    name: 'Full-Stack Command Deck',
    description: 'Balanced arrangement for full-stack engineering with git, servers, sprint board & notes.',
    icon: 'LayoutDashboard',
    widgets: INITIAL_WIDGETS,
  },
  {
    id: 'preset-sre',
    name: 'SRE & DevOps Radar',
    description: 'Prioritizes server health, telemetry gauges, quick links and error tracking.',
    icon: 'Activity',
    widgets: INITIAL_WIDGETS.map((w) => {
      if (w.id === 'servers') return { ...w, colSpan: 4, order: 1 };
      if (w.id === 'system') return { ...w, colSpan: 2, order: 2 };
      if (w.id === 'github') return { ...w, colSpan: 2, order: 3 };
      if (w.id === 'quicklinks') return { ...w, colSpan: 2, order: 4 };
      if (w.id === 'devtools') return { ...w, colSpan: 2, order: 5 };
      return { ...w, enabled: false };
    }),
  },
  {
    id: 'preset-deepwork',
    name: 'Deep Work & Sprint Focus',
    description: 'Streamlined for uninterrupted coding with Pomodoro, Kanban sprint, and scratchpad.',
    icon: 'Zap',
    widgets: INITIAL_WIDGETS.map((w) => {
      if (w.id === 'pomodoro') return { ...w, colSpan: 2, order: 1 };
      if (w.id === 'kanban') return { ...w, colSpan: 2, order: 2 };
      if (w.id === 'scratchpad') return { ...w, colSpan: 4, order: 3 };
      if (w.id === 'standup') return { ...w, colSpan: 2, order: 4 };
      if (w.id === 'devtools') return { ...w, colSpan: 2, order: 5 };
      return { ...w, enabled: false };
    }),
  },
];

