import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import SimulatedLocationCard from '../common/SimulatedLocationCard';
import {
  ShieldAlert,
  PhoneCall,
  RotateCw,
  CheckCircle,
  MessageSquare,
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  X,
  PhoneForwarded,
  Info,
  Smartphone,
  ExternalLink,
  Send
} from 'lucide-react';

export default function EmergencyResponsePage() {
  const {
    isEmergencyActive,
    emergencyDetails,
    dispatches,
    settings,
    resetEmergency,
    triggerEmergencyResponse,
    notify,
    activePatient,
    caregiverChat,
    setIsCaregiverModalOpen
  } = useApp();

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState('Dialing...');

  const fallData = emergencyDetails || {
    userId: `${activePatient.name} (${activePatient.userCode})`,
    severity: "HIGH",
    confidence: 94,
    timestamp: "10:32 AM",
    location: activePatient.roomLocation,
    zone: activePatient.gpsCoordinates?.zone || "Indoor Residence",
    signals: ["High Impact (24.8 m/s²)", "Angle Tilt 82°", "Zero Post-Impact Velocity"]
  };

  const handleSimulatedCall = () => {
    setCallModalOpen(true);
    setCallStatus(`Connecting simulated call to ${activePatient.caregiverName} (${activePatient.caregiverPhone})...`);
    setTimeout(() => {
      setCallStatus(`Simulated Call Connected • Voice synthesis alert: "SafeFall AI automated emergency notification for resident ${activePatient.name}. Fall detected at ${activePatient.roomLocation}."`);
    }, 1800);
  };

  const handleSendAgain = () => {
    notify('emergency', 'Alert Re-transmitted', `Simulated SMS and emergency push re-dispatched to ${activePatient.caregiverName}.`);
  };

  // Find most recent alert SMS
  const latestAlertSMS = caregiverChat.filter(m => m.type === 'emergency_alert').slice(-1)[0] || caregiverChat[0];

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Emergency Header Screen Banner */}
      <div className={`border-2 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden transition-all ${
        isEmergencyActive
          ? 'bg-red-950/90 border-red-500 shadow-2xl glow-red animate-pulse-fast'
          : 'bg-slate-900 border-slate-800 shadow-xl'
      }`}>
        {/* Top ambient strobe light */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-400 to-red-600"></div>

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-xl">
            <ShieldAlert className="w-12 h-12" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-600 text-white shadow-md inline-block mb-2">
              🚨 EMERGENCY ALERT DISPATCH ACTIVE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Fall Detected & Automated Response Triggered
            </h2>
            <p className="text-sm font-semibold text-red-300 mt-1">
              Autonomous escalation workflow active for {activePatient.name} ({activePatient.userCode})
            </p>
          </div>

          {/* Fall incident details pill card */}
          <div className="bg-slate-950/80 border border-red-500/40 rounded-2xl p-4 text-left grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Monitored Resident</span>
              <p className="font-bold text-white mt-0.5">{activePatient.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{activePatient.userCode} • {activePatient.roomNumber}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Incident Time</span>
              <p className="font-mono font-bold text-white mt-0.5">{fallData.timestamp}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Severity Rating</span>
              <p className="font-bold text-red-400 mt-0.5">{fallData.severity || 'HIGH'} ({fallData.confidence || 94}%)</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Location</span>
              <p className="font-bold text-white truncate mt-0.5">{activePatient.roomLocation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Caregiver SMS Alert Transmission Card (Interactive Feature) */}
      <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Caregiver SMS Alert Notification</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  DISPATCHED (SIMULATED)
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cellular text payload transmitted to primary caregiver: <strong>{activePatient.caregiverName}</strong> ({activePatient.caregiverPhone})
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCaregiverModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md self-start sm:self-auto active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open Simulated Phone & Reply</span>
          </button>
        </div>

        {/* SMS Bubble Preview */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-200 space-y-2 max-w-2xl">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>TO: {activePatient.caregiverPhone} ({activePatient.caregiverName})</span>
            <span className="text-emerald-400 font-bold">STATUS: DELIVERED (SIMULATED)</span>
          </div>
          <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans text-xs pt-1">
            {latestAlertSMS?.content}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>* Cellular GSM message generated automatically upon fall algorithm confirmation.</span>
          <button
            onClick={() => setIsCaregiverModalOpen(true)}
            className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Simulate Caregiver Response</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Simulated Dispatch Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Response Pipeline Status
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous escalation workflow verified by system dispatcher
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            All 5 Protocols Executed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            {
              title: 'Emergency Event Created',
              desc: `Incident logged for ${activePatient.name} in persistent audit log.`,
              icon: AlertTriangle,
              status: dispatches.emergencyEventCreated
            },
            {
              title: 'Caregiver Notification',
              desc: `Push alert transmitted to ${activePatient.caregiverName}.`,
              icon: User,
              status: dispatches.caregiverNotified
            },
            {
              title: 'SMS Alert Simulated',
              desc: `SMS dispatch encoded to ${activePatient.caregiverPhone}.`,
              icon: MessageSquare,
              status: dispatches.smsSent
            },
            {
              title: 'Buzzer Siren Simulated',
              desc: '90dB simulated audio siren activated for nearby assistance.',
              icon: Volume2,
              status: dispatches.buzzerActive
            },
            {
              title: 'Location Sharing',
              desc: 'Simulated GPS coordinates appended to dispatch payload.',
              icon: MapPin,
              status: dispatches.locationShared
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    SIMULATED ✓
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons: Call Caregiver, Send Again, Mark Safe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleSimulatedCall}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call {activePatient.caregiverName.split(' ')[0]} (Simulated)</span>
          </button>

          <button
            onClick={handleSendAgain}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700 active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            <span>Send Alert Again</span>
          </button>

          <button
            onClick={resetEmergency}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark User Safe (Resolve)</span>
          </button>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
          <p className="text-xs font-bold text-amber-300">
            ⚠️ Demo Simulation – No real emergency message was sent.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            This screen validates UI escalation and workflow execution. Emergency services and live telephone networks are not contacted.
          </p>
        </div>
      </div>

      {/* Location Map Preview */}
      <SimulatedLocationCard />

      {/* Simulated Phone Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setCallModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <PhoneForwarded className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Simulated Outbound Phone Call
            </h3>
            <p className="text-xs font-mono text-blue-400 mb-4">
              To: {activePatient.caregiverName} ({activePatient.caregiverPhone})
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 mb-5 leading-relaxed font-mono">
              {callStatus}
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              * Demonstration Only: Zero telecommunication charges or outbound trunk connectivity.
            </p>

            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              End Simulated Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
