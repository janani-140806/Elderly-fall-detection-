import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Radio, Info, Compass, ExternalLink } from 'lucide-react';

export default function SimulatedLocationCard() {
  const { settings } = useApp();
  const [selectedZone, setSelectedZone] = useState('Home');

  const zones = {
    Home: {
      name: "Home – Living Room",
      lat: settings.gpsCoordinates?.lat || 37.7749,
      lng: settings.gpsCoordinates?.lng || -122.4194,
      accuracy: "Simulated GPS ±3.2m",
      environment: "Indoor (Geofence Safe Zone)",
      address: settings.gpsCoordinates?.address || "442 Maplewood Drive, Apt 3B, Simulated City"
    },
    Garden: {
      name: "Backyard Garden / Patio",
      lat: 37.7753,
      lng: -122.4189,
      accuracy: "Simulated GPS ±2.5m",
      environment: "Outdoor (Residential Perimeter)",
      address: "442 Maplewood Drive (Rear Grounds)"
    },
    Walkway: {
      name: "Community Walkway / Park",
      lat: 37.7761,
      lng: -122.4205,
      accuracy: "Simulated GPS ±1.8m",
      environment: "Public Pathway",
      address: "Oakland Boulevard & 5th Ave Walkway"
    }
  };

  const current = zones[selectedZone];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Simulated GPS & Geolocation
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Simulated GPS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Future hardware version: NEO-6M GPS module provides real satellite coordinates
            </p>
          </div>
        </div>

        {/* Zone switcher for simulation demonstration */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {Object.keys(zones).map(z => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedZone === z
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Map visual representation */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-52 mb-4 flex items-center justify-center">
        {/* Visual Map Grid & Concentric radar rings */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        {/* Geofence Circles */}
        <div className="absolute w-44 h-44 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-emerald-500/40 bg-emerald-500/15 animate-ping-slow"></div>
          </div>
        </div>

        {/* User Marker Pin */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-red-600/90 border-2 border-white flex items-center justify-center text-white shadow-xl glow-red animate-bounce-slight">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] font-bold text-white shadow-md">
            {current.name}
          </div>
        </div>

        {/* Radar beam animation */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur border border-slate-800 text-[10px] font-mono text-emerald-400">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>SATELLITES: 8 LOCKED (SIMULATED)</span>
        </div>

        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
          LAT: {current.lat.toFixed(4)}° N, LNG: {Math.abs(current.lng).toFixed(4)}° W
        </div>
      </div>

      {/* Location Details metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            Current Location
          </span>
          <p className="font-bold text-slate-200">{current.name}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{current.address}</p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            Simulated Coordinates
          </span>
          <p className="font-mono font-bold text-slate-200">
            {current.lat.toFixed(6)}, {current.lng.toFixed(6)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{current.accuracy}</p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
            Hardware Mapping
          </span>
          <p className="font-bold text-indigo-300">NEO-6M NMEA Feed</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{current.environment}</p>
        </div>
      </div>
    </div>
  );
}
