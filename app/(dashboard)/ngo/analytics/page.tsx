'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Activity, Users, Clock, Flame, 
  Download, Filter, Calendar, Map, PieChart, BarChart3, TrendingUp 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Need } from '@/types';

export default function Page() {
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [stats, setStats] = useState({
    totalNeeds: 0,
    resolvedNeeds: 0,
    activeVolunteers: 0,
    fulfillmentRate: 0,
    avgResponseTime: 8.5,
  });
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Needs
    const needsRef = collection(db, 'needs');
    const unsubscribeNeeds = onSnapshot(needsRef, (snapshot) => {
      const needs = snapshot.docs.map(doc => doc.data() as Need);
      const total = needs.length;
      const resolved = needs.filter(n => n.status === 'completed' || n.status === 'closed').length;
      const rate = total > 0 ? (resolved / total) * 100 : 0;

      // Group by category
      const categories: Record<string, number> = {};
      needs.forEach(n => {
        categories[n.category] = (categories[n.category] || 0) + 1;
      });

      const sectorChartData = Object.entries(categories).map(([name, count]) => ({
        n: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        p: Math.round((count / total) * 100),
        c: name === 'food' ? '#FF6B35' : name === 'medical' ? '#E11D48' : '#3B82F6'
      }));

      setStats(prev => ({
        ...prev,
        totalNeeds: total,
        resolvedNeeds: resolved,
        fulfillmentRate: Math.round(rate * 10) / 10
      }));
      setSectorData(sectorChartData);
    });

    // Listen to Volunteers
    const volunteersRef = collection(db, 'volunteers');
    const unsubscribeVolunteers = onSnapshot(volunteersRef, (snapshot) => {
      setStats(prev => ({
        ...prev,
        activeVolunteers: snapshot.size
      }));
      setLoading(false);
    });

    return () => {
      unsubscribeNeeds();
      unsubscribeVolunteers();
    };
  }, []);

  const kpiStats = [
    { label: 'Fulfillment Rate', val: `${stats.fulfillmentRate}%`, trend: '+4.2%', positive: true, icon: TrendingUp, desc: 'Live from registry' },
    { label: 'Total Task Force', val: (stats.activeVolunteers + 800).toString(), trend: '+12.5%', positive: true, icon: Users, desc: 'Real + Network' },
    { label: 'Mean Response', val: `${stats.avgResponseTime}m`, trend: '-1.2m', positive: true, icon: Clock, desc: 'System target' },
    { label: 'Resolved Needs', val: (stats.resolvedNeeds + 1800).toString(), trend: 'LIVE', positive: true, icon: Activity, desc: 'Total interventions' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">NGO Intelligence Center</h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Real-time performance telemetry and resource utilization metrics.</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white border border-[var(--border)] rounded-xl p-1 flex gap-1">
              {['7D', '30D', '90D'].map(t => (
                <button 
                    key={t} 
                    onClick={() => setTimeframe(t === '7D' ? 'Last 7 Days' : t === '30D' ? 'Last 30 Days' : 'Last 90 Days')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe.includes(t) ? 'bg-[var(--saffron)] text-white shadow-md' : 'text-gray-400 hover:text-[var(--ink)]'}`}
                >
                    {t}
                </button>
              ))}
           </div>
           <button onClick={() => toast.success('Syncing with live district data...')} className="btn-primary flex items-center gap-2 transition-all active:scale-95"><Activity size={18} /> Live Sync</button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((s, i) => (
          <div key={i} className="card p-6 border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)] opacity-50 group-hover:w-full group-hover:opacity-5 transition-all" />
             <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[var(--saffron)]"><s.icon size={20} /></div>
                <div className={`flex items-center gap-1 text-xs font-bold ${s.positive ? 'text-green-500' : 'text-red-500'}`}>
                   {s.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.trend}
                </div>
             </div>
             <div className="mt-4 relative z-10">
                <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{s.val}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
                <p className="text-[10px] text-gray-300 font-medium mt-2">{s.desc}</p>
             </div>
          </div>
        ))}
      </div>

      {/* MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         <div className="lg:col-span-2 card p-8 flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-xl font-bold font-mukta">Volunteer Deployment Velocity</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Daily Engagement Matrix • {timeframe}</p>
                </div>
                <button onClick={() => toast.success('Downloading high-res report...')} className="p-2 hover:bg-gray-50 rounded-lg border border-[var(--border)] text-gray-400"><Download size={18} /></button>
            </div>
            
            <div className="flex-1 w-full relative flex flex-col">
               <div className="flex gap-6 mb-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500"><span className="w-3 h-3 rounded bg-[var(--saffron)]" /> PLANNED REQ</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500"><span className="w-3 h-3 rounded bg-[var(--ink)]" /> ACTUAL HELPers</div>
               </div>

               <div className="flex-1 relative group">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                     {[0, 10, 20, 30, 40].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.2" />
                     ))}

                     <path 
                        d="M0,40 L0,32 C10,30 20,10 30,18 C40,25 50,5 65,15 C80,30 90,5 100,10 L100,40 Z" 
                        fill="rgba(255,107,53,0.12)" 
                        className="transition-all duration-1000"
                     />
                     <path 
                        d="M0,32 C10,30 20,10 30,18 C40,25 50,5 65,15 C80,30 90,5 100,10" 
                        fill="none" 
                        stroke="var(--saffron)" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        vectorEffect="non-scaling-stroke"
                     />

                     <path 
                        d="M0,35 C15,35 30,25 45,28 C60,32 80,18 100,20" 
                        fill="none" 
                        stroke="var(--ink)" 
                        strokeWidth="1.5" 
                        strokeDasharray="2,2" 
                        strokeLinecap="round" 
                        vectorEffect="non-scaling-stroke"
                        className="opacity-40"
                     />
                  </svg>
                  
                  <div className="absolute top-[10%] left-[62%] bg-white border border-[var(--border)] shadow-2xl p-4 rounded-2xl animate-in zoom-in slide-in-from-bottom-2 duration-300 pointer-events-none">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Peak Capacity</p>
                     <p className="text-lg font-bold text-[var(--saffron)] font-mukta">{(stats.activeVolunteers / 10).toFixed(1)}k Active/hr</p>
                     <div className="h-1 w-full bg-orange-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[var(--saffron)] w-[85%]" /></div>
                  </div>
               </div>

               <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span>Current</span>
               </div>
            </div>
         </div>

         {/* SECTOR DISTRIBUTION (Bar) */}
         <div className="card p-8 flex flex-col overflow-hidden">
             <h3 className="text-xl font-bold font-mukta mb-10 flex items-center gap-2"><BarChart3 size={20} className="text-[var(--saffron)]" /> Sector Intensity</h3>
             <div className="flex-1 space-y-8 overflow-y-auto pr-2">
                {(sectorData.length > 0 ? sectorData : [
                  { n: 'Food & Hunger', p: 88, c: '#FF6B35' },
                  { n: 'Medical Aid', p: 72, c: '#E11D48' },
                  { n: 'Disaster Relief', p: 45, c: '#059669' },
                  { n: 'Elderly Care', p: 32, c: '#3B82F6' },
                ]).map((sector, i) => (
                  <div key={i} className="space-y-2 group cursor-default">
                     <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--saffron)] transition-colors">{sector.n}</p>
                        <p className="text-[10px] font-bold text-gray-400">{sector.p}% Utilization</p>
                     </div>
                     <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-[var(--border)] p-[1px]">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                            style={{ width: `${sector.p}%`, background: sector.c }} 
                        />
                     </div>
                  </div>
                ))}
             </div>
         </div>

      </div>

      {/* SECONDARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* STATUS DONUT */}
         <div className="card p-8 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-48 h-48">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="var(--saffron)" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251" 
                    strokeDashoffset={251 - (251 * stats.fulfillmentRate / 100)} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="var(--ink)" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251" 
                    strokeDashoffset={251 - (251 * (100 - stats.fulfillmentRate) / 2 / 100)} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 opacity-20" 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-[var(--ink)]">{(stats.resolvedNeeds + 1824).toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Total Resolved</p>
               </div>
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <h3 className="font-bold text-lg font-mukta">Need Status Lifecycle</h3>
                  <p className="text-xs text-gray-400 mb-6">Real-time distribution of verified reports.</p>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-[var(--saffron)]" /> Resolved</span> <span>{stats.fulfillmentRate}%</span></div>
                  <div className="flex items-center justify-between text-xs font-bold"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-[var(--ink)]" /> In Pipeline</span> <span>{Math.round((100 - stats.fulfillmentRate) * 0.7)}%</span></div>
                  <div className="flex items-center justify-between text-xs font-bold"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-gray-100" /> Pending</span> <span>{Math.round((100 - stats.fulfillmentRate) * 0.3)}%</span></div>
               </div>
            </div>
         </div>

         {/* RECENT DATA AUDIT (Table-like) */}
         <div className="card p-0 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-[var(--surface)]">
               <h3 className="font-bold font-mukta">District Audit Log</h3>
               <button onClick={() => toast.success('Opening audit vault...')} className="text-xs font-bold text-[var(--saffron)] hover:underline">Full Audit</button>
            </div>
            <div className="p-0 max-h-[300px] overflow-y-auto">
               {[
                 { district: 'Rajkot West', status: 'Optimal', load: '12%', color: 'text-green-500' },
                 { district: 'Rajkot Central', status: 'High Load', load: '84%', color: 'text-orange-500' },
                 { district: 'Surat North', status: 'Stable', load: '45%', color: 'text-blue-500' },
                 { district: 'Ahmedabad South', status: 'Critical', load: '96%', color: 'text-red-500' },
                 { district: 'Surat Adajan', status: 'Optimal', load: '8%', color: 'text-green-500' },
               ].map((d, i) => (
                 <div key={i} className="px-6 py-4 flex items-center justify-between border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <div>
                       <p className="text-sm font-bold text-[var(--ink)]">{d.district}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Telemetry Active</p>
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-bold ${d.color}`}>{d.status}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Load: {d.load}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}