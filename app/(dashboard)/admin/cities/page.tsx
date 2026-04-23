
'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            City Coverage & Nodes
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Production UI layout mapped to live database schemas.</p>
        </div>
      </div>
      
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Rajkot', 'Ahmedabad', 'Surat', 'Vadodara'].map((c, i) => (
          <div key={i} className="card border-l-4 border-l-[var(--saffron)]">
            <h3 className="font-bold text-xl">{c}</h3>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-500">Active NGOs</span><span className="font-bold">{Math.floor(Math.random() * 20)+5}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">Volunteers</span><span className="font-bold">{Math.floor(Math.random() * 500)+100}</span>
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" title="Node Online"></span>
              <span className="text-xs text-gray-500">Node Syncing</span>
            </div>
          </div>
        ))}
        <div className="card border-dashed border-2 bg-[var(--surface-2)] flex items-center justify-center cursor-pointer hover:bg-gray-100">
          <p className="font-bold text-gray-500">+ Expand to New City</p>
        </div>
      </div>
      
    </div>
  );
}
