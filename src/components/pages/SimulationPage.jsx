import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import SimulatedVisionFeed from '../monitoring/SimulatedVisionFeed';
import FallDetectionLogicCard from '../common/FallDetectionLogicCard';
import TelemetryWaveformChart from '../common/TelemetryWaveformChart';
import {
  Sliders,
  Play,
  CheckCircle,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Activity,
  Layers,
  Zap,
  SlidersHorizontal
} from 'lucide-react';

export default function SimulationPage() {
  const {
    currentActivity,
    sensorData,
    setSensorData,
    triggerScenario,
    isSimulatingFall,
    fallSimStep,
    fallSimStatusText,
    setNoMovementModalOpen,
    startVerificationCountdown,
    settings
  } = useApp();

  // Manual interactive threshold sandbox for viva / professor demonstration
  const [manualMode, setManualMode] = useState(false);
  const [manualAccel, setManualAccel] = useState(9.8);
  const [manualAngle, setManualAngle] = useState(10);
  const [manualImpact, setManualImpact] = useState('Low');

  const applyManualValues = (acc, ang, imp) => {
    const isCritical = acc > (settings.impactThreshold || 18.5) && ang > (settings.angleThreshold || 60);
    const isWarning = acc > 14 || ang > 45;

    setSensorData(prev => ({
      ...prev,
      acceleration: acc,
      bodyAngle: ang,
      impact: imp,
      velocity: acc > 15 ? 2.5 : 0.8,
      movement: isCritical ? 'Low' : 'Normal',
      fallConfidence: isCritical ? 92 : isWarning ? 52 : 8,
      severity: isCritical ? 'HIGH' : isWarning ? 'Medium' : 'Normal',
      status: isCritical ? 'FALL DETECTED' : isWarning ? 'WARNING' : 'SAFE'
    }));

    if (isCritical) {
      startVerificationCountdown('Manual Critical Trigger Exceeded');
    }
  };

  const stepsList = [
    { num: 1, title: 'Monitoring movement...', detail: 'Acquiring baseline gravitational vector (1g).' },
    { num: 2, title: 'Sudden acceleration detected...', detail: 'Free-fall velocity transition delta > threshold.' },
    { num: 3, title: 'Abnormal body orientation detected...', detail: 'Significant angular pitch change (35° → 68°).' },
    { num: 4, title: 'High impact detected...', detail: 'Contact deceleration spike measured at 26.4 m/s².' },
    { num: 5, title: 'Movement stopped...', detail: 'Post-impact immobility confirmed on floor plane.' },
    { num: 6, title: 'Analyzing...', detail: 'Multi-parameter rule consensus calculation.' },
  ];

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Main Page Title */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Fall Simulation & Testing Lab
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Interactive Test Suite
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Test and validate the explainable fall detection algorithm across standard human activities and critical collapse trajectories.
          </p>
        </div>

        {/* Viva / Sandbox mode toggle */}
        <button
          onClick={() => setManualMode(!manualMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors self-start md:self-auto ${
            manualMode
              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{manualMode ? 'Using Manual Sliders' : 'Open Manual Sliders'}</span>
        </button>
      </div>

      {/* SECTION: SIMULATION CONTROL */}
      <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              Simulation Control Panel
            </h3>
            <p className="text-xs text-slate-400">
              Select any scenario to immediately demonstrate the system response
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Current: <strong className="text-blue-400">{currentActivity}</strong>
          </span>
        </div>

        {/* The 6 Required Scenario Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Normal Activity */}
          <button
            onClick={() => triggerScenario('NORMAL')}
            disabled={isSimulatingFall}
            className={`p-4 rounded-xl border text-left transition-all active:scale-95 ${
              currentActivity === 'NORMAL'
                ? 'bg-emerald-950/70 border-emerald-500 text-white glow-emerald'
                : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 text-slate-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Normal Activity</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Nominal standing/rest • Low probability
            </p>
          </button>

          {/* 2. Walking */}
          <button
            onClick={() => triggerScenario('WALKING')}
            disabled={isSimulatingFall}
            className={`p-4 rounded-xl border text-left transition-all active:scale-95 ${
              currentActivity === 'WALKING'
                ? 'bg-emerald-950/70 border-emerald-500 text-white glow-emerald'
                : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 text-slate-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Walking</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Rhythmic gait cadence (1.2 m/s) • Safe
            </p>
          </button>

          {/* 3. Sitting */}
          <button
            onClick={() => triggerScenario('SITTING')}
            disabled={isSimulatingFall}
            className={`p-4 rounded-xl border text-left transition-all active:scale-95 ${
              currentActivity === 'SITTING'
                ? 'bg-blue-950/70 border-blue-500 text-white glow-blue'
                : 'bg-slate-950/70 border-slate-800 hover:border-blue-500/50 text-slate-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Sitting</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Controlled descent, 28° seated • Safe
            </p>
          </button>

          {/* 4. Sudden Movement */}
          <button
            onClick={() => triggerScenario('SUDDEN_MOVEMENT')}
            disabled={isSimulatingFall}
            className={`p-4 rounded-xl border text-left transition-all active:scale-95 ${
              currentActivity === 'SUDDEN MOVEMENT'
                ? 'bg-amber-950/70 border-amber-500 text-white glow-amber'
                : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/50 text-slate-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Sudden Move</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Abrupt jerk/stumble • Status: WARNING
            </p>
          </button>

          {/* 5. Fall Simulation (Primary Demo) */}
          <button
            onClick={() => triggerScenario('FALL')}
            disabled={isSimulatingFall}
            className={`p-4 rounded-xl border text-left transition-all active:scale-95 sm:col-span-1 lg:col-span-1 glow-red ${
              currentActivity === 'FALL DETECTED' || isSimulatingFall
                ? 'bg-red-950 border-red-500 text-white animate-pulse'
                : 'bg-red-950/50 border-red-500/50 hover:bg-red-900/50 text-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-red-500/30 text-red-400 flex items-center justify-center mb-2">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-red-300">Fall Simulation</h4>
            <p className="text-[10px] text-red-200/80 mt-1 leading-snug font-semibold">
              6-Step Animated Sequence → Trigger Alert
            </p>
          </button>

          {/* 6. No Movement */}
          <button
            onClick={() => triggerScenario('NO_MOVEMENT')}
            disabled={isSimulatingFall}
            className={`p-4 rounded-xl border text-left transition-all active:scale-95 ${
              currentActivity === 'NO MOVEMENT'
                ? 'bg-amber-950/70 border-amber-500 text-white glow-amber'
                : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/50 text-slate-300'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">No Movement</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Prolonged inactivity verification prompt
            </p>
          </button>
        </div>

        {/* 6-Step Fall Simulation Animated Timeline Visualizer */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              6-Step Fall Sequence Execution Timeline
            </span>
            {isSimulatingFall && (
              <span className="text-xs font-mono font-bold text-red-400 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                {fallSimStatusText}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {stepsList.map((step) => {
              const isPast = fallSimStep > step.num;
              const isCurrent = fallSimStep === step.num;

              let style = 'bg-slate-950/50 border-slate-800 text-slate-500';
              let badgeStyle = 'bg-slate-800 text-slate-500';

              if (isPast) {
                style = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (isCurrent) {
                style = 'bg-red-950/80 border-red-500 text-white glow-red animate-pulse';
                badgeStyle = 'bg-red-500 text-white';
              }

              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-xl border transition-all duration-300 ${style}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-mono font-black flex items-center justify-center ${badgeStyle}`}>
                      {step.num}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-slate-500">
                      Step {step.num}
                    </span>
                  </div>
                  <h5 className="text-[11px] font-bold leading-tight mb-1 text-slate-200">
                    {step.title}
                  </h5>
                  <p className="text-[9px] text-slate-400 leading-snug">
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* After 6 steps completed banner */}
          {fallSimStep >= 7 && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/80 border border-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 glow-red">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 rounded-lg text-white">
                  <ShieldAlert className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    🔴 FALL DETECTED • Confidence: 94% • Severity: HIGH
                  </h4>
                  <p className="text-xs text-red-200 mt-0.5">
                    Multi-signal threshold breached. Emergency verification countdown active.
                  </p>
                </div>
              </div>
              <button
                onClick={() => startVerificationCountdown('Critical Fall Detected')}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold self-start sm:self-auto shadow-md"
              >
                Open Verification Modal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Viva / Sliders Sandbox Section */}
      {manualMode && (
        <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Manual Sensor Injection Sandbox (Professor / Viva Controls)
              </h4>
              <p className="text-xs text-slate-400">
                Manually adjust acceleration and angle sliders to test the algorithm boundary limits
              </p>
            </div>
            <span className="text-xs text-blue-400 font-mono">Real-Time Threshold Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Acceleration Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Contact Acceleration</span>
                <span className="font-mono text-blue-400">{manualAccel} m/s²</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="0.5"
                value={manualAccel}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setManualAccel(val);
                  applyManualValues(val, manualAngle, manualImpact);
                }}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 m/s²</span>
                <span className="text-amber-400">18.5 m/s² Threshold</span>
                <span>35 m/s²</span>
              </div>
            </div>

            {/* Body Angle Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Body Tilt Angle</span>
                <span className="font-mono text-teal-400">{manualAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={manualAngle}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setManualAngle(val);
                  applyManualValues(manualAccel, val, manualImpact);
                }}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0° (Vertical)</span>
                <span className="text-amber-400">60° Threshold</span>
                <span>90° (Flat)</span>
              </div>
            </div>

            {/* Impact Level Preset */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Impact Shockwave</span>
                <span className="font-mono text-amber-400">{manualImpact}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {['Low', 'Moderate', 'High', 'Critical'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setManualImpact(lvl);
                      applyManualValues(manualAccel, manualAngle, lvl);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      manualImpact === lvl
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split View: Synthetic Vision Avatar + Real-time Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <SimulatedVisionFeed />
          <TelemetryWaveformChart />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <FallDetectionLogicCard />

          {/* Current State Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Simulation Telemetry Snapshot
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Activity Label</span>
                <span className="font-bold text-white text-sm">{currentActivity}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Fall Probability</span>
                <span className={`font-mono font-bold text-sm ${
                  sensorData.fallConfidence > 75 ? 'text-red-400' : sensorData.fallConfidence > 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {sensorData.fallConfidence}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Acceleration</span>
                <span className="font-mono font-bold text-slate-200">{sensorData.acceleration} m/s²</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Posture Angle</span>
                <span className="font-mono font-bold text-slate-200">{sensorData.bodyAngle}° tilt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
