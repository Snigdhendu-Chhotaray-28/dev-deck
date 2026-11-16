export type WidgetId =
  | 'github'
  | 'servers'
  | 'kanban'
  | 'scratchpad'
  | 'pomodoro'
  | 'devtools'
  | 'quicklinks'
  | 'system'
  | 'standup';

export type WidgetCategory = 'git' | 'monitoring' | 'productivity' | 'utilities';

export interface WidgetConfig {
  id: WidgetId;
  title: string;
  description: string;
  category: WidgetCategory;
  enabled: boolean;
  colSpan: 1 | 2 | 3 | 4; // grid column span
  order: number;
}

export type ThemeMode = 'cyberpunk' | 'stealth' | 'nord' | 'terminal' | 'midnight' | 'minimal';

export interface ServerEndpoint {
  id: string;
  name: string;
  url: string;
  status: 'healthy' | 'degraded' | 'down' | 'checking';
  statusCode?: number;
  latency: number; // in milliseconds
  latencyHistory: number[]; // last 12-24 pings
  uptimePercent: number; // e.g. 99.98
  lastChecked: string;
  sslDaysRemaining?: number;
  environment: 'production' | 'staging' | 'internal' | 'local';
}

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'p0' | 'p1' | 'p2' | 'p3';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  branchName?: string;
  storyPoints?: number;
  createdAt: string;
  dueDate?: string;
}

export interface GitHubRepoMetric {
  name: string;
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  description: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface GitHubActivityItem {
  id: string;
  type: 'PushEvent' | 'PullRequestEvent' | 'IssuesEvent' | 'ReleaseEvent' | 'WatchEvent';
  repo: string;
  message: string;
  author: string;
  avatarUrl: string;
  date: string;
  url?: string;
  statusBadge?: string;
}

export interface GitHubProfile {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
  company?: string;
  location?: string;
}

export interface QuickLinkItem {
  id: string;
  title: string;
  url: string;
  category: 'cloud' | 'monitoring' | 'devtools' | 'local' | 'custom';
  icon: string;
  badge?: string;
}

export interface ScratchpadTab {
  id: string;
  title: string;
  content: string;
  syntax: 'markdown' | 'javascript' | 'json' | 'sql' | 'env';
  updatedAt: string;
}

export interface PomodoroState {
  mode: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number; // seconds
  isActive: boolean;
  workDuration: number; // default 25 * 60
  shortBreakDuration: number; // 5 * 60
  longBreakDuration: number; // 15 * 60
  sessionsCompletedToday: number;
  currentTaskTitle?: string;
}

export interface DashboardSettings {
  theme: ThemeMode;
  autoRefreshInterval: number; // in seconds
  soundEnabled: boolean;
  githubToken: string;
  githubUsername: string;
  githubRepo: string;
  useMockDataWhenRateLimited: boolean;
  compactMode: boolean;
}

export interface WorkspacePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  widgets: WidgetConfig[];
}

