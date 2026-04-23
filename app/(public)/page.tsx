import { HeroSection } from '@/components/homepage/HeroSection';
import { StatsBar } from '@/components/homepage/StatsBar';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { LiveNeedsPreview } from '@/components/homepage/LiveNeedsPreview';
import { SDGSection } from '@/components/homepage/SDGSection';
import Link from 'next/link';
import { db } from '@/lib/firebase/admin';
import { Task } from '@/types';

async function getTestimonials() {
  try {
    const snapshot = await db.collection('tasks')
      .where('status', '==', 'completed')
      .where('beneficiary_rating', '>=', 4)
      .limit(3)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <LiveNeedsPreview />
      <SDGSection />

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-white border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold font-mukta text-center mb-16 text-[var(--ink)]">
              Voices from the ground
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((task) => (
                <div key={task.id} className="card bg-[var(--surface-2)]">
                  <div className="text-[var(--saffron)] text-4xl font-serif leading-none mb-4">"</div>
                  <p className="text-[var(--ink-muted)] mb-6 text-base italic leading-relaxed">
                    {task.completion_note}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center font-bold">
                      {task.volunteer?.profiles?.full_name?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="font-bold font-mukta text-[var(--ink)] text-sm">
                        {task.volunteer?.profiles?.full_name || 'Anonymous Volunteer'}
                      </p>
                      <div className="flex text-[var(--saffron)] text-xs mt-0.5">
                        {Array.from({ length: Math.floor(task.beneficiary_rating || 5) }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, var(--saffron), #E85D04)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold font-mukta mb-6">
            Join thousands of volunteers making a difference today
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            No fees. No bureaucracy. Just direct, measurable impact in your local community.
          </p>
          <Link 
            href="/join" 
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-mukta font-bold text-lg bg-white text-[var(--saffron)] hover:bg-[var(--surface)] transition-transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
