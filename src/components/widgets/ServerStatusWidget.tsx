import React, { useState } from 'react';
import {
  Activity,
  Server,
  RefreshCw,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';
import { ServerEndpoint } from '../../types';

export const ServerStatusWidget: React.FC = () => {
  const { widgets, servers, pingServer, pingAllServers, addServer, removeServer } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'servers');

  const [isAdding, setIsAdding] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');
  const [newServerEnv, setNewServerEnv] = useState<'production' | 'staging' | 'internal' | 'local'>('production');
  const [isPingingAll, setIsPingingAll] = useState(false);

  if (!widgetConfig || !widgetConfig.enabled) return null;

  const handlePingAll = async () => {
    setIsPingingAll(true);
    await pingAllServers();
    setTimeout(() => setIsPingingAll(false), 500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim() || !newServerUrl.trim()) return;

    addServer({
      name: newServerName.trim(),
      url: newServerUrl.trim(),
      status: 'healthy',
      latency: 35,
      uptimePercent: 99.99,
      environment: newServerEnv,
      sslDaysRemaining: newServerUrl.startsWith('https') ? 120 : undefined,
    });

    setNewServerName('');
    setNewServerUrl('');
    setIsAdding(false);
  };

  // Calculate average SLA and healthy count
  const healthyCount = servers.filter((s) => s.status === 'healthy').length;
  const avgUptime = servers.length
    ? (servers.reduce((acc, s) => acc + s.uptimePercent, 0) / servers.length).toFixed(2)
    : '100.00';

  const getStatusIcon = (status: ServerEndpoint['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />;
    }
  };

  const getStatusBg = (status: ServerEndpoint['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'degraded':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'down':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'checking':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  return (
    <WidgetCard
      id="servers"
      title="Infrastructure & Services Radar"
      subtitle={`${healthyCount}/${servers.length} Operational • ${avgUptime}% Uptime`}
      icon={<Activity className="w-4 h-4 text-emerald-400" />}
      colSpan={widgetConfig.colSpan}
      headerAction={
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
            title="Add Server Endpoint"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePingAll}
            disabled={isPingingAll}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
            title="Ping all endpoints now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPingingAll ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Add Server Inline Panel */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3 animate-in fade-in"
          >
            <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Add New Service Endpoint
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Service Name (e.g. Analytics API)"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="URL (e.g. https://api.myapp.com/health)"
                value={newServerUrl}
                onChange={(e) => setNewServerUrl(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <select
                value={newServerEnv}
                onChange={(e) => setNewServerEnv(e.target.value as any)}
                className="px-2 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-300"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="internal">Internal Microservice</option>
                <option value="local">Local Dev</option>
              </select>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950"
                >
                  Save Endpoint
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Server List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {servers.map((server) => (
            <div
              key={server.id}
              className="group/srv p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Info */}
              <div className="min-w-0 flex items-start gap-2.5">
                <div className="mt-0.5">{getStatusIcon(server.status)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200 truncate">
                      {server.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                        server.environment === 'production'
                          ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
                          : server.environment === 'staging'
                          ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          : 'border-slate-700 text-slate-400 bg-slate-800'
                      }`}
                    >
                      {server.environment}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-sm">
                    {server.url}
                  </p>
                </div>
              </div>

              {/* Right: Latency Sparkline & Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                {/* Mini SVG latency sparkline */}
                <div className="flex items-end gap-0.5 h-6 w-16" title="Recent latency trend">
                  {server.latencyHistory.map((val, idx) => {
                    const heightPercent = Math.min(100, Math.max(15, (val / 150) * 100));
                    return (
                      <div
                        key={idx}
                        style={{ height: `${heightPercent}%` }}
                        className={`w-1 rounded-xs transition-all ${
                          val > 150
                            ? 'bg-amber-400'
                            : val > 300
                            ? 'bg-rose-400'
                            : 'bg-emerald-400/80'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Latency badge */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span className="font-mono text-xs font-semibold text-slate-200">
                      {server.latency}ms
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {server.uptimePercent}% uptime
                  </span>
                </div>

                {/* SSL badge */}
                {server.sslDaysRemaining && (
                  <div
                    className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
                    title={`SSL expires in ${server.sslDaysRemaining} days`}
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {server.sslDaysRemaining}d
                  </div>
                )}

                {/* Single ping button */}
                <button
                  onClick={() => pingServer(server.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  title="Ping this endpoint"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => removeServer(server.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover/srv:opacity-100"
                  title="Remove endpoint"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
};

