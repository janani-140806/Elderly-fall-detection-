import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  initPoseDetector,
  estimatePoses,
  FallDetectionAnalyzer,
  drawPoseOnCanvas,
  DEFAULT_DETECTION_THRESHOLDS
} from '../../services/poseDetectionService';
import {
  Camera,
  Video,
  VideoOff,
  ShieldAlert,
  Play,
  Pause,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  RotateCcw,
  Cpu,
  Layers,
  Info
} from 'lucide-react';

export default function RealTimeWebcamDetector({ onFallDetected, onMetricsUpdate, onCameraStateChange }) {
  const {
    activePatient,
    startVerificationCountdown,
    triggerEmergencyResponse,
    confirmUserSafe,
    countdownActive,
    countdownSeconds,
    notify
  } = useApp();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const analyzerRef = useRef(new FallDetectionAnalyzer());

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Real-time Detection State Display
  const [detectionState, setDetectionState] = useState({
    state: 'NORMAL / STANDING',
    stateLabel: 'NORMAL / STANDING',
    stateColor: 'emerald',
    activity: 'Standing',
    fallScore: 0,
    isFall: false,
    metrics: {
      bodyAngle: 6,
      centerOfMassY: 48,
      aspectRatio: 2.1,
      dropVelocity: 0.02,
      dropMagnitude: 0.01
    }
  });

  // Configurable Thresholds Sandbox (Testing & Professor Tuning)
  const [thresholds, setThresholds] = useState(DEFAULT_DETECTION_THRESHOLDS);
  const [showConfig, setShowConfig] = useState(false);

  // Update analyzer when thresholds change
  useEffect(() => {
    if (analyzerRef.current) {
      analyzerRef.current.updateThresholds(thresholds);
    }
  }, [thresholds]);

  // Start Camera and Video Processing Loop
  const startCamera = async () => {
    setCameraError(null);
    setIsLoadingModel(true);

    try {
      // 1. Initialize MoveNet Pose Model
      await initPoseDetector();
      setModelReady(true);
      setIsLoadingModel(false);

      // 2. Request User Webcam Permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraActive(true);
          if (onCameraStateChange) onCameraStateChange(true);
          notify('safe', 'Live Webcam Active', 'MoveNet pose tracking engaged at real-time 30+ FPS.');
          startDetectionLoop();
        };
      }
    } catch (err) {
      console.error('Camera / Model initialization error:', err);
      setIsLoadingModel(false);
      setIsCameraActive(false);
      if (onCameraStateChange) onCameraStateChange(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Webcam permission denied. Please allow camera access in browser settings.');
      } else {
        setCameraError(`Unable to start camera: ${err.message || 'Device error'}`);
      }
    }
  };

  // Stop Camera cleanly
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    if (onCameraStateChange) onCameraStateChange(false);
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    notify('info', 'Webcam Stopped', 'Camera feed and inference loop paused.');
  };

  // Continuous Inference Loop across Incoming Video Frames
  const startDetectionLoop = useCallback(() => {
    let lastFallTriggerTime = 0;
    let lastUiUpdateTime = 0;
    let lastReportedState = 'NORMAL / STANDING';

    const runFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState < 2 || video.paused || video.ended) {
        animationFrameRef.current = requestAnimationFrame(runFrame);
        return;
      }

      try {
        // Run MoveNet Model on Video Frame
        const poses = await estimatePoses(video);

        if (poses && poses.length > 0) {
          const pose = poses[0];
          const result = analyzerRef.current.processPose(
            pose,
            video.videoWidth || 640,
            video.videoHeight || 480
          );

          // Draw Pose Skeleton & Bounding Box on Overlay Canvas on every frame
          const ctx = canvas.getContext('2d');
          drawPoseOnCanvas(
            ctx,
            pose.keypoints,
            video.videoWidth || 640,
            video.videoHeight || 480,
            result
          );

          // Update UI state (throttled to avoid React re-render churn, but instant on state change or fall)
          const now = Date.now();
          if (now - lastUiUpdateTime > 100 || result.isFall || result.state !== lastReportedState) {
            lastUiUpdateTime = now;
            lastReportedState = result.state;
            setDetectionState(result);
            if (onMetricsUpdate && result.metrics) {
              onMetricsUpdate(result.metrics, result);
            }
          }

          // Check Fall Trigger (Rate-limited to prevent double triggers)
          if (result.isFall && now - lastFallTriggerTime > 12000) {
            lastFallTriggerTime = now;
            notify('emergency', `⚠️ REAL FALL DETECTED (${result.fallScore}%)`, 'Sudden downward velocity and horizontal posture verified in live webcam!');
            if (onFallDetected) {
              onFallDetected(result);
            }
            startVerificationCountdown(`Actual Live Camera Fall Detected for ${activePatient.name}`);
          }
        }
      } catch (err) {
        console.warn('Frame processing exception:', err);
      }

      animationFrameRef.current = requestAnimationFrame(runFrame);
    };

    animationFrameRef.current = requestAnimationFrame(runFrame);
  }, [activePatient.name, onFallDetected, onMetricsUpdate, startVerificationCountdown, notify]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, []);

  // Badge colors based on state
  let stateBadgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  if (detectionState.state === 'FALL DETECTED') {
    stateBadgeStyle = 'bg-red-500/20 text-red-300 border-red-500 glow-red animate-pulse-fast font-black';
  } else if (detectionState.state === 'POSSIBLE FALL') {
    stateBadgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber';
  } else if (detectionState.state === 'WALKING') {
    stateBadgeStyle = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  } else if (detectionState.state === 'SITTING / BENDING') {
    stateBadgeStyle = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
  }

  return (
    <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              <span>LIVE WEBCAM POSE & FALL DETECTOR</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              MOVENET LIGHTNING (REAL-TIME)
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Analyzes your actual laptop webcam frames in real time to detect physical falls
          </p>
        </div>

        {/* Start / Stop Camera Action Buttons */}
        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              disabled={isLoadingModel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs transition-all shadow-lg shadow-blue-900/40 glow-blue"
            >
              <Video className="w-4 h-4" />
              <span>{isLoadingModel ? 'Loading MoveNet Model...' : 'START CAMERA'}</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md"
            >
              <VideoOff className="w-4 h-4" />
              <span>STOP CAMERA</span>
            </button>
          )}

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
              showConfig ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Adjust detection thresholds"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video & Canvas Overlay Viewport */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 aspect-video min-h-[320px] max-h-[460px] flex items-center justify-center">
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Canvas for Detected Skeleton, Keypoint Dots and Bounding Box */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`absolute inset-0 w-full h-full pointer-events-none ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Placeholder when Camera is Inactive */}
        {!isCameraActive && (
          <div className="text-center p-6 space-y-3 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
              <Camera className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-white">Live Camera Standby</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click <strong>START CAMERA</strong> above. Stand, walk, and sit in front of the lens. When an actual rapid fall occurs, the model detects the sudden vertical drop and horizontal posture automatically.
            </p>
            {cameraError && (
              <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs">
                ⚠️ {cameraError}
              </div>
            )}
          </div>
        )}

        {/* Real-Time Live Overlay Badge */}
        {isCameraActive && (
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border backdrop-blur-md shadow-lg ${stateBadgeStyle}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              <span>{detectionState.stateLabel}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur border border-slate-700 text-[10px] font-mono text-slate-300">
              Fall Score: <strong className={detectionState.fallScore > 75 ? 'text-red-400' : 'text-emerald-400'}>{detectionState.fallScore}%</strong>
            </div>
          </div>
        )}

        {/* Live Metrics Floating Capsule (Bottom Left) */}
        {isCameraActive && detectionState.metrics && (
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-300 bg-slate-950/85 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800 space-y-0.5">
            <div>Spine Tilt Angle: <strong className="text-teal-400">{detectionState.metrics.bodyAngle}°</strong></div>
            <div>Aspect Ratio (H/W): <strong className="text-blue-400">{detectionState.metrics.aspectRatio}</strong></div>
            <div>Floor Proximity: <strong className="text-indigo-400">{detectionState.metrics.centerOfMassY}%</strong></div>
          </div>
        )}

        {/* Camera Notice Footnote */}
        <div className="absolute bottom-3 right-3 text-[9px] text-slate-400 bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800">
          Inference running locally on device via WebGL
        </div>
      </div>

      {/* Detection States Reference Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3 text-xs">
        <div className={`p-2 rounded-xl border text-center transition-all ${
          detectionState.state === 'NORMAL / STANDING'
            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 glow-emerald font-bold'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] block">🟢 NORMAL</span>
          <span>Standing</span>
        </div>

        <div className={`p-2 rounded-xl border text-center transition-all ${
          detectionState.state === 'SITTING / BENDING'
            ? 'bg-yellow-950/70 border-yellow-500 text-yellow-300 font-bold'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] block">🟡 SITTING</span>
          <span>Bending / Chair</span>
        </div>

        <div className={`p-2 rounded-xl border text-center transition-all ${
          detectionState.state === 'WALKING'
            ? 'bg-blue-950/70 border-blue-500 text-blue-300 font-bold'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] block">🔵 WALKING</span>
          <span>Gait Cadence</span>
        </div>

        <div className={`p-2 rounded-xl border text-center transition-all ${
          detectionState.state === 'POSSIBLE FALL'
            ? 'bg-amber-950/70 border-amber-500 text-amber-300 glow-amber font-bold'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] block">🟠 WARNING</span>
          <span>Possible Fall</span>
        </div>

        <div className={`p-2 rounded-xl border text-center transition-all col-span-2 sm:col-span-1 ${
          detectionState.state === 'FALL DETECTED'
            ? 'bg-red-950/90 border-red-500 text-red-200 glow-red animate-pulse-fast font-black'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] block text-red-400">🔴 FALL DETECTED</span>
          <span>Confirmed Fall</span>
        </div>
      </div>

      {/* Configurable Threshold Tuning Drawer (Section 6) */}
      {showConfig && (
        <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-indigo-500/40 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Real Fall Detection Algorithm Threshold Calibration
            </span>
            <button
              onClick={() => setThresholds(DEFAULT_DETECTION_THRESHOLDS)}
              className="text-[11px] text-blue-400 hover:underline"
            >
              Reset to Recommended
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Drop Velocity Threshold</span>
                <span className="font-mono text-blue-400">{thresholds.dropVelocityThreshold} /s</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.02"
                value={thresholds.dropVelocityThreshold}
                onChange={(e) => setThresholds({ ...thresholds, dropVelocityThreshold: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
              <span className="text-[9px] text-slate-500">Lower = more sensitive to slow falls</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Horizontal Angle Threshold</span>
                <span className="font-mono text-teal-400">{thresholds.horizontalAngleThreshold}°</span>
              </div>
              <input
                type="range"
                min="45"
                max="80"
                step="1"
                value={thresholds.horizontalAngleThreshold}
                onChange={(e) => setThresholds({ ...thresholds, horizontalAngleThreshold: parseInt(e.target.value) })}
                className="w-full accent-teal-500"
              />
              <span className="text-[9px] text-slate-500">Angle from vertical to consider horizontal</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Confidence Trigger</span>
                <span className="font-mono text-red-400">{thresholds.confidenceTriggerThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="1"
                value={thresholds.confidenceTriggerThreshold}
                onChange={(e) => setThresholds({ ...thresholds, confidenceTriggerThreshold: parseInt(e.target.value) })}
                className="w-full accent-red-500"
              />
              <span className="text-[9px] text-slate-500">Minimum score to fire alert</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
