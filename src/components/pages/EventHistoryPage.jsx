import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PrototypeBadge from '../common/PrototypeBadge';
import {
  History,
  Trash2,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function EventHistoryPage() {
  const { events, clearEvents, addEvent } = useApp();
  const [filter, setFilter] = useState('ALL'); // ALL, FALLS, WARNINGS, NORMAL
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    // Category filter
    if (filter === 'FALLS') {
      const isFall = evt.activity?.toLowerCase().includes('fall') || evt.detection?.toLowerCase().includes('fall');
      if (!isFall) return false;
    } else if (filter === 'WARNINGS') {
      const isWarning = evt.severity?.toLowerCase().includes('med') || evt.detection?.toLowerCase().includes('warning') || evt.activity?.toLowerCase().includes('sudden');
      if (!isWarning) return false;
    } else if (filter === 'NORMAL') {
      const isNormal = evt.severity?.toLowerCase().includes('normal') || evt.activity?.toLowerCase().includes('walk') || evt.activity?.toLowerCase().includes('sit');
      if (!isNormal) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchActivity = evt.activity?.toLowerCase().includes(query);
      const matchDetection = evt.detection?.toLowerCase().includes(query);
      const matchResponse = evt.response?.toLowerCase().includes(query);
      const matchTime = evt.timestamp?.toLowerCase().includes(query);
      return matchActivity || matchDetection || matchResponse || matchTime;
    }

    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Date/Time', 'Activity', 'Detection', 'Confidence (%)', 'Severity', 'Response', 'Status'];
    const rows = events.map(e => [
      e.id,
      `"${e.timestamp}"`,
      `"${e.activity}"`,
      `"${e.detection}"`,
      e.confidence,
      `"${e.severity}"`,
      `"${e.response}"`,
      `"${e.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `safefall_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Prototype Badge */}
      <PrototypeBadge />

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Audit Event History & Incident Log
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {events.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete sequential log of fall triggers, false alarms, warnings, and safe activities.
          </p>
        </div>

        {/* Action Buttons: Export & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={clearEvents}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 rounded-xl text-xs font-semibold border border-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'FALLS', label: 'Falls Only' },
            { id: 'WARNINGS', label: 'Warnings' },
            { id: 'NORMAL', label: 'Normal Activity' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filter === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Detection</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Response</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    No matching events found in audit log.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  let sevBadge = 'bg-slate-800 text-slate-400';
                  if (evt.severity?.toLowerCase().includes('high') || evt.severity?.toLowerCase().includes('crit')) {
                    sevBadge = 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold';
                  } else if (evt.severity?.toLowerCase().includes('med')) {
                    sevBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                  } else {
                    sevBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                  }

                  let statusBadge = 'text-slate-400';
                  if (evt.status?.toLowerCase().includes('safe') || evt.status?.toLowerCase().includes('resolved')) {
                    statusBadge = 'text-emerald-400 font-semibold';
                  } else if (evt.status?.toLowerCase().includes('emergency')) {
                    statusBadge = 'text-red-400 font-bold animate-pulse';
                  } else if (evt.status?.toLowerCase().includes('false')) {
                    statusBadge = 'text-amber-400 font-semibold';
                  }

                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        {evt.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {evt.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {evt.activity}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {evt.detection}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={`font-bold ${
                          evt.confidence > 70 ? 'text-red-400' : evt.confidence > 30 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {evt.confidence}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${sevBadge}`}>
                          {evt.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {evt.response}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={statusBadge}>
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
