import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import { INITIAL_ANALYTICS_DAYS } from '../../utils/mockData';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldAlert,
  Clock,
  CheckCircle,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const { events } = useApp();
  const [activeMetric, setActiveMetric] = useState('ALL');

  // Compute live summary stats
  const totalMonitored = 238 + events.length;
  const totalFalls = 5 + events.filter(e => e.activity === 'Fall').length;
  const avgConfidence = 91.4;
  const falseAlarmPercent = 14.2;
  const avgResponseTime = '3.8s';

  const daysData = INITIAL_ANALYTICS_DAYS;

  // Donut chart calculations
  const donutData = [
    { label: 'Normal / Rest', value: 58, color: '#10b981' },
    { label: 'Walking Gait', value: 24, color: '#3b82f6' },
    { label: 'Sitting Trans.', value: 11, color: '#6366f1' },
    { label: 'Stumbles / Warn', value: 5, color: '#f59e0b' },
    { label: 'Fall Events', value: 2, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Safety Telemetry & Incident Analytics
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              7-Day Aggregation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative analysis of fall occurrences, warning frequencies, false alarms, and automated response velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>System Accuracy: 96.8%</span>
        </div>
      </div>

      {/* 5 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Monitored Events
          </span>
          <span className="text-2xl font-black font-mono text-white">{totalMonitored}</span>
          <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +12% vs last week
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Falls
          </span>
          <span className="text-2xl font-black font-mono text-red-400">{totalFalls}</span>
          <p className="text-[10px] text-slate-400 mt-1">All verified & logged</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Fall Confidence
          </span>
          <span className="text-2xl font-black font-mono text-white">{avgConfidence}%</span>
          <p className="text-[10px] text-slate-400 mt-1">Multi-signal consensus</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            False Alarm Rate
          </span>
          <span className="text-2xl font-black font-mono text-amber-400">{falseAlarmPercent}%</span>
          <p className="text-[10px] text-slate-400 mt-1">Cleared via 10s modal</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Response Time
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400">{avgResponseTime}</span>
          <p className="text-[10px] text-slate-400 mt-1">Impact to dispatch</p>
        </div>
      </div>

      {/* Main Charts Grid: Bar Chart + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bar Chart: Falls, Warnings & Normal per Day (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Weekly Event Distribution by Category
              </h3>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span>
                Normal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-500 inline-block"></span>
                Warnings
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-red-500 inline-block"></span>
                Falls
              </span>
            </div>
          </div>

          {/* SVG Grouped Bar Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-2 px-2 pt-4">
            {daysData.map((d) => {
              const maxNormal = 50;
              const hNormal = Math.max(15, (d.normal / maxNormal) * 160);
              const hWarn = d.warnings * 25;
              const hFall = d.falls * 45;

              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Normal Bar */}
                    <div
                      style={{ height: `${hNormal}px` }}
                      className="w-2.5 bg-emerald-500/70 hover:bg-emerald-400 rounded-t transition-all"
                      title={`${d.day}: ${d.normal} Normal`}
                    ></div>
                    {/* Warning Bar */}
                    {d.warnings > 0 && (
                      <div
                        style={{ height: `${hWarn}px` }}
                        className="w-2.5 bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all"
                        title={`${d.day}: ${d.warnings} Warnings`}
                      ></div>
                    )}
                    {/* Fall Bar */}
                    {d.falls > 0 && (
                      <div
                        style={{ height: `${hFall}px` }}
                        className="w-2.5 bg-red-500 hover:bg-red-400 rounded-t transition-all glow-red"
                        title={`${d.day}: ${d.falls} Falls`}
                      ></div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[45px] text-center">
                    {d.day.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Donut Chart: Activity Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
            <PieIcon className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Activity & Posture Distribution
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* 58% Normal */}
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="100" />
                {/* 24% Walking */}
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="180" />
                {/* 11% Sitting */}
                <circle cx="50" cy="50" r="38" stroke="#6366f1" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="212" />
                {/* 5% Stumble */}
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="226" />
                {/* 2% Fall */}
                <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="234" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black font-mono text-white">99%</span>
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Uptime</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-1.5 text-xs">
              {donutData.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 text-[11px]">{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-400 text-[11px]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-2">
            Aggregated across 168 hours of continuous simulated subject observation.
          </p>
        </div>
      </div>

      {/* Line Chart: Response Speed & Confidence Curve */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency Dispatch Latency & False Alarm Trend Line
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Target SLA: &lt; 5.0 seconds from impact
          </span>
        </div>

        <div className="h-44 w-full relative pt-2">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_28px] opacity-40"></div>

          <svg viewBox="0 0 600 120" className="w-full h-full overflow-visible">
            {/* Target line */}
            <line x1="0" y1="50" x2="600" y2="50" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />

            {/* SLA line */}
            <path
              d="M 20 85 Q 120 70 200 65 T 380 40 T 480 35 T 580 30"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Data points */}
            {[
              [20, 85, '5.2s'],
              [120, 70, '4.6s'],
              [200, 65, '4.1s'],
              [380, 40, '3.8s'],
              [480, 35, '3.6s'],
              [580, 30, '3.4s']
            ].map(([cx, cy, label], idx) => (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="4" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                <text x={cx} y={cy - 8} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  {label}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Day 1 (Baseline)</span>
            <span>Day 3</span>
            <span>Day 5</span>
            <span>Day 7 (Optimized: 3.4s)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
