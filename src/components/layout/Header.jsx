import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import {
  Shield,
  Volume2,
  VolumeX,
  Menu,
  Activity,
  BellRing,
  User,
  Users,
  ChevronDown,
  MessageSquare,
  Check,
  Radio
} from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  const {
    systemStatus,
    settings,
    updateSettings,
    isEmergencyActive,
    activeTab,
    setActiveTab,
    patients,
    activePatient,
    switchPatient,
    setIsCaregiverModalOpen,
    caregiverChat
  } = useApp();

  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPatientDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let statusBadge = (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>ACTIVE</span>
    </div>
  );

  if (systemStatus === 'EMERGENCY' || isEmergencyActive) {
    statusBadge = (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 border border-red-500/50 text-red-300 animate-pulse glow-red">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
        <span>EMERGENCY ALERT</span>
      </div>
    );
  } else if (systemStatus === 'WARNING') {
    statusBadge = (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
        <span>WARNING</span>
      </div>
    );
  } else if (systemStatus === 'PAUSED') {
    statusBadge = (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700/50 border border-slate-600 text-slate-400">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
        <span>PAUSED</span>
      </div>
    );
  }

  const toggleAudio = () => {
    updateSettings({ buzzerAudioEnabled: !settings.buzzerAudioEnabled });
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/40 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  SafeFall <span className="text-blue-500">AI</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase rounded bg-slate-800 text-slate-400 border border-slate-700">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Intelligent Fall Detection & Response
              </p>
            </div>
          </button>
        </div>

        {/* Center: Status indicators & Prototype pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="text-xs text-slate-400 font-medium">System Status:</span>
            {statusBadge}
          </div>

          <PrototypeBadge variant="pill" />
        </div>

        {/* Right: Caregiver SMS Trigger, Sound toggle, Patient Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Caregiver SMS Inbox Quick-Trigger Button */}
          <button
            onClick={() => setIsCaregiverModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isEmergencyActive
                ? 'bg-red-500/20 text-red-300 border-red-500 glow-red animate-pulse-fast'
                : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}
            title="Open Caregiver Simulated Phone & SMS Alerts"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Caregiver SMS</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-blue-600 text-white">
              {caregiverChat.length}
            </span>
          </button>

          {/* Sound audio toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              settings.buzzerAudioEnabled
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
            title={settings.buzzerAudioEnabled ? "Simulated audio buzzers enabled (Click to mute)" : "Simulated audio muted (Click to unmute)"}
          >
            {settings.buzzerAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Patient Profile Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPatientDropdownOpen(!patientDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-850 hover:border-blue-500/50 transition-all text-left"
              title="Click to switch monitored patient"
            >
              <div className={`w-6 h-6 rounded-lg ${activePatient.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-[11px] shadow-sm`}>
                {activePatient.avatarInitials}
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-white leading-tight">
                    {activePatient.name}
                  </p>
                  <span className={`px-1 rounded text-[8px] font-bold uppercase ${
                    activePatient.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {activePatient.riskLevel}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {activePatient.userCode} • {activePatient.roomNumber}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {patientDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Monitored Subject
                  </span>
                  <button
                    onClick={() => {
                      setPatientDropdownOpen(false);
                      setActiveTab('patients');
                    }}
                    className="text-[10px] text-blue-400 hover:underline font-semibold"
                  >
                    Directory →
                  </button>
                </div>

                <div className="space-y-1">
                  {patients.map((p) => {
                    const isSelected = p.id === activePatient.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchPatient(p.id);
                          setPatientDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${p.avatarBg} text-white flex items-center justify-center font-bold text-xs`}>
                            {p.avatarInitials}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{p.userCode} • {p.roomNumber}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setPatientDropdownOpen(false);
                      setActiveTab('patients');
                    }}
                    className="w-full py-1.5 text-center text-xs font-bold text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    + Manage All {patients.length} Residents
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
