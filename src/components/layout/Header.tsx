import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Settings,
  Search,
  Sparkles,
  Palette,
  Terminal,
  Activity,
  Zap,
  Globe,
  Clock,
  LayoutDashboard,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { ThemeMode } from '../../types';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    presets,
    activePresetId,
    applyPreset,
    setIsCustomizeOpen,
    setIsSettingsOpen,
    setIsCommandPaletteOpen,
  } = useDashboard();

  // Multi-timezone clock
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTz = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(time);
    } catch {
      return '';
    }
  };

  const THEMES: { id: ThemeMode; label: string; dotColor: string }[] = [
    { id: 'cyberpunk', label: 'Cyberpunk Neon', dotColor: 'bg-cyan-400' },
    { id: 'stealth', label: 'Stealth Obsidian', dotColor: 'bg-emerald-400' },
    { id: 'nord', label: 'Nordic Frost', dotColor: 'bg-sky-300' },
    { id: 'terminal', label: 'Matrix Terminal', dotColor: 'bg-green-500' },
    { id: 'midnight', label: 'Midnight Violet', dotColor: 'bg-purple-400' },
    { id: 'minimal', label: 'Minimal Carbon', dotColor: 'bg-slate-300' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Terminal className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  dev-deck
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    v1.0.0
                  </span>
                </h1>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Deck
                </div>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Modular Developer Command Center
              </p>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              title="Command Palette"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400"
              title="Customize Layout"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Global Clocks */}
        <div className="hidden xl:flex items-center gap-4 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200 font-semibold">{formatTz(Intl.DateTimeFormat().resolvedOptions().timeZone)}</span>
            <span className="text-[10px] text-slate-500 uppercase">LOCAL</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-300">{formatTz('UTC')}</span>{' '}
            <span className="text-[10px] text-slate-500">UTC</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-300">{formatTz('America/Los_Angeles')}</span>{' '}
            <span className="text-[10px] text-slate-500">PST</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-300">{formatTz('Europe/London')}</span>{' '}
            <span className="text-[10px] text-slate-500">GMT</span>
          </div>
        </div>

        {/* Right: Controls & Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {/* Preset Selector */}
          <select
            value={activePresetId}
            onChange={(e) => applyPreset(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                Deck: {p.name}
              </option>
            ))}
          </select>

          {/* Theme Dropdown */}
          <div className="relative">
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as ThemeMode })}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  Theme: {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition-colors shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Search commands...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {/* Customize Widgets Button */}
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Customize
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Settings & Integrations"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

