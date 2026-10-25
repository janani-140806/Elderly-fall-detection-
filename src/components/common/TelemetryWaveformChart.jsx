import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Radio } from 'lucide-react';

export default function TelemetryWaveformChart() {
  const { telemetryHistory, sensorData } = useApp();

  // Create SVG points for Acceleration (0 - 30 m/s^2)
  // Height 100px, Width 400px
  const width = 450;
  const height = 110;
  const padding = 15;

  const maxAccel = 30;
  const pointsAccel = telemetryHistory.map((pt, i) => {
    const x = padding + (i / (telemetryHistory.length - 1)) * (width - 2 * padding);
    const clampedAccel = Math.min(maxAccel, Math.max(0, pt.accel));
    const y = height - padding - (clampedAccel / maxAccel) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Create SVG points for Body Angle (0 - 90 deg)
  const maxAngle = 90;
  const pointsAngle = telemetryHistory.map((pt, i) => {
    const x = padding + (i / (telemetryHistory.length - 1)) * (width - 2 * padding);
    const clampedAngle = Math.min(maxAngle, Math.max(0, pt.angle));
    const y = height - padding - (clampedAngle / maxAngle) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Telemetry Waveform (50Hz Stream)
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-emerald-400 rounded-full inline-block"></span>
            <span className="text-slate-300">Acceleration ({sensorData.acceleration} m/s²)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-blue-400 rounded-full inline-block"></span>
            <span className="text-slate-300">Body Angle ({sensorData.bodyAngle}°)</span>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-950 rounded-xl p-2 border border-slate-800 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_22px] opacity-30"></div>

        {/* Live indicator dot */}
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          REAL-TIME
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          {/* Threshold guide line */}
          <line
            x1={padding}
            y1={height - padding - (18.5 / maxAccel) * (height - 2 * padding)}
            x2={width - padding}
            y2={height - padding - (18.5 / maxAccel) * (height - 2 * padding)}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Body Angle Line (Blue) */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsAngle}
          />

          {/* Acceleration Line (Emerald) */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsAccel}
          />
        </svg>

        <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 px-1">
          <span>T-20s</span>
          <span className="text-red-400/80">Threshold 18.5 m/s²</span>
          <span>Current (T-0)</span>
        </div>
      </div>
    </div>
  );
}
