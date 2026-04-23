'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { AlertTriangle, Clock, Columns3, CheckCircle, PlusCircle, Activity, Users, Sparkles } from 'lucide-react';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function NgoDashboard() {
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    activeNeeds: 0,
    pendingVerification: 0,
    volunteersDeployed: 0,
    needsResolvedThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<{ summary: string; priorities: any[] } | null>(null);

  useEffect(() => {
    const needsRef = collection(db, 'needs');
    
    const unsubscribe = onSnapshot(needsRef, async (snapshot) => {
      const needs = snapshot.docs.map(doc => doc.data());
      setStats({
        activeNeeds: needs.filter(n => n.status === 'reported' || n.status === 'verified').length,
        pendingVerification: needs.filter(n => n.status === 'reported').length,
        volunteersDeployed: needs.filter(n => n.status === 'in_progress').length,
        needsResolvedThisWeek: needs.filter(n => n.status === 'completed').length
      });

      // AI Analysis for NGO
      try {
        const res = await fetch('/api/ai/ngo-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ needs: needs.slice(0, 5) }) // Sample for performance
        });
        const data = await res.json();
        setAiInsights(data);
      } catch (err) {
        console.error('AI Insights failed', err);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <LoadingSkeleton type="page" />;

  return (
    <div className="space-y-8">
      {aiInsights && (
        <div className="bg-gradient-to-r from-[var(--ink)] to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-xl animate-in fade-in slide-in-from-top duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={40} /></div>
          <div className="flex items-center gap-2 text-[var(--saffron)] font-bold text-xs uppercase tracking-widest mb-3">
             <Sparkles size={14} /> AI Strategic Summary
          </div>
          <p className="text-sm font-medium leading-relaxed mb-4">{aiInsights.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.priorities?.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <p className="text-xs font-bold text-[var(--saffron)] mb-1 line-clamp-1">{p.title}</p>
                <p className="text-[10px] text-gray-400 line-clamp-2">{p.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold font-mukta mb-1 text-[var(--ink)]">Command Center</h1>
          <p className="text-[var(--ink-muted)]">Disha Foundation • Central Rajkot</p>
        </div>
        <Link href="/ngo/needs/new" className="btn-primary shadow-lg shadow-[var(--saffron-glow)] hidden sm:flex">
          <PlusCircle size={18} />
          Report New Need
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white hover:border-[var(--saffron)] transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} />
            </div>
            <span className="text-xs font-bold text-red-600 px-2 py-1 bg-red-50 rounded">Needs Action</span>
          </div>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{stats?.activeNeeds}</p>
          <p className="text-sm text-[var(--ink-muted)] font-medium">Active Needs</p>
        </div>
        
        <div className="card bg-white hover:border-orange-500 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{stats?.pendingVerification}</p>
          <p className="text-sm text-[var(--ink-muted)] font-medium">Pending Verification</p>
        </div>
        
        <div className="card bg-white hover:border-blue-500 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded">Live</span>
          </div>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{stats?.volunteersDeployed}</p>
          <p className="text-sm text-[var(--ink-muted)] font-medium">Volunteers Deployed</p>
        </div>

        <div className="card bg-white hover:border-green-500 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{stats?.needsResolvedThisWeek}</p>
          <p className="text-sm text-[var(--ink-muted)] font-medium">Resolved This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card border-[var(--border)] relative overflow-hidden group hover:border-[var(--saffron)] transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--saffron)] opacity-5 rounded-bl-full group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-bold font-mukta mb-2"><Columns3 className="inline mr-2 text-[var(--saffron)]" /> Task Board</h2>
          <p className="text-[var(--ink-muted)] mb-6">Manage volunteer assignments, track progress, and close resolved needs via Kanban interface.</p>
          <Link href="/ngo/tasks" className="btn-primary w-full justify-center">Open Task Board</Link>
        </div>

        <div className="card border-[var(--border)] relative overflow-hidden group hover:border-teal-500 transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500 opacity-5 rounded-bl-full group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-bold font-mukta mb-2"><Activity className="inline mr-2 text-teal-600" /> Data Intake API</h2>
          <p className="text-[var(--ink-muted)] mb-6">Connect your existing CRM systems or upload bulk CSVs of beneficiary needs via our API.</p>
          <Link href="/ngo/data-intake" className="btn-ghost border border-[var(--border)] w-full justify-center hover:border-teal-500 hover:text-teal-700">Manage Intake</Link>
        </div>
      </div>
    </div>
  );
}
