import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  Send,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';

export const StandupWidget: React.FC = () => {
  const { widgets, tasks } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'standup');

  const [standupText, setStandupText] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate standup markdown from tasks
  const generateStandup = () => {
    const doneTasks = tasks.filter((t) => t.status === 'done');
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
    const blockers = tasks.filter((t) => t.priority === 'p0' && t.status !== 'done');

    const dateStr = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    let md = `### 📋 Daily Standup Update — ${dateStr}\n\n`;

    md += `**✅ What I completed:**\n`;
    if (doneTasks.length > 0) {
      doneTasks.forEach((t) => {
        md += `- ${t.title}${t.branchName ? ` (\`${t.branchName}\`)` : ''}\n`;
      });
    } else {
      md += `- Code reviews and sprint planning\n`;
    }

    md += `\n**🚀 Working on today:**\n`;
    if (inProgressTasks.length > 0) {
      inProgressTasks.forEach((t) => {
        md += `- ${t.title}${t.branchName ? ` (\`${t.branchName}\`)` : ''}\n`;
      });
    } else {
      md += `- Picking next priority from sprint backlog\n`;
    }

    md += `\n**⚠️ Blockers / Impediments:**\n`;
    if (blockers.length > 0) {
      blockers.forEach((t) => {
        md += `- [BLOCKER] ${t.title}\n`;
      });
    } else {
      md += `- None at the moment! All green.\n`;
    }

    setStandupText(md);
  };

  useEffect(() => {
    generateStandup();
  }, [tasks]);

  const handleCopy = () => {
    navigator.clipboard.writeText(standupText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!widgetConfig || !widgetConfig.enabled) return null;

  return (
    <WidgetCard
      id="standup"
      title="Daily Standup Synthesizer"
      subtitle="Auto-generated from sprint flow • Ready for Slack / Teams"
      icon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
      colSpan={widgetConfig.colSpan}
      headerAction={
        <div className="flex items-center gap-1.5">
          <button
            onClick={generateStandup}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 transition-colors"
            title="Regenerate from current sprint"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
            title="Copy standup text"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      }
    >
      <div className="space-y-2 flex-1 flex flex-col">
        <textarea
          value={standupText}
          onChange={(e) => setStandupText(e.target.value)}
          className="w-full flex-1 min-h-[140px] p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-none"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Synced with {tasks.length} sprint tickets</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Send className="w-3 h-3" /> Ready for Slack, Discord & Teams
          </span>
        </div>
      </div>
    </WidgetCard>
  );
};

