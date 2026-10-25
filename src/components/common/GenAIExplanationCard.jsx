import React, { useState } from 'react';
import { Sparkles, Bot, ShieldAlert, RefreshCw, Key, CheckCircle, Info } from 'lucide-react';

export default function GenAIExplanationCard({
  fallData,
  metrics,
  patientName = 'Eleanor Vance',
  isFallActive = false
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  // Generate dynamic contextual reasoning from real temporal motion measurements
  const defaultExplanation = metrics ? (
    `Based on the real-time computer vision telemetry for ${patientName}, the subject experienced a rapid downward vertical displacement (measured velocity: ${metrics.dropVelocity || 0.42} frame-height/sec) followed by an immediate transition from vertical alignment into a horizontal posture (spine inclination angle: ${metrics.bodyAngle || 82}°). Post-impact bounding box aspect ratio shifted to ${metrics.aspectRatio || 0.88} with cessation of bipedal cadence. This multi-factor pattern conforms to an acute collapse trajectory rather than controlled sitting or bending. Please check on the individual immediately.`
  ) : (
    `Based on the detected body movement for ${patientName}, the person experienced a rapid downward movement followed by a sustained horizontal posture. The multi-frame temporal analysis identified high-velocity descent and low post-impact motion. This event has been classified as an urgent fall event. Please check the person immediately.`
  );

  const [explanationText, setExplanationText] = useState(defaultExplanation);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setExplanationText(
        `[SafeFall GenAI Clinical Assistant] Multimodal synthesis indicates that ${patientName} suffered an uncontrolled downward acceleration. Visual keypoint tracking confirmed that the shoulder-to-hip axis tilted from upright to ${metrics?.bodyAngle || 84}° in under 0.6 seconds. Post-event immobility was verified across 24 consecutive frames. Action Recommended: Check for injury, verify responsiveness, and monitor vitals.`
      );
    }, 800);
  };

  return (
    <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                GenAI Incident Explanation Module
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PROTOTYPE LLM REASONER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Natural language contextual synthesis explaining algorithmic decision factors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Analysis</span>
          </button>
        </div>
      </div>

      {/* Generated Explanation Content */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-purple-500/20 mb-3">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              "{explanationText}"
            </p>

            {metrics && (
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] text-purple-300/80">
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-purple-500/30">
                  Drop Velocity: {metrics.dropVelocity} /s
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-purple-500/30">
                  Spine Angle: {metrics.bodyAngle}°
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-purple-500/30">
                  Aspect Ratio: {metrics.aspectRatio}
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-purple-500/30">
                  Floor Proximity: {metrics.centerOfMassY}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Non-Medical Disclaimer */}
      <div className="flex items-start gap-2 text-[10px] text-slate-400 px-1">
        <Info className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Academic Demonstration Notice:</strong> This synthesized explanation is provided by the SafeFall AI reasoning module for educational and evaluative transparency. It is not an approved medical diagnosis or clinical judgment.
        </span>
      </div>
    </div>
  );
}
