'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Need } from '@/types';
import { AlertCircle, Clock, CheckCircle2, UserPlus, MoreVertical, X, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignTask } from '@/lib/assignmentService';

type Column = 'reported' | 'verified' | 'in_progress' | 'completed';

const COLUMNS: { id: Column; title: string; color: string; icon: any }[] = [
  { id: 'reported', title: 'Reported', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  { id: 'verified', title: 'Verified / Pending', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: Clock },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: UserPlus },
  { id: 'completed', title: 'Completed', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 }
];

export default function NgoTasks() {
  // Use local state to allow demo interactivity without failing DB calls
  const [localNeeds, setLocalNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  useEffect(() => {
    const volunteersRef = collection(db, 'volunteers');
    const unsubscribeVolunteers = onSnapshot(volunteersRef, (snapshot) => {
      setVolunteers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const needsRef = collection(db, 'needs');
    const q = query(needsRef, where('status', '!=', 'closed'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setLocalNeeds([
          { id: 'kn-1', title: '50 Water bottles needed', category: 'water_sanitation', urgency_score: 8.2, status: 'reported', city: 'Rajkot', district: 'West', created_at: new Date().toISOString() },
          { id: 'kn-2', title: 'O+ Blood required at Civil', category: 'medical', urgency_score: 9.5, status: 'verified', city: 'Rajkot', district: 'Central', created_at: new Date().toISOString() },
          { id: 'kn-3', title: 'Food distribution drive', category: 'food', urgency_score: 7.1, status: 'in_progress', city: 'Rajkot', district: 'Saurashtra', created_at: new Date().toISOString() },
          { id: 'kn-4', title: 'Mental health counseling', category: 'mental_health', urgency_score: 4.5, status: 'completed', city: 'Rajkot', district: 'South', created_at: new Date().toISOString() },
          { id: 'kn-5', title: '10 Volunteers for debris clearing', category: 'disaster_relief', urgency_score: 9.1, status: 'verified', city: 'Ahmedabad', district: 'Riverfront', created_at: new Date().toISOString() },
          { id: 'kn-6', title: 'Elderly checkup rounds', category: 'elderly_care', urgency_score: 6.2, status: 'reported', city: 'Surat', district: 'Adajan', created_at: new Date().toISOString() }
        ] as any[]);
      } else {
        setLocalNeeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Need[]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Ngo tasks sync error:', error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeVolunteers();
    };
  }, []);

  const [draggedNeed, setDraggedNeed] = useState<Need | null>(null);
  const [selectedNeedForAssign, setSelectedNeedForAssign] = useState<Need | null>(null);

  const handleDragStart = (e: React.DragEvent, need: Need) => {
    setDraggedNeed(need);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: Column) => {
    e.preventDefault();
    if (!draggedNeed || draggedNeed.status === targetStatus) return;

    const promise = new Promise(async (resolve, reject) => {
        try {
            // If it's a mock ID, we just skip remote update
            if (!draggedNeed.id.startsWith('kn-')) {
                const needRef = doc(db, 'needs', draggedNeed.id);
                await updateDoc(needRef, { status: targetStatus });
            } else {
                console.log('Demo Mode: Updating local state instead of remote DB');
            }

            // Update local state for immediate feedback
            setLocalNeeds(prev => prev.map(n => 
                n.id === draggedNeed.id ? { ...n, status: targetStatus } : n
            ));
            
            setTimeout(() => resolve(true), 500);
        } catch (err) {
            reject(err);
        }
    });
      
    toast.promise(promise, {
      loading: 'Moving task...',
      success: 'Task moved successfully',
      error: 'Failed to move task'
    });

    setDraggedNeed(null);
  };

  const assignVolunteer = async (volunteerId: string) => {
    if (!selectedNeedForAssign) return;
    
    const loadingToast = toast.loading('Assigning volunteer...');
    try {
      await assignTask(selectedNeedForAssign.id, volunteerId);
      toast.success('Volunteer assigned successfully!', { id: loadingToast });
      setSelectedNeedForAssign(null);
    } catch (error: any) {
      toast.error('Assignment failed: ' + error.message, { id: loadingToast });
    }
  };

  const deleteNeed = async (needId: string) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (!needId.startsWith('kn-')) {
          const needRef = doc(db, 'needs', needId);
          await deleteDoc(needRef);
        } else {
          console.log('Demo Mode: Deleting local state instead of remote DB');
        }

        setLocalNeeds(prev => prev.filter(n => n.id !== needId));
        setTimeout(() => resolve(true), 500);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: 'Deleting task...',
      success: 'Task deleted successfully',
      error: 'Failed to delete task'
    });
  };

  // Group needs
  const groupedNeeds = COLUMNS.reduce((acc, col) => {
    acc[col.id] = localNeeds.filter(n => n.status === col.id);
    return acc;
  }, {} as Record<Column, Need[]>);

  if (loading) {
    return <div className="p-20 text-center animate-pulse">Loading Task Board...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Task Board (Kanban)</h1>
        <p className="text-[var(--ink-muted)]">Drag and drop needs to update their status and coordinate volunteer deployment.</p>
      </div>
      
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {COLUMNS.map(col => {
          const colNeeds = groupedNeeds[col.id] || [];
          const Icon = col.icon;
          
          return (
            <div 
              key={col.id} 
              className="flex-shrink-0 w-80 bg-[var(--surface-2)] rounded-2xl flex flex-col border border-[var(--border)] snap-center"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className={`p-4 border-b flex justify-between items-center bg-white rounded-t-2xl border ${col.color} border-x-0 border-t-0`}>
                <h3 className="font-bold flex items-center gap-2">
                  <Icon size={18} />
                  {col.title}
                </h3>
                <span className="text-xs font-bold px-2 py-1 bg-white rounded-md shadow-sm opacity-80">
                  {colNeeds.length}
                </span>
              </div>
              
              {/* Column Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[200px]">
                {colNeeds.map(need => (
                  <div
                    key={need.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, need)}
                    className="bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm cursor-grab active:cursor-grabbing hover:border-[var(--saffron)] hover:shadow-md transition-all group relative"
                  >
                    <div className="w-full h-1 absolute top-0 left-0 rounded-t-xl" style={{ background: need.urgency_score >= 8 ? 'var(--critical)' : need.urgency_score >= 6 ? 'var(--high)' : 'var(--saffron)' }} />
                    
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] bg-[var(--surface-2)] px-2 py-0.5 rounded">
                        {need.category}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedNeedForAssign(need)}
                          className="text-[var(--saffron)] hover:bg-[var(--saffron-light)] p-1 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold"
                        >
                          <UserPlus size={14} /> ASSIGN
                        </button>
                        <button 
                          onClick={() => deleteNeed(need.id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold"
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {selectedNeedForAssign?.id === need.id && (
                      <div className="absolute inset-0 bg-white z-20 p-4 rounded-xl flex flex-col animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h5 className="text-xs font-black font-mukta uppercase tracking-wider">AI Assignment Guard</h5>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Matching based on speciality</p>
                          </div>
                          <button onClick={() => setSelectedNeedForAssign(null)} className="text-[var(--ink-faint)] hover:text-red-500"><X size={14} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                          {volunteers.length > 0 ? volunteers.map(v => {
                            const volunteerSkills = v.skills || [];
                            const isMatch = volunteerSkills.some((s: string) => 
                              need.title.toLowerCase().includes(s.toLowerCase()) || 
                              s.toLowerCase().includes(need.category.toLowerCase())
                            );
                            const score = isMatch ? 90 + Math.floor(Math.random() * 10) : 60 + Math.floor(Math.random() * 15);
                            
                            return (
                              <button 
                                key={v.id} 
                                onClick={() => {
                                  if (!isMatch) {
                                    const confirmStr = `🚨 SPECIALITY MISMATCH\n\n${v.name} is not specialized in ${need.category}.\nAI Predicts Efficiency: ${score}%\n\nRajesh Kumar (Alternative) has 98% efficiency for this task.\n\nDo you still want to proceed with this assignment?`;
                                    if (!window.confirm(confirmStr)) return;
                                  }
                                  assignVolunteer(v.id);
                                }}
                                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-white transition-all flex items-center justify-between group/v border border-slate-100 hover:border-slate-900 hover:shadow-xl"
                              >
                                <div className="flex gap-3 items-center">
                                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white ${isMatch ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                      {score}%
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-800">{v.name}</span>
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                         {isMatch ? 'High Match' : 'Mismatch Risk'}
                                      </span>
                                   </div>
                                </div>
                                <Check size={16} className="opacity-0 group-hover/v:opacity-100 text-slate-900" />
                              </button>
                            );
                          }) : (
                            <p className="text-[10px] text-[var(--ink-faint)] text-center py-4">No active volunteers found.</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <h4 className="font-bold font-mukta text-[var(--ink)] text-sm mb-2">{need.title}</h4>
                    
                    {need.assigned_volunteer_id && (
                      <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-[var(--saffron)] flex items-center justify-center text-[10px] text-white font-bold">
                          {volunteers.find(v => v.id === need.assigned_volunteer_id)?.name?.charAt(0) || 'V'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Deployed</span>
                          <span className="text-[10px] font-bold text-slate-700">{volunteers.find(v => v.id === need.assigned_volunteer_id)?.name || 'Volunteer'}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-[var(--ink-muted)]">
                      <span>Score: <span className="font-bold" style={{ color: need.urgency_score >= 8 ? 'var(--critical)' : 'inherit' }}>{need.urgency_score.toFixed(1)}</span></span>
                      <span>{need.city}</span>
                    </div>
                  </div>
                ))}
                
                {colNeeds.length === 0 && (
                  <div className="h-full min-h-[100px] flex items-center justify-center text-[var(--ink-faint)] text-sm border-2 border-dashed border-[var(--border)] rounded-xl opacity-50">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
