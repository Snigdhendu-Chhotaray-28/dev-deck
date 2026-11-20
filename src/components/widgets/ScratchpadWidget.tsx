import React, { useState } from 'react';
import {
  FileCode2,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  BookOpen,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';

export const ScratchpadWidget: React.FC = () => {
  const {
    widgets,
    notes,
    activeNoteId,
    setActiveNoteId,
    updateNoteContent,
    addNoteTab,
    deleteNoteTab,
  } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'scratchpad');

  const [copied, setCopied] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);

  if (!widgetConfig || !widgetConfig.enabled) return null;

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddTabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabTitle.trim()) return;
    addNoteTab(newTabTitle.trim(), 'markdown');
    setNewTabTitle('');
    setIsAddingTab(false);
  };

  // Metrics
  const charCount = activeNote?.content.length || 0;
  const lineCount = activeNote?.content ? activeNote.content.split('\n').length : 0;
  const wordCount = activeNote?.content
    ? activeNote.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <WidgetCard
      id="scratchpad"
      title="Developer Scratchpad & Vault"
      subtitle={`${notes.length} active documents • Auto-saved`}
      icon={<FileCode2 className="w-4 h-4 text-purple-400" />}
      colSpan={widgetConfig.colSpan}
      headerAction={
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title="Copy current note"
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800/80 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            title="Export note to file"
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Note Tabs Row */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`group/tab flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
                  activeNoteId === note.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-transparent'
                }`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <BookOpen className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[120px]">{note.title}</span>
                {notes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNoteTab(note.id);
                    }}
                    className="ml-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover/tab:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => setIsAddingTab(!isAddingTab)}
              className="p-1 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800/60 border border-dashed border-slate-700 transition-colors shrink-0"
              title="Add document tab"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Add Tab Prompt */}
        {isAddingTab && (
          <form onSubmit={handleAddTabSubmit} className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Tab title (e.g. AWS Keys / Drafts)"
              value={newTabTitle}
              onChange={(e) => setNewTabTitle(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 flex-1 focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTab(false)}
              className="px-2 py-1 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Textarea Workspace */}
        {activeNote ? (
          <div className="flex-1 flex flex-col min-h-[180px]">
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNoteContent(activeNote.id, e.target.value)}
              placeholder="Write developer notes, markdown, curl snippets, SQL or config..."
              className="w-full flex-1 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed selection:bg-purple-500/30"
              spellCheck={false}
            />
            <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
              <span>{activeNote.syntax.toUpperCase()} mode</span>
              <div className="flex items-center gap-3">
                <span>{lineCount} lines</span>
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-xs text-slate-500">
            No active document. Create one above.
          </div>
        )}
      </div>
    </WidgetCard>
  );
};

