'use client';
import React from 'react';
import { Building2, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const ngos = [
    { n: 'Rajkot Relief Fund', r: 'District A', s: 'Verified', h: '98%' },
    { n: 'Surat Green Initiative', r: 'District B', s: 'Pending', h: 'N/A' },
    { n: 'Ahmedabad Food Bank', r: 'District A', s: 'Verified', h: '92%' },
    { n: 'Baroda Education Hub', r: 'District C', s: 'Verified', h: '88%' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex justify-between items-end">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Institutional Compliance</h1><p className="text-[var(--ink-muted)]">Verified 312 NGOs operating across 32 sectors.</p></div>
        <button onClick={() => toast.success('Generating audit tokens...')} className="btn-primary">Export Registry</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {ngos.map((n, i) => (
            <div key={i} className="card p-8 flex flex-col group hover:border-[var(--saffron)] transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--surface-2)] opacity-30 rotate-45 translate-x-10 -translate-y-10 group-hover:bg-[var(--saffron)] group-hover:opacity-10 transition-all" />
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-[var(--ink)] font-bold text-xl">{n.n[0]}</div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${n.s === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{n.s}</span>
               </div>
               <h3 className="text-xl font-bold font-mukta mb-1 group-hover:text-[var(--saffron)] transition-colors">{n.n}</h3>
               <p className="text-xs text-gray-600 flex items-center gap-1 mb-6"><MapPin size={12} /> {n.r} Compliance Zone</p>
               
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-lg font-bold text-[var(--ink)]">{n.h}</p><p className="text-[10px] text-gray-600 font-bold uppercase">Impact Score</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-lg font-bold text-[var(--ink)]">{Math.floor(Math.random()*50)+10}</p><p className="text-[10px] text-gray-600 font-bold uppercase">Active Sites</p></div>
               </div>

               <div className="flex gap-2">
                  <button onClick={() => toast.success('Institutional deep-dive opened')} className="flex-1 py-3 bg-[var(--surface-2)] text-[var(--ink)] rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors">Details</button>
                  <button onClick={() => toast.success('Compliance score recalculated')} className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-100 transition-colors"><ShieldCheck size={20} /></button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
