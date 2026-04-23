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
    <div className="min-h-screen bg-[#F1F5F9] p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-black font-mukta text-slate-900 tracking-tighter">Impact Analytics</h1>
        <p className="text-slate-500 font-medium">Deep data visualization of global relief velocity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><TrendingUp className="text-emerald-500" /> Intervention Velocity</h3>
                 <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Growth: +24%</div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                 <Users className="mx-auto text-blue-500 mb-4" size={32} />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Retention Rate</p>
                 <h4 className="text-3xl font-black text-slate-900">89%</h4>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                 <Target className="mx-auto text-red-500 mb-4" size={32} />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Reach</p>
                 <h4 className="text-3xl font-black text-slate-900">12k+</h4>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                 <BarChart3 className="mx-auto text-amber-500 mb-4" size={32} />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network ROI</p>
                 <h4 className="text-3xl font-black text-slate-900">4.2x</h4>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4">
           <AuditLedger />
        </div>
      </div>
    </div>
  );
}
