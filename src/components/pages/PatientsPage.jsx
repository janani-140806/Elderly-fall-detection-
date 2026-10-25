import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldAlert,
  Phone,
  MapPin,
  Heart,
  Sliders,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  Radio,
  Clock,
  X
} from 'lucide-react';

export default function PatientsPage() {
  const {
    patients,
    activePatientId,
    switchPatient,
    addPatient,
    currentActivity,
    sensorData,
    setActiveTab,
    isEmergencyActive
  } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    userCode: `User #00${patients.length + 1}`,
    age: 72,
    gender: 'Female',
    roomLocation: 'Apartment 4A – Bedroom',
    roomNumber: 'Apt 4A',
    riskLevel: 'Moderate',
    medicalNotes: 'General mobility monitoring with assistive walking frame.',
    caregiverName: 'Jennifer Adams',
    caregiverPhone: '+1 (555) 612-4490',
    caregiverRelation: 'Family Caregiver',
    impactThreshold: 18.5,
    angleThreshold: 60,
    countdownDuration: 10
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPatient.name.trim()) return;
    addPatient(newPatient);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Monitored Patients & Resident Directory
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {patients.length} Registered Subjects
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Switch active monitoring telemetry across multiple residents. Each profile maintains independent fall risk thresholds, assigned emergency contacts, and GPS geofence zones.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Monitored Subject</span>
        </button>
      </div>

      {/* Patient Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patients.map((p) => {
          const isActive = p.id === activePatientId;
          const isSubjectInEmergency = isActive && isEmergencyActive;

          let riskBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          if (p.riskLevel === 'Critical') {
            riskBadge = 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold';
          } else if (p.riskLevel === 'Low') {
            riskBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
          }

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                isSubjectInEmergency
                  ? 'bg-red-950/80 border-red-500 glow-red animate-pulse-fast'
                  : isActive
                  ? 'bg-slate-900 border-blue-500 shadow-xl glow-blue ring-1 ring-blue-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div>
                {/* Top Card Bar: Subject initials, Name, Active Badge & Risk */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${p.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                      {p.avatarInitials || p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white leading-tight">
                          {p.name}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            ACTIVE FEED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {p.userCode} • {p.age} yrs • {p.gender}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${riskBadge}`}>
                    {p.riskLevel} Risk
                  </span>
                </div>

                {/* Medical Profile & Room location */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                      Clinical Notes & Fall Risk Baseline:
                    </span>
                    <p className="text-slate-300 leading-snug text-[11px]">
                      {p.medicalNotes}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                    <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{p.roomLocation}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{p.caregiverName}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Caregiver Notification Target */}
                <div className="border-t border-slate-800/80 pt-3 mb-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Target Emergency Caregiver:
                    </span>
                    <span className="font-bold text-white">{p.caregiverName}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {p.caregiverPhone} ({p.caregiverRelation.split('(')[0]})
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Calibrated Threshold:
                    </span>
                    <span className="font-mono text-blue-400 font-bold">{p.impactThreshold || 18.5} m/s²</span>
                    <span className="text-[10px] text-slate-500 block">Angle: {p.angleThreshold || 60}°</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                {isActive ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Currently Monitoring This Subject</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('monitoring')}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Live Feed</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => switchPatient(p.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 font-bold text-xs transition-all border border-slate-700 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span>Switch Active Monitoring to {p.name.split(' ')[0]}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Patient Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Enroll New Monitored Resident</h3>
                <p className="text-xs text-slate-400">Creates a new profile with independent telemetry thresholds</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Full Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    placeholder="e.g. Walter White"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) || 70 })}
                      className="w-20 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room / Location</label>
                  <input
                    type="text"
                    value={newPatient.roomLocation}
                    onChange={(e) => setNewPatient({ ...newPatient, roomLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fall Risk Level</label>
                  <select
                    value={newPatient.riskLevel}
                    onChange={(e) => setNewPatient({ ...newPatient, riskLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Critical">Critical Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medical Notes & Risk History</label>
                <input
                  type="text"
                  value={newPatient.medicalNotes}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Caregiver Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.caregiverName}
                    onChange={(e) => setNewPatient({ ...newPatient, caregiverName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Caregiver Phone (SMS Target)</label>
                  <input
                    type="text"
                    required
                    value={newPatient.caregiverPhone}
                    onChange={(e) => setNewPatient({ ...newPatient, caregiverPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save & Enroll Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
