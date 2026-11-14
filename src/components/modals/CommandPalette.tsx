import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Settings,
  Activity,
  Zap,
  Code2,
  FileCode2,
  CheckSquare,
  Compass,
  MessageSquare,
  Cpu,
  Palette,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { useDashboard } from '../../context/DashboardContext';
import { ThemeMode, WidgetId } from '../../types';

interface CommandItem {
  id: string;
  title: string;
  category: 'Widgets' | 'Themes' | 'Presets' | 'Actions' | 'Quicklinks';
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    toggleWidget,
    widgets,
    updateSettings,
    applyPreset,
    presets,
    pingAllServers,
    setIsCustomizeOpen,
    setIsSettingsOpen,
    quickLinks,
  } = useDashboard();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const commands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // Actions
    list.push({
      id: 'action-ping',
      title: 'Ping all server endpoints now',
      category: 'Actions',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => pingAllServers(),
    });
    list.push({
      id: 'action-customize',
      title: 'Customize Deck Layout & Widgets',
      category: 'Actions',
      icon: <SlidersHorizontal className="w-4 h-4 text-cyan-400" />,
      action: () => setIsCustomizeOpen(true),
    });
    list.push({
      id: 'action-settings',
      title: 'Open Settings & GitHub Tokens',
      category: 'Actions',
      icon: <Settings className="w-4 h-4 text-slate-300" />,
      action: () => setIsSettingsOpen(true),
    });

    // Presets
    presets.forEach((p) => {
      list.push({
        id: `preset-${p.id}`,
        title: `Switch Workspace Preset: ${p.name}`,
        category: 'Presets',
        icon: <Zap className="w-4 h-4 text-amber-400" />,
        action: () => applyPreset(p.id),
      });
    });

    // Themes
    const themes: { id: ThemeMode; label: string }[] = [
      { id: 'cyberpunk', label: 'Theme: Cyberpunk Neon' },
      { id: 'stealth', label: 'Theme: Stealth Obsidian' },
      { id: 'nord', label: 'Theme: Nordic Frost' },
      { id: 'terminal', label: 'Theme: Retro Matrix Terminal' },
      { id: 'midnight', label: 'Theme: Midnight Violet' },
      { id: 'minimal', label: 'Theme: Minimal Carbon' },
    ];
    themes.forEach((t) => {
      list.push({
        id: `theme-${t.id}`,
        title: t.label,
        category: 'Themes',
        icon: <Palette className="w-4 h-4 text-purple-400" />,
        action: () => updateSettings({ theme: t.id }),
      });
    });

    // Widgets Toggle
    widgets.forEach((w) => {
      list.push({
        id: `widget-${w.id}`,
        title: `Toggle Widget: ${w.title} (${w.enabled ? 'Disable' : 'Enable'})`,
        category: 'Widgets',
        icon: <Code2 className="w-4 h-4 text-cyan-400" />,
        action: () => toggleWidget(w.id),
      });
    });

    // QuickLinks
    quickLinks.forEach((l) => {
      list.push({
        id: `link-${l.id}`,
        title: `Open Link: ${l.title}`,
        category: 'Quicklinks',
        icon: <ExternalLink className="w-4 h-4 text-sky-400" />,
        action: () => window.open(l.url, '_blank'),
      });
    });

    return list;
  }, [
    widgets,
    presets,
    quickLinks,
    pingAllServers,
    setIsCustomizeOpen,
    setIsSettingsOpen,
    applyPreset,
    updateSettings,
    toggleWidget,
  ]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredCommands.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Dialog */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, theme, widget, or shortcut..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setIsCommandPaletteOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                  idx === selectedIndex
                    ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="shrink-0">{cmd.icon}</div>
                  <span className="truncate">{cmd.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-800/80 shrink-0 ml-2">
                  {cmd.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>dev-deck command engine</span>
        </div>
      </div>
    </div>
  );
};
