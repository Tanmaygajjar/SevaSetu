'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, UserCheck, MessageSquare, Phone, Mail, Award, Clock, X, Shield, Calendar, Zap, Bot } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';
import { Volunteer, Need } from '@/types';
import { findBestTaskForVolunteer, assignTask, getActiveTaskCount, MAX_TASKS_PER_VOLUNTEER } from '@/lib/assignmentService';

export default function Page() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const vRef = collection(db, 'volunteers');
    const unsubscribe = onSnapshot(vRef, (snapshot) => {
      const dbVolunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const mockVolunteers = [
        { 
            id: 'v11', name: 'Arjun Mehta', hours: 142, rating: 4.9, 
            skills: ['First Aid', 'Logistics', 'Heavy Driving'], status: 'available',
            phone: '+91 98765 43210', email: 'arjun.m@example.com',
            bio: 'Dedicated field volunteer with 3 years of experience in disaster relief. Expert in coordination and emergency logistics.',
            badges: ['Gold Responder', 'Safe Driver', 'Top 10%'],
            wellness_score: 85,
            certificateStatus: 'requested'
        },
        { 
            id: 'v12', name: 'Priya Patel', hours: 86, rating: 4.7, 
            skills: ['Teaching', 'Counseling', 'Documentation'], status: 'busy',
            phone: '+91 87654 32109', email: 'priya.p@example.com',
            bio: 'Professional educator volunteering for digital literacy and child welfare programs. Passionate about community building.',
            badges: ['Star Teacher', 'Punctual'],
            wellness_score: 92,
            certificateStatus: 'none'
        },
        { 
            id: 'v13', name: 'Rajesh Kumar', hours: 210, rating: 5.0, 
            skills: ['Construction', 'Rescue', 'Plumbing'], status: 'available',
            phone: '+91 76543 21098', email: 'rajesh.k@example.com',
            bio: 'Skilled tradesperson focusing on infrastructure repair and rescue operations during urban floods.',
            badges: ['Elite Rescuer', '5-Star Hero'],
            wellness_score: 78,
            certificateStatus: 'none'
        },
        { 
            id: 'v14', name: 'Sneha Shah', hours: 45, rating: 4.5, 
            skills: ['Nutrition', 'Medical Triage', 'Hindi/English'], status: 'busy',
            phone: '+91 99887 76655', email: 'sneha.s@example.com',
            bio: 'Clinical nutritionist assisting in community health camps and nutritional auditing for underserved wards.',
            badges: ['Health Guide'],
            wellness_score: 95,
            certificateStatus: 'none'
        }
      ];

      // Merge real and mock, avoiding duplicates if names match
      const merged = [...dbVolunteers];
      mockVolunteers.forEach(mock => {
        if (!merged.find(v => v.name === mock.name)) {
          merged.push(mock);
        }
      });

      setVolunteers(merged);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAiAssign = async (v: any) => {
    const loadingToast = toast.loading(`AI analyzing best task for ${v.name}...`);
    try {
      const activeCount = await getActiveTaskCount(v.id);
      if (activeCount >= MAX_TASKS_PER_VOLUNTEER) {
        toast.error(`${v.name} already has ${MAX_TASKS_PER_VOLUNTEER} active tasks. Please wait for completion.`, { id: loadingToast });
        return;
      }

      const bestTask = await findBestTaskForVolunteer(v);
      if (bestTask) {
        await assignTask(bestTask.id, v.id);
        toast.success(`AI assigned "${bestTask.title}" to ${v.name}!`, { id: loadingToast, icon: '🤖' });
      } else {
        toast.error("No matching tasks found for this volunteer's skillset currently.", { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error.message || "AI assignment failed", { id: loadingToast });
    }
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Volunteer Network</h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">AI-powered deployment and profile management.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search by name or skill..." 
             className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--saffron)] transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center animate-pulse text-[var(--ink-muted)]">Scanning Volunteer Grid...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.map(v => (
            <div key={v.id} className="card p-6 flex flex-col group hover:border-[var(--saffron)] transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--saffron)] opacity-5 translate-x-10 -translate-y-10 rounded-full" />
               
               <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                      <img src={`https://i.pravatar.cc/150?u=${v.id}`} className="w-16 h-16 rounded-2xl shadow-md group-hover:scale-105 transition-transform object-cover" />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${v.status === 'available' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${v.status === 'available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                      {v.status}
                    </span>
                    <button 
                      onClick={() => handleAiAssign(v)}
                      className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[10px] font-black hover:bg-indigo-100 transition-colors"
                      title="AI Match Best Task"
                    >
                      <Bot size={12} /> AI ASSIGN
                    </button>
                  </div>
               </div>
               
               <h3 className="text-xl font-bold font-mukta text-[var(--ink)] mb-1 group-hover:text-[var(--saffron)] transition-colors">{v.name}</h3>
               <div className="flex items-center gap-1.5 text-xs text-yellow-600 font-bold mb-4">
                  <Star size={12} fill="currentColor" /> {(v.rating || 4.5).toFixed(1)} <span className="text-gray-400 font-normal ml-1">({v.hours || 0} hrs logged)</span>
               </div>

               <div className="flex flex-wrap gap-1.5 mb-6 flex-1">
                  {v.skills?.slice(0, 3).map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-500 tracking-wider ">{s}</span>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[var(--border)]">
                  <button 
                    onClick={() => setSelectedVolunteer(v)} 
                    className="py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                     Profile View
                  </button>
                  <button 
                    onClick={() => toast.success(`Assigning ${v.name} to higher-priority task...`)} 
                    className="py-2.5 rounded-xl bg-[var(--saffron)] text-white text-xs font-bold shadow-lg shadow-[var(--saffron-glow)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <UserCheck size={14} /> Quick Assign
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {selectedVolunteer && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[var(--ink)]/60 backdrop-blur-sm" onClick={() => setSelectedVolunteer(null)} />
           <div className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in slide-in-from-bottom-8 duration-500">
              
              <div className="md:w-1/3 bg-[var(--surface-2)] p-8 flex flex-col items-center text-center border-r border-[var(--border)]">
                 <div className="relative mb-6">
                    <img src={`https://i.pravatar.cc/150?u=${selectedVolunteer.id}`} className="w-32 h-32 rounded-[40px] shadow-2xl border-4 border-white" />
                    <div className="absolute -bottom-2 right-2 bg-white p-2 rounded-2xl shadow-lg text-[var(--saffron)]"><Shield size={20} /></div>
                 </div>
                 <h2 className="text-2xl font-bold font-mukta leading-tight mb-2">{selectedVolunteer.name}</h2>
                 <p className="text-[10px] font-bold text-[var(--saffron)] uppercase tracking-[3px] mb-6">Verified Member</p>
                 
                 <div className="w-full space-y-3">
                    <div className="bg-white p-3 rounded-2xl border border-[var(--border)]">
                        <p className="text-xl font-bold">{selectedVolunteer.hours || 0}h</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-[var(--border)]">
                        <p className="text-xl font-bold">{(selectedVolunteer.rating || 4.5).toFixed(1)}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Rating</p>
                    </div>
                 </div>
              </div>

              <div className="md:w-2/3 p-8 md:p-10 flex flex-col">
                 <button onClick={() => setSelectedVolunteer(null)} className="ml-auto w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[var(--ink)] transition-colors mb-2">&times;</button>
                 
                 <div className="space-y-6">
                    <section>
                        <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About Volunteer</h4>
                        <p className="text-sm text-[var(--ink-muted)] leading-relaxed italic">"{selectedVolunteer.bio || 'No bio provided.'}"</p>
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Phone size={10} /> Connectivity</h4>
                            <p className="text-sm font-bold">{selectedVolunteer.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Mail size={10} /> Email</h4>
                            <p className="text-sm font-bold truncate">{selectedVolunteer.email}</p>
                        </div>
                    </section>

                     <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                           Live Workload 
                           <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md text-[8px]">Active</span>
                        </h4>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-700">Active Tasks</span>
                              <span className="text-lg font-black text-slate-900">3 Missions</span>
                           </div>
                           <div className="flex gap-2">
                              <div className="flex-1 h-1.5 bg-blue-500 rounded-full" title="In Progress: 1" />
                              <div className="flex-1 h-1.5 bg-orange-500 rounded-full opacity-30" title="Pending: 0" />
                              <div className="flex-1 h-1.5 bg-emerald-500 rounded-full opacity-30" title="Completed: 0" />
                           </div>
                           <p className="text-[10px] text-slate-400 font-medium italic">"Currently deploying flood relief kits in Rajkot West sector."</p>
                        </div>
                     </section>

                     <section>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Professional Skillset</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedVolunteer.skills?.map((s: string) => (
                                <span key={s} className="px-3 py-1 bg-white text-slate-700 rounded-xl text-[10px] font-black border border-slate-100 shadow-sm uppercase tracking-wider">{s}</span>
                            ))}
                        </div>
                     </section>
                  </div>

                  <div className="mt-auto pt-8 flex flex-col gap-4">
                    {selectedVolunteer.certificateStatus === 'requested' && (
                       <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3 text-amber-700">
                             <Award size={24} className="animate-bounce" />
                             <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-900">Phase 3 Complete</p>
                                <p className="text-[10px] font-bold text-slate-500">Requesting Social Internship Certificate</p>
                             </div>
                          </div>
                          <button 
                            onClick={async () => {
                              try {
                                await updateDoc(doc(db, 'volunteers', selectedVolunteer.id), { certificateStatus: 'approved' });
                                toast.success("Certificate Approved!");
                                setSelectedVolunteer(null);
                              } catch(e) { toast.error("Approval failed"); }
                            }}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800"
                          >
                             Approve
                          </button>
                       </div>
                    )}
                    <div className="flex gap-3">
                       <button 
                         onClick={() => handleAiAssign(selectedVolunteer)} 
                         className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:opacity-90 flex items-center justify-center gap-2"
                       >
                         <Bot size={20} /> AI Smart Assign
                       </button>
                       <button onClick={() => { setSelectedVolunteer(null); toast.success('Chat interface opened.'); }} className="w-14 h-14 bg-[var(--ink)] text-white rounded-2xl flex items-center justify-center hover:opacity-90"><MessageSquare size={20} /></button>
                    </div>
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}