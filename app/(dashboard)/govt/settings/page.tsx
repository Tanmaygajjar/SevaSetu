'use client';
import React from 'react';
import { Save, Bell, Globe, Cog, Shield, Map, Phone, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 fade-in min-h-screen pb-20">
      <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Officer Guidelines & Logic</h1><p className="text-[var(--ink-muted)]">Configure district boundaries, official alert thresholds, and department keys.</p></div>

      <div className="space-y-8">
         <section className="space-y-4">
            <h3 className="text-lg font-bold font-mukta flex items-center gap-2 text-blue-600"><Map size={20} /> Boundary Logic</h3>
            <div className="card p-8 space-y-6">
                <div><label className="label">Managed District Code</label><input type="text" defaultValue="GUJ-RAJKOT-360001" className="input bg-gray-50 border-gray-100 font-mono" readOnly /></div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-3xl border border-blue-100">
                   <div><p className="font-bold text-sm text-blue-900">Automated State Sync</p><p className="text-[10px] text-blue-600">Sync all reports with GSWAN Network hourly.</p></div>
                   <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                </div>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="text-lg font-bold font-mukta flex items-center gap-2 text-orange-600"><Bell size={20} /> Alert Configuration</h3>
            <div className="card p-8 space-y-6 text-xs">
               <div className="flex justify-between items-center"><p className="font-bold">Incident Escalation Threshold</p><select className="input w-36 py-1 h-auto text-[10px]"><option>High (Score &gt; 8.5)</option><option>Med (Score &gt; 6.0)</option></select></div>
               <div className="flex justify-between items-center"><p className="font-bold">Official Response SLA</p><select className="input w-36 py-1 h-auto text-[10px]"><option>30 Minutes</option><option>60 Minutes</option></select></div>
            </div>
         </section>
      </div>

      <div className="flex justify-end items-center gap-4 pt-10 border-t">
         <button className="text-xs font-bold text-gray-600 hover:text-red-500 transition-colors uppercase tracking-widest">Wipe Local Logs</button>
         <button onClick={() => toast.success('Official district settings updated!')} className="px-10 py-4 bg-blue-900 text-white rounded-2xl font-bold shadow-2xl flex items-center gap-2"><Save size={18} /> Apply Governance</button>
      </div>
    </div>
  );
}
