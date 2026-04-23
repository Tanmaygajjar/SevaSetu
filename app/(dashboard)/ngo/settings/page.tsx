
'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            NGO Organization Settings
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Production UI layout mapped to live database schemas.</p>
        </div>
      </div>
      
      
      <div className="max-w-2xl mt-6 card space-y-6">
        <div><label className="block font-bold mb-1">Organization Name</label><input type="text" defaultValue="Disha Foundation" readOnly className="w-full p-2 border rounded bg-gray-50" /></div>
        <div><label className="block font-bold mb-1">Government Registration Number (FCRA/Trust)</label><input type="text" defaultValue="REG-94827-GJ" readOnly className="w-full p-2 border rounded bg-gray-50" /></div>
        <div><label className="block font-bold mb-1">Notification Emails</label><input type="text" defaultValue="admin@disha.org, alerts@disha.org" className="w-full p-2 border rounded" /></div>
        <div className="border-t pt-4">
          <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
          <button className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-50 text-sm">Deactivate Account</button>
        </div>
      </div>
      
    </div>
  );
}
