import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, X } from 'lucide-react';

export default function ToastContainer() {
  const { notifications, removeNotification } = useApp();

  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {notifications.map((note) => {
        let borderColor = 'border-blue-500/30 bg-slate-900/95 text-blue-300';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (note.type === 'emergency') {
          borderColor = 'border-red-500/50 bg-red-950/90 text-red-200 glow-red animate-pulse-fast';
          Icon = ShieldAlert;
          iconColor = 'text-red-400';
        } else if (note.type === 'warning') {
          borderColor = 'border-amber-500/50 bg-slate-900/95 text-amber-300 glow-amber';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (note.type === 'safe' || note.type === 'success') {
          borderColor = 'border-emerald-500/50 bg-slate-900/95 text-emerald-300 glow-emerald';
          Icon = CheckCircle;
          iconColor = 'text-emerald-400';
        }

        return (
          <div
            key={note.id}
            className={`pointer-events-auto flex items-start p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${borderColor}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {note.title}
              </p>
              <p className="text-sm font-medium mt-0.5 text-slate-100 leading-snug">
                {note.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(note.id)}
              className="ml-2 flex-shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
