'use client';
import React from 'react';
import { Search, Filter, Shield, UserX, UserCheck, MoreVertical, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const users = [
    { n: 'Arjun Mehta', r: 'Volunteer', s: 'Active', k: '1.2k', d: 'Rajkot' },
    { n: 'Deepika Rao', r: 'NGO Admin', s: 'Verified', k: '450', d: 'Surat' },
    { n: 'Vicky Sharma', r: 'Govt Officer', s: 'Critical', k: '8.2k', d: 'Ahmedabad' },
    { n: 'Sneha Kapur', r: 'Volunteer', s: 'Active', k: '2.1k', d: 'Baroda' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Identity Management</h1><p className="text-[var(--ink-muted)]">Control access for 18,492 platform participants.</p></div>
        <div className="flex gap-4">
           <div className="relative w-64"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search by UID..." className="input pl-10" /></div>
           <button className="p-3 bg-white border border-[var(--border)] rounded-xl"><Filter size={20} /></button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-[var(--border)] text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">
               <tr>
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Karma / Rating</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Governance</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
               {users.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center font-bold text-xs">{u.n[0]}</div>
                           <div><p className="font-bold text-sm text-[var(--ink)]">{u.n}</p><p className="text-[10px] text-gray-400 font-bold uppercase">UID: {Math.floor(Math.random()*10000)}</p></div>
                        </div>
                     </td>
                     <td className="px-6 py-4"><span className="px-2 py-1 bg-white border border-[var(--border)] rounded-md text-[10px] font-bold text-gray-500 uppercase">{u.r}</span></td>
                     <td className="px-6 py-4"><span className="flex items-center gap-1 text-xs font-bold text-[var(--saffron)]"><Star size={12} fill="currentColor" /> {u.k}</span></td>
                     <td className="px-6 py-4 text-xs font-medium text-gray-500">{u.d}</td>
                     <td className="px-6 py-4">
                        <div className="flex gap-2">
                           <button onClick={() => toast.success('Moderation Panel Opened')} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[var(--ink)]"><Shield size={14} /></button>
                           <button onClick={() => toast.error('User access restricted temporarily')} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500"><UserX size={14} /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}