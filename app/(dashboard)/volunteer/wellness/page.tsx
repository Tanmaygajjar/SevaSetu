'use client';
import React, { useState } from 'react';
import { Heart, Calendar, Zap, MessageSquare, ShieldCheck, Activity, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WellnessPage() {
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSchedule = () => {
    setBookingLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Finding an available counselor...',
        success: 'Session scheduled for tomorrow at 10:00 AM! Check your notifications.',
        error: 'Failed to schedule. Please try again.',
      }
    ).finally(() => setBookingLoading(false));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Heart size={20} className="animate-pulse" />
             </div>
             <h1 className="text-3xl font-black font-mukta text-slate-900 tracking-tight">Wellness Core</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
            Prioritizing your mental resilience. Our AI monitors deployment fatigue and matches you with professional support nodes.
          </p>
        </div>
        <div className="flex gap-4 relative">
           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[100px]">
              <p className="text-2xl font-black text-slate-900">88%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resilience</p>
           </div>
           <div className="bg-emerald-600 p-4 rounded-2xl text-white text-center min-w-[100px] shadow-xl shadow-emerald-100">
              <p className="text-2xl font-black">40h</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Service Log</p>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Tracking */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold font-mukta text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" /> Biometric Engagement
             </h3>
             <div className="flex gap-2">
                {['Day', 'Week', 'Month'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Week' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                    {t}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex-1 h-64 flex items-end justify-between gap-4 mb-4">
            {[40, 70, 45, 90, 60, 80, 50, 65, 45, 85, 75, 55].map((h, i) => (
              <div key={i} className="flex-1 h-full group relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-md text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  {h}% Flow
                </div>
                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden h-full flex flex-col justify-end">
                   <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl transition-all duration-1000 group-hover:brightness-110" 
                    style={{ height: `${h}%` }} 
                   />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] px-2">
            <span>Mission Alpha</span>
            <span>Current Deployment</span>
            <span>Recovery Phase</span>
          </div>
        </div>

        {/* Counseling Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2rem] text-white shadow-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
          
          <h3 className="text-2xl font-black font-mukta mb-4 leading-tight">Mental Health Recovery Node</h3>
          <p className="text-sm opacity-90 mb-8 leading-relaxed font-medium">
            "High deployment intensity detected (40h+). Fatigue levels are above threshold. Professional debriefing is recommended for cognitive balance."
          </p>
          
          <div className="space-y-4 mb-8">
             <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={20} className="text-emerald-300" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Confidential Support</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Zap size={20} className="text-amber-300" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Priority Slot Available</span>
             </div>
          </div>

          <button 
            onClick={handleSchedule}
            disabled={bookingLoading}
            className="mt-auto bg-white text-emerald-700 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {bookingLoading ? 'Scanning Availability...' : 'Schedule Free Session'}
          </button>
        </div>
      </div>

      {/* Wellness Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { icon: Award, label: 'Resilience King', color: 'bg-amber-50 text-amber-600' },
           { icon: Zap, label: 'High Energy', color: 'bg-blue-50 text-blue-600' },
           { icon: Heart, label: 'Empathy Pro', color: 'bg-rose-50 text-rose-600' },
           { icon: ShieldCheck, label: 'Vetted Helper', color: 'bg-indigo-50 text-indigo-600' }
         ].map((badge, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-3 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${badge.color}`}>
                 <badge.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{badge.label}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
