'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Need } from '@/types';
import { AlertCircle, Clock, CheckCircle2, UserPlus, MoreVertical, X, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const deleteTask = async (id: string) => {
    if (!window.confirm('SYSTEM ALERT: This will permanently delete this record from the entire platform database. Continue?')) return;
    
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (!id.startsWith('kn-')) {
          await deleteDoc(doc(db, 'needs', id));
        }
        setLocalNeeds(prev => prev.filter(n => n.id !== id));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: 'Purging record...',
      success: 'Task deleted permanently.',
      error: 'Deletion failed.'
    });
  };

  const assignVolunteer = async (volunteerId: string) => {
    if (!selectedNeedForAssign) return;
    
    try {
      const taskRef = doc(collection(db, 'tasks'));
      await setDoc(taskRef, {
        id: taskRef.id,
        need_id: selectedNeedForAssign.id,
        volunteer_id: volunteerId,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      });
      
      await updateDoc(doc(db, 'needs', selectedNeedForAssign.id), {
        status: 'verified',
        assigned_volunteer_id: volunteerId
      });
      
      toast.success('Volunteer assigned successfully!');
      setSelectedNeedForAssign(null);
    } catch (error: any) {
      toast.error('Assignment failed: ' + error.message);
    }
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
                          onClick={() => deleteTask(need.id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {selectedNeedForAssign?.id === need.id && (
                      <div className="absolute inset-0 bg-white z-20 p-4 rounded-xl flex flex-col animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="text-xs font-bold font-mukta">Select Volunteer</h5>
                          <button onClick={() => setSelectedNeedForAssign(null)} className="text-[var(--ink-faint)]"><X size={14} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2">
                          {volunteers.length > 0 ? volunteers.map(v => (
                            <button 
                              key={v.id} 
                              onClick={() => assignVolunteer(v.id)}
                              className="w-full text-left p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--saffron-light)] transition-colors flex items-center justify-between group/v"
                            >
                              <span className="text-xs font-semibold">{v.name}</span>
                              <Check size={12} className="opacity-0 group-hover/v:opacity-100 text-[var(--saffron)]" />
                            </button>
                          )) : (
                            <p className="text-[10px] text-[var(--ink-faint)] text-center py-4">No active volunteers found.</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <h4 className="font-bold font-mukta text-[var(--ink)] text-sm mb-2">{need.title}</h4>
                    
                    {col.id === 'in_progress' && (
                      <div className="flex -space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--saffron)] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">A</div>
                        <div className="w-6 h-6 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">R</div>
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
