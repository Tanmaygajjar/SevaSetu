'use client';
import React from 'react';
import { AreaChart, BarChart4, TrendingUp, TrendingDown, Target, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">District Benchmarks</h1><p className="text-[var(--ink-muted)]">Official fulfillment velocity and resource gap analysis.</p></div>
        <button onClick={() => toast.success('Recalculating district growth index...')} className="btn-primary flex items-center gap-2"><AreaChart size={18} /> Performance Audit</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card md:col-span-2 p-8 h-[400px] flex flex-col bg-white">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Response Velocity Audit</h3>
               <select className="input w-36 py-1 h-auto text-xs"><option>Last Quarter</option><option>Last Year</option></select>
            </div>
            <div className="flex-1 w-full bg-[var(--surface-2)] rounded-3xl relative overflow-hidden flex items-end p-4">
                {[20, 30, 45, 10, 60, 40, 85, 30, 90].map((h, i) => (
                   <div key={i} className="flex-1 px-1 group relative">
                      <div className="w-full bg-blue-600 opacity-20 group-hover:opacity-60 transition-all rounded-t-lg" style={{ height: `${h}%` }} />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-blue-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Idx: {h}</div>
                   </div>
                ))}
            </div>
         </div>

         <div className="card p-8 bg-blue-900 text-white flex flex-col justify-center items-center text-center border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rotate-45 rounded-full translate-x-16 -translate-y-16" />
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6"><Target size={32} /></div>
            <h3 className="text-2xl font-bold font-mukta mb-2">District Goal Meta</h3>
            <p className="text-xs text-blue-200 mb-8 px-4 font-medium opacity-80">Currently at 92% of the mandatory resource allocation target for the current session.</p>
            <div className="w-full h-1 bg-blue-800 rounded-full mb-2"><div className="h-full bg-yellow-400 w-[92%]" /></div>
            <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Progress: 92%</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[
           { l: 'Fulfillment Delta', v: '+12%', i: <TrendingUp size={24} />, c: 'text-green-500' },
           { l: 'Avg Latency', v: '14.2m', i: <Clock size={24} />, c: 'text-orange-500' },
           { l: 'Energy Spent', v: '4.2 GW', i: <Zap size={24} />, c: 'text-blue-500' },
         ].map((s, i) => (
            <div key={i} className="card p-6 flex items-center gap-4">
               <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${s.c}`}>{s.i}</div>
               <div><p className="text-2xl font-bold text-[var(--ink)]">{s.v}</p><p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{s.l}</p></div>
            </div>
         ))}
      </div>
    </div>
  );
}
