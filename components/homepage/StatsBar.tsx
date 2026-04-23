'use client';

import { useRef, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useInView } from 'framer-motion';
import { formatNumber } from '@/lib/utils';
import { PlatformStats } from '@/types';

function Counter({ from, to, inView }: { from: number; to: number; inView: boolean }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) {
      setCount(from);
      return;
    }

    let start = from;
    const duration = 1400; // 1.4s
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(start + (to - start) * easeProgress);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(updateCount);
  }, [from, to, inView]);

  return <>{formatNumber(count)}</>;
}

export function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const statsDocRef = doc(db, 'platform_stats', 'global');
    
    const unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      } else {
        // Fallback demo data
        setStats({
          total_volunteers: 2847,
          active_today: 143,
          needs_resolved: 18492,
          ngos_registered: 312,
          cities_covered: 5,
          avg_response_minutes: 23,
          people_helped: 18492,
          volunteer_hours: 45000,
          updated_at: new Date().toISOString()
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Stats sync error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statItems = stats ? [
    { label: 'Total Volunteers', value: stats.total_volunteers },
    { label: 'NGOs Registered', value: stats.ngos_registered },
    { label: 'Needs Resolved', value: stats.needs_resolved },
    { label: 'Cities Covered', value: stats.cities_covered },
    { label: 'Avg Response (mins)', value: stats.avg_response_minutes },
  ] : [
    { label: 'Total Volunteers', value: 0 },
    { label: 'NGOs Registered', value: 0 },
    { label: 'Needs Resolved', value: 0 },
    { label: 'Cities Covered', value: 0 },
    { label: 'Avg Response', value: 0 },
  ];

  return (
    <div className="w-full bg-[var(--surface-2)] border-y border-[var(--border)] py-8" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center divide-x divide-[var(--border)]">
          {statItems.map((stat, i) => (
            <div key={i} className="px-6 md:px-12 py-4 flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold font-mukta text-[var(--saffron)] tabular-nums mb-1">
                {stats ? <Counter from={0} to={stat.value} inView={isInView} /> : '0'}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)] text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
