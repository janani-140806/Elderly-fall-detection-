import React from 'react';
import { useApp } from '../../context/AppContext';
import { Radio, Gauge, Zap, Activity, ShieldCheck, ShieldAlert, Cpu, Info } from 'lucide-react';

export default function RealHardwareSensorCard({ demoFallStage = 'idle' }) {
  const { sensorData, currentActivity } = useApp();

  // Determine animated sensor values based on demo fall stage or live activity
  // BEFORE: Acceleration: 1.02 g | Movement: Stable | Risk: LOW
  // DURING: Acceleration: 2.87 g | Movement: Sudden | Impact: DETECTED | Risk: HIGH
  // AFTER: Acceleration: 0.91 g | Movement: Low / Horizontal | Fall Status: CONFIRMED

  let accelMagG = 1.02;
  let accelX = 0.82;
  let accelY = 0.34;
  let accelZ = 1.12;
  let motionState = 'NORMAL';
  let fallStatus = 'NO FALL';
  let riskLevel = 'LOW';
  let impactState = 'NO IMPACT';
  let statusBadgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

  if (demoFallStage === 'during' || currentActivity === 'FALL SEQUENCE') {
    accelMagG = 2.87;
    accelX = 2.34;
    accelY = 1.45;
    accelZ = 0.88;
    motionState = 'SUDDEN / FREEFALL';
    fallStatus = 'ANALYZING THRESHOLD';
    riskLevel = 'HIGH';
    impactState = 'CRITICAL DETECTED';
    statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber animate-pulse';
  } else if (demoFallStage === 'after' || currentActivity === 'FALL DETECTED') {
    accelMagG = 0.91;
    accelX = 0.12;
    accelY = 0.89;
    accelZ = 0.15;
    motionState = 'LOW / HORIZONTAL';
    fallStatus = 'CONFIRMED';
    riskLevel = 'CRITICAL';
    impactState = 'SPIKE RECORDED';
    statusBadgeColor = 'bg-red-500/20 text-red-300 border-red-500/50 glow-red animate-pulse-fast';
  } else if (currentActivity === 'WALKING') {
    accelMagG = 1.15;
    accelX = 0.95;
    accelY = 0.42;
    accelZ = 1.05;
    motionState = 'RHYTHMIC GAIT';
    fallStatus = 'NO FALL';
    riskLevel = 'LOW';
  } else if (currentActivity === 'SUDDEN MOVEMENT') {
    accelMagG = 1.62;
    accelX = 1.42;
    accelY = 0.65;
    accelZ = 0.98;
    motionState = 'SUDDEN SPIKE';
    fallStatus = 'WARNING (RECOVERED)';
    riskLevel = 'MEDIUM';
    statusBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Top Banner: Real Hardware Sensor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">
            PROPOSED SYSTEM INPUT
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-wide flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
              REAL HARDWARE SENSOR
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              📡 Motion Sensor / IMU
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>● SIMULATED HARDWARE FEED</span>
          </span>
        </div>
      </div>

      {/* Main Sensor Parameters Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Total Acceleration Magnitude */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Acceleration
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-black font-mono ${accelMagG > 2.0 ? 'text-red-400' : 'text-white'}`}>
              {accelMagG}
            </span>
            <span className="text-xs text-slate-400 font-bold">g</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            {(accelMagG * 9.81).toFixed(1)} m/s²
          </span>
        </div>

        {/* 3-Axis Coordinates */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            3-Axis Vector
          </span>
          <div className="text-[11px] font-mono font-bold text-slate-200 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-slate-400">X:</span>
              <span className="text-blue-400">{accelX.toFixed(2)} g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Y:</span>
              <span className="text-teal-400">{accelY.toFixed(2)} g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Z:</span>
              <span className="text-indigo-400">{accelZ.toFixed(2)} g</span>
            </div>
          </div>
        </div>

        {/* Motion State */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Motion
          </span>
          <div className="text-sm font-black text-white truncate">
            {motionState}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Impact: <strong className={impactState.includes('CRITICAL') ? 'text-red-400' : 'text-slate-300'}>{impactState}</strong>
          </span>
        </div>

        {/* Fall Status */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Fall Status
          </span>
          <div className={`text-xs font-black px-2 py-1 rounded-lg border text-center ${statusBadgeColor}`}>
            {fallStatus}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block text-center font-mono">
            Risk: <strong className={riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}>{riskLevel}</strong>
          </span>
        </div>
      </div>

      {/* 3-State Educational Timeline: Before / During / After */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-3">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
          Demonstration Telemetry States (Conceptual Hardware Equivalent):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className={`p-2 rounded-lg border transition-all ${
            demoFallStage === 'idle' && currentActivity !== 'FALL DETECTED'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className="text-[9px] font-bold uppercase block text-emerald-400">1. BEFORE EVENT</span>
            <p className="font-mono text-[11px] text-slate-200">Accel: 1.02 g</p>
            <p className="text-[10px] text-slate-400">Movement: Stable • Risk: LOW</p>
          </div>

          <div className={`p-2 rounded-lg border transition-all ${
            demoFallStage === 'during' || currentActivity === 'FALL SEQUENCE'
              ? 'bg-amber-950/60 border-amber-500 text-amber-200 glow-amber'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className="text-[9px] font-bold uppercase block text-amber-400">2. DURING EVENT</span>
            <p className="font-mono text-[11px] text-slate-200">Accel: 2.87 g (Impact!)</p>
            <p className="text-[10px] text-slate-400">Movement: Sudden • Risk: HIGH</p>
          </div>

          <div className={`p-2 rounded-lg border transition-all ${
            demoFallStage === 'after' || currentActivity === 'FALL DETECTED'
              ? 'bg-red-950/60 border-red-500 text-red-200 glow-red'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className="text-[9px] font-bold uppercase block text-red-400">3. AFTER EVENT</span>
            <p className="font-mono text-[11px] text-slate-200">Accel: 0.91 g</p>
            <p className="text-[10px] text-slate-400">Movement: Low/Horizontal • CONFIRMED</p>
          </div>
        </div>
      </div>

      {/* Mandatory Transparency Notice */}
      <div className="flex items-start gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">SIMULATED SENSOR VALUES FOR DEMONSTRATION: </strong>
          This represents what the real hardware (MPU-6050 6-DoF IMU) would provide when connected. Do NOT claim these are actual measurements from the laptop camera.
        </div>
      </div>
    </div>
  );
}
