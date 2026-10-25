import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Gauge,
  Compass,
  Zap,
  ShieldAlert,
  Play,
  Pause,
  AlertTriangle,
  Rotate3d,
  Layers
} from 'lucide-react';

export default function SensorCards() {
  const {
    sensorData,
    isMonitoringPaused,
    setIsMonitoringPaused,
    currentActivity,
    triggerScenario
  } = useApp();

  // Status Badge formatting
  let statusBadge = (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>🟢 NORMAL ACTIVITY</span>
    </div>
  );

  if (sensorData.status === 'FALL DETECTED') {
    statusBadge = (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500 text-red-300 font-bold text-xs glow-red animate-pulse-fast">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
        <span>🔴 FALL DETECTED</span>
      </div>
    );
  } else if (sensorData.status === 'WARNING') {
    statusBadge = (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs glow-amber">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
        <span>🟡 POSSIBLE FALL / WARNING</span>
      </div>
    );
  }

  // Confidence progress bar color
  let confBarColor = 'bg-emerald-500';
  if (sensorData.fallConfidence > 75) confBarColor = 'bg-red-500';
  else if (sensorData.fallConfidence > 40) confBarColor = 'bg-amber-500';

  return (
    <div className="space-y-4">
      {/* Top Banner: Status + Pause/Resume button */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-semibold uppercase">Detection Status:</div>
          {statusBadge}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMonitoringPaused(!isMonitoringPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isMonitoringPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isMonitoringPaused ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Monitoring</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Monitoring</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fall Confidence Meter Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            Fall Confidence Index
          </span>
          <span className="text-xl font-black font-mono text-white">
            {sensorData.fallConfidence}%
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${confBarColor}`}
            style={{ width: `${sensorData.fallConfidence}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>0% Baseline</span>
          <span>40% Warning Threshold</span>
          <span>80% Fall Trigger</span>
          <span>100% Confirmed</span>
        </div>
      </div>

      {/* 5 Main Sensor Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Acceleration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              Acceleration
            </span>
            <span className="text-[10px] text-slate-500 font-mono">3-Axis</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">
              {sensorData.acceleration}
            </span>
            <span className="text-xs text-slate-400 font-sans">m/s²</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Normal: 9.8 m/s² (1g)</p>
        </div>

        {/* Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Velocity
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Est.</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">
              {sensorData.velocity}
            </span>
            <span className="text-xs text-slate-400 font-sans">m/s</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Free-fall speed integration</p>
        </div>

        {/* Body Orientation Angle */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              Body Angle
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Tilt</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-white">
              {sensorData.bodyAngle}°
            </span>
            <span className="text-xs text-slate-400 font-sans">from vertical</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {sensorData.bodyAngle > 60 ? 'Horizontal posture' : 'Normal upright'}
          </p>
        </div>

        {/* Movement Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Movement Level
            </span>
          </div>
          <div className="text-base font-bold text-white truncate">
            {sensorData.movement}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Post-event cadence rate</p>
        </div>

        {/* Impact Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              Impact Level
            </span>
          </div>
          <div className={`text-base font-bold ${
            sensorData.impact.toLowerCase().includes('critical') || sensorData.impact.toLowerCase().includes('high')
              ? 'text-red-400 font-black'
              : sensorData.impact.toLowerCase().includes('mod')
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}>
            {sensorData.impact}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Contact shock absorption</p>
        </div>

        {/* Gyroscope Rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <Rotate3d className="w-3.5 h-3.5 text-purple-400" />
              Gyroscope (rad/s)
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-200 grid grid-cols-3 gap-1">
            <span>X: {sensorData.gyroscope.x}</span>
            <span>Y: {sensorData.gyroscope.y}</span>
            <span>Z: {sensorData.gyroscope.z}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">MPU-6050 Simulated Rate</p>
        </div>
      </div>
    </div>
  );
}
