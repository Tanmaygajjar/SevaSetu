'use client';

import { AuditLedger } from '@/components/shared/AuditLedger';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts';

const dummyData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1100 },
];

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-mukta text-slate-900 tracking-tighter">Impact Analytics</h1>
          <p className="text-slate-600 font-medium mt-1">Deep data visualization of global relief velocity and institutional performance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Export Report</button>
          <button className="px-6 py-2.5 bg-[var(--ink)] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">Refresh Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-red-500 to-blue-500" />
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><TrendingUp className="text-emerald-500" /> Intervention Velocity</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500" />
                       <span className="text-[10px] font-black text-slate-600 uppercase">Relief Units</span>
                    </div>
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Growth: +24.8%</div>
                 </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }} 
                      itemStyle={{ fontWeight: 800, color: '#0F172A' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { l: 'Retention Rate', v: '89.4%', i: Users, c: 'text-blue-600', bg: 'bg-blue-50' },
                { l: 'Target Reach', v: '12.8k', i: Target, c: 'text-red-600', bg: 'bg-red-50' },
                { l: 'Network Efficiency', v: '4.2x', i: BarChart3, c: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                   <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.c} flex items-center justify-center mb-6`}>
                      <s.i size={24} />
                   </div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{s.l}</p>
                   <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{s.v}</h4>
                   <div className="mt-4 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Optimal Range</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-8">
           <div className="h-[730px]">
              <AuditLedger />
           </div>
           <div className="mt-4 p-4 bg-slate-900 text-white rounded-3xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Network Pulse</p>
              </div>
              <p className="text-[10px] font-mono text-slate-400">0x42...F9A2</p>
           </div>
        </div>
      </div>
    </div>
  );
}
