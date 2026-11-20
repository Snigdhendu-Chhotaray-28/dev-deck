import React, { useState } from 'react';
import {
  Compass,
  Plus,
  ExternalLink,
  Trash2,
  Globe,
  Terminal,
  Cloud,
  Database,
  CheckSquare,
  AlertOctagon,
  Triangle,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';
import { QuickLinkItem } from '../../types';
import { GithubIcon } from '../ui/Icons';

export const QuickLinksWidget: React.FC = () => {
  const { widgets, quickLinks, addQuickLink, removeQuickLink } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'quicklinks');

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<QuickLinkItem['category']>('devtools');

  if (!widgetConfig || !widgetConfig.enabled) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    addQuickLink({
      title: title.trim(),
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      category,
      icon: 'Globe',
      badge: category.toUpperCase(),
    });

    setTitle('');
    setUrl('');
    setIsAdding(false);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <GithubIcon className="w-4 h-4 text-slate-100" />;
      case 'Triangle':
        return <Triangle className="w-4 h-4 text-cyan-400" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-amber-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'CheckSquare':
        return <CheckSquare className="w-4 h-4 text-purple-400" />;
      case 'AlertOctagon':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case 'Terminal':
      case 'Server':
        return <Terminal className="w-4 h-4 text-sky-400" />;
      default:
        return <Globe className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <WidgetCard
      id="quicklinks"
      title="Developer Hub & Launchpad"
      subtitle={`${quickLinks.length} configured shortcuts`}
      icon={<Compass className="w-4 h-4 text-sky-400" />}
      colSpan={widgetConfig.colSpan}
      headerAction={
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
          title="Add Quicklink"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3">
        {/* Add Link Form */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-sky-500/30 space-y-2.5 text-xs animate-in fade-in"
          >
            <div className="font-semibold text-sky-300">Add Launcher Bookmark</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Title (e.g. Supabase Dev)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                required
              />
              <input
                type="text"
                placeholder="URL (e.g. http://localhost:8080)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
                required
              />
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300"
              >
                <option value="cloud">Cloud / Infrastructure</option>
                <option value="devtools">Developer Tools</option>
                <option value="local">Localhost</option>
                <option value="monitoring">Monitoring & APM</option>
                <option value="custom">Custom</option>
              </select>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 font-medium rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950"
                >
                  Add Link
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
          {quickLinks.map((link) => (
            <div
              key={link.id}
              className="group/link p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-2"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 min-w-0 flex-1"
              >
                <div className="p-1.5 rounded-lg bg-slate-800 text-sky-400 border border-slate-700 shrink-0 group-hover/link:border-sky-500/40">
                  {getIcon(link.icon)}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-semibold text-slate-200 group-hover/link:text-sky-300 truncate transition-colors flex items-center gap-1">
                    {link.title}
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </div>
                  {link.badge && (
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      {link.badge}
                    </span>
                  )}
                </div>
              </a>

              <button
                onClick={() => removeQuickLink(link.id)}
                className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0"
                title="Remove link"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
};
