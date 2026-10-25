import React, { useState } from 'react';
import { Shield, Info, CheckCircle2, AlertCircle, Cpu, X, Sparkles } from 'lucide-react';

export default function PrototypeBadge({ variant = 'banner' }) {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'pill') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all duration-200"
          title="Click to view Prototype & Transparency details"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Prototype Mode: Simulated Data</span>
          <Info className="w-3.5 h-3.5 text-amber-400" />
        </button>

        {showModal && <TransparencyModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-3 rounded-r-lg mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/20 rounded-md text-amber-400 flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Prototype Mode Notice
            </p>
            <p className="text-xs text-slate-300">
              Sensor inputs and emergency responses are simulated for software verification and project demonstration.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 flex-shrink-0 self-start sm:self-auto"
        >
          View System Transparency Details →
        </button>
      </div>

      {showModal && <TransparencyModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function TransparencyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">System Architecture & Transparency</h3>
            <p className="text-xs text-slate-400">Distinguishing current software features, simulated subsystems, and future physical hardware</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-5">
          {/* REAL */}
          <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Real & Working</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Web Dashboard & UI</li>
              <li>• Multi-stage Fall Detection Rules</li>
              <li>• State Machine & Logic</li>
              <li>• Verification Countdown</li>
              <li>• LocalStorage Persistence</li>
              <li>• Analytics & Telemetry</li>
              <li>• Web Audio Synthesizer</li>
            </ul>
          </div>

          {/* SIMULATED */}
          <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Simulated</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• 3-Axis Accelerometer Feed</li>
              <li>• Gyroscope Angular Rate</li>
              <li>• GPS Coordinates & Lat/Lng</li>
              <li>• Cellular SMS Dispatch</li>
              <li>• Caregiver Phone Call</li>
              <li>• Hardware Piezo Buzzer</li>
              <li>• Camera Vision Landmarks</li>
            </ul>
          </div>

          {/* FUTURE */}
          <div className="bg-slate-950/60 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Cpu className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Future Hardware</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• MPU-6050 6-DoF IMU</li>
              <li>• ESP32 Microcontroller</li>
              <li>• SIM800L GSM Module</li>
              <li>• NEO-6M GPS Receiver</li>
              <li>• Active 90dB Buzzer</li>
              <li>• Wearable Lanyard/Belt clip</li>
              <li>• Battery Power Management</li>
            </ul>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed mb-4">
          <strong className="text-slate-200">Demonstration Scope: </strong>
          This software prototype was created to validate the end-to-end detection, false-alarm mitigation, and emergency response workflow before physical hardware fabrication. No physical components are currently connected to this browser session.
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
}
