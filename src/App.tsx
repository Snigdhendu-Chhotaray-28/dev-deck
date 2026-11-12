import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { Header } from './components/layout/Header';
import { DashboardGrid } from './components/layout/DashboardGrid';
import { CustomizeDeckModal } from './components/modals/CustomizeDeckModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { GithubIcon } from './components/ui/Icons';
import { Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <div>
        <Header />
        <DashboardGrid />
      </div>

      {/* Global Modals */}
      <CustomizeDeckModal />
      <SettingsModal />
      <CommandPalette />

      {/* Dashboard Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/60 py-6 px-4 sm:px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">dev-deck</span>
            <span>•</span>
            <span>Modular Command Center for Engineers</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                Ctrl + K
              </kbd>
              <span>Command Palette</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> 100% Local-First
            </span>
            <span>•</span>
            <a
              href="https://github.com/Snigdhendu-Chhotaray-28/dev-deck"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
};

export default App;
