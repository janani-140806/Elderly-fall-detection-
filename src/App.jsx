import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ToastContainer from './components/common/ToastContainer';
import VerificationCountdownModal from './components/modals/VerificationCountdownModal';
import NoMovementModal from './components/modals/NoMovementModal';
import CaregiverMessageModal from './components/modals/CaregiverMessageModal';

// Pages
import LandingPage from './components/pages/LandingPage';
import DashboardPage from './components/pages/DashboardPage';
import LiveMonitoringPage from './components/pages/LiveMonitoringPage';
import SimulationPage from './components/pages/SimulationPage';
import EmergencyResponsePage from './components/pages/EmergencyResponsePage';
import PatientsPage from './components/pages/PatientsPage';
import EventHistoryPage from './components/pages/EventHistoryPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import HardwareIntegrationPage from './components/pages/HardwareIntegrationPage';
import SettingsPage from './components/pages/SettingsPage';

function MainLayout() {
  const { activeTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Render the current view
  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'monitoring':
        return <LiveMonitoringPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'alerts':
        return <EmergencyResponsePage />;
      case 'patients':
        return <PatientsPage />;
      case 'history':
        return <EventHistoryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'hardware':
        return <HardwareIntegrationPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Application Header */}
      <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex w-full">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}

          {/* Persistent Academic & Prototype Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-400">
              SafeFall AI – Intelligent Fall Detection and Emergency Response System
            </p>
            <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
              Software prototype developed for academic and engineering demonstration. Sensor telemetry and emergency responses are simulated to demonstrate the proposed hardware architecture.
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-mono pt-1">
              <span>React 18</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Web Audio API</span>
              <span>•</span>
              <span>Multi-Patient Directory</span>
              <span>•</span>
              <span>Caregiver SMS Dispatch</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Interactive Modals & Toast Alerts */}
      <VerificationCountdownModal />
      <NoMovementModal />
      <CaregiverMessageModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
