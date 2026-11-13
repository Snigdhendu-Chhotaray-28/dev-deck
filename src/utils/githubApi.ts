import { GitHubProfile, GitHubRepoMetric, GitHubActivityItem } from '../types';

export interface GitHubApiResponse {
  profile: GitHubProfile;
  repos: GitHubRepoMetric[];
  activity: GitHubActivityItem[];
  rateLimitRemaining?: number;
  rateLimitLimit?: number;
  rateLimitReset?: string;
  isMock: boolean;
}

const MOCK_PROFILE: GitHubProfile = {
  login: 'Snigdhendu-Chhotaray-28',
  name: 'Snigdhendu Chhotaray',
  avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
  bio: 'Full-stack software engineer & open source explorer. Building resilient developer tooling and web systems.',
  publicRepos: 34,
  followers: 182,
  following: 95,
  htmlUrl: 'https://github.com/Snigdhendu-Chhotaray-28',
  company: 'DevDeck Open Source',
  location: 'Global / Remote',
};

const MOCK_REPOS: GitHubRepoMetric[] = [
  {
    name: 'dev-deck',
    fullName: 'Snigdhendu-Chhotaray-28/dev-deck',
    stars: 342,
    forks: 58,
    openIssues: 3,
    language: 'TypeScript',
    description: 'A modular, highly customizable command center dashboard for developers.',
    updatedAt: '2026-11-09T09:30:00Z',
    htmlUrl: 'https://github.com/Snigdhendu-Chhotaray-28/dev-deck',
  },
  {
    name: 'micro-service-orchestrator',
    fullName: 'Snigdhendu-Chhotaray-28/micro-service-orchestrator',
    stars: 129,
    forks: 24,
    openIssues: 5,
    language: 'Go',
    description: 'Lightweight distributed consensus and service mesh monitor in Go.',
    updatedAt: '2026-11-08T18:15:00Z',
    htmlUrl: 'https://github.com',
  },
  {
    name: 'turbo-cache-redis',
    fullName: 'Snigdhendu-Chhotaray-28/turbo-cache-redis',
    stars: 87,
    forks: 14,
    openIssues: 1,
    language: 'Rust',
    description: 'Sub-millisecond persistent in-memory caching layer with automatic TTL evictions.',
    updatedAt: '2026-11-07T12:00:00Z',
    htmlUrl: 'https://github.com',
  },
  {
    name: 'next-zero-latency',
    fullName: 'Snigdhendu-Chhotaray-28/next-zero-latency',
    stars: 215,
    forks: 41,
    openIssues: 4,
    language: 'TypeScript',
    description: 'Optimistic UI rendering and edge-rendered state synchronization library.',
    updatedAt: '2026-11-05T14:20:00Z',
    htmlUrl: 'https://github.com',
  },
];

const MOCK_ACTIVITY: GitHubActivityItem[] = [
  {
    id: 'act-1',
    type: 'PushEvent',
    repo: 'Snigdhendu-Chhotaray-28/dev-deck',
    message: 'feat: add modular grid engine and live server health widgets',
    author: 'Snigdhendu',
    avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    date: '15 minutes ago',
    statusBadge: 'main',
  },
  {
    id: 'act-2',
    type: 'PullRequestEvent',
    repo: 'Snigdhendu-Chhotaray-28/dev-deck',
    message: 'PR #14: Optimize telemetry chart re-renders with WebGL canvas fallback',
    author: 'dependabot[bot]',
    avatarUrl: 'https://avatars.githubusercontent.com/in/29110?v=4',
    date: '2 hours ago',
    statusBadge: 'Merged',
  },
  {
    id: 'act-3',
    type: 'PushEvent',
    repo: 'Snigdhendu-Chhotaray-28/micro-service-orchestrator',
    message: 'fix: patch connection leak in raft state machine election round',
    author: 'Snigdhendu',
    avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    date: 'Yesterday at 4:15 PM',
    statusBadge: 'v2.1.4',
  },
  {
    id: 'act-4',
    type: 'ReleaseEvent',
    repo: 'Snigdhendu-Chhotaray-28/dev-deck',
    message: 'v1.0.0 Stable release: Complete developer dashboard suite',
    author: 'Snigdhendu',
    avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    date: 'Yesterday at 11:00 AM',
    statusBadge: 'v1.0.0',
  },
];

