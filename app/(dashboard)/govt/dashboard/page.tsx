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

    // Recent Incidents Feed
    const qFeed = query(collection(db, 'needs'), orderBy('created_at', 'desc'), limit(3));
    const unsubFeed = onSnapshot(qFeed, (snap) => {
      const feed = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentIncidents(feed);
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
             <p className="text-[10px] text-gray-400 mt-2">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="card p-8 bg-white space-y-6">
               <h3 className="font-bold font-mukta text-xl flex items-center justify-between">
                  District Priority Heatmap
                  <button onClick={() => window.location.href = '/govt/map'} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">Full Analytics <ArrowRight size={12} /></button>
               </h3>
               <div className="h-64 bg-[var(--surface-2)] rounded-3xl relative overflow-hidden flex items-center justify-center border border-dashed border-[var(--border)]">
                  <MapIcon size={48} className="text-gray-300 animate-pulse" />
                  <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-lg text-[10px] font-bold border">RAJKOT METRO ZONE</div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded-2xl bg-red-50 border-red-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => toast('Filtering West Zone priority')}>
                     <p className="text-xl font-bold text-red-600">High</p>
                     <p className="text-[10px] font-bold uppercase text-red-400">West Zone</p>
                  </div>
                  <div className="text-center p-3 border rounded-2xl bg-blue-50 border-blue-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => toast('Filtering East Zone priority')}>
                     <p className="text-xl font-bold text-blue-600">Stable</p>
                     <p className="text-[10px] font-bold uppercase text-blue-400">East Zone</p>
                  </div>
                  <div className="text-center p-3 border rounded-2xl bg-green-50 border-green-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => toast('Filtering Suburbs priority')}>
                     <p className="text-xl font-bold text-green-600">Optimal</p>
                     <p className="text-[10px] font-bold uppercase text-green-400">Suburbs</p>
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
                 <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase bg-gray-50 rounded-xl border border-dashed">
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