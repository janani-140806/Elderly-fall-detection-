import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RealTimeWebcamDetector from '../monitoring/RealTimeWebcamDetector';
import SimulatedVisionFeed from '../monitoring/SimulatedVisionFeed';
import RealHardwareSensorCard from '../monitoring/RealHardwareSensorCard';
import PresentationModeComparison from '../monitoring/PresentationModeComparison';
import FallDetectionLogicCard from '../common/FallDetectionLogicCard';
import GenAIExplanationCard from '../common/GenAIExplanationCard';
import IoTIntegrationPanel from '../common/IoTIntegrationPanel';
import PrototypeBadge from '../common/PrototypeBadge';
import TelemetryWaveformChart from '../common/TelemetryWaveformChart';
import {
  Play,
  Pause,
  Camera,
  Video,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Cpu,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function LiveMonitoringPage() {
  const {
    activePatient,
    isMonitoringPaused,
    setIsMonitoringPaused,
    setSystemStatus,
    triggerScenario,
    setActiveTab,
    currentActivity,
    setCurrentActivity,
    sensorData,
    setSensorData,
    addEvent
  } = useApp();

  // Mode: 'webcam' (Default Real Webcam Input) | 'simulated' (Canvas Animation Lab)
  const [feedMode, setFeedMode] = useState('webcam');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Shared state for the demo fall sequence across camera and hardware sensor card
  const [demoFallStage, setDemoFallStage] = useState('idle'); // 'idle' | 'during' | 'after'
  const [showArchComparison, setShowArchComparison] = useState(true);

  // Telemetry metrics from live webcam detection
  const [latestMetrics, setLatestMetrics] = useState({
    bodyAngle: 6,
    centerOfMassY: 48,
    aspectRatio: 2.1,
    dropVelocity: 0.02,
    dropMagnitude: 0.01
  });
  const [lastFallData, setLastFallData] = useState(null);

  const handleStopMonitoring = () => {
    setIsMonitoringPaused(true);
    setSystemStatus('PAUSED');
  };

  const handleResumeMonitoring = () => {
    setIsMonitoringPaused(false);
    setSystemStatus('ACTIVE');
  };

  // Called when real webcam detects physical fall kinematics
  const handleFallDetected = (result) => {
    setLatestMetrics(result.metrics);
    setLastFallData(result);
    setDemoFallStage('during');
    setCurrentActivity('FALL DETECTED');

    // Update sensor data to mirror the fall event on the telemetry dashboard
    setSensorData(prev => ({
      ...prev,
      acceleration: 2.87,
      bodyAngle: result.metrics?.bodyAngle || 82,
      movement: 'Abnormal / Sudden Downward Drop',
      impact: 'CRITICAL IMPACT SPIKE DETECTED',
      fallConfidence: result.fallScore || 94,
      severity: 'Critical',
      status: 'FALL DETECTED'
    }));

    // Log the actual live webcam fall into audit event history
    addEvent({
      patientId: activePatient.id,
      patientName: activePatient.name,
      activity: 'Fall (Live Webcam MoveNet)',
      detection: `Rapid Drop (${result.metrics?.dropVelocity || 0.42}/s) + Tilt (${result.metrics?.bodyAngle || 82}°)`,
      confidence: result.fallScore || 94,
      severity: 'High',
      response: `10s Verification Siren Triggered for ${activePatient.name}`,
      status: 'Verification Pending',
      signals: [
        `Downward Velocity: ${result.metrics?.dropVelocity || 0.42} frame-h/sec`,
        `Spine Incline Angle: ${result.metrics?.bodyAngle || 82}°`,
        `Aspect Ratio (H/W): ${result.metrics?.aspectRatio || 0.88}`,
        `Floor Proximity: ${result.metrics?.centerOfMassY || 84}%`,
        `AI Model: MoveNet SinglePose Lightning (WebGL)`
      ]
    });

    // Shift to 'after' stage (low post-impact velocity / lying down)
    setTimeout(() => {
      setDemoFallStage('after');
      setSensorData(prev => ({
        ...prev,
        acceleration: 0.91,
        movement: 'Low / Horizontal Immobility',
        status: 'IMMOBILE / PENDING HELP'
      }));
    }, 1500);
  };

  // Called on throttled pose updates from the webcam
  const handleMetricsUpdate = (metrics, result) => {
    setLatestMetrics(metrics);
    if (!result) return;

    // Only update non-fall activities if no emergency/fall is actively triggered
    if (demoFallStage === 'idle' && !isMonitoringPaused) {
      if (result.state === 'WALKING') {
        setCurrentActivity('WALKING');
        setSensorData(prev => ({
          ...prev,
          acceleration: 1.15,
          bodyAngle: metrics.bodyAngle || 6,
          movement: 'Walking Gait Cadence',
          status: 'SAFE',
          fallConfidence: 8
        }));
      } else if (result.state === 'SITTING / BENDING') {
        setCurrentActivity('SITTING');
        setSensorData(prev => ({
          ...prev,
          acceleration: 0.98,
          bodyAngle: metrics.bodyAngle || 24,
          movement: 'Sitting Down / Bending',
          status: 'SAFE',
          fallConfidence: 18
        }));
      } else if (result.state === 'NORMAL / STANDING') {
        setCurrentActivity('NORMAL');
        setSensorData(prev => ({
          ...prev,
          acceleration: 1.02,
          bodyAngle: metrics.bodyAngle || 6,
          movement: 'Upright Stable',
          status: 'SAFE',
          fallConfidence: 4
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Main Header with Architecture Designation & Mode Switcher */}
      <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-400" />
              <span>🎥 LIVE FALL DETECTION DEMO</span>
            </h2>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono tracking-wider">
              DEMO INPUT — CAMERA
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono tracking-wider">
              MOVENET AI (LIGHTNING)
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-300">
            Visual demonstration of the motion-sensor-based fall detection workflow using real webcam frames
          </p>
        </div>

        {/* Input Mode Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Feed Mode Toggle: Real Webcam vs Canvas Simulation */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFeedMode('webcam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                feedMode === 'webcam'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Real Webcam (AI)</span>
            </button>
            <button
              onClick={() => setFeedMode('simulated')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                feedMode === 'simulated'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Canvas Simulation</span>
            </button>
          </div>

          <button
            onClick={() => setShowArchComparison(!showArchComparison)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              showArchComparison
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showArchComparison ? 'Hide Architecture Guide' : 'Show Architecture Guide'}</span>
          </button>

          {isMonitoringPaused ? (
            <button
              onClick={handleResumeMonitoring}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={handleStopMonitoring}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 active:scale-95"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Presentation Architecture Comparison */}
      {showArchComparison && <PresentationModeComparison />}

      {/* IoT Multimodal Integration Panel */}
      <IoTIntegrationPanel
        cameraActive={isCameraActive || feedMode === 'simulated'}
        fallActive={demoFallStage === 'during' || demoFallStage === 'after'}
      />

      {/* Main Grid: Left = Visual Demo Feed (Camera or Simulation), Right = Real Hardware Sensor Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Visual Demonstration Feed (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {feedMode === 'webcam' ? (
            <RealTimeWebcamDetector
              onFallDetected={handleFallDetected}
              onMetricsUpdate={handleMetricsUpdate}
              onCameraStateChange={setIsCameraActive}
            />
          ) : (
            <SimulatedVisionFeed
              demoFallStage={demoFallStage}
              setDemoFallStage={setDemoFallStage}
            />
          )}

          {/* Real-time Telemetry Waveform */}
          <TelemetryWaveformChart />

          {/* GenAI Clinical Reasoning Module */}
          <GenAIExplanationCard
            fallData={lastFallData}
            metrics={latestMetrics}
            patientName={activePatient.name}
            isFallActive={demoFallStage === 'during' || demoFallStage === 'after'}
          />
        </div>

        {/* Right Side: Real Hardware Sensor (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real Hardware Sensor Representation (MPU-6050 Accelerometer/Gyroscope on ESP32) */}
          <RealHardwareSensorCard demoFallStage={demoFallStage} />

          {/* Fall Detection Logic Card */}
          <FallDetectionLogicCard />

          {/* Quick Scenario Injectors */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Simulated Motion Scenarios
              </span>
              <button
                onClick={() => setActiveTab('simulation')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Open Full Lab →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setDemoFallStage('idle');
                  triggerScenario('NORMAL');
                }}
                className="py-2 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                Normal
              </button>
              <button
                onClick={() => {
                  setDemoFallStage('idle');
                  triggerScenario('WALKING');
                }}
                className="py-2 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                Walking
              </button>
              <button
                onClick={() => {
                  setDemoFallStage('idle');
                  triggerScenario('SUDDEN_MOVEMENT');
                }}
                className="py-2 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
              >
                Stumble
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
