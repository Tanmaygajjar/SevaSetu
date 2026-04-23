'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { ShieldAlert, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function GlobalBroadcastBanner() {
  const [broadcast, setBroadcast] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'broadcasts'),
      where('active', '==', true),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setBroadcast({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        setIsVisible(true);
      } else {
        setBroadcast(null);
      }
    });

    return () => unsub();
  }, []);

  if (!broadcast || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
      <div className="bg-red-600 text-white px-4 py-2 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <ShieldAlert size={18} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 overflow-hidden">
             <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">Emergency Broadcast</span>
             <p className="text-sm font-bold truncate">{broadcast.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link 
            href="/volunteer/notifications" 
            className="hidden md:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-white text-red-600 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            View Details <ChevronRight size={12} />
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
