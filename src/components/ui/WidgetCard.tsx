import React from 'react';
import { Maximize2, Minimize2, ArrowUp, ArrowDown, EyeOff, MoreHorizontal } from 'lucide-react';
import { WidgetId } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface WidgetCardProps {
  id: WidgetId;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  headerAction?: React.ReactNode;
  colSpan: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  id,
  title,
  subtitle,
  icon,
  headerAction,
  colSpan,
  children,
  className = '',
}) => {
  const { updateWidgetSpan, moveWidget, toggleWidget } = useDashboard();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Responsive column mapping for grid
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return 'col-span-12 md:col-span-6 lg:col-span-3';
      case 2:
        return 'col-span-12 md:col-span-6 lg:col-span-6';
      case 3:
        return 'col-span-12 lg:col-span-9';
      case 4:
      default:
        return 'col-span-12';
    }
  };

  return (
    <div
      className={`deck-card rounded-2xl p-5 flex flex-col justify-between relative group ${getColSpanClass(
        colSpan
      )} ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-inner shrink-0">
            {icon}
          </div>
          <div className="truncate">
            <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2 truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {headerAction}

          {/* Quick span toggle */}
          <button
            onClick={() => updateWidgetSpan(id, colSpan === 4 ? 2 : (colSpan + 1 > 4 ? 1 : ((colSpan + 1) as any)))}
            title="Cycle widget width"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/70 transition-colors"
          >
            {colSpan >= 3 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors"
              title="Widget options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-40 backdrop-blur-md text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Grid Width
                  </div>
                  <div className="grid grid-cols-4 gap-1 px-2 py-1">
                    {[1, 2, 3, 4].map((span) => (
                      <button
                        key={span}
                        onClick={() => {
                          updateWidgetSpan(id, span as any);
                          setIsMenuOpen(false);
                        }}
                        className={`py-1 text-center rounded border text-xs font-mono transition-all ${
                          colSpan === span
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {span}x
                      </button>
                    ))}
                  </div>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      moveWidget(id, 'up');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
                    Move Up / Left
                  </button>

                  <button
                    onClick={() => {
                      moveWidget(id, 'down');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                    Move Down / Right
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      toggleWidget(id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Hide Widget
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Widget Content Body */}
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
};

