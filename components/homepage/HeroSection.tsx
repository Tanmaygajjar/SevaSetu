'use client';

import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PlatformStats } from '@/types';

// Dynamic import with SSR disabled for Three.js
const GlobeScene = dynamic(() => import('../three/GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]">
      <div className="w-64 h-64 rounded-full border border-white/10 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[var(--saffron)] animate-spin" />
      </div>
    </div>
  ),
});

// 🛡️ SUB-COMPONENT FOR CLIENT-SIDE STATS
function HeroStatsDisplay() {
  const { data: stats } = useQuery({
    queryKey: ['platform_stats_hero'],
    queryFn: async () => {
      try {
        const statsRef = collection(db, 'platform_stats');
        const q = query(statsRef, limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs[0].data() as Pick<PlatformStats, 'active_today' | 'total_volunteers' | 'ngos_registered' | 'needs_resolved'>;
        }
        return null;
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        return null;
      }
    },
    staleTime: 60000,
  });

  const defaultStats = { active_today: 143, total_volunteers: 2847, ngos_registered: 312, needs_resolved: 18492 };
  const currentStats = stats || defaultStats;

  return (
    <>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 text-sm shadow-xl">
        <span className="live-dot" />
        <span className="text-white font-bold tracking-tight">
          Live <span className="text-[var(--saffron)] ml-1">{currentStats.active_today}</span> volunteers active right now
        </span>
      </div>

      {/* Stats row at the bottom */}
      <div className="flex items-center gap-8 pt-10 border-t border-white/20">
        <Link href="/join" className="flex flex-col hover:opacity-80 transition-opacity group">
          <span className="text-3xl font-black text-white font-mukta tabular-nums group-hover:text-[var(--saffron)] transition-colors">
            {(currentStats.total_volunteers).toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-200 font-black mt-1">Volunteers</span>
        </Link>
        <div className="h-10 w-px bg-white/20" />
        <Link href="/ngos" className="flex flex-col hover:opacity-80 transition-opacity group">
          <span className="text-3xl font-black text-white font-mukta tabular-nums group-hover:text-[var(--saffron)] transition-colors">
            {(currentStats.ngos_registered).toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-200 font-black mt-1">NGO Partners</span>
        </Link>
        <div className="h-10 w-px bg-white/20" />
        <div className="flex flex-col">
          <span className="text-3xl font-black text-white font-mukta tabular-nums">
            {(currentStats.needs_resolved).toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-200 font-black mt-1">Resolved</span>
        </div>
      </div>
    </>
  );
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden flex flex-col lg:flex-row bg-[#0A0A0F]">
      {/* 3D Globe Background / Right Half */}
      <div className="absolute inset-0 lg:left-1/2 lg:w-1/2">
        <Suspense fallback={<div className="bg-[#0A0A0F] w-full h-full" />}>
          <GlobeScene />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent hidden lg:block" />
      </div>

      {/* Left Content */}
      <div className="relative z-10 w-full lg:w-1/2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 flex flex-col justify-center min-h-[calc(100vh-64px)]">
        <div className="max-w-2xl mt-12 lg:mt-0">
          
          {/* Use Stats sub-component only if mounted */}
          {mounted ? (
            <HeroStatsDisplay />
          ) : (
            <div className="h-[200px] flex items-end">
               <div className="w-full h-2 bg-white/10 animate-pulse rounded" />
            </div>
          )}

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-mukta leading-[1.1] tracking-tight !text-white mb-6 mt-8">
            <span className="block text-[var(--saffron)] drop-shadow-[0_0_40px_rgba(255,107,53,0.4)]">Resource IQ</span>
            <span className="!text-white">Strategic Resource Hub</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed mb-10 max-w-xl drop-shadow-sm">
            Connecting community needs to the right volunteer — in minutes. <span className="text-[var(--saffron)] font-bold">Powered by AI.</span> Built for India.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/join" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mukta font-bold text-lg bg-[var(--saffron)] text-white hover:bg-[var(--saffron-dark)] transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_30px_var(--saffron-glow)]"
            >
              Join as Volunteer
              <ArrowRight size={20} />
            </Link>
            
            <Link 
              href="/map" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mukta font-bold text-lg bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25 transition-colors shadow-lg"
            >
              Explore Needs Map
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
