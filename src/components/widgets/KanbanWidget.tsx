import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  GitBranch,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Tag,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';
import { KanbanTask, TaskPriority, TaskStatus } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

export const KanbanWidget: React.FC = () => {
  const { widgets, tasks, addTask, updateTaskStatus, deleteTask } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'kanban');

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('p1');
  const [tagsStr, setTagsStr] = useState('Frontend, Feature');
  const [branchName, setBranchName] = useState('');
  const [copiedBranch, setCopiedBranch] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');

  if (!widgetConfig || !widgetConfig.enabled) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'in_progress',
      priority,
      tags: tags.length ? tags : ['General'],
      branchName: branchName.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setBranchName('');
    setIsAdding(false);
  };

  const handleCopyBranch = (branch: string) => {
    navigator.clipboard.writeText(branch);
    setCopiedBranch(branch);
    setTimeout(() => setCopiedBranch(null), 1800);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === 'done') {
      triggerConfetti();
    }
    updateTaskStatus(taskId, newStatus);
  };

  const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: 'text-slate-400 border-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'text-cyan-400 border-cyan-500/40' },
    { id: 'review', label: 'Review & PR', color: 'text-purple-400 border-purple-500/40' },
    { id: 'done', label: 'Completed', color: 'text-emerald-400 border-emerald-500/40' },
  ];

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'p0':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">P0 BLOCKER</span>;
      case 'p1':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">P1 HIGH</span>;
      case 'p2':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">P2 MED</span>;
      case 'p3':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700">P3 LOW</span>;
    }
  };

  // Extract all distinct tags for filter pills
  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

  const filteredTasks = tasks.filter((t) => {
    if (filterTag === 'all') return true;
    return t.tags.includes(filterTag);
  });

  return (
    <WidgetCard
      id="kanban"
      title="Developer Task Flow & Sprint"
      subtitle={`${tasks.filter((t) => t.status === 'done').length}/${tasks.length} tasks completed`}
      icon={<CheckSquare className="w-4 h-4 text-cyan-400" />}
      colSpan={widgetConfig.colSpan}
      headerAction={
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
            title="Create Sprint Task"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-500 flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setFilterTag('all')}
            className={`px-2 py-0.5 rounded-md font-mono shrink-0 transition-colors ${
              filterTag === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({tasks.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-2 py-0.5 rounded-md font-mono shrink-0 transition-colors ${
                filterTag === tag
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Create Task Form */}
        {isAdding && (
          <form
            onSubmit={handleCreateTask}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2.5 animate-in fade-in text-xs"
          >
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Add Task to Sprint
            </div>
            <input
              type="text"
              placeholder="Task title (e.g. Implement refresh token rotation)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
            <textarea
              placeholder="Details / acceptance criteria (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300"
              >
                <option value="p0">P0 - Blocker</option>
                <option value="p1">P1 - High</option>
                <option value="p2">P2 - Medium</option>
                <option value="p3">P3 - Low</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
              />
              <input
                type="text"
                placeholder="git branch (optional)"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        {/* Kanban Board Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl bg-slate-900/50 border border-slate-800/80 p-2.5 min-h-[160px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className={`text-xs font-semibold ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-2 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="h-20 flex items-center justify-center text-[11px] text-slate-600 italic">
                      Empty
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-1.5 group/item"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span
                            className={`font-medium text-slate-200 leading-snug ${
                              task.status === 'done' ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-600 hover:text-rose-400 p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Git Branch Helper */}
                        {task.branchName && (
                          <div className="flex items-center justify-between gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                            <span className="flex items-center gap-1 truncate">
                              <GitBranch className="w-2.5 h-2.5 text-cyan-400" />
                              {task.branchName}
                            </span>
                            <button
                              onClick={() => handleCopyBranch(task.branchName!)}
                              title="Copy branch name"
                              className="text-slate-400 hover:text-cyan-300"
                            >
                              {copiedBranch === task.branchName ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Tags & Priority */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-900">
                          <div className="flex items-center gap-1 flex-wrap">
                            {getPriorityBadge(task.priority)}
                            {task.tags.slice(0, 1).map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-mono text-slate-400 px-1 py-0.2 rounded bg-slate-800"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Quick Column Navigation Arrows */}
                          <div className="flex items-center gap-0.5">
                            {col.id !== 'backlog' && (
                              <button
                                onClick={() => {
                                  const prevMap: Record<TaskStatus, TaskStatus> = {
                                    in_progress: 'backlog',
                                    review: 'in_progress',
                                    done: 'review',
                                    backlog: 'backlog',
                                  };
                                  handleStatusChange(task.id, prevMap[task.status]);
                                }}
                                className="p-0.5 text-slate-500 hover:text-slate-200"
                                title="Move left"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => {
                                  const nextMap: Record<TaskStatus, TaskStatus> = {
                                    backlog: 'in_progress',
                                    in_progress: 'review',
                                    review: 'done',
                                    done: 'done',
                                  };
                                  handleStatusChange(task.id, nextMap[task.status]);
                                }}
                                className="p-0.5 text-slate-500 hover:text-cyan-400"
                                title="Move right"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
};

