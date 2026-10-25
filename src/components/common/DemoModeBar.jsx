import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, RotateCcw, Square, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DemoModeBar() {
  const { demoState, startDemo, stopDemo, resetDemo } = useApp();

  return (
    <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900/80 border border-blue-500/30 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 border border-blue-400/40 rounded-xl text-blue-400 flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                College Presentation Demo Mode
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/30 text-blue-300 border border-blue-400/30">
                Automated 8-Step Tour
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {demoState.isRunning
                ? demoState.title
                : 'Runs a realistic live demonstration covering monitoring, walking, stumble, fall detection, countdown, emergency alert, and analytics.'}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {!demoState.isRunning ? (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/30 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START DEMO</span>
            </button>
          ) : (
            <button
              onClick={stopDemo}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>PAUSE DEMO</span>
            </button>
          )}

          <button
            onClick={resetDemo}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 active:scale-95"
            title="Reset system state back to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DEMO</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when running */}
      {demoState.isRunning && (
        <div className="mt-3 pt-3 border-t border-blue-500/20">
          <div className="flex items-center justify-between text-[11px] text-blue-200 mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Executing presentation sequence...
            </span>
            <span className="font-mono">{demoState.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${demoState.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
