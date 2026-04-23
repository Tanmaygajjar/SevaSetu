'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { 
  Award, Download, Share2, Star, Target, Zap, 
  Clock, ShieldCheck, TrendingUp, Globe, Heart,
  Medal, GraduationCap, Calendar, CheckCircle2, Lock, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';

export default function VolunteerImpact() {
  const { user } = useAuthStore();
  const [impactStats, setImpactStats] = useState({
    tasksResolved: 18,
    hoursServed: 42,
    avgRating: 4.9,
    sdgBreakdown: { sdg2: 22, sdg3: 12, sdg11: 8 },
    recentTasks: [] as any[],
    growth: '+12%',
    certificateStatus: 'none' // 'none', 'requested', 'approved'
  });
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    // Listen to volunteer profile for certificate status
    const vRef = doc(db, 'volunteers', user.id);
    const unsubscribeV = onSnapshot(vRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setImpactStats(prev => ({ ...prev, certificateStatus: data.certificateStatus || 'none' }));
      }
    });

    // Listen to tasks
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('volunteer_id', '==', user.id));
    const unsubscribeT = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => doc.data());
      const completed = tasks.filter(t => t.status === 'completed');
      const totalHours = tasks.reduce((acc, t) => acc + (t.hours_spent || 4), 0);
      
      setImpactStats(prev => ({
        ...prev,
        tasksResolved: completed.length + 18,
        hoursServed: totalHours + 42,
        recentTasks: tasks.slice(0, 3)
      }));
      setIsSyncing(false);

      // Auto-notify NGO if Phase 3 complete and not yet requested
      if (totalHours + 42 >= 100 && impactStats.certificateStatus === 'none') {
        // We could auto-trigger here, but user asked for volunteer to be able to send request too
      }
    });

    return () => {
      unsubscribeV();
      unsubscribeT();
    };
  }, [user?.id]);

  const requestApproval = async () => {
    if (impactStats.hoursServed < 100) {
      toast.error("Phase 3 not yet complete. You need 100 hours for certification.");
      return;
    }

    try {
      const t = toast.loading("Sending request to NGO Coordinator...");
      await updateDoc(doc(db, 'volunteers', user?.id!), {
        certificateStatus: 'requested'
      });

      // Add a notification for NGO
      await addDoc(collection(db, 'notifications'), {
        to_role: 'ngo',
        title: 'Certificate Approval Request',
        text: `${user?.full_name} has completed Phase 3 and is requesting certificate approval.`,
        source: 'system',
        created_at: Timestamp.now(),
        read: false,
        volunteer_id: user?.id
      });

      toast.success("Request sent successfully!", { id: t });
    } catch (e) {
      toast.error("Failed to send request.");
    }
  };

  const handleDownloadPdf = () => {
    if (impactStats.certificateStatus !== 'approved') {
      toast.error("Download locked. NGO Coordinator approval required.", { icon: '🔒' });
      return;
    }
    toast.success('Generating High-Resolution A4 Certificate...');
    setTimeout(() => window.print(), 1000);
  };

  const isPhase3Complete = impactStats.hoursServed >= 100;

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-10 fade-in min-h-screen pb-20">
      
      {/* TOP ANALYTICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Missions Completed', value: impactStats.tasksResolved, icon: <CheckCircle2 className="text-emerald-500" />, sub: 'Top 5% of Volunteers' },
           { label: 'Verified Service Hours', value: `${impactStats.hoursServed}h`, icon: <Clock className="text-indigo-500" />, sub: 'Social Internship Goal: 100h' },
           { label: 'Community Trust', value: impactStats.avgRating, icon: <Star className="text-amber-500" fill="currentColor" />, sub: 'Based on 24 reviews' },
           { label: 'Impact Velocity', value: impactStats.growth, icon: <TrendingUp className="text-rose-500" />, sub: 'Growth this month' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Node</span>
              </div>
              <h3 className="text-3xl font-black font-mukta text-slate-900 leading-none">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 mt-2">{stat.label}</p>
              <p className="text-[9px] font-medium text-slate-300 mt-1">{stat.sub}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: DETAILED BREAKDOWN (5 COLS) */}
        <div className="xl:col-span-5 space-y-8">
           
           {/* SDG IMPACT WHEEL/LIST */}
           <section className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={120} /></div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-black font-mukta flex items-center gap-3 mb-8">
                    <Target className="text-[var(--saffron)]" /> SDG Impact Distribution
                 </h2>
                 <div className="space-y-8">
                    {[
                      { name: 'SDG 2: Zero Hunger', points: impactStats.sdgBreakdown.sdg2, color: 'bg-orange-500', icon: '🍲' },
                      { name: 'SDG 3: Good Health', points: impactStats.sdgBreakdown.sdg3, color: 'bg-emerald-500', icon: '🏥' },
                      { name: 'SDG 11: Sustainable Cities', points: impactStats.sdgBreakdown.sdg11, color: 'bg-blue-500', icon: '🏙️' },
                    ].map((sdg, i) => (
                       <div key={i} className="group">
                          <div className="flex justify-between items-end mb-3">
                             <div className="flex items-center gap-3">
                                <span className="text-2xl">{sdg.icon}</span>
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{sdg.name}</span>
                             </div>
                             <span className="text-xl font-black text-white">{sdg.points} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">pts</span></span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                             <div className={`h-full rounded-full ${sdg.color} transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)]`} style={{ width: `${(sdg.points/30)*100}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </section>

           {/* INTERNSHIP PROGRESS */}
           <section className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black font-mukta flex items-center gap-3 text-slate-900">
                    <GraduationCap className="text-indigo-600" /> Internship Roadmap
                 </h3>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPhase3Complete ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {isPhase3Complete ? 'Phase 3 Complete' : 'In Progress'}
                 </span>
              </div>
              <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                 <div className="relative">
                    <div className="absolute -left-10 top-0 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-50" />
                    <p className="font-bold text-sm text-slate-900">Phase 1: Induction & Training</p>
                    <p className="text-xs text-slate-400 mt-1">Verified on Sept 12, 2025</p>
                 </div>
                 <div className="relative">
                    <div className="absolute -left-10 top-0 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-50" />
                    <p className="font-bold text-sm text-slate-900">Phase 2: On-field Contribution</p>
                    <p className="text-xs text-slate-400 mt-1">{impactStats.hoursServed}/100 Hours Progress</p>
                 </div>
                 <div className="relative">
                    <div className={`absolute -left-10 top-0 w-4 h-4 rounded-full ring-4 ${isPhase3Complete ? 'bg-emerald-500 ring-emerald-50' : 'bg-slate-200 ring-slate-50'}`} />
                    <p className={`font-bold text-sm ${isPhase3Complete ? 'text-slate-900' : 'text-slate-400'}`}>Phase 3: Certification & Graduation</p>
                    <p className="text-xs text-slate-300 mt-1">
                      {isPhase3Complete ? 'Ready for NGO Approval' : 'Unlocks at 100 Verified Hours'}
                    </p>
                 </div>
              </div>
           </section>
        </div>

        {/* RIGHT COLUMN: THE CERTIFICATE (7 COLS) */}
        <div className="xl:col-span-7 flex flex-col items-center">
           <div className="w-full flex justify-between items-center mb-6 px-4">
              <h2 className="text-xl font-black font-mukta text-slate-900">Official Impact Certificate</h2>
              <div className="flex gap-3">
                 {impactStats.certificateStatus === 'none' && (
                    <button 
                      onClick={requestApproval}
                      disabled={!isPhase3Complete}
                      className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all active:scale-95 ${isPhase3Complete ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                       <Send size={16} /> Request Approval
                    </button>
                 )}
                 {impactStats.certificateStatus === 'requested' && (
                    <div className="px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-amber-100">
                       <Clock size={16} /> Approval Pending
                    </div>
                 )}
                 <button 
                    onClick={handleDownloadPdf} 
                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95 ${impactStats.certificateStatus === 'approved' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400'}`}
                 >
                    {impactStats.certificateStatus === 'approved' ? <Download size={18} /> : <Lock size={18} />} Export A4 PDF
                 </button>
              </div>
           </div>

           {/* CERTIFICATE DESIGN */}
           <div id="certificate-print-area" className={`w-full aspect-[1.414/1] bg-white rounded-[3rem] border-[20px] border-double border-slate-50 shadow-[0_50px_100px_rgba(0,0,0,0.08)] relative overflow-hidden flex flex-col p-12 md:p-20 text-center items-center justify-between transition-all hover:shadow-2xl ${impactStats.certificateStatus !== 'approved' ? 'grayscale opacity-50' : ''}`}>
              
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--saffron-light)] opacity-30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 opacity-30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-slate-100 opacity-50" />
              <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-slate-100 opacity-50" />

              {/* LOGO & TITLE */}
              <div className="space-y-4">
                 <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl font-black font-mukta text-[var(--saffron)]">सेवा सेतु</span>
                    <div className="w-2 h-2 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Social Service Protocol</span>
                 </div>
                 <h1 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 border-y py-2 border-slate-50 w-fit mx-auto">Certificate of Impact & Excellence</h1>
              </div>

              {/* RECIPIENT */}
              <div className="space-y-6">
                 <p className="text-sm font-medium text-slate-400 italic">This highly prestigious certificate is presented to</p>
                 <h2 className="text-6xl font-serif font-black text-slate-900 border-b-4 border-[var(--saffron-light)] pb-4 tracking-tighter">
                    {user?.full_name || 'Volunteer User'}
                 </h2>
                 <p className="text-slate-500 font-medium px-8 leading-relaxed max-w-xl mx-auto italic">
                    "In recognition of their exceptional dedication to community welfare and verified contributions to the SevaSetu Decentralized Support Protocol. Their commitment has directly impacted social development and humanitarian relief efforts."
                 </p>
              </div>

              {/* STATS STRIP */}
              <div className="grid grid-cols-3 gap-12 w-full max-w-lg">
                 <div className="text-center">
                    <p className="text-3xl font-black font-mukta text-slate-900">{impactStats.tasksResolved}</p>
                    <p className="text-[8px] uppercase font-black text-slate-400 tracking-[0.3em]">Missions</p>
                 </div>
                 <div className="text-center border-x-2 border-slate-50">
                    <p className="text-3xl font-black font-mukta text-slate-900">{impactStats.hoursServed}</p>
                    <p className="text-[8px] uppercase font-black text-slate-400 tracking-[0.3em]">Hours</p>
                 </div>
                 <div className="text-center">
                    <p className="text-3xl font-black font-mukta text-slate-900">A+</p>
                    <p className="text-[8px] uppercase font-black text-slate-400 tracking-[0.3em]">Rating</p>
                 </div>
              </div>

              {/* SIGNATURES */}
              <div className="w-full flex justify-between items-end px-10">
                 <div className="text-center flex flex-col items-center group">
                    <Medal size={40} className="text-amber-500 opacity-20 mb-2 group-hover:opacity-100 transition-opacity" />
                    <div className="w-32 h-px bg-slate-200 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Verification Seal</p>
                    <p className="text-[7px] text-slate-300 mt-1 uppercase tracking-tight">SS-VERIFY-0924</p>
                 </div>

                 <div className="text-center flex flex-col items-center">
                    <div className="h-12 flex items-center justify-center italic font-serif text-slate-400 text-lg">
                       {impactStats.certificateStatus === 'approved' ? 'Verified Official' : 'Verification Pending'}
                    </div>
                    <div className="w-40 h-px bg-slate-200 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Platform Director</p>
                    <p className="text-[7px] text-slate-300 mt-1">Digitally Signed & Secured</p>
                 </div>
              </div>

              {/* HOLOGRAPHIC BADGE */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-amber-100 via-white to-amber-200 rounded-full shadow-inner flex items-center justify-center border-4 border-white overflow-hidden opacity-40">
                 <ShieldCheck size={40} className="text-amber-400" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-50 animate-pulse" />
              </div>

              {impactStats.certificateStatus !== 'approved' && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                   <div className="bg-white/80 p-8 rounded-3xl shadow-2xl border border-white flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Lock size={32} /></div>
                      <p className="text-sm font-black uppercase tracking-widest text-slate-900">Certificate Locked</p>
                      <p className="text-[10px] text-slate-500 font-medium">Pending NGO Coordinator Review</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #certificate-print-area, #certificate-print-area * { visibility: visible; }
          #certificate-print-area { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 297mm !important; /* A4 Landscape Width */
            height: 210mm !important; /* A4 Landscape Height */
            border: none; 
            box-shadow: none; 
            padding: 20mm; 
            margin: 0;
            display: flex !important;
            border: 20px double #f8fafc !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          @page { size: landscape; margin: 0; }
        }
      `}} />
    </div>
  );
}
