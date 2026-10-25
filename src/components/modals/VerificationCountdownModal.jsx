import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, BellRing, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function VerificationCountdownModal() {
  const {
    countdownActive,
    countdownSeconds,
    countdownReason,
    confirmUserSafe,
    triggerEmergencyResponse,
    settings
  } = useApp();

  if (!countdownActive) return null;

  const totalSeconds = settings.alertCountdownDuration || 10;
  const progressPercent = Math.max(0, Math.min(100, (countdownSeconds / totalSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-red-500/70 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center glow-red relative overflow-hidden">
        {/* Top ambient strobe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse"></div>

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 mb-4 animate-bounce-slight">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
          Are you okay?
        </h2>
        <p className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-4">
          ⚠️ {countdownReason}
        </p>

        <p className="text-sm text-slate-300 max-w-sm mx-auto mb-6 leading-relaxed">
          Unusual motion or posture impact detected. Emergency response will automatically dispatch if no response is received.
        </p>

        {/* Circular / Radial Countdown Gauge */}
        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated countdown ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-red-500 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white font-mono">{countdownSeconds}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seconds</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          <button
            onClick={confirmUserSafe}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-emerald-900/30"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I'm OK (Safe)</span>
          </button>

          <button
            onClick={() => triggerEmergencyResponse()}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-red-900/40 glow-red"
          >
            <BellRing className="w-5 h-5" />
            <span>Send Alert Now</span>
          </button>
        </div>

        {/* Simulation footnote */}
        <p className="text-[11px] text-slate-500 font-medium">
          [Simulated Verification Protocol] • Clicking "I'm OK" records a false-alarm resolution.
        </p>
      </div>
    </div>
  );
}
