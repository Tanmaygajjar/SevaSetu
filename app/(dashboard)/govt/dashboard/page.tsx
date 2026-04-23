'use client';
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FileBarChart, ShieldCheck, 
  AlertTriangle, Map as MapIcon, ArrowRight, Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';

export default function Page() {
  const [stats, setStats] = useState({
    ngos: 0,
    volunteers: 0,
    reports: 0,
    alerts: 0
  });
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Registered NGOs (Verified)
    const qNgos = query(collection(db, 'ngos'), where('verification_status', '==', 'verified'));
    const unsubNgos = onSnapshot(qNgos, (snap) => {
      setStats(prev => ({ ...prev, ngos: snap.size }));
    });

    // Total Volunteers
    const unsubVolunteers = onSnapshot(collection(db, 'volunteers'), (snap) => {
      setStats(prev => ({ ...prev, volunteers: snap.size }));
    });

    // Total Reports (Needs)
    const unsubReports = onSnapshot(collection(db, 'needs'), (snap) => {
      setStats(prev => ({ ...prev, reports: snap.size }));
    });

    // Active Alerts (High Urgency)
    const qAlerts = query(collection(db, 'needs'), where('urgency_score', '>=', 8));
    const unsubAlerts = onSnapshot(qAlerts, (snap) => {
      setStats(prev => ({ ...prev, alerts: snap.size }));
    });

    // Recent Incidents Feed (Taskforce Feed)
    const unsubFeed = onSnapshot(collection(db, 'needs'), (snap) => {
      const demoIncidents = [
        { id: 'f1', title: 'Medical Supply Crisis', description: 'Immediate shortage of surgical masks and sanitizers in Ward 7.', urgency_score: 9, created_at: new Date().toISOString() },
        { id: 'f2', title: 'Power Grid Fluctuation', description: 'East Zone Hospital reporting irregular power supply. Backup requested.', urgency_score: 10, created_at: new Date().toISOString() },
        { id: 'f3', title: 'Water Contamination Alert', description: 'Reports of discolored water in Mavdi area. Dispatching health inspectors.', urgency_score: 8, created_at: new Date().toISOString() }
      ];

      const feed = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRecentIncidents(feed.length > 0 ? feed.slice(0, 3) : demoIncidents);
    });

    return () => {
      unsubNgos();
      unsubVolunteers();
      unsubReports();
      unsubAlerts();
      unsubFeed();
    };
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">District Command Center</h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Official oversight for Rajkot District resources and volunteer networks.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> Official Session
           </div>
           <button onClick={() => toast.success('Syncing with global emergency nodes...')} className="btn-primary">Sync All Nodes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Registered NGOs', v: stats.ngos.toLocaleString(), d: 'Verified in District', i: Building2 },
          { l: 'Total Volunteers', v: stats.volunteers.toLocaleString(), d: 'Active in 24h', i: Users },
          { l: 'Reports Filed', v: stats.reports.toLocaleString(), d: 'Total active needs', i: FileBarChart },
          { l: 'Active Alerts', v: stats.alerts.toLocaleString(), d: 'Critical Priority', i: AlertTriangle },
        ].map((s, i) => (
          <div key={i} className="card p-6 border-l-4 border-l-blue-600 hover:shadow-xl transition-all">
             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4"><s.i size={20} /></div>
             <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{s.v}</p>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
             <p className="text-[10px] text-gray-600 mt-2">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="card p-0 bg-white relative overflow-hidden group shadow-xl border-[var(--border)] rounded-[2.5rem]">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-sm relative z-20">
                  <div>
                    <h3 className="font-black font-mukta text-2xl uppercase tracking-tight flex items-center gap-2 text-[var(--ink)]">
                      <MapIcon size={24} className="text-blue-600" /> Regional Node Analysis
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live District Resource Mapping</p>
                  </div>
                  <button onClick={() => window.location.href = '/govt/map'} className="px-5 py-2 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Satellite View <ArrowRight size={14} />
                  </button>
               </div>

               {/* Realistic Cartographic Heatmap Container */}
               <div className="h-[400px] bg-[#F1F5F9] relative overflow-hidden">
                  {/* Premium Map SVG */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                     <defs>
                        <filter id="softGlow">
                           <feGaussianBlur stdDeviation="15" result="blur" />
                           <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                     </defs>
                     
                     {/* Landmass */}
                     <path 
                       d="M50,150 C100,50 300,30 450,80 C600,120 750,80 750,250 C750,400 600,450 400,420 C200,380 50,450 50,300 Z" 
                       fill="#FFFFFF" 
                       stroke="#CBD5E1" 
                       strokeWidth="2" 
                       className="drop-shadow-sm"
                     />
                     
                     {/* Internal Zones */}
                     <path d="M250,100 L350,250 L200,400" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="4" />
                     <path d="M450,100 L400,250 L550,400" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="4" />
                     
                     {/* Subtle Infrastructure */}
                     <circle cx="400" cy="250" r="120" fill="none" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="10" className="opacity-20" />
                  </svg>
                  
                  {/* Dynamic Data Overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                     {recentIncidents.map((incident, idx) => {
                        const x = (incident.id.charCodeAt(0) * 17) % 60 + 20;
                        const y = (incident.id.charCodeAt(1) * 9) % 50 + 25;
                        const isHighUrgency = incident.urgency_score >= 8;
                        
                        return (
                           <div 
                             key={incident.id} 
                             className="absolute pointer-events-auto"
                             style={{ left: `${x}%`, top: `${y}%` }}
                           >
                              {/* Soft Heat Halo */}
                              <div className={`w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl transition-all duration-1000 ${
                                isHighUrgency ? 'bg-orange-500' : 'bg-blue-400'
                              }`} />
                              
                              {/* Pulse & Anchor */}
                              <div className="relative group/spot">
                                 <div className={`w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg z-20 ${
                                   isHighUrgency ? 'bg-orange-600 animate-pulse' : 'bg-blue-500'
                                 }`} />
                                 
                                 {/* Precision Tooltip */}
                                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/spot:opacity-100 transition-all duration-300 scale-90 group-hover/spot:scale-100">
                                    <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-white/50 w-64 space-y-3">
                                       <div className="flex justify-between items-center">
                                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                             isHighUrgency ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                          }`}>
                                             Level: {incident.urgency_score}
                                          </span>
                                          <p className="text-[10px] font-bold text-gray-400">RAJKOT-NODE</p>
                                       </div>
                                       <p className="text-sm font-black font-mukta text-[var(--ink)] leading-tight">{incident.title}</p>
                                       <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{incident.description}</p>
                                       <div className="pt-2 border-t flex justify-between items-center text-[9px] font-bold text-blue-600">
                                          <span>DEPLOY RESOURCE</span>
                                          <ArrowRight size={10} />
                                       </div>
                                    </div>
                                    <div className="w-4 h-4 bg-white/90 backdrop-blur-md rotate-45 mx-auto -mt-2 border-r border-b border-white/50" />
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Operational UI Elements */}
                  <div className="absolute bottom-8 left-8 z-20 space-y-2">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-1 bg-blue-600 rounded-full" />
                        <p className="text-sm font-black font-mukta text-[var(--ink)] uppercase tracking-tighter">Rajkot Operational Grid</p>
                     </div>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] pl-16">Node: SV-482-B</p>
                  </div>

                  <div className="absolute top-8 right-8 z-20">
                     <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[2rem] border border-white/50 shadow-xl space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
                           <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Immediate Response</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                           <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Routine Monitoring</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-gray-50/50 grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group/btn cursor-pointer hover:border-orange-200 transition-all">
                     <p className="text-3xl font-black font-mukta text-orange-600">08</p>
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mt-1 group-hover/btn:text-orange-400 transition-colors">West Priority</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group/btn cursor-pointer hover:border-blue-200 transition-all">
                     <p className="text-3xl font-black font-mukta text-blue-600">12</p>
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mt-1 group-hover/btn:text-blue-400 transition-colors">East Nodes</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group/btn cursor-pointer hover:border-emerald-200 transition-all">
                     <p className="text-3xl font-black font-mukta text-emerald-600">04</p>
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mt-1 group-hover/btn:text-emerald-400 transition-colors">Suburbs Sync</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="font-bold font-mukta text-xl">Official Taskforce Feed</h3>
            <div className="space-y-4">
               {recentIncidents.map((f) => (
                  <div key={f.id} onClick={() => window.location.href = `/govt/reports?id=${f.id}`} className="card p-4 border-none bg-blue-900 text-white hover:scale-105 transition-transform cursor-pointer">
                     <p className="text-xs font-bold mb-1 flex items-center gap-2 tracking-tight">
                       <Zap size={10} className={f.urgency_score >= 8 ? "text-yellow-400 animate-pulse" : "text-blue-300"} /> 
                       {f.title}
                     </p>
                     <p className="text-[10px] opacity-70 leading-relaxed line-clamp-2">{f.description}</p>
                  </div>
               ))}
               {recentIncidents.length === 0 && (
                 <div className="text-center py-8 text-gray-600 text-xs font-bold uppercase bg-gray-50 rounded-xl border border-dashed">
                   No recent incidents
                 </div>
               )}
               <button onClick={() => window.location.href = '/govt/reports'} className="w-full py-4 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors uppercase tracking-widest">View All Incidents</button>
            </div>
         </div>
      </div>
    </div>
  );
}
