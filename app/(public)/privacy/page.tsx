'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] pt-32 pb-20 font-dm-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-12 rounded-3xl border border-[var(--border)] shadow-sm">
        <h1 className="text-3xl font-bold font-mukta text-[var(--ink)] mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-[var(--ink-muted)]">
          <p className="font-bold text-[var(--ink)] uppercase tracking-widest text-xs">Last Updated: April 21, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">1. Information We Collect</h2>
            <p>SevaSetu collects information necessary to connect volunteers with community needs. This includes your name, phone number (for OTP verification), and approximate location if you choose to share it for the Needs Map.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">2. How We Use Data</h2>
            <p>Your data is used to alert you to relevant volunteering opportunities in your vicinity. We do not sell your personal information to third parties.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">3. AI Processing</h2>
            <p>Our platform uses AI models to score urgency and moderate content. We do not use your personal identifiable information (PII) to train these models without explicit consent.</p>
          </section>

          <section className="space-y-4 pt-10 border-t">
            <p className="text-sm">If you have questions about your data, contact us at <span className="text-[var(--saffron)] font-bold">privacy@sevasetu.org</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
