import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  Radio,
  Layers,
} from 'lucide-react';
import { WidgetCard } from '../ui/WidgetCard';
import { useDashboard } from '../../context/DashboardContext';

export const SystemTelemetryWidget: React.FC = () => {
  const { widgets } = useDashboard();
  const widgetConfig = widgets.find((w) => w.id === 'system');

  const [cores, setCores] = useState(8);
  const [memoryHeap, setMemoryHeap] = useState({ used: 42, total: 64, percent: 65 });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downlink, setDownlink] = useState<number | string>('10+');
  const [rtt, setRtt] = useState<number>(25);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setCores(navigator.hardwareConcurrency || 8);

      const navWithConn = navigator as unknown as {
        connection?: {
          downlink?: number;
          rtt?: number;
          effectiveType?: string;
          addEventListener?: (type: string, listener: () => void) => void;
        };
      };

      if (navWithConn.connection) {
        if (navWithConn.connection.downlink) setDownlink(navWithConn.connection.downlink);
        if (navWithConn.connection.rtt) setRtt(navWithConn.connection.rtt);
      }
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Dynamic memory meter simulation with slight natural fluctuations
    const memInterval = setInterval(() => {
      const perfWithMem = performance as unknown as {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };

      if (perfWithMem.memory) {
        const usedMB = Math.round(perfWithMem.memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(perfWithMem.memory.totalJSHeapSize / 1048576);
        const percent = Math.min(100, Math.round((usedMB / totalMB) * 100));
        setMemoryHeap({ used: usedMB, total: totalMB, percent });
      } else {
        // Simulated smooth wave
        const simulated = 45 + Math.round(Math.sin(Date.now() / 3000) * 12);
        setMemoryHeap({ used: simulated, total: 80, percent: simulated });
      }
    }, 2500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(memInterval);
    };
  }, []);

  if (!widgetConfig || !widgetConfig.enabled) return null;

  return (
    <WidgetCard
      id="system"
      title="System Telemetry & Vitals"
      subtitle={`${cores} Logical Cores • ${isOnline ? 'Online' : 'Offline'}`}
      icon={<Cpu className="w-4 h-4 text-emerald-400" />}
      colSpan={widgetConfig.colSpan}
    >
      <div className="space-y-3.5 py-1">
        {/* Core & Heap Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-mono">CPU Cores</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold font-mono text-slate-100">{cores}</span>
              <span className="text-[10px] text-slate-500 font-mono ml-1">threads</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-400 h-full w-3/4 rounded-full" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-mono">JS Heap</span>
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold font-mono text-slate-100">{memoryHeap.used}</span>
              <span className="text-[10px] text-slate-500 font-mono ml-1">/ {memoryHeap.total} MB</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${memoryHeap.percent}%` }}
                className="bg-purple-400 h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Network Status & Bandwidth */}
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Network Status
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Bandwidth:</span>
              <span className="text-slate-200">{downlink} Mbps</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>RTT Ping:</span>
              <span className="text-slate-200">{rtt} ms</span>
            </div>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

