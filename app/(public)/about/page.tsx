import Link from 'next/link';
import { Target, ShieldCheck, HeartHandshake, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <div className="bg-[#0A0A0F] text-white py-24 pt-32 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--saffron)] opacity-20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 opacity-20 blur-[120px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-mukta mb-8 leading-tight">
            Building the digital bridge for civic impact.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-4">
            During disasters, the gap between a community's need and a volunteer's readiness isn't a lack of willingness—it's a lack of connection. 
          </p>
          <p className="text-xl md:text-2xl text-[var(--saffron)] font-bold">
            SevaSetu was built to solve this.
          </p>
        </div>
      </div>

      <div className="py-24 bg-[var(--surface-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold font-mukta mb-6 text-[var(--ink)]">The Problem</h2>
              <p className="text-lg text-[var(--ink-muted)] mb-6">
                When crisis strikes, <strong>critical time is lost to coordination friction</strong>. Needs are reported via fragmented WhatsApp groups, unverified claims lead to duplicated efforts, and language barriers prevent volunteers from acting immediately.
              </p>
              <ul className="space-y-4 text-[var(--ink-muted)]">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="text-red-500 mt-1 shrink-0" /> 
                  <span>No central verification of requests or NGO legitimacy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <HeartHandshake className="text-red-500 mt-1 shrink-0" />
                  <span>Volunteers burn out managing unorganized data instead of doing fieldwork.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="text-red-500 mt-1 shrink-0" />
                  <span>Non-Hindi/English speakers are cut out of the resolution loops.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-[var(--border)] relative">
              <div className="absolute top-0 right-0 p-6">
                <Target size={48} className="text-[var(--teal)] opacity-20" />
              </div>
              <h2 className="text-4xl font-bold font-mukta mb-6 text-[var(--ink)]">Our Solution</h2>
              <p className="text-lg text-[var(--ink-muted)] mb-6">
                SevaSetu is an AI-powered, multilingual platform that acts as an intelligent router for civic action.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-4 bg-[var(--saffron-light)] rounded-xl border border-[var(--saffron)]/20">
                  <span className="font-bold text-[var(--saffron)]">1.</span>
                  <span className="text-[var(--saffron-dark)] font-medium">Native language voice reporting powered by Sarvam AI.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="font-bold text-teal-700">2.</span>
                  <span className="text-teal-800 font-medium">Automated urgency scoring and Gemini content validation.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="font-bold text-indigo-700">3.</span>
                  <span className="text-indigo-800 font-medium">Algorithmic matching of volunteers based on proximity, skills, and wellness.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-mukta mb-8">Google Solution Challenge 2025</h2>
          <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-8">
            This platform was engineered as an open-source solution utilizing the best of Google's technology stack (Gemini, Maps, Firebase Auth variants) combined with cutting-edge Indian LLM capabilities (Sarvam).
          </p>
          <div className="inline-flex items-center gap-4 P-4 bg-[var(--surface-2)] rounded-full px-6 py-3 font-semibold text-[var(--ink)] border border-[var(--border)]">
            <Code /> View Source Code on GitHub
          </div>
        </div>
      </div>
    </>
  );
}
