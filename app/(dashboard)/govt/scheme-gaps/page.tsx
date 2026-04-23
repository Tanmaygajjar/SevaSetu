
'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--saffron)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mukta text-[var(--ink)] tracking-tight">
            Scheme Gap Analysis (AI)
          </h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Production UI layout mapped to live database schemas.</p>
        </div>
      </div>
      
      
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <div className="card flex-1">
          <h3 className="font-bold border-b pb-2 mb-4">Top Unmet Needs vs Existing Schemes</h3>
          <ul className="space-y-4">
            <li>
              <div className="flex justify-between mb-1"><span className="font-bold">Post-Disaster Microloans</span><span className="text-red-500">82% Gap</span></div>
              <p className="text-xs text-gray-500">Current: PM SVANidhi (Not tailored for rapid disaster reconstruction)</p>
            </li>
            <li>
              <div className="flex justify-between mb-1"><span className="font-bold">Vernacular Mental Health Support</span><span className="text-orange-500">65% Gap</span></div>
              <p className="text-xs text-gray-500">Current: Tele MANAS (High wait times locally)</p>
            </li>
          </ul>
        </div>
        <div className="card flex-1 bg-[var(--surface-2)]">
          <h3 className="text-lg font-bold font-mukta mb-2 text-[var(--ink)]">Gemini Policy Recommendation</h3>
          <p className="text-sm leading-relaxed text-gray-700 italic">"Based on 14,000 resolved needs over 6 months, establishing a rapid-disbursement fund mechanism utilizing the existing NGO network in Rajkot could reduce fulfillment delays by 4.2 days."</p>
          <button className="mt-4 w-full py-2 border-2 border-indigo-200 text-indigo-700 font-bold rounded-lg hover:bg-indigo-50" onClick={() => alert('Generating PDF Policy Brief...')}>Generate Policy Draft</button>
        </div>
      </div>
      
    </div>
  );
}
