import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, Radio, Camera, ShieldAlert, CheckCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function IoTIntegrationPanel({ cameraActive = true, fallActive = false }) {
  const { sensorData, currentActivity } = useApp();
  const [esp32Connected, setEsp32Connected] = useState(false); // Default disconnected as webcam operates independently

  const isMotionDetected = currentActivity !== 'NORMAL' && currentActivity !== 'SITTING';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Multimodal IoT & Hardware Integration Status</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              HYBRID ARCHITECTURE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status of physical embedded telemetry mesh and vision inference pipeline
          </p>
        </div>

        {/* Toggle ESP32 connection for testing hybrid fusion */}
        <button
          onClick={() => setEsp32Connected(!esp32Connected)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            esp32Connected
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title="Simulate connecting physical ESP32 hardware"
        >
          {esp32Connected ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>ESP32: {esp32Connected ? 'Simulated Connected' : 'Disconnected'}</span>
        </button>
      </div>

      {/* 4 IoT Integration Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {/* ESP32 Status */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            ESP32 Microcontroller
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${esp32Connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span className={`text-xs font-mono font-bold ${esp32Connected ? 'text-emerald-400' : 'text-slate-400'}`}>
              {esp32Connected ? 'Connected (Mesh)' : 'Disconnected'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">
            {esp32Connected ? 'MQTT Telemetry 50Hz' : 'Stand-Alone Vision Active'}
          </span>
        </div>

        {/* Motion Sensor Status */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Motion Sensor (IMU)
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isMotionDetected ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className={`text-xs font-mono font-bold ${isMotionDetected ? 'text-amber-300' : 'text-emerald-400'}`}>
              {isMotionDetected ? 'Motion Detected' : 'Normal / Stable'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">
            Accel: {sensorData.acceleration} m/s²
          </span>
        </div>

        {/* Camera Status */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Camera (Pose Detection)
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`}></span>
            <span className={`text-xs font-mono font-bold ${cameraActive ? 'text-blue-300' : 'text-slate-400'}`}>
              {cameraActive ? 'Active (WebGL 30FPS)' : 'Inactive'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">
            MoveNet Lightning
          </span>
        </div>

        {/* Fall Detection Pipeline Status */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Fall Detection Engine
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${fallActive ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className={`text-xs font-mono font-bold ${fallActive ? 'text-red-400' : 'text-emerald-400'}`}>
              {fallActive ? '⚠️ ALERT ACTIVE' : 'Normal / Monitoring'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">
            Temporal Sliding Window
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        * <strong>Autonomous Fallback Architecture:</strong> The webcam continuously executes real-time pose estimation and fall detection in the browser independently, even when physical ESP32 hardware is disconnected. When ESP32 is online, accelerometer readings fuse with pose orientation for multimodal redundancy.
      </p>
    </div>
  );
}
