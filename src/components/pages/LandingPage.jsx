import React from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import {
  Shield,
  Activity,
  Sliders,
  Cpu,
  BellRing,
  CheckCircle,
  Radio,
  ArrowRight,
  Sparkles,
  Smartphone,
  ChevronRight,
  Database,
  Compass,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const { setActiveTab, startDemo } = useApp();

  return (
    <div className="space-y-14 py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Prototype Notice Banner */}
      <PrototypeBadge />

      {/* Hero Section */}
      <div className="relative text-center space-y-6 pt-4 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Next-Generation Healthcare IoT Prototype</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          SafeFall <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">AI</span>
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-300 max-w-2xl mx-auto">
          Intelligent Fall Detection & Emergency Response System
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An AI-assisted monitoring prototype designed to detect potential falls and initiate an emergency response workflow.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-900/40 active:scale-95 glow-blue"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-base transition-all border border-slate-700 active:scale-95"
          >
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>Try Simulation</span>
          </button>

          <button
            onClick={startDemo}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800 hover:to-purple-800 text-indigo-200 border border-indigo-500/40 font-bold text-base transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>2-Min Demo Walkthrough</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 font-medium pt-2">
          College Engineering Project Prototype • Zero Hardware Required for Demonstration
        </p>
      </div>

      {/* How It Works Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white tracking-tight">
            How It Works
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            A reliable 4-step autonomous safeguarding cycle designed to protect vulnerable individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Continuous Telemetry',
              desc: 'High-frequency 3-axis accelerometer and gyroscope sampling monitoring motion and tilt dynamics.',
              icon: Activity,
              color: 'text-blue-400',
              border: 'border-blue-500/30'
            },
            {
              step: '02',
              title: 'Explainable AI Analysis',
              desc: 'Rule-based multi-signal evaluation analyzing freefall, contact impact, body tilt, and post-impact immobility.',
              icon: Cpu,
              color: 'text-indigo-400',
              border: 'border-indigo-500/30'
            },
            {
              step: '03',
              title: 'False-Alarm Verification',
              desc: '10-second interactive verification countdown allows conscious users to cancel accidental triggers.',
              icon: Shield,
              color: 'text-amber-400',
              border: 'border-amber-500/30'
            },
            {
              step: '04',
              title: 'Autonomous Dispatch',
              desc: 'Simulated cellular SMS, caregiver call alert, local 90dB buzzer activation, and GPS location transmission.',
              icon: BellRing,
              color: 'text-red-400',
              border: 'border-red-500/30'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`bg-slate-900/80 border ${item.border} rounded-2xl p-5 shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-600">
                      {item.step}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-slate-800 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white tracking-tight">
            Key System Features
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Comprehensive software simulator designed with enterprise medical UX principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: 'Multi-Scenario Simulation Lab',
              desc: 'Instantly simulate Normal, Walking, Sitting, Sudden Movement, Full Fall Sequence, and Prolonged Inactivity.',
              icon: Sliders,
              cta: 'Test Scenarios',
              tab: 'simulation'
            },
            {
              title: 'Explainable Rule Detection Logic',
              desc: 'Transparent multi-parameter criteria: High impact + Sudden acceleration + Body angle shift + Movement cessation.',
              icon: Cpu,
              cta: 'View Algorithm',
              tab: 'dashboard'
            },
            {
              title: 'Synthetic Vision & Pose Estimation',
              desc: 'Real-time animated avatar visualizing subject orientation, center of gravity, and ground impact in living spaces.',
              icon: Activity,
              cta: 'View Live Feed',
              tab: 'monitoring'
            },
            {
              title: 'Simulated Emergency Dispatch',
              desc: 'Simulated Caregiver notifications, automated SMS, synthetic audible Web Audio buzzer, and location broadcast.',
              icon: BellRing,
              cta: 'Emergency Console',
              tab: 'alerts'
            },
            {
              title: 'Persistent Event History',
              desc: 'Audit logging for every incident with confidence scores, timestamps, severity ratings, and localStorage persistence.',
              icon: Database,
              cta: 'Explore History',
              tab: 'history'
            },
            {
              title: 'Healthcare Analytics Engine',
              desc: 'Incident distribution charts, response time trends, false-alarm ratios, and fall recurrence frequency metrics.',
              icon: Compass,
              cta: 'View Analytics',
              tab: 'analytics'
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{feature.desc}</p>
                </div>
                <button
                  onClick={() => setActiveTab(feature.tab)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>{feature.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Future Hardware Integration Section */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Future Hardware Integration Plan</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Designed to Bridge Directly into Physical Hardware
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            While this software prototype simulates all telemetry streams, the architecture maps 1-to-1 to physical embedded modules. Once hardware is deployed, WebSockets or MQTT will stream real-time MPU6050 & GPS feeds directly into this dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { name: 'ESP-32 WROOM', role: 'Dual-core MCU + WiFi/BLE', pin: 'I2C Master' },
            { name: 'MPU-6050', role: '6-Axis Accel + Gyro', pin: 'SDA/SCL (GPIO 21/22)' },
            { name: 'NEO-6M GPS', role: 'Satellite Coordinates', pin: 'UART2 (GPIO 16/17)' },
            { name: 'SIM800L GSM', role: 'Cellular SMS / Dialing', pin: 'UART1 (GPIO 4/2)' },
            { name: 'Active Buzzer', role: 'Local 90dB Siren', pin: 'GPIO 25 (PWM)' }
          ].map((hw, idx) => (
            <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-blue-400 block mb-1">MODULE {idx + 1}</span>
              <h5 className="text-xs font-bold text-white mb-0.5">{hw.name}</h5>
              <p className="text-[10px] text-slate-400 mb-1">{hw.role}</p>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                {hw.pin}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-start">
          <button
            onClick={() => setActiveTab('hardware')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all"
          >
            <span>Explore Full Hardware Architecture & Schematics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
