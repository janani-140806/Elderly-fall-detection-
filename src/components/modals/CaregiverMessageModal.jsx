import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Send,
  X,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  Radio,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function CaregiverMessageModal() {
  const {
    isCaregiverModalOpen,
    setIsCaregiverModalOpen,
    caregiverChat,
    sendCaregiverReply,
    activePatient,
    isEmergencyActive
  } = useApp();

  const [replyInput, setReplyInput] = useState('');

  if (!isCaregiverModalOpen) return null;

  const handleQuickReply = (text, actionType) => {
    sendCaregiverReply(text, actionType);
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    sendCaregiverReply(replyInput.trim(), 'custom');
    setReplyInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Smartphone Device Mockup */}
      <div className="bg-slate-900 border-4 border-slate-700 rounded-[38px] max-w-md w-full shadow-2xl overflow-hidden relative flex flex-col h-[650px] max-h-[92vh]">
        {/* Phone Notch & Speaker bar */}
        <div className="bg-slate-950 pt-3 pb-2 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 font-bold">9:41</div>
          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold font-mono">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Messaging Header Bar */}
        <div className="bg-slate-900/95 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full ${activePatient.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-md`}>
              {activePatient.caregiverName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white leading-tight">
                  {activePatient.caregiverName}
                </h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {activePatient.caregiverPhone} • {activePatient.caregiverRelation.split('(')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SIMULATED SMS
            </span>
            <button
              onClick={() => setIsCaregiverModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SMS Dispatch Channel Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 text-[10px] text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            Cellular Carrier: SIM800L GSM Mesh (Simulated)
          </span>
          <span className="text-slate-400">Zero Network Charges</span>
        </div>

        {/* Chat / SMS Thread Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/70">
          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">
              Today • Automated Dispatch Channel
            </span>
          </div>

          {caregiverChat.map((msg) => {
            const isAlert = msg.type === 'emergency_alert';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isAutomated ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-lg ${
                    isAlert
                      ? 'bg-red-950/90 border border-red-500/50 text-red-100 glow-red'
                      : msg.isAutomated
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-blue-600 text-white font-medium'
                  }`}
                >
                  {isAlert && (
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-400 mb-1.5 pb-1 border-b border-red-500/30">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                      <span>CRITICAL AUTOMATED SMS DISPATCH</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line text-[11px] font-sans">
                    {msg.content}
                  </p>

                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-70 mt-1.5 font-mono">
                    <span>{msg.time}</span>
                    <span>•</span>
                    <span>{msg.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Response Interactive Buttons for Presentation */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
            <span>Quick Caregiver Responses:</span>
            <span className="text-blue-400 text-[9px]">Click to simulate reply</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleQuickReply("I am 3 minutes away and heading over now! Please keep the siren active.", "eta")}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 text-left truncate transition-colors"
            >
              🏃 "I'm on my way! (ETA 3m)"
            </button>

            <button
              onClick={() => handleQuickReply("Dispatched building medical staff to assist Eleanor Vance immediately.", "staff")}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-blue-300 border border-blue-500/30 text-left truncate transition-colors"
            >
              🏥 "Dispatched on-site staff"
            </button>

            <button
              onClick={() => handleQuickReply("Calling 911 EMS dispatch for emergency response.", "ems")}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-red-300 border border-red-500/30 text-left truncate transition-colors"
            >
              🚑 "Escalate to EMS (Simulated)"
            </button>

            <button
              onClick={() => handleQuickReply("Patient attended. Eleanor is conscious and seated safely.", "resolved")}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 border border-amber-500/30 text-left truncate transition-colors"
            >
              ✅ "Mark Attended / Resolved"
            </button>
          </div>

          {/* Custom SMS reply text field */}
          <form onSubmit={handleSendCustom} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Type simulated SMS reply..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Phone Bottom Home Bar */}
        <div className="bg-slate-950 py-1.5 flex justify-center">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
