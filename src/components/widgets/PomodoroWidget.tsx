import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';
import { playNotificationSound } from '../../utils/sound';

export const PomodoroWidget: React.FC = () => {
  const { widgets, settings, tasks } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'pomodoro');

  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);

  // Time durations in seconds
  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playNotificationSound(settings.soundEnabled);

      if (mode === 'work') {
        const nextSessions = completedSessions + 1;
        setCompletedSessions(nextSessions);
        if (nextSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(durations.longBreak);
        } else {
          setMode('shortBreak');
          setTimeLeft(durations.shortBreak);
        }
      } else {
        setMode('work');
        setTimeLeft(durations.work);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, completedSessions, settings.soundEnabled, durations]);

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = durations[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  // Find currently active task
  const activeTask = tasks.find((t) => t.status === 'in_progress');

  if (!widgetConfig || !widgetConfig.enabled) return null;

  return (
    <WidgetCard
      id="pomodoro"
      title="Focus & Pomodoro"
      subtitle={`${completedSessions} focus cycles completed`}
      icon={<Zap className="w-4 h-4 text-cyan-400" />}
      colSpan={widgetConfig.colSpan}
    >
      <div className="flex flex-col items-center justify-center space-y-4 py-2">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-medium">
          <button
            onClick={() => switchMode('work')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              mode === 'work'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              mode === 'shortBreak'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              mode === 'longBreak'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rest (15m)
          </button>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${
                mode === 'work'
                  ? 'text-cyan-400'
                  : mode === 'shortBreak'
                  ? 'text-emerald-400'
                  : 'text-purple-400'
              }`}
              fill="transparent"
            />
          </svg>

          {/* Time display in center */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold font-mono text-slate-100 tracking-wider">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
              {mode === 'work' ? 'Deep Focus' : 'Recharge'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
              isActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isActive ? 'Pause' : 'Start Session'}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => switchMode(mode === 'work' ? 'shortBreak' : 'work')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Skip phase"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Focus Task Link */}
        {activeTask && (
          <div className="w-full text-center px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 truncate">
            <span className="text-cyan-400 font-medium">Sprint Focus: </span>
            {activeTask.title}
          </div>
        )}
      </div>
    </WidgetCard>
  );
};

