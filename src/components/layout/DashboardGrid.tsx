import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { GitHubWidget } from '../widgets/GitHubWidget';
import { ServerStatusWidget } from '../widgets/ServerStatusWidget';
import { KanbanWidget } from '../widgets/KanbanWidget';
import { ScratchpadWidget } from '../widgets/ScratchpadWidget';
import { DevToolsWidget } from '../widgets/DevToolsWidget';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { SystemTelemetryWidget } from '../widgets/SystemTelemetryWidget';
import { QuickLinksWidget } from '../widgets/QuickLinksWidget';
import { StandupWidget } from '../widgets/StandupWidget';
import { GithubIcon } from '../ui/Icons';
import {
  Activity,
  CheckSquare,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { WidgetId } from '../../types';

export const DashboardGrid: React.FC = () => {
  const { widgets, servers, tasks, setIsCustomizeOpen } = useDashboard();

  // Sort widgets by order
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  const healthyServers = servers.filter((s) => s.status === 'healthy').length;
  const avgUptime = servers.length
    ? (servers.reduce((acc, s) => acc + s.uptimePercent, 0) / servers.length).toFixed(1)
    : '100.0';
  const completedTasks = tasks.filter((t) => t.status === 'done').length;

  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case 'github':
        return <GitHubWidget key={id} />;
      case 'servers':
        return <ServerStatusWidget key={id} />;
      case 'kanban':
        return <KanbanWidget key={id} />;
      case 'scratchpad':
        return <ScratchpadWidget key={id} />;
      case 'devtools':
        return <DevToolsWidget key={id} />;
      case 'pomodoro':
        return <PomodoroWidget key={id} />;
      case 'system':
        return <SystemTelemetryWidget key={id} />;
      case 'quicklinks':
        return <QuickLinksWidget key={id} />;
      case 'standup':
        return <StandupWidget key={id} />;
      default:
        return null;
    }
  };

  const enabledWidgets = sortedWidgets.filter((w) => w.enabled);

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Quick Status Bar / Vitals Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GithubIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">GitHub Repos</div>
            <div className="text-base font-bold text-white font-mono">Live Pulse</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Infra SLA</div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {avgUptime}% <span className="text-[10px] text-slate-500">({healthyServers}/{servers.length})</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Sprint Velocity</div>
            <div className="text-base font-bold text-purple-300 font-mono">
              {completedTasks}/{tasks.length} <span className="text-[10px] text-slate-500">Tasks</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Deck Modules</div>
            <div className="text-base font-bold text-amber-300 font-mono">
              {enabledWidgets.length}/{widgets.length} <span className="text-[10px] text-slate-500">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-12 gap-5">
        {sortedWidgets.map((widget) => renderWidget(widget.id))}
      </div>

      {/* Hidden Widgets Notice / Add Widget CTA */}
      {enabledWidgets.length < widgets.length && (
        <div className="p-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              {widgets.length - enabledWidgets.length} modules currently hidden
            </span>
            . Customize your deck layout to enable and rearrange widgets.
          </div>
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Manage Widgets
          </button>
        </div>
      )}
    </main>
  );
};
