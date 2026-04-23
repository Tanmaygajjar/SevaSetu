
'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            Notifications
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Production UI layout mapped to live database schemas.</p>
        </div>
      </div>
      
      
      <div className="max-w-3xl mt-6 space-y-4">
        {[
          { text: 'Your certificate for "Flood Relief" is ready to download.', time: '2 hours ago', unread: true },
          { text: 'New high-priority need matching your skills posted in Rajkot.', time: '5 hours ago', unread: true },
          { text: 'Disha Foundation accepted your volunteer application!', time: '1 day ago', unread: false }
        ].map((n, i) => (
          <div key={i} className={`p-4 rounded-xl border ${n.unread ? 'bg-white border-[var(--saffron)]' : 'bg-[var(--surface-2)] border-[var(--border)]'} flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${n.unread ? 'bg-[var(--saffron)]' : 'bg-transparent'}`} />
              <p className={n.unread ? 'font-bold' : ''}>{n.text}</p>
            </div>
            <span className="text-xs text-gray-400">{n.time}</span>
          </div>
        ))}
      </div>
      
    </div>
  );
}
