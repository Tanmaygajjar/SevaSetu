'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] pt-32 pb-20 font-dm-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-12 rounded-3xl border border-[var(--border)] shadow-sm">
        <h1 className="text-3xl font-bold font-mukta text-[var(--ink)] mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-[var(--ink-muted)]">
          <p className="font-bold text-[var(--ink)] uppercase tracking-widest text-xs">Effective Date: April 21, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">1. Acceptance of Terms</h2>
            <p>By accessing Resource IQ, you agree to be bound by these Terms of Service and all applicable laws and regulations in India.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">2. Volunteer Conduct</h2>
            <p>Volunteers are expected to act with integrity and respect. Resource IQ is a platform for social impact and should not be used for commercial solicitation or harassment.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">3. NGO Responsibility</h2>
            <p>NGOs are responsible for the accuracy of the needs they report. Falsifying needs or urgency scores may lead to account suspension.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
