'use client';
import React from 'react';
import { MapPin, Search, Filter, Layers, Navigation, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[var(--surface)] overflow-hidden">
      <div className="w-full md:w-80 bg-white border-r border-[var(--border)] flex flex-col">
         <div className="p-6 border-b">
            <h2 className="text-xl font-bold font-mukta text-[var(--ink)] mb-4">GIS Surveillance</h2>
            <div className="relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
               <input type="text" placeholder="Search ward or site..." className="input pl-10 text-xs" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Live Heat Signature</p>
            {[
              { n: 'Mavdi Market Area', l: 'Critical', c: 'text-red-500' },
              { n: 'Rajkot Bus Port', l: 'High Active', c: 'text-orange-500' },
              { n: 'Metoda GIDC Zone', l: 'Stable', c: 'text-green-500' },
              { n: 'Nana Mava Site', l: 'Verified', c: 'text-blue-500' },
            ].map((s, i) => (
              <div key={i} className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] hover:border-blue-600 transition-all cursor-pointer">
                 <div className="flex justify-between items-center mb-1"><p className="font-bold text-sm">{s.n}</p><span className={`text-[9px] font-bold uppercase ${s.c}`}>{s.l}</span></div>
                 <p className="text-[10px] text-gray-600">Last heartbeat: 42 seconds ago</p>
              </div>
            ))}
         </div>
         <div className="p-6 border-t bg-gray-50">
            <button onClick={() => toast.success('Reporting official incident...')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-blue-700">Flag Incident</button>
         </div>
      </div>
      <div className="flex-1 relative bg-slate-200">
         {/* Live OpenStreetMap simulation */}
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.682020295!2d70.7301056!3d22.299105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c98ac1682521%3A0x1da901c530e38600!2sRajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            className="w-full h-full grayscale opacity-80"
            loading="lazy"
         ></iframe>
         <div className="absolute top-6 right-6 flex flex-col gap-3">
            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all"><Layers size={24} /></button>
            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all"><Navigation size={24} /></button>
            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all"><Info size={24} /></button>
         </div>
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-4 bg-white/90 backdrop-blur rounded-3xl shadow-2xl flex items-center gap-6 border border-white">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> <span className="text-[10px] font-bold uppercase">Danger Hub</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-full" /> <span className="text-[10px] font-bold uppercase">Active Deployment</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full" /> <span className="text-[10px] font-bold uppercase">Official Center</span></div>
         </div>
      </div>
    </div>
  );
}
