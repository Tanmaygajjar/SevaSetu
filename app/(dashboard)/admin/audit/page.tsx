'use client';
import React from 'react';
import { Activity, Clock, Server, Fingerprint, Database, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const events = [
    { t: 'User Auth Success', u: 'NGO_ADM_42', i: '192.168.1.1', m: 'Login verified via TOTP', c: 'green' },
    { t: 'DB Schema Update', u: 'SYS_ADMIN', i: 'internal-01', m: 'Applied migration v2.4.12', c: 'blue' },
    { t: 'Rate Limit Hit', u: 'UNKNOWN_API', i: '42.12.8.9', m: 'Burst detected (1.2k/sec)', c: 'red' },
    { t: 'Task Deployment', u: 'VOL_COORD', i: '102.1.22.4', m: 'Assigned 12 users to #T-992', c: 'orange' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Immutable Audit Trail</h1><p className="text-[var(--ink-muted)]">Real-time system transaction ledger.</p></div>
        <button onClick={() => toast.success('Streaming live logs...')} className="flex items-center gap-2 text-[var(--saffron)] font-bold text-sm animate-pulse"><Activity size={16} /> Live Streaming</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card p-6 bg-gray-900 text-white border-none shadow-2xl">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Server size={14} /> Log Density</h4>
            <div className="h-24 bg-gray-800 rounded-xl relative overflow-hidden flex items-end">
               {[20, 50, 40, 80, 20, 40, 90, 60].map((h, i) => <div key={i} className="flex-1 mx-0.5 bg-[var(--saffron)] opacity-30" style={{ height: `${h}%` }} />)}
            </div>
            <p className="mt-4 text-2xl font-bold">12.4k <span className="text-xs text-green-500">+12%</span></p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Inbound Events / Min</p>
         </div>
         <div className="card md:col-span-2 p-8 space-y-6">
            <h3 className="font-bold font-mukta text-xl">Recent Governance Events</h3>
            <div className="space-y-4">
               {events.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-[var(--border)] cursor-default">
                     <div className={`w-2 h-2 rounded-full ${e.c === 'green' ? 'bg-green-500' : e.c === 'red' ? 'bg-red-500' : e.c === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                     <div className="flex-1">
                        <div className="flex justify-between items-center"><p className="font-bold text-sm text-[var(--ink)]">{e.t}</p><p className="text-[10px] text-gray-600 font-bold uppercase">{e.u}</p></div>
                        <p className="text-xs text-gray-500 mt-1">{e.m}</p>
                     </div>
                     <p className="text-[10px] font-bold text-gray-300 font-mono">{e.i}</p>
                  </div>
               ))}
            </div>
            <button className="w-full py-3 bg-[var(--surface-2)] text-[var(--ink)] font-bold text-xs rounded-xl hover:bg-[var(--surface-3)] transition-all">View All 82,412 Records</button>
         </div>
      </div>
    </div>
  );
}
