import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  GitFork,
  AlertCircle,
  GitPullRequest,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';
import { fetchGitHubData, GitHubApiResponse } from '../../utils/githubApi';
import { GithubIcon } from '../ui/Icons';

export const GitHubWidget: React.FC = () => {
  const { widgets, settings, updateSettings } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'github');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GitHubApiResponse | null>(null);
  const [usernameInput, setUsernameInput] = useState(settings.githubUsername || 'Snigdhendu-Chhotaray-28');
  const [activeTab, setActiveTab] = useState<'repos' | 'activity'>('repos');

  const loadData = useCallback(async (user: string, token?: string) => {
    setLoading(true);
    try {
      const res = await fetchGitHubData(user, token, false);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(settings.githubUsername, settings.githubToken);
  }, [settings.githubUsername, settings.githubToken, loadData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      updateSettings({ githubUsername: usernameInput.trim() });
    }
  };

  if (!widgetConfig || !widgetConfig.enabled) return null;

  return (
    <WidgetCard
      id="github"
      title="GitHub Metrics & Streams"
      subtitle={data?.profile ? `@${data.profile.login} • ${data.profile.publicRepos} repos` : 'Repository & CI pulse'}
      icon={<GithubIcon className="w-4 h-4 text-cyan-400" />}
      colSpan={widgetConfig.colSpan}
      headerAction={
        <div className="flex items-center gap-1.5">
          {data?.isMock ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-2.5 h-2.5" /> Demo Mode
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-2.5 h-2.5" /> Live API
            </span>
          )}

          <button
            onClick={() => loadData(settings.githubUsername, settings.githubToken)}
            disabled={loading}
            title="Refresh GitHub telemetry"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* User Search & Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/90">
          <div className="flex items-center gap-3">
            <img
              src={data?.profile.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
              alt={data?.profile.name || 'User'}
              className="w-10 h-10 rounded-full ring-2 ring-cyan-500/30 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <a
                  href={data?.profile.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-100 hover:text-cyan-400 text-sm flex items-center gap-1 transition-colors"
                >
                  {data?.profile.name || data?.profile.login}
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {data?.profile.followers} followers • {data?.profile.following} following
              </p>
            </div>
          </div>

          {/* Quick User Lookup */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
            <div className="relative">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Lookup GitHub user..."
                className="w-40 sm:w-48 pl-7 pr-2.5 py-1 text-xs rounded-lg bg-slate-950/80 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors"
            >
              Go
            </button>
          </form>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('repos')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'repos'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top Repositories ({data?.repos.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Activity Stream
            </button>
          </div>

          {data?.rateLimitRemaining !== undefined && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
              API quota: {data.rateLimitRemaining}/{data.rateLimitLimit || 60}
            </span>
          )}
        </div>

        {/* Tab 1: Repositories */}
        {activeTab === 'repos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {data?.repos.map((repo) => (
              <a
                key={repo.fullName}
                href={repo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="group/repo p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-200 group-hover/repo:text-cyan-300 transition-colors truncate">
                      {repo.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
                      {repo.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-800/60 text-slate-400 text-[11px] font-mono">
                  <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                    <Star className="w-3 h-3 text-amber-400/80" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    <GitFork className="w-3 h-3 text-cyan-400/80" />
                    {repo.forks}
                  </span>
                  <span className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                    <AlertCircle className="w-3 h-3 text-rose-400/80" />
                    {repo.openIssues}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Tab 2: Activity Feed */}
        {activeTab === 'activity' && (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {data?.activity.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3 hover:bg-slate-800/30 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 shrink-0 mt-0.5">
                  <GitPullRequest className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {item.repo}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 truncate font-mono">
                    {item.message}
                  </p>
                </div>
                {item.statusBadge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-300 border border-slate-700/80 shrink-0">
                    {item.statusBadge}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetCard>
  );
};
