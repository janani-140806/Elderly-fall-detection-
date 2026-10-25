import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, ShieldAlert, Cpu, Sliders, ArrowRight } from 'lucide-react';

export default function FallDetectionLogicCard() {
  const { algorithmSignals, sensorData, settings, setActiveTab } = useApp();

  const rules = [
    {
      id: 'impact',
      label: 'High impact detected',
      subtext: `Acceleration peak (${sensorData.acceleration} m/s²) > threshold (${settings.impactThreshold || 18.5} m/s²)`,
      triggered: algorithmSignals.highImpact
    },
    {
      id: 'acceleration',
      label: 'Sudden acceleration detected',
      subtext: 'Free-fall velocity transition delta > calibrated rate',
      triggered: algorithmSignals.suddenAcceleration
    },
    {
      id: 'angle',
      label: 'Body angle changed significantly',
      subtext: `Body tilt (${sensorData.bodyAngle}°) > posture threshold (${settings.angleThreshold || 60}°)`,
      triggered: algorithmSignals.bodyAngleChanged
    },
    {
      id: 'movement',
      label: 'Movement decreased after impact',
      subtext: `Stationary state: post-impact movement is '${sensorData.movement}'`,
      triggered: algorithmSignals.movementDecreased
    }
  ];

  const triggeredCount = rules.filter(r => r.triggered).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Explainable Fall Detection Algorithm (AI Analysis)
            </h3>
            <p className="text-xs text-slate-400">
              Rule-based multi-signal evaluation • Not a certified medical diagnosis model
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Config Thresholds</span>
        </button>
      </div>

      {/* Rules evaluation checklist */}
      <div className="space-y-2.5 mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Signal Condition Checklist ({triggeredCount}/4 Triggered):
        </div>
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              rule.triggered
                ? 'bg-red-500/10 border-red-500/40 text-red-200'
                : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                rule.triggered
                  ? 'bg-red-500 text-white font-black'
                  : 'bg-slate-800 text-slate-600'
              }`}
            >
              {rule.triggered ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${rule.triggered ? 'text-white' : 'text-slate-300'}`}>
                {rule.label}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {rule.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Final AI Decision Summary */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Consensus Output
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-base font-black tracking-wide ${
              algorithmSignals.verdict === 'FALL DETECTED'
                ? 'text-red-400'
                : algorithmSignals.verdict === 'WARNING'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {algorithmSignals.verdict}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Confidence: {sensorData.fallConfidence}%
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Severity: {sensorData.severity}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 sm:max-w-xs text-left sm:text-right">
          Sensitivity Calibration: <strong className="text-slate-200">{settings.detectionSensitivity}</strong>
          <br />
          <span className="text-[11px] text-slate-500">Requires 3+ signals for critical dispatch</span>
        </div>
      </div>
    </div>
  );
}
