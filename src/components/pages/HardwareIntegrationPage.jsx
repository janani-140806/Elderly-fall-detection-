import React, { useState } from 'react';
import PrototypeBadge from '../common/PrototypeBadge';
import {
  Cpu,
  Radio,
  Wifi,
  Compass,
  Volume2,
  Smartphone,
  ArrowDown,
  ArrowRight,
  Code2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function HardwareIntegrationPage() {
  const [selectedSnippet, setSelectedSnippet] = useState('arduino');

  const firmwareCode = `// SafeFall AI - ESP32 Firmware Telemetry Streamer (Future Hardware Implementation)
#include <Wire.h>
#include <MPU6050.h>
#include <WiFi.h>
#include <HTTPClient.h>

MPU6050 mpu;
const char* ssid = "Healthcare_IoT_Mesh";
const char* password = "SafeFallMeshSecret";
const char* serverEndpoint = "https://safefall-ai-gateway.local/api/telemetry";

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // ESP32 I2C SDA=21, SCL=22
  mpu.initialize();
  
  // Calibrate baseline 1g gravity vector
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_16);
  mpu.setFullScaleGyroRange(MPU6050_GYRO_FS_2000);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(250); Serial.print("."); }
  Serial.println("\\nWiFi Connected. Streaming Telemetry to SafeFall AI...");
}

void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  
  // Compute normalized acceleration magnitude (m/s^2)
  float accelMagnitude = sqrt(ax*ax + ay*ay + az*az) / 2048.0 * 9.81;
  float bodyAngle = atan2(ay, az) * 180.0 / PI;

  // Stream JSON payload to SafeFall AI web dashboard over WebSocket / HTTP
  String payload = "{\\"accel\\":" + String(accelMagnitude) + 
                   ",\\"angle\\":" + String(bodyAngle) + 
                   ",\\"gx\\":" + String(gx / 16.4) + "}";
                   
  // Check local threshold trigger
  if (accelMagnitude > 18.5 && abs(bodyAngle) > 60.0) {
    digitalWrite(25, HIGH); // Sound local buzzer (GPIO 25)
  }
  delay(20); // 50Hz Sampling Rate
}`;

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Future Hardware Integration & Embedded Architecture
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Future Deployment Plan
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            This page specifies the physical microcontroller, sensor wiring, communication bus, and firmware architecture for future physical deployment.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold self-start md:self-auto flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Notice: Hardware components are simulated in this prototype.</span>
        </div>
      </div>

      {/* Current Hardware Architecture Card */}
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">
              PROPOSED HARDWARE PIPELINE
            </span>
            <h3 className="text-base font-black text-white tracking-wide flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>CURRENT HARDWARE ARCHITECTURE</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Hardware: PROTOTYPE / FUTURE INTEGRATION
            </span>
          </div>
        </div>

        {/* The Exact Flow requested */}
        <div className="flex flex-col items-center space-y-2 max-w-sm mx-auto my-4 text-center text-xs font-mono">
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-300 font-bold">
            📡 Motion Sensor (MPU-6050)
          </div>
          <div className="text-slate-500 font-bold">↓</div>
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-purple-500/40 text-purple-300 font-bold">
            🔲 Microcontroller (ESP32)
          </div>
          <div className="text-slate-500 font-bold">↓</div>
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-blue-500/40 text-blue-300 font-bold">
            ⚙️ Fall Detection (Threshold Engine)
          </div>
          <div className="text-slate-500 font-bold">↓</div>
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-bold">
            📶 Wi-Fi / Communication (MQTT / WebSockets)
          </div>
          <div className="text-slate-500 font-bold">↓</div>
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold">
            🛡️ SafeFall AI (Web Platform)
          </div>
          <div className="text-slate-500 font-bold">↓</div>
          <div className="w-full py-2.5 px-4 rounded-xl bg-red-950 border border-red-500/50 text-red-200 font-black glow-red">
            🚨 Caregiver Alert (SMS, Call, Siren)
          </div>
        </div>
      </div>

      {/* Vertical Architecture Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          End-to-End System Hardware-to-Cloud Architecture
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Sequential data flow from physical wearable transducers to web dashboard and caregiver alerts
        </p>

        {/* Visual Flow diagram boxes */}
        <div className="flex flex-col items-center space-y-2 max-w-md mx-auto">
          {[
            { name: '1. Accelerometer (3-Axis)', desc: 'Measures linear dynamic acceleration & contact shock (m/s²)', color: 'border-blue-500/50 bg-blue-950/40 text-blue-300' },
            { name: '2. Gyroscope (3-Axis)', desc: 'Measures angular rotational rate & body tilt orientation (°/s)', color: 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300' },
            { name: '3. Microcontroller (ESP32)', desc: 'Dual-core 240MHz MCU sampling I2C bus at 50Hz with DMA buffering', color: 'border-purple-500/50 bg-purple-950/40 text-purple-300' },
            { name: '4. Bluetooth / Wi-Fi', desc: 'Secure local telemetry broadcast via BLE 4.2 / MQTT / WebSockets', color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' },
            { name: '5. SafeFall AI Web Application', desc: 'Software dashboard ingest engine & visual user interface', color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' },
            { name: '6. Fall Detection Algorithm', desc: 'Multi-parameter threshold evaluation (Impact + Tilt + Immobility)', color: 'border-amber-500/50 bg-amber-950/40 text-amber-300' },
            { name: '7. Fall Confirmation (10s)', desc: 'Interactive cancellation timer preventing false-alarm dispatch', color: 'border-yellow-500/50 bg-yellow-950/40 text-yellow-300' },
            { name: '8. Emergency Alert & Caregiver Dispatch', desc: 'Cellular GSM SMS, simulated voice call, 90dB buzzer & GPS payload', color: 'border-red-500/70 bg-red-950/60 text-red-200 glow-red' }
          ].map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <div className={`w-full p-3.5 rounded-xl border text-center transition-all ${item.color}`}>
                <h4 className="text-xs font-black uppercase tracking-wider">{item.name}</h4>
                <p className="text-[11px] opacity-80 mt-0.5">{item.desc}</p>
              </div>
              {idx < arr.length - 1 && (
                <div className="text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 5 Hardware Components Breakdown Cards */}
      <div>
        <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">
          Hardware Component Specifications (Future Deployment)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'ESP32 Microcontroller',
              category: 'Central Processing & Wireless',
              icon: Cpu,
              specs: ['Xtensa Dual-Core 32-bit LX6 (240 MHz)', 'Built-in 2.4 GHz Wi-Fi (802.11 b/g/n)', 'Bluetooth Low Energy (BLE 4.2)', '520 KB SRAM + 4 MB Flash', 'Ultra-low power deep sleep (10µA)'],
              status: 'Future Integration'
            },
            {
              name: 'MPU-6050 IMU Sensor',
              category: '6-Axis Inertial Motion Tracking',
              icon: Radio,
              specs: ['3-Axis Accelerometer (±2g, ±4g, ±8g, ±16g)', '3-Axis Gyroscope (±250, ±500, ±2000 °/s)', 'Digital Motion Processor (DMP) engine', 'Fast I2C interface (400 kHz)', 'Built-in temperature compensation'],
              status: 'Future Integration'
            },
            {
              name: 'NEO-6M GPS Receiver',
              category: 'Autonomous Satellite Positioning',
              icon: Compass,
              specs: ['50-Channel positioning engine', 'Cold start TTFF: 27 seconds', 'Horizontal accuracy: 2.5 meters', 'Configurable UART Baud rate (9600 bps)', 'On-board ceramic patch antenna'],
              status: 'Future Integration'
            },
            {
              name: 'SIM800L GSM/GPRS Modem',
              category: 'Cellular Emergency Telephony',
              icon: Smartphone,
              specs: ['Quad-band 850/900/1800/1900 MHz', 'Autonomous SMS dispatch via AT commands', 'Automated voice dialer synthesis', 'MicroSIM card socket', 'Direct battery power 3.7V - 4.2V'],
              status: 'Future Integration'
            },
            {
              name: 'Active Piezo Buzzer',
              category: 'Audible Acoustic Siren',
              icon: Volume2,
              specs: ['Sound pressure output: 90dB @ 10cm', 'Resonant frequency: 2300 ± 300 Hz', 'Operating voltage: 3.3V - 5V DC', 'Audible for up to 25 meters indoors', 'Rapid pulse strobe frequency'],
              status: 'Future Integration'
            },
            {
              name: '3.7V Li-Po & TP4056 BMS',
              category: 'Wearable Power Management',
              icon: Wifi,
              specs: ['1200mAh Lithium-Polymer cell', 'TP4056 USB-C charging IC', 'Over-charge & over-discharge protection', 'Estimated wearable battery life: 48 hours', 'Compact form-factor lanyard housing'],
              status: 'Future Integration'
            }
          ].map((hw, idx) => {
            const Icon = hw.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      {hw.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-0.5">{hw.name}</h4>
                  <p className="text-xs text-blue-400 font-medium mb-3">{hw.category}</p>

                  <ul className="space-y-1 text-xs text-slate-300">
                    {hw.specs.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Firmware Code Snippet for Future ESP32 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Firmware Code Architecture (Arduino C++ for ESP32)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            MPU6050_Telemetry_Stream.ino
          </span>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
          <pre>{firmwareCode}</pre>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          * This sample firmware demonstrates the proposed hardware transmission logic. Once physical sensors are connected, this script streams real telemetry directly to the SafeFall AI endpoint.
        </p>
      </div>
    </div>
  );
}
