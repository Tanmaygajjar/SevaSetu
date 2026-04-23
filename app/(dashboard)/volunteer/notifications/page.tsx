'use client';
import React, { useState } from 'react';
import { 
  Bell, Building2, ShieldCheck, Users, 
  ChevronRight, Trash2, CheckCircle2, 
  AlertTriangle, Info, Clock, Filter,
  Building, Landmark, Zap
} from 'lucide-react';

export default function Page() {
  const [activeFilter, setActiveFilter] = useState('all');

  const notifications = [
    { id: 1, source: 'govt', title: 'District Directive #092', text: 'New mandatory health protocol issued for Rajkot region volunteers.', time: '10m ago', type: 'urgent', read: false },
    { id: 2, source: 'ngo', title: 'Mission Update: Sanjeevani', text: 'Task "Food Distribution" moved to "Verified" status. Report ready.', time: '2h ago', type: 'success', read: false },
    { id: 3, source: 'system', title: 'Impact Milestone Reached', text: 'Congratulations! You have completed 50 hours of verified service.', time: '5h ago', type: 'milestone', read: true },
    { id: 4, source: 'govt', title: 'State Authorization Granted', text: 'Your emergency travel pass for disaster relief has been approved.', time: '1d ago', type: 'info', read: true },
    { id: 5, source: 'ngo', title: 'New Mission Recommendation', text: 'AI matched your skills with a high-priority need in East Zone.', time: '2d ago', type: 'recommend', read: true },
  ];

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.source === activeFilter);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'govt': return <Landmark size={18} />;
      case 'ngo': return <Building size={18} />;
      case 'system': return <Zap size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'govt': return 'bg-blue-500';
      case 'ngo': return 'bg-[var(--saffron)]';
      case 'system': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 fade-in min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Notification Center</h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Manage alerts from authorities and track mission progress.</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--ink-faint)] hover:text-red-500 transition-colors flex items-center gap-2">
           <Trash2 size={14} /> Clear All Read
        </button>
      </div>

      {/* ROLE-BASED FILTERS (VIEW FROM HEADS) */}
      <div className="flex flex-wrap gap-4 items-center">
         <button 
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${activeFilter === 'all' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border-gray-100'}`}
         >
            <Bell size={16} /> All Feeds
         </button>
         
         <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

         {[
           { id: 'govt', label: 'Government Head', icon: <Landmark size={16} />, color: 'hover:border-blue-500 hover:text-blue-600' },
           { id: 'ngo', label: 'NGO Coordinator', icon: <Building size={16} />, color: 'hover:border-[var(--saffron)] hover:text-[var(--saffron)]' },
           { id: 'system', label: 'Platform AI', icon: <Zap size={16} />, color: 'hover:border-purple-500 hover:text-purple-600' },
         ].map(role => (
           <button 
            key={role.id}
            onClick={() => setActiveFilter(role.id)}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${activeFilter === role.id ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-lg scale-105' : `bg-white text-gray-400 border-gray-100 ${role.color}`}`}
           >
              {role.icon} {role.label}
           </button>
         ))}
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">
        {filteredNotifications.map((n) => (
          <div 
            key={n.id} 
            className={`group relative p-6 rounded-[2rem] border transition-all hover:shadow-2xl hover:-translate-y-1 ${n.read ? 'bg-white border-gray-100 opacity-70' : 'bg-white border-2 border-slate-900'}`}
          >
            <div className="flex gap-6 items-start">
               {/* Source Avatar */}
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${getSourceColor(n.source)}`}>
                  {getSourceIcon(n.source)}
               </div>

               <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                     <h3 className={`text-lg font-bold font-mukta ${n.read ? 'text-gray-600' : 'text-slate-900'}`}>
                        {n.title}
                     </h3>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock size={12} /> {n.time}
                     </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
                    {n.text}
                  </p>
                  
                  {!n.read && (
                    <div className="pt-3 flex gap-4">
                       <button className="text-[10px] font-black uppercase tracking-widest text-[var(--saffron)] hover:underline">Take Action</button>
                       <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-slate-900">Mark as Read</button>
                    </div>
                  )}
               </div>

               <div className="hidden group-hover:flex items-center gap-2">
                  <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  <ChevronRight className="text-gray-200" />
               </div>
            </div>

            {/* Unread dot */}
            {!n.read && (
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-4 border-white animate-pulse" />
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Bell size={40} />
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No notifications from this source</p>
          </div>
        )}
      </div>

    </div>
  );
}
