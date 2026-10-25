import React from 'react';
import { Radio, Camera, ArrowDown, ShieldAlert, BellRing, PhoneCall, CheckCircle } from 'lucide-react';

export default function PresentationModeComparison() {
  return (
    <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            SYSTEM ARCHITECTURAL SEPARATION
          </span>
          <h3 className="text-base font-black text-white tracking-wide">
            Presentation Mode: Real Hardware vs Live Software Demo Input
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 self-start sm:self-auto">
          Dual-Input Demonstration Model
        </span>
      </div>

      {/* Two Clearly Separated Side-by-Side Architectural Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: REAL SYSTEM ARCHITECTURE */}
        <div className="p-4 rounded-xl bg-slate-950 border-2 border-emerald-500/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                ACTUAL HARDWARE
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROPOSED SYSTEM
              </span>
            </div>

            <h4 className="text-sm font-black text-white flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>📡 MOTION SENSOR / IMU</span>
            </h4>
            <p className="text-xs text-slate-300 font-medium mb-3">
              Actual proposed hardware input
            </p>

            {/* Architecture pipeline */}
            <div className="space-y-1 text-[11px] font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <span>1.</span> Motion Sensor / IMU (MPU-6050)
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2">
                <span>2.</span> 3-Axis Acceleration & Tilt Angle ($g, ^\circ$)
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <span>3.</span> Fall Detection Algorithm
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <span>4.</span> Emergency Response
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2 text-red-300 font-bold">
                <span>5.</span> Caregiver Alert & Siren
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            * Wearable physical transducer measuring actual force dynamics.
          </p>
        </div>

        {/* Box 2: LIVE SOFTWARE DEMONSTRATION */}
        <div className="p-4 rounded-xl bg-slate-950 border-2 border-blue-500/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 font-mono">
                DEMO MODE
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                SOFTWARE DEMO INPUT
              </span>
            </div>

            <h4 className="text-sm font-black text-white flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-blue-400" />
              <span>🎥 LAPTOP CAMERA</span>
            </h4>
            <p className="text-xs text-slate-300 font-medium mb-3">
              Visual demonstration input only
            </p>

            {/* Architecture pipeline */}
            <div className="space-y-1 text-[11px] font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <span>1.</span> Laptop Camera / Webcam Feed
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2">
                <span>2.</span> Pose / Movement Analysis Trigger
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <span>3.</span> Demo Fall Detection Event
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <span>4.</span> Same Fall Detection Workflow
              </div>
              <div className="text-slate-500 pl-4">↓</div>
              <div className="flex items-center gap-2 text-red-300 font-bold">
                <span>5.</span> Same Caregiver Alert & Siren
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            * Visual input simulating the event for college project evaluation.
          </p>
        </div>
      </div>

      {/* Unified Output Convergence Statement */}
      <div className="p-3.5 bg-gradient-to-r from-blue-950/60 via-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-xl text-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 block mb-1">
          UNIFIED BACKEND WORKFLOW
        </span>
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
          <span>FALL DETECTION</span>
          <span className="text-indigo-400">→</span>
          <span>EMERGENCY RESPONSE</span>
          <span className="text-indigo-400">→</span>
          <span>CAREGIVER ALERT</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Both inputs trigger the identical algorithmic verification countdown, siren, simulated SMS, and location broadcast.
        </p>
      </div>
    </div>
  );
}
