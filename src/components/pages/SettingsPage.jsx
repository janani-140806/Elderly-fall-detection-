import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import {
  Settings,
  User,
  Phone,
  Sliders,
  BellRing,
  Volume2,
  VolumeX,
  Save,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, notify } = useApp();

  // Local form state
  const [formData, setFormData] = useState({
    userName: settings.userName || 'Eleanor Vance (User #001)',
    userAge: settings.userAge || 74,
    roomLocation: settings.roomLocation || 'Living Room – Primary Residence',
    emergencyContactName: settings.emergencyContactName || 'Sarah Vance (Daughter)',
    emergencyContactPhone: settings.emergencyContactPhone || '+1 (555) 389-4402',
    emergencyContactRelation: settings.emergencyContactRelation || 'Primary Family Caregiver',
    secondaryContactName: settings.secondaryContactName || 'Dr. Robert Chen',
    secondaryContactPhone: settings.secondaryContactPhone || '+1 (555) 702-8819',
    detectionSensitivity: settings.detectionSensitivity || 'Medium',
    impactThreshold: settings.impactThreshold || 18.5,
    angleThreshold: settings.angleThreshold || 60,
    alertCountdownDuration: settings.alertCountdownDuration || 10,
    simulationSpeed: settings.simulationSpeed || 'Normal',
    buzzerAudioEnabled: settings.buzzerAudioEnabled !== undefined ? settings.buzzerAudioEnabled : true,
    autoNotificationEnabled: settings.autoNotificationEnabled !== undefined ? settings.autoNotificationEnabled : true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSensitivityChange = (lvl) => {
    let impact = 18.5;
    let angle = 60;
    if (lvl === 'High') {
      impact = 16.0;
      angle = 50;
    } else if (lvl === 'Low') {
      impact = 22.0;
      angle = 70;
    }
    setFormData(prev => ({
      ...prev,
      detectionSensitivity: lvl,
      impactThreshold: impact,
      angleThreshold: angle
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      alertCountdownDuration: parseInt(formData.alertCountdownDuration) || 10,
      impactThreshold: parseFloat(formData.impactThreshold) || 18.5,
      angleThreshold: parseInt(formData.angleThreshold) || 60
    });
  };

  const handleResetDefaults = () => {
    setFormData({
      userName: "Eleanor Vance (User #001)",
      userAge: 74,
      roomLocation: "Living Room – Primary Residence",
      emergencyContactName: "Sarah Vance (Daughter)",
      emergencyContactPhone: "+1 (555) 389-4402",
      emergencyContactRelation: "Primary Family Caregiver",
      secondaryContactName: "Dr. Robert Chen",
      secondaryContactPhone: "+1 (555) 702-8819",
      detectionSensitivity: "Medium",
      impactThreshold: 18.5,
      angleThreshold: 60,
      alertCountdownDuration: 10,
      simulationSpeed: "Normal",
      buzzerAudioEnabled: true,
      autoNotificationEnabled: true
    });
    notify('info', 'Defaults Restored', 'Click Save Settings to apply default configuration.');
  };

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              System Configuration & Calibration
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              LocalStorage Persisted
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure monitored patient identity, simulated emergency contacts, and fall detection algorithm thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Monitored Subject Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Monitored Subject Identity (Demo Profile)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject Name & Identifier
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                * Simulated identity. Do not input real personal medical data.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject Age
                </label>
                <input
                  type="number"
                  name="userAge"
                  value={formData.userAge}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Location Zone
                </label>
                <input
                  type="text"
                  name="roomLocation"
                  value={formData.roomLocation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Simulated Emergency Contacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Phone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Emergency Caregiver Contacts (Simulated Dispatch)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Caregiver Name & Relationship
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Emergency Phone (Simulated SMS / Call Target)
              </label>
              <input
                type="text"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                * Simulated phone number. No actual telephony network calls will be made.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Detection Algorithm Thresholds */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Fall Detection Algorithm Thresholds & Sensitivity
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400">Configurable Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sensitivity Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Detection Sensitivity Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Low', 'Medium', 'High'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSensitivityChange(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      formData.detectionSensitivity === lvl
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                High: More sensitive (fewer false negatives). Low: Stricter criteria.
              </p>
            </div>

            {/* Impact Threshold */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Impact Threshold: <span className="font-mono text-blue-400">{formData.impactThreshold} m/s²</span>
              </label>
              <input
                type="number"
                step="0.5"
                name="impactThreshold"
                value={formData.impactThreshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Deceleration spike threshold representing ground collision.
              </p>
            </div>

            {/* Angle Threshold */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Posture Angle Threshold: <span className="font-mono text-teal-400">{formData.angleThreshold}°</span>
              </label>
              <input
                type="number"
                step="1"
                name="angleThreshold"
                value={formData.angleThreshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Maximum allowable tilt from upright vertical before warning.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
            {/* Alert Countdown Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alert Verification Countdown: <span className="font-mono text-red-400">{formData.alertCountdownDuration}s</span>
              </label>
              <select
                name="alertCountdownDuration"
                value={formData.alertCountdownDuration}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
              >
                <option value="5">5 Seconds (Urgent Test)</option>
                <option value="10">10 Seconds (Standard Protocol)</option>
                <option value="15">15 Seconds (Extended Verification)</option>
                <option value="30">30 Seconds (Clinical Buffer)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Time allocated for subject to cancel false alarms via "I'm OK".
              </p>
            </div>

            {/* Buzzer Sound Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Simulated Buzzer Audio (Web Audio API)
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="buzzerAudioEnabled"
                  checked={formData.buzzerAudioEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs text-slate-300 font-medium">
                  {formData.buzzerAudioEnabled ? 'Buzzer Siren & Chimes Enabled' : 'Muted'}
                </span>
              </label>
              <p className="text-[10px] text-slate-500 mt-1">
                Synthesizes realistic multi-tone hardware buzzer alarms in browser.
              </p>
            </div>

            {/* Toast Notifications */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                In-App Toast Alerts
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoNotificationEnabled"
                  checked={formData.autoNotificationEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Display Real-Time Toast Notifications
                </span>
              </label>
              <p className="text-[10px] text-slate-500 mt-1">
                Shows floating status alerts when scenarios or thresholds trigger.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-900/40 active:scale-95 glow-blue"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
