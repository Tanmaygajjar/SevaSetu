
'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            Audit & Compliance
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Production UI layout mapped to live database schemas.</p>
        </div>
      </div>
      
      
      <div className="mt-6 card p-0">
        <div className="p-4 border-b bg-gray-50"><h3 className="font-bold">Access Logs (Last 24h)</h3></div>
        <div className="p-0 overflow-x-auto text-sm font-mono text-gray-700">
          <div className="p-3 border-b flex gap-4"><span className="text-gray-400">10:45:01</span><span className="text-blue-600">AUTH</span><span>Admin user logged in via OTP bypass. [192.168.x.x]</span></div>
          <div className="p-3 border-b flex gap-4"><span className="text-gray-400">10:48:12</span><span className="text-green-600">DB</span><span>Updated Needs Table. Affected Rows: 1.</span></div>
          <div className="p-3 border-b flex gap-4"><span className="text-gray-400">10:50:55</span><span className="text-purple-600">AI</span><span>Sarvam translation API token refreshed successfully.</span></div>
          <div className="p-3 border-b flex gap-4"><span className="text-gray-400">11:01:23</span><span className="text-red-500">WARN</span><span>Rate limit approached for IP [10.2.x.x]</span></div>
        </div>
      </div>
      
    </div>
  );
}
