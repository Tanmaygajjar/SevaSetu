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
      try {
        const demoIncidents = [
          { id: 'f1', title: 'Medical Supply Crisis', description: 'Immediate shortage of surgical masks and sanitizers in Ward 7.', urgency_score: 9, created_at: new Date().toISOString() },
          { id: 'f2', title: 'Power Grid Fluctuation', description: 'East Zone Hospital reporting irregular power supply. Backup requested.', urgency_score: 10, created_at: new Date().toISOString() },
          { id: 'f3', title: 'Water Contamination Alert', description: 'Reports of discolored water in Mavdi area. Dispatching health inspectors.', urgency_score: 8, created_at: new Date().toISOString() }
        ];

        const feed = snap.docs.map(doc => {
          const data = doc.data();
          // Handle Firestore Timestamp vs ISO String
          let createdAt = data.created_at;
          if (createdAt && typeof createdAt.toDate === 'function') {
            createdAt = createdAt.toDate().toISOString();
          } else if (!createdAt) {
            createdAt = new Date().toISOString();
          }
          
          return { id: doc.id, ...data, created_at: createdAt };
        });

        // Sort by date descending
        feed.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setRecentIncidents(feed.length > 0 ? feed.slice(0, 5) : demoIncidents);
      } catch (err) {
        console.error("Error processing feed:", err);
        // Fallback to demo data on error to prevent blank screen
        setRecentIncidents([
          { id: 'f1', title: 'Connection Error', description: 'Real-time feed sync interrupted. Reconnecting...', urgency_score: 1, created_at: new Date().toISOString() }
        ]);
      }
    }, (error) => {
      console.error("Firestore Snapshot Error:", error);
      toast.error("Failed to connect to live taskforce feed.");
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
            <div className="card p-0 bg-slate-900 relative overflow-hidden group shadow-2xl border-slate-800 rounded-[2rem]">
               <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-md relative z-20">
                  <div>
                    <h3 className="font-bold font-mukta text-xl uppercase tracking-wider flex items-center gap-2 text-white">
                      <MapIcon size={20} className="text-blue-400" /> Regional Node Analysis
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Live District Resource Topology</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-2">
                       <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYSTEM ACTIVE
                       </span>
                       <span className="text-[8px] font-mono text-slate-500 uppercase">Latency: 24ms</span>
                    </div>
                    <button onClick={() => window.location.href = '/govt/map'} className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all">
                      <Zap size={16} />
                    </button>
                  </div>
               </div>

               {/* Cartographic Grid Container */}
               <div className="h-[450px] bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {/* Digital Grid Background */}
                  <div className="absolute inset-0 opacity-20" 
                       style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-60" />
                  
                  {/* Technical Scanline Effect */}
                  <div className="absolute inset-0 pointer-events-none z-20 opacity-5" 
                       style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

                  {/* Stylized District Map */}
                  <svg className="w-[85%] h-[85%] opacity-40" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
                     <path 
                       d="M100,200 Q150,100 300,80 T500,150 T700,300 T550,450 T300,420 T100,350 Z" 
                       fill="none" 
                       stroke="#334155" 
                       strokeWidth="1.5" 
                       strokeDasharray="5,5" 
                     />
                     <circle cx="400" cy="250" r="180" fill="none" stroke="#1e293b" strokeWidth="1" />
                     <circle cx="400" cy="250" r="100" fill="none" stroke="#1e293b" strokeWidth="1" />
                     <line x1="400" y1="50" x2="400" y2="450" stroke="#1e293b" strokeWidth="1" />
                     <line x1="150" y1="250" x2="650" y2="250" stroke="#1e293b" strokeWidth="1" />
                  </svg>
                  
                  {/* Dynamic Nodes Overlay */}
                  <div className="absolute inset-0 z-10">
                     {recentIncidents.map((incident, idx) => {
                        // More distributed positioning logic
                        const seed = incident.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                        const x = (seed * 13) % 70 + 15;
                        const y = (seed * 7) % 60 + 20;
                        const isHighUrgency = incident.urgency_score >= 8;
                        
                        return (
                           <div 
                             key={incident.id} 
                             className="absolute transition-all duration-500"
                             style={{ left: `${x}%`, top: `${y}%` }}
                           >
                              {/* Pulse Layer */}
                              <div className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border ${
                                isHighUrgency ? 'border-red-500/30 bg-red-500/10' : 'border-blue-500/30 bg-blue-500/10'
                              } animate-ping`} />
                              
                              {/* Node Point */}
                              <div className="relative group/node">
                                 <div className={`w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg z-20 cursor-pointer ${
                                   isHighUrgency ? 'bg-red-500' : 'bg-blue-400'
                                 }`} />
                                 
                                 {/* Technical Tooltip */}
                                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all duration-200 pointer-events-none z-30">
                                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl w-48 space-y-2">
                                       <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                                          <span className="text-[8px] font-mono text-slate-500">NODE_ID: {incident.id.slice(0,6)}</span>
                                          <span className={`text-[8px] font-bold ${isHighUrgency ? 'text-red-400' : 'text-blue-400'}`}>
                                             {isHighUrgency ? 'CRITICAL' : 'STABLE'}
                                          </span>
                                       </div>
                                       <p className="text-[11px] font-bold text-white leading-tight">{incident.title}</p>
                                       <p className="text-[9px] text-slate-400 line-clamp-1">{incident.description}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Corner Coordinates */}
                  <div className="absolute top-4 left-4 font-mono text-[8px] text-slate-600 space-y-1">
                     <p>LAT: 22.3039° N</p>
                     <p>LNG: 70.8022° E</p>
                  </div>
                  <div className="absolute bottom-4 right-4 font-mono text-[8px] text-slate-600">
                     <p>R-NODE_AUTH_7492-X</p>
                  </div>
               </div>

               {/* Bottom Stats Grid */}
               <div className="p-4 bg-slate-900 grid grid-cols-3 gap-4 border-t border-white/5">
                  {[
                    { label: 'Priority Nodes', val: recentIncidents.filter(i => i.urgency_score >= 8).length, color: 'text-red-400' },
                    { label: 'Active Matching', val: '142', color: 'text-blue-400' },
                    { label: 'Resource Sync', val: '98%', color: 'text-emerald-400' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                       <span className={`text-xl font-bold font-mukta ${stat.color}`}>{stat.val}</span>
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="font-bold font-mukta text-xl text-slate-800">Official Taskforce Feed</h3>
               <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
               </span>
            </div>

            <div className="space-y-3">
               {recentIncidents.map((f) => {
                  const date = new Date(f.created_at);
                  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const isHigh = f.urgency_score >= 8;

                  return (
                     <div 
                        key={f.id} 
                        onClick={() => window.location.href = `/govt/reports?id=${f.id}`} 
                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-lg ${
                           isHigh 
                           ? 'bg-red-50 border-red-100 hover:border-red-200' 
                           : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ${
                              isHigh ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                           }`}>
                              {isHigh ? 'Urgent Alert' : 'Log Entry'}
                           </span>
                           <span className="text-[9px] font-mono text-slate-400">{timeStr}</span>
                        </div>
                        <h4 className={`text-sm font-bold font-mukta mb-1 group-hover:text-blue-600 transition-colors ${
                           isHigh ? 'text-red-900' : 'text-slate-800'
                        }`}>
                           {f.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{f.description}</p>
                        
                        {/* Interactive Hint */}
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowRight size={14} className={isHigh ? "text-red-400" : "text-blue-400"} />
                        </div>
                     </div>
                  );
               })}

               {recentIncidents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <AlertTriangle className="text-slate-300 mb-2" size={32} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Incidents Found</p>
                  </div>
               )}

               <button 
                  onClick={() => window.location.href = '/govt/reports'} 
                  className="w-full py-4 text-[10px] font-black text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all uppercase tracking-[0.2em] shadow-sm active:scale-95"
               >
                  Access Full Archives
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
