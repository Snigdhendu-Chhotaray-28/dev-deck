import React from 'react';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { WidgetCategory, WidgetId } from '../../types';

export const CustomizeDeckModal: React.FC = () => {
  const {
    widgets,
    toggleWidget,
    updateWidgetSpan,
    moveWidget,
    resetToDefaults,
    isCustomizeOpen,
    setIsCustomizeOpen,
    presets,
    activePresetId,
    applyPreset,
  } = useDashboard();

  if (!isCustomizeOpen) return null;

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  const getCategoryBadge = (cat: WidgetCategory) => {
    switch (cat) {
      case 'git':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">GIT</span>;
      case 'monitoring':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SRE & HEALTH</span>;
      case 'productivity':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">WORKFLOW</span>;
      case 'utilities':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">TOOLS</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={() => setIsCustomizeOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Customize Deck Layout</h3>
              <p className="text-xs text-slate-400">
                Enable, reorder, or resize widgets to match your ideal developer workflow.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomizeOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Presets Fast Switch */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Apply Layout Preset:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  activePresetId === preset.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-semibold">{preset.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Widgets List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {sortedWidgets.map((widget, index) => (
            <div
              key={widget.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                widget.enabled
                  ? 'bg-slate-950/50 border-slate-800 text-slate-200'
                  : 'bg-slate-950/20 border-slate-900 text-slate-600'
              }`}
            >
              {/* Left Info & Toggle */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleWidget(widget.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    widget.enabled
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title={widget.enabled ? 'Disable widget' : 'Enable widget'}
                >
                  {widget.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold truncate">{widget.title}</span>
                    {getCategoryBadge(widget.category)}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-sm">
                    {widget.description}
                  </p>
                </div>
              </div>

              {/* Right Controls: Width and Order */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Width selector */}
                <select
                  disabled={!widget.enabled}
                  value={widget.colSpan}
                  onChange={(e) => updateWidgetSpan(widget.id, parseInt(e.target.value, 10) as any)}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 disabled:opacity-40"
                >
                  <option value={1}>1 Column (Small)</option>
                  <option value={2}>2 Columns (Half)</option>
                  <option value={3}>3 Columns (Wide)</option>
                  <option value={4}>4 Columns (Full Width)</option>
                </select>

                {/* Move Up/Down */}
                <div className="flex items-center gap-0.5">
                  <button
                    disabled={index === 0}
                    onClick={() => moveWidget(widget.id, 'up')}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === sortedWidgets.length - 1}
                    onClick={() => moveWidget(widget.id, 'down')}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Factory Default
          </button>
          <button
            onClick={() => setIsCustomizeOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

