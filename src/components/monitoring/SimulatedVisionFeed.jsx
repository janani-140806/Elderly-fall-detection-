import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  ShieldAlert,
  Eye,
  Video,
  VideoOff,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';

export default function SimulatedVisionFeed({
  onDemoFallStart,
  demoFallStage = 'idle',
  setDemoFallStage
}) {
  const {
    currentActivity,
    sensorData,
    isMonitoringPaused,
    triggerScenario,
    startVerificationCountdown,
    notify
  } = useApp();

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);

  // Fall demo local animation step
  const [visualFallStep, setVisualFallStep] = useState(0); // 0=normal, 1=abnormal movement, 2=simulated sensor event, 3=fall detected

  // Web camera activation effect
  useEffect(() => {
    let stream = null;
    if (useWebcam) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setWebcamActive(true);
          setWebcamError(null);
          notify('info', 'Webcam Connected', 'Using live laptop camera as visual software demo input.');
        })
        .catch((err) => {
          console.warn('Webcam access error:', err);
          setWebcamActive(false);
          setWebcamError('Camera access not granted or unavailable. Switched to Synthetic Avatar.');
          setUseWebcam(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setWebcamActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [useWebcam, notify]);

  // Animated human stick figure / skeleton rendering when synthetic avatar mode is active
  useEffect(() => {
    if (useWebcam && webcamActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let tick = 0;

    const render = () => {
      tick += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Dark surveillance background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Floor reference line
      const groundY = height - 50;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, groundY);
      ctx.lineTo(width - 30, groundY);
      ctx.stroke();

      if (isMonitoringPaused) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DEMONSTRATION FEED PAUSED', width / 2, height / 2);
        return;
      }

      const centerX = width / 2;

      // Pose configuration based on activity and demoFallStage
      let headX = centerX;
      let headY = groundY - 140;
      let shoulderY = groundY - 115;
      let hipX = centerX;
      let hipY = groundY - 75;
      let leftFootX = centerX - 15;
      let leftFootY = groundY;
      let rightFootX = centerX + 15;
      let rightFootY = groundY;
      let leftHandX = centerX - 25;
      let leftHandY = groundY - 85;
      let rightHandX = centerX + 25;
      let rightHandY = groundY - 85;

      let poseColor = '#10b981';
      let boxColor = 'rgba(16, 185, 129, 0.4)';
      let boxText = 'PERSON DETECTED: STABLE';

      const isFalling = demoFallStage === 'during' || currentActivity === 'FALL SEQUENCE';
      const isFallen = demoFallStage === 'after' || currentActivity === 'FALL DETECTED' || currentActivity === 'NO MOVEMENT';

      if (isFalling) {
        headX = centerX + 50;
        headY = groundY - 35;
        shoulderY = groundY - 25;
        hipX = centerX;
        hipY = groundY - 15;
        leftFootX = centerX - 60;
        rightFootX = centerX - 45;
        leftHandX = centerX + 70;
        leftHandY = groundY - 10;
        rightHandX = centerX + 40;
        rightHandY = groundY - 10;
        boxColor = 'rgba(239, 68, 68, 0.8)';
        poseColor = '#f87171';
        boxText = 'ABNORMAL MOVEMENT: DESCENT';
      } else if (isFallen) {
        headX = centerX + 65;
        headY = groundY - 15;
        shoulderY = groundY - 12;
        hipX = centerX;
        hipY = groundY - 8;
        leftFootX = centerX - 70;
        rightFootX = centerX - 60;
        leftFootY = groundY - 5;
        rightFootY = groundY - 5;
        leftHandX = centerX + 80;
        leftHandY = groundY - 5;
        rightHandX = centerX + 30;
        rightHandY = groundY - 5;

        boxColor = 'rgba(239, 68, 68, 0.9)';
        poseColor = '#ef4444';
        boxText = 'FALL DETECTED: HORIZONTAL (84°)';

        // Ground impact waves
        const rippleR = (tick * 20) % 60;
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - rippleR / 60})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(centerX + 20, groundY, rippleR, rippleR * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (currentActivity === 'WALKING') {
        const walkCycle = Math.sin(tick * 3);
        const legSwing = walkCycle * 22;
        headY += Math.abs(walkCycle) * 3;
        leftFootX = centerX + legSwing;
        rightFootX = centerX - legSwing;
        leftHandX = centerX - legSwing * 0.8;
        rightHandX = centerX + legSwing * 0.8;
        boxColor = 'rgba(16, 185, 129, 0.6)';
        poseColor = '#34d399';
        boxText = 'MOVEMENT: NORMAL (WALKING)';
      } else if (currentActivity === 'SITTING') {
        headY = groundY - 95;
        shoulderY = groundY - 75;
        hipY = groundY - 45;
        leftFootX = centerX + 30;
        rightFootX = centerX + 30;
        boxColor = 'rgba(59, 130, 246, 0.5)';
        poseColor = '#60a5fa';
        boxText = 'BODY MOTION: SEATED';
      } else if (currentActivity === 'SUDDEN MOVEMENT') {
        headX = centerX + 35;
        headY = groundY - 110;
        hipX = centerX + 10;
        boxColor = 'rgba(245, 158, 11, 0.7)';
        poseColor = '#fbbf24';
        boxText = 'MOVEMENT: SUDDEN / UNSTABLE';
      } else {
        const breathing = Math.sin(tick) * 2;
        headY += breathing;
        shoulderY += breathing;
      }

      // Draw Synthetic Bounding Box & Skeleton
      const minX = Math.min(headX, hipX, leftFootX, rightFootX) - 25;
      const maxX = Math.max(headX, hipX, leftFootX, rightFootX) + 25;
      const minY = Math.min(headY) - 20;
      const maxY = groundY + 5;

      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

      ctx.fillStyle = boxColor;
      ctx.fillRect(minX, minY - 18, Math.max(160, (maxX - minX)), 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(boxText, minX + 4, minY - 5);

      // Skeleton joints
      ctx.strokeStyle = poseColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(headX, shoulderY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftHandX, leftHandY);
      ctx.lineTo(headX, shoulderY);
      ctx.lineTo(rightHandX, rightHandY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftFootX, leftFootY);
      ctx.lineTo(hipX, hipY);
      ctx.lineTo(rightFootX, rightFootY);
      ctx.stroke();

      ctx.fillStyle = poseColor;
      ctx.beginPath();
      ctx.arc(headX, headY, 10, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentActivity, isMonitoringPaused, useWebcam, webcamActive, demoFallStage]);

  // Execute the requested demonstration fall sequence
  const handleTriggerDemoFall = () => {
    if (setDemoFallStage) setDemoFallStage('during');
    setVisualFallStep(1);

    notify('warning', 'CAMERA DEMO: Abnormal Movement', 'Camera detected rapid downward displacement. Triggering conceptual motion sensor equivalent.');

    // Step 2: Simulated Motion Sensor Event (1.2s)
    setTimeout(() => {
      setVisualFallStep(2);
    }, 1200);

    // Step 3: Fall Confirmed (2.4s)
    setTimeout(() => {
      setVisualFallStep(3);
      if (setDemoFallStage) setDemoFallStage('after');
      triggerScenario('FALL');
    }, 2400);
  };

  // Determine current display values
  const isFallActive = demoFallStage === 'after' || currentActivity === 'FALL DETECTED';
  const isDuringFall = demoFallStage === 'during' || currentActivity === 'FALL SEQUENCE';

  const cameraStatusText = isMonitoringPaused ? 'PAUSED' : 'ACTIVE';
  const personStatusText = isFallActive ? 'HORIZONTAL ON FLOOR' : isDuringFall ? 'FALLING DESCENT' : 'DETECTED';
  const movementStatusText = isFallActive ? 'LOW / IMMOBILE' : isDuringFall ? 'SUDDEN ABNORMAL' : currentActivity === 'WALKING' ? 'CADENCE (NORMAL)' : 'NORMAL';
  const bodyMotionStatusText = isFallActive ? 'HORIZONTAL (84° TILT)' : isDuringFall ? 'RAPID ANGULAR SHIFT' : currentActivity === 'SITTING' ? 'SEATED' : 'STABLE';

  return (
    <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden">
      {/* Feed Header with Exact Requested Labels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              <span>🎥 LIVE FALL DETECTION DEMO</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 tracking-wider">
              DEMO INPUT — CAMERA
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Visual demonstration of the motion-sensor-based fall detection workflow
          </p>
        </div>

        {/* Toggle Real Laptop Webcam vs Synthetic Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseWebcam(!useWebcam)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              useWebcam
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Toggle between laptop webcam and simulated avatar"
          >
            {useWebcam ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            <span>{useWebcam ? 'Using Laptop Webcam' : 'Use Laptop Webcam'}</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Container (Webcam or Canvas) */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 min-h-[310px] flex items-center justify-center">
        {useWebcam && webcamActive ? (
          <div className="relative w-full h-full min-h-[310px] flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover min-h-[310px]"
            />
            {/* Live pose bounding box overlay */}
            <div className="absolute inset-8 border-2 border-emerald-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-500/90 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  LIVE WEBCAM POSE: {personStatusText}
                </span>
                <span className="bg-slate-900/80 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                  DEMO SENSOR TRANSLATOR ACTIVE
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-700 w-fit">
                Motion Index: {movementStatusText}
              </div>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={520}
            height={310}
            className="w-full h-full object-cover"
          />
        )}

        {/* Live overlay badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-blue-300">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>LIVE VISUAL DEMO • CAMERA {cameraStatusText}</span>
        </div>

        {/* Action Button: [🧪 DEMO FALL] */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={handleTriggerDemoFall}
            disabled={isDuringFall}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs transition-all shadow-xl shadow-red-900/50 glow-red border border-red-400"
          >
            <span className="text-base">🧪</span>
            <span>DEMO FALL</span>
          </button>
        </div>

        {/* Floating transparency notice */}
        <div className="absolute bottom-3 left-3 text-[9px] text-slate-400 bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800">
          DEMO INPUT ONLY • The camera is NOT the actual hardware sensor.
        </div>
      </div>

      {/* Visual Demo Status Readout Table */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3 text-xs">
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold block">Camera</span>
          <span className="font-bold text-emerald-400 font-mono">{cameraStatusText}</span>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold block">Person</span>
          <span className="font-bold text-white font-mono truncate block">{personStatusText}</span>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold block">Movement</span>
          <span className={`font-bold font-mono ${isDuringFall ? 'text-amber-400' : isFallActive ? 'text-red-400' : 'text-emerald-400'}`}>
            {movementStatusText}
          </span>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold block">Body Motion</span>
          <span className="font-bold text-white font-mono truncate block">{bodyMotionStatusText}</span>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-xl border border-blue-500/30 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-blue-400 font-bold block">Demo Input</span>
          <span className="font-bold text-blue-300 font-mono">CAMERA</span>
        </div>
      </div>

      {/* Conceptual Sensor Equivalent Flow when Demo Fall is Triggered */}
      {(visualFallStep > 0 || isFallActive) && (
        <div className="p-3.5 bg-red-950/70 border border-red-500/60 rounded-xl mb-3 glow-red animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
              🚨 FALL DETECTED (Confidence: 94%)
            </span>
            <span className="text-[10px] font-mono text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-500/40">
              Source: Visual Demo → Motion Sensor Equivalent
            </span>
          </div>

          <div className="text-[10px] font-mono text-red-200/90 flex flex-wrap items-center gap-1 leading-snug">
            <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">CAMERA DEMO EVENT</span>
            <span>→</span>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">ABNORMAL MOVEMENT DETECTED</span>
            <span>→</span>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">SIMULATED MOTION SENSOR EVENT</span>
            <span>→</span>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">FALL DETECTION ALGORITHM</span>
            <span>→</span>
            <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">FALL CONFIRMED</span>
            <span>→</span>
            <span className="bg-red-700 text-white font-bold px-1.5 py-0.5 rounded">EMERGENCY RESPONSE</span>
          </div>
        </div>
      )}

      {/* Presentation Explanation Card */}
      <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
          <span>💡 WHY CAMERA IN DEMO?</span>
        </div>
        <p className="text-slate-400">
          "The actual SafeFall AI hardware prototype is designed around motion-sensor/IMU data. The camera is used here only as a visual demonstration interface to make the fall-detection process easy to observe during evaluation."
        </p>
      </div>
    </div>
  );
}
