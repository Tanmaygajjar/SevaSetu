'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Need } from '@/types';
import { Trash2, AlertTriangle, MapPin, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const needsRef = collection(db, 'needs');
    const unsubscribe = onSnapshot(needsRef, (snapshot) => {
      if (!snapshot.empty) {
        setNeeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Need[]);
      } else {
        // Fallback mock data if DB is empty
        setNeeds([
          { id: 'kn-1', title: 'Require 50 units blood', city: 'Rajkot', urgency_score: 9.5, status: 'reported' },
          { id: 'kn-2', title: 'Textbook drive for orphans', city: 'Surat', urgency_score: 4.2, status: 'verified' },
          { id: 'kn-3', title: 'Setup temporary tents', city: 'Ahmedabad', urgency_score: 7.8, status: 'in_progress' }
        ] as any[]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteNeed = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this need?')) return;

    try {
      if (!id.startsWith('kn-')) {
        await deleteDoc(doc(db, 'needs', id));
      }
      setNeeds(prev => prev.filter(n => n.id !== id));
      toast.success('Need deleted successfully');
    } catch (error) {
      toast.error('Failed to delete need');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            All Active Needs
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Manage and coordinate all community-reported needs.</p>
        </div>
      </div>
      
      <div className="mt-6 card overflow-hidden p-0 border border-[var(--border)] rounded-2xl shadow-sm bg-white">
        {loading ? (
          <div className="p-12 text-center text-[var(--ink-muted)] animate-pulse font-medium">Synchronizing with registry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-2)] text-[var(--ink-muted)] uppercase text-[10px] font-black tracking-widest border-b border-[var(--border)]">
                <tr>
                  <th className="p-4">Title / Need</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {needs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-[var(--ink)] font-mukta text-base">{r.title}</div>
                      <div className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-tighter">ID: {r.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[var(--ink-muted)] font-medium">
                        <MapPin size={14} className="text-[var(--saffron)]" />
                        {r.city}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 border border-gray-200">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-1000" 
                            style={{ 
                              width: `${(r.urgency_score || 0) * 10}%`,
                              backgroundColor: (r.urgency_score || 0) >= 8 ? 'var(--critical)' : (r.urgency_score || 0) >= 5 ? 'var(--high)' : 'var(--saffron)'
                            }} 
                          />
                        </div>
                        <span className="text-xs font-bold font-mono">{(r.urgency_score || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--ink)] text-[10px] font-black uppercase tracking-widest border border-[var(--border)]">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteNeed(r.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Need"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
