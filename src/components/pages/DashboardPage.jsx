import React from 'react';
import { useApp } from '../../context/AppContext';
import DemoModeBar from '../common/DemoModeBar';
import PrototypeBadge from '../common/PrototypeBadge';
import SensorCards from '../monitoring/SensorCards';
import FallDetectionLogicCard from '../common/FallDetectionLogicCard';
import TelemetryWaveformChart from '../common/TelemetryWaveformChart';
import SimulatedLocationCard from '../common/SimulatedLocationCard';
import DataFlowDiagram from '../common/DataFlowDiagram';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Sliders,
  Play,
  ArrowRight,
  TrendingUp,
  Radio,
  Eye
} from 'lucide-react';

export default function DashboardPage() {
  const {
    systemStatus,
    events,
    currentActivity,
    sensorData,
    triggerScenario,
    setActiveTab,
    isEmergencyActive
  } = useApp();

  // Aggregate metrics
  const totalEvents = events.length;
  const fallsDetected = events.filter(e => e.activity === 'Fall' || e.detection?.toLowerCase().includes('fall')).length;
  const alertsGenerated = events.filter(e => e.response?.toLowerCase().includes('alert') || e.status === 'Emergency Active').length;
  const falseAlarms = events.filter(e => e.status?.toLowerCase().includes('false') || e.response?.toLowerCase().includes('safe') || e.detection?.toLowerCase().includes('false')).length;

  return (
    <div className="space-y-6">
      {/* Presentation Demo Mode Banner */}
      <DemoModeBar />

      {/* Prototype Notice Banner */}
      <PrototypeBadge />

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* System Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>System Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-lg font-black text-white">{systemStatus}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Live background polling</p>
        </div>

        {/* Total Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Total Events</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black font-mono text-white">{totalEvents}</span>
          <p className="text-[10px] text-slate-500 mt-1">Recorded in session</p>
        </div>

        {/* Falls Detected */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Falls Detected</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-2xl font-black font-mono text-red-400">{fallsDetected}</span>
          <p className="text-[10px] text-slate-500 mt-1">Algorithm verified</p>
        </div>

        {/* Alerts Generated */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Alerts Generated</span>
            <BellRing className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-mono text-amber-400">{alertsGenerated}</span>
          <p className="text-[10px] text-slate-500 mt-1">Simulated dispatches</p>
        </div>

        {/* False Alarms */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>False Alarms</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black font-mono text-emerald-400">{falseAlarms}</span>
          <p className="text-[10px] text-slate-500 mt-1">User cleared (Safe)</p>
        </div>
      </div>

      {/* Live Monitoring Activity Card + Quick Scenario Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity & Dynamic Sensors */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Activity Banner Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Current Activity Classification
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  currentActivity === 'FALL DETECTED'
                    ? 'text-red-500 animate-pulse'
                    : currentActivity === 'SUDDEN MOVEMENT'
                    ? 'text-amber-400'
                    : currentActivity === 'WALKING'
                    ? 'text-emerald-400'
                    : currentActivity === 'SITTING'
                    ? 'text-blue-400'
                    : 'text-slate-100'
                }`}>
                  {currentActivity}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  Confidence: {sensorData.fallConfidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('monitoring')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Open Vision Monitor</span>
              </button>
            </div>
          </div>

          {/* Dynamic Sensors Component */}
          <SensorCards />

          {/* Real-time Telemetry Waveform */}
          <TelemetryWaveformChart />
        </div>

        {/* Right Col: Quick Simulation Launcher & AI Algorithm Analysis */}
        <div className="space-y-4">
          {/* Quick Simulation Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Quick Simulation Trigger
                </h4>
              </div>
              <button
                onClick={() => setActiveTab('simulation')}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Lab</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Click any scenario to inject simulated sensor dynamics into the detection pipeline:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => triggerScenario('NORMAL')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-emerald-400 font-bold block">01 • Nominal</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Normal</span>
              </button>

              <button
                onClick={() => triggerScenario('WALKING')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-emerald-400 font-bold block">02 • Gait</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Walking</span>
              </button>

              <button
                onClick={() => triggerScenario('SITTING')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-blue-400 font-bold block">03 • Rest</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300">Sitting</span>
              </button>

              <button
                onClick={() => triggerScenario('SUDDEN_MOVEMENT')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <span className="text-[10px] text-amber-400 font-bold block">04 • Stumble</span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">Sudden Move</span>
              </button>

              <button
                onClick={() => triggerScenario('FALL')}
                className="col-span-2 p-3 rounded-xl bg-red-950/60 border border-red-500/50 hover:bg-red-900/60 text-left transition-all group glow-red"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-red-300 font-bold uppercase">Critical Scenario</span>
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                </div>
                <span className="text-sm font-black text-white group-hover:text-red-200 block mt-0.5">
                  🔴 Run Fall Simulation (6-Step)
                </span>
                <span className="text-[11px] text-red-300/80 block mt-0.5">
                  Freefall → Impact shock → 84° tilt → Countdown
                </span>
              </button>
            </div>
          </div>

          {/* Fall Detection Logic Card */}
          <FallDetectionLogicCard />

          {/* Location Snapshot */}
          <SimulatedLocationCard />
        </div>
      </div>

      {/* End-to-End System Data Flow Pipeline */}
      <DataFlowDiagram />
    </div>
  );
}
