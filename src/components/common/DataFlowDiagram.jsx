import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Binary,
  Cpu,
  Calculator,
  AlertTriangle,
  UserCheck,
  BellRing,
  Database,
  BarChart3,
  ArrowRight,
  ArrowDown
} from 'lucide-react';

export default function DataFlowDiagram() {
  const { currentActivity, countdownActive, isEmergencyActive } = useApp();

  const flowSteps = [
    { id: 1, title: 'Input Sources', desc: 'Simulated 3-axis motion & posture', icon: 'Sensors', status: 'active' },
    { id: 2, title: 'Sensor Simulation', desc: 'Accel (m/s²), Gyro (°/s), Tilt (°)', icon: 'Binary', status: 'active' },
    { id: 3, title: 'Preprocessing', desc: 'Noise filtering & baseline calibration', icon: 'Cpu', status: 'active' },
    { id: 4, title: 'Detection Logic', desc: 'Multi-parameter threshold evaluation', icon: 'Cpu', status: currentActivity === 'FALL DETECTED' || currentActivity === 'FALL SEQUENCE' ? 'highlight' : 'active' },
    { id: 5, title: 'Confidence Calc', desc: 'Confidence weighting (0 - 100%)', icon: 'Calculator', status: currentActivity === 'FALL DETECTED' ? 'highlight' : 'active' },
    { id: 6, title: 'Severity Analysis', desc: 'Normal / Medium / High / Critical', icon: 'AlertTriangle', status: currentActivity === 'FALL DETECTED' ? 'highlight' : 'active' },
    { id: 7, title: 'User Verification', desc: '10s false-alarm verification check', icon: 'UserCheck', status: countdownActive ? 'pulse-gold' : 'normal' },
    { id: 8, title: 'Emergency Dispatch', desc: 'Caregiver call, SMS, buzzer & GPS', icon: 'BellRing', status: isEmergencyActive ? 'pulse-red' : 'normal' },
    { id: 9, title: 'Event Storage', desc: 'Persisted to local audit history', icon: 'Database', status: 'active' },
    { id: 10, title: 'Analytics Engine', desc: 'Incident aggregation & reporting', icon: 'BarChart', status: 'active' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            End-to-End System Data Flow Architecture
          </h3>
          <p className="text-xs text-slate-400">
            Sequential progression from raw simulated telemetry to caregiver dispatch and audit analytics
          </p>
        </div>
        <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full self-start">
          10-Stage Pipeline
        </span>
      </div>

      {/* Grid of pipeline stages */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
        {flowSteps.map((step, idx) => {
          let cardStyle = 'bg-slate-950/70 border-slate-800 text-slate-300';
          let badgeStyle = 'bg-slate-800 text-slate-400';

          if (step.status === 'highlight') {
            cardStyle = 'bg-blue-950/60 border-blue-500 text-blue-100 glow-blue';
            badgeStyle = 'bg-blue-600 text-white';
          } else if (step.status === 'pulse-gold') {
            cardStyle = 'bg-amber-950/70 border-amber-500 text-amber-100 glow-amber animate-pulse';
            badgeStyle = 'bg-amber-500 text-slate-950';
          } else if (step.status === 'pulse-red') {
            cardStyle = 'bg-red-950/80 border-red-500 text-red-100 glow-red animate-pulse-fast';
            badgeStyle = 'bg-red-500 text-white';
          }

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${badgeStyle}`}>
                    {step.id}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Stage {idx + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 leading-snug">{step.title}</h4>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
