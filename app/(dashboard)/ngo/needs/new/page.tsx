'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { autoAssignVolunteerForNeed, recommendVolunteerForNeed } from '@/lib/assignmentService';
import { Bot, Zap, AlertCircle } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    volunteers_needed: 1,
    city: 'Rajkot',
    urgency_score: 5.0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const broadcastToast = toast.loading("Broadcasting to network...");

    try {
      // 1. Save Need to Firestore
      const needData = {
        ...formData,
        status: 'verified',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        required_skills: [formData.category === 'food' ? 'cooking' : formData.category === 'medical' ? 'first_aid' : 'driving'],
        location_lat: 22.3039, // Default to Rajkot for demo
        location_lng: 70.8022
      };

      const docRef = await addDoc(collection(db, 'needs'), needData);
      const newNeed = { id: docRef.id, ...needData } as any;

      toast.success("Need broadcasted successfully!", { id: broadcastToast });

      // 2. Trigger AI Analysis & Recommendation
      const aiToast = toast.loading("AI generating smart recommendations...");
      await recommendVolunteerForNeed(newNeed);
      
      toast.success("AI Analysis complete. Recommendation sent to best-fit volunteer.", { 
        id: aiToast,
        icon: '🤖',
        duration: 4000
      });

      router.push('/ngo/tasks');
    } catch (error: any) {
      toast.error("Broadcast failed: " + error.message, { id: broadcastToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            Broadcast New Need
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Deploy AI matching to find the right responders instantly.</p>
        </div>
      </div>
      
      <div className="max-w-2xl mt-6">
        <form onSubmit={handleSubmit} className="card space-y-6 bg-white p-8 rounded-[2rem] border border-[var(--border)] shadow-xl shadow-slate-100">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Need Title</label>
            <input 
              type="text" 
              required
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-[var(--saffron)] transition-all font-bold" 
              placeholder="e.g. 50 Water bottles needed at West Zone"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Detailed Description</label>
            <textarea 
              required
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-[var(--saffron)] transition-all h-32 font-medium" 
              placeholder="Specify tasks, requirements, and whom to contact..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
              <select 
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-[var(--saffron)] transition-all font-bold appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="food">Food & Water</option>
                <option value="medical">Medical Assistance</option>
                <option value="disaster_relief">Rescue / Relief</option>
                <option value="shelter">Shelter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Urgency Level</label>
              <input 
                type="number" 
                min="1" max="10" step="0.5"
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none focus:ring-2 focus:ring-[var(--saffron)] transition-all font-bold" 
                value={formData.urgency_score}
                onChange={e => setFormData({...formData, urgency_score: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex gap-4 text-indigo-900 text-sm items-start shadow-inner">
            <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600"><Bot size={20} /></div>
            <div>
              <p className="font-bold mb-1">AI Matchmaking Active</p>
              <p className="text-indigo-700/80 leading-relaxed">Our neural engine will analyze nearby volunteers based on skills, current workload, and performance to auto-assign this task.</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[var(--saffron)] text-white font-black rounded-3xl text-lg hover:shadow-2xl hover:shadow-[var(--saffron-glow)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : <><Zap size={24} fill="white" /> BROADCAST & AUTO-ASSIGN</>}
          </button>
        </form>
      </div>
    </div>
  );
}
