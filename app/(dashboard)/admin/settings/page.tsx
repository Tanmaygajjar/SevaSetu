'use client';
import React from 'react';
import { Save, Bell, Globe, Cog, Shield, Database, Smartphone, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 fade-in min-h-screen pb-20">
      <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Core Governance Rules</h1><p className="text-[var(--ink-muted)]">Configure global thresholds, API integrations, and system-wide policies.</p></div>

      <div className="space-y-8">
         <section className="space-y-4">
            <h3 className="text-lg font-bold font-mukta flex items-center gap-2 text-[var(--saffron)]"><Shield size={20} /> Integrity Constraints</h3>
            <div className="card p-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-3xl">
                   <div><p className="font-bold text-sm">Force Critical-Only Dispatch</p><p className="text-[10px] text-gray-500">Auto-assign volunteers only when Urgency Score &gt; 8.5</p></div>
                   <div className="w-12 h-6 bg-[var(--saffron)] rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                </div>
                <div><label className="label">Monthly NGO Report Quota</label><input type="range" className="w-full accent-[var(--saffron)]" defaultValue="80" /><div className="flex justify-between text-[10px] text-gray-600 font-bold mt-2"><span>10 reports</span><span>UPPER LIMIT: 500 reports</span></div></div>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="text-lg font-bold font-mukta flex items-center gap-2 text-indigo-600"><Database size={20} /> Infrastructure Hooks</h3>
            <div className="card p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="label">Firebase Project ID</label><input type="text" defaultValue="sevasetu-platform-prod" className="input" /></div>
                  <div><label className="label">GIS Maps Direction Key</label><input type="password" defaultValue="pk_test_42A8F9..." className="input" /></div>
               </div>
               <div><label className="label">Global Webhook for Disaster Alerts (JSON)</label><input type="text" defaultValue="https://safety-api.gov.in/v1/ingest/seva-setu" className="input" /></div>
            </div>
         </section>
      </div>

      <div className="flex justify-end items-center gap-4 pt-10 border-t">
         <button className="text-xs font-bold text-gray-600 hover:text-red-500 transition-colors">Emergency System Reset</button>
         <button onClick={() => toast.success('Platform rules updated globally!')} className="px-10 py-4 bg-[var(--ink)] text-white rounded-2xl font-bold shadow-2xl flex items-center gap-2"><Save size={18} /> Deploy Changes</button>
      </div>
    </div>
  );
}
