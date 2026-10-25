import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export default function NoMovementModal() {
  const {
    noMovementModalOpen,
    setNoMovementModalOpen,
    triggerEmergencyResponse,
    confirmUserSafe
  } = useApp();

  if (!noMovementModalOpen) return null;

  const handleConfirmEmergency = () => {
    setNoMovementModalOpen(false);
    triggerEmergencyResponse({
      userId: "User 001 (Eleanor Vance)",
      severity: "MEDIUM",
      confidence: 68,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: "Home – Living Room",
      signals: ["Prolonged Stationary Posture (180s+)", "Abnormal Tilt Angle (75°)", "Zero Accelerometer Variance"]
    });
  };

  const handleMarkSafe = () => {
    setNoMovementModalOpen(false);
    confirmUserSafe();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-center glow-amber">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3.5">
          <Clock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Prolonged Inactivity Detected
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
          Telemetry Observation Alert
        </p>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Subject has remained motionless in a horizontal position for an extended observation period. Possible fall or inactive resting state?
        </p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={handleMarkSafe}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Mark as Safe</span>
          </button>

          <button
            onClick={handleConfirmEmergency}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-all shadow-lg shadow-amber-900/40"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Confirm Emergency</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          [Simulated Sensor Check] • Inactivity threshold calibrated to 3 minutes.
        </p>
      </div>
    </div>
  );
}
