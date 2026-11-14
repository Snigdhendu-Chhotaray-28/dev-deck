import React, { useState, useRef } from 'react';
import {
  X,
  Settings,
  KeyRound,
  Bell,
  Activity,
  Download,
  Upload,
  Check,
  AlertCircle,
  Shield,
  FileJson,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const SettingsModal: React.FC = () => {
  const {
    settings,
    updateSettings,
    isSettingsOpen,
    setIsSettingsOpen,
    exportConfig,
    importConfig,
  } = useDashboard();

  const [tokenInput, setTokenInput] = useState(settings.githubToken || '');
  const [userInput, setUserInput] = useState(settings.githubUsername || '');
  const [repoInput, setRepoInput] = useState(settings.githubRepo || '');
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [intervalSec, setIntervalSec] = useState(settings.autoRefreshInterval);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      githubToken: tokenInput.trim(),
      githubUsername: userInput.trim() || 'Snigdhendu-Chhotaray-28',
      githubRepo: repoInput.trim() || 'Snigdhendu-Chhotaray-28/dev-deck',
      soundEnabled,
      autoRefreshInterval: intervalSec,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  const handleExport = () => {
    const jsonStr = exportConfig();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devdeck-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importConfig(content);
        if (success) {
          setImportStatus('Configuration imported successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON backup file.');
        }
      } catch {
        setImportStatus('Error reading file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">DevDeck Configuration</h3>
              <p className="text-xs text-slate-400">
                API tokens, audio alerts, telemetry rates, and backup.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* GitHub Integration */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" /> GitHub Token & Identity
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Personal Access Tokens (classic or fine-grained) boost your API rate limit from 60 to 5,000 requests/hour and allow inspecting private repositories. Tokens are stored only in your local browser storage.
            </p>
            <div>
              <label className="text-[11px] text-slate-400 font-mono block mb-1">
                Personal Access Token (optional):
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-mono block mb-1">
                  Default Username:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g. Snigdhendu-Chhotaray-28"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-mono block mb-1">
                  Primary Repo:
                </label>
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="e.g. Snigdhendu-Chhotaray-28/dev-deck"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" /> Telemetry & Alerts
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200">Synthesized Audio Chimes</div>
                <div className="text-[11px] text-slate-500">
                  Play Web Audio notifications for Pomodoro and task completions.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  soundEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <div className="font-medium text-slate-200">Server Auto-Ping Rate</div>
                <div className="text-[11px] text-slate-500">
                  Frequency of background latency checks.
                </div>
              </div>
              <select
                value={intervalSec}
                onChange={(e) => setIntervalSec(parseInt(e.target.value, 10))}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono"
              >
                <option value={15}>Every 15s</option>
                <option value={30}>Every 30s</option>
                <option value={60}>Every 1m</option>
                <option value={0}>Disabled (Manual only)</option>
              </select>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-purple-400" /> Backup & Restore
            </div>
            <p className="text-[11px] text-slate-400">
              Export your entire custom deck (widgets, servers, notes, tasks, quicklinks) to JSON or import on another machine.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export Backup (.json)
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Import Backup
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {importStatus && (
              <p className="text-emerald-400 text-[11px] font-mono pt-1">
                {importStatus}
              </p>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-slate-950" /> : null}
              {savedSuccess ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

