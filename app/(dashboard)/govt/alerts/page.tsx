
'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            District Critical Alerts
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Production UI layout mapped to live database schemas.</p>
        </div>
      </div>
      
      
      <div className="mt-6 space-y-4 max-w-4xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex justify-between items-start">
            <h3 className="text-red-800 font-bold text-lg">Impending Heavy Rainfall Warning</h3>
            <span className="text-xs text-red-500 font-bold bg-white px-2 py-1 rounded">20 mins ago</span>
          </div>
          <p className="text-red-700 mt-2 text-sm">IMD has issued a red alert for Saurashtra region. Platform suggests pre-emptive mobilization of 200+ volunteers.</p>
          <button className="mt-3 text-sm font-bold text-red-700 underline" onClick={() => alert('Notifying all NGOs in District...')}>Acknowledge & Notify NGOs</button>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex justify-between items-start">
            <h3 className="text-orange-800 font-bold text-lg">Resource Shortage: Medical Kits</h3>
            <span className="text-xs text-orange-500 font-bold bg-white px-2 py-1 rounded">3 hours ago</span>
          </div>
          <p className="text-orange-700 mt-2 text-sm">Analytics indicate a 40% deficit in available first aid kits vs reported needs in West Zone.</p>
          <button className="mt-3 text-sm font-bold text-orange-700 underline" onClick={() => alert('Authorizing budget for Kits...')}>Authorize Emergency Funds</button>
        </div>
      </div>
      
    </div>
  );
}
