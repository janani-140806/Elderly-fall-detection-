import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  SlidersHorizontal,
  AlertTriangle,
  History,
  BarChart3,
  Cpu,
  Settings,
  Home,
  Users,
  MessageSquare,
  Radio
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab, isEmergencyActive, events, patients, setIsCaregiverModalOpen } = useApp();

  const emergencyEventsCount = events.filter(e => e.activity === 'Fall' && e.status === 'Emergency Active').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity, badge: 'Live' },
    { id: 'simulation', label: 'Fall Simulation', icon: SlidersHorizontal, highlight: true },
    {
      id: 'alerts',
      label: 'Emergency Alert',
      icon: AlertTriangle,
      alertBadge: isEmergencyActive || emergencyEventsCount > 0
    },
    { id: 'patients', label: 'Residents Directory', icon: Users, count: patients.length },
    { id: 'history', label: 'Event History', icon: History, count: events.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'hardware', label: 'Hardware Integration', icon: Cpu, badge: 'Future' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-[57px] left-0 z-40 h-full md:h-[calc(100vh-57px)] w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Landing page link */}
          <div className="pt-2">
            <button
              onClick={() => handleSelect('landing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-blue-400" />
                <span>Landing Page</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Home</span>
            </button>
          </div>

          {/* Section Divider */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              System Navigation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                let activeClasses = 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60';
                if (isActive) {
                  activeClasses = 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30';
                }

                if (item.highlight && !isActive) {
                  activeClasses += ' text-amber-300 font-medium hover:bg-amber-500/10';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${activeClasses}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.badge === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.alertBadge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                        ALERT
                      </span>
                    )}

                    {item.count !== undefined && !isActive && (
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Hardware Status & Caregiver Shortcut */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <button
            onClick={() => setIsCaregiverModalOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Caregiver SMS Feed</span>
            </div>
            <span className="text-[10px] text-blue-400 font-mono font-bold">Open</span>
          </button>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Telemetry Link</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sensor simulator active at 50Hz update rate.
            </p>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium leading-tight">
            SafeFall AI • College Project Prototype
            <br />
            <span className="text-slate-600">Simulated Multi-Subject Environment</span>
          </div>
        </div>
      </aside>
    </>
  );
}