export async function fetchGitHubData(
  username: string,
  token?: string,
  forceMock: boolean = false
): Promise<GitHubApiResponse> {
  if (forceMock || !username.trim()) {
    return {
      profile: MOCK_PROFILE,
      repos: MOCK_REPOS,
      activity: MOCK_ACTIVITY,
      rateLimitRemaining: 60,
      rateLimitLimit: 60,
      isMock: true,
    };
  }

  const cleanUser = username.trim();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers.Authorization = `token ${token.trim()}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
      headers,
    });

    const rateRemaining = userRes.headers.get('x-ratelimit-remaining');
    const rateLimit = userRes.headers.get('x-ratelimit-limit');
    const rateReset = userRes.headers.get('x-ratelimit-reset');

    if (!userRes.ok) {
      console.warn(`GitHub API response ${userRes.status}. Using rich demo dataset.`);
      return {
        profile: { ...MOCK_PROFILE, login: cleanUser, name: cleanUser },
        repos: MOCK_REPOS,
        activity: MOCK_ACTIVITY,
        rateLimitRemaining: rateRemaining ? parseInt(rateRemaining, 10) : 0,
        rateLimitLimit: rateLimit ? parseInt(rateLimit, 10) : 60,
        rateLimitReset: rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : undefined,
        isMock: true,
      };
    }

    const userData = await userRes.json();

    // Fetch repos
    let reposData: GitHubRepoMetric[] = [];
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=6`,
        { headers }
      );
      if (reposRes.ok) {
        const rawRepos = await reposRes.json();
        if (Array.isArray(rawRepos)) {
          reposData = rawRepos.map((r: any) => ({
            name: r.name,
            fullName: r.full_name,
            stars: r.stargazers_count ?? 0,
            forks: r.forks_count ?? 0,
            openIssues: r.open_issues_count ?? 0,
            language: r.language ?? 'Code',
            description: r.description ?? 'No description provided.',
            updatedAt: r.updated_at,
            htmlUrl: r.html_url,
          }));
        }
      }
    } catch (e) {
      console.debug('Error fetching repos', e);
    }

    // Fetch events
    let activityData: GitHubActivityItem[] = [];
    try {
      const eventsRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUser)}/events/public?per_page=8`,
        { headers }
      );
      if (eventsRes.ok) {
        const rawEvents = await eventsRes.json();
        if (Array.isArray(rawEvents)) {
          activityData = rawEvents.map((ev: any) => {
            let msg = 'Updated repository';
            let badge = ev.payload?.ref?.replace('refs/heads/', '') || 'git';

            if (ev.type === 'PushEvent') {
              msg = ev.payload?.commits?.[0]?.message || 'Pushed commits';
            } else if (ev.type === 'PullRequestEvent') {
              msg = `PR #${ev.payload?.pull_request?.number}: ${ev.payload?.pull_request?.title || ev.payload?.action}`;
              badge = ev.payload?.action || 'PR';
            } else if (ev.type === 'IssuesEvent') {
              msg = `Issue #${ev.payload?.issue?.number}: ${ev.payload?.issue?.title}`;
              badge = ev.payload?.action || 'Issue';
            } else if (ev.type === 'ReleaseEvent') {
              msg = `Release ${ev.payload?.release?.tag_name || 'published'}`;
              badge = 'Release';
            }

            return {
              id: ev.id,
              type: ev.type,
              repo: ev.repo?.name || cleanUser,
              message: msg,
              author: ev.actor?.display_login || ev.actor?.login || cleanUser,
              avatarUrl: ev.actor?.avatar_url || 'https://avatars.githubusercontent.com/u/9919?v=4',
              date: new Date(ev.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              statusBadge: badge,
            };
          });
        }
      }
    } catch (e) {
      console.debug('Error fetching events', e);
    }

    return {
      profile: {
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        bio: userData.bio || 'Developer on GitHub',
        publicRepos: userData.public_repos ?? 0,
        followers: userData.followers ?? 0,
        following: userData.following ?? 0,
        htmlUrl: userData.html_url,
        company: userData.company,
        location: userData.location,
      },
      repos: reposData.length > 0 ? reposData : MOCK_REPOS,
      activity: activityData.length > 0 ? activityData : MOCK_ACTIVITY,
      rateLimitRemaining: rateRemaining ? parseInt(rateRemaining, 10) : undefined,
      rateLimitLimit: rateLimit ? parseInt(rateLimit, 10) : undefined,
      rateLimitReset: rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : undefined,
      isMock: false,
    };
  } catch (err) {
    console.warn('Network error fetching GitHub data, falling back to mock dataset', err);
    return {
      profile: MOCK_PROFILE,
      repos: MOCK_REPOS,
      activity: MOCK_ACTIVITY,
      rateLimitRemaining: 60,
      rateLimitLimit: 60,
      isMock: true,
    };
  }
}

