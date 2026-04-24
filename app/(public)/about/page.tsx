'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, ShieldCheck, HeartHandshake, Code, Globe, Zap, Users, Sparkles } from 'lucide-react';

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Verification First",
    desc: "Every request is validated through multi-layer AI filtering to ensure legitimacy and prevent resource waste.",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    icon: Globe,
    title: "Language Inclusivity",
    desc: "Breaking barriers with native voice reporting and real-time translation for every Indian citizen.",
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    icon: Zap,
    title: "Rapid Response",
    desc: "Algorithmic matching connects the right help to the right place in minutes, not hours.",
    color: "text-[var(--saffron)]",
    bg: "bg-[var(--saffron-light)]"
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A0A0F]">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--saffron)] opacity-10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[var(--saffron)] text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> The Future of Civic Action
            </span>
            <h1 className="text-5xl md:text-8xl font-bold font-mukta mb-8 leading-[1.1] !text-white">
              Bridging the gap between <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--saffron)] to-orange-400">
                intent and impact.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
              During a crisis, the bottleneck isn't a lack of compassion—it's a lack of coordination. Resource IQ is the digital infrastructure for a more resilient India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold font-mukta mb-6 text-[var(--ink)]">The Coordination Crisis</h2>
                <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-[var(--saffron)] pl-6 py-2">
                  "When every second counts, fragmented data is as dangerous as the disaster itself."
                </p>
              </div>
              <p className="text-lg text-slate-600">
                Today, most grassroots relief is organized via unverified WhatsApp groups. This leads to **information silos, duplicate efforts, and unaddressed needs** in remote areas.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Verification Friction", desc: "Hard to distinguish real needs from outdated or false reports." },
                  { icon: Globe, title: "Language Barriers", desc: "Critical help is often lost in translation between regions." },
                  { icon: Users, title: "Volunteer Burnout", desc: "Heroic individuals spend more time on logistics than on the field." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--ink)]">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#0F172A] p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden text-white"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                <Target size={120} />
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold font-mukta mb-8">The Resource IQ Solution</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--saffron)] to-orange-500 flex items-center justify-center font-black text-xl shrink-0">1</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Multilingual Intelligence</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">AI-powered voice reporting allows citizens to speak in their native tongue, automatically translating and categorizing the crisis.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl shrink-0">2</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Predictive Urgency Scoring</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Our algorithms analyze population density and severity to rank needs, ensuring life-critical situations are addressed first.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center font-black text-xl shrink-0">3</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Transparent Logistics</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">A live Kanban board and audit ledger ensure every rupee and every hour donated is tracked and accounted for.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl font-bold font-mukta text-[var(--ink)] mb-4">Our Core Philosophy</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Technology is just a tool. Our mission is to empower the human spirit of service with the efficiency of modern engineering.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6 shadow-inner`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 font-mukta">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold font-mukta mb-8">Ready to be part of the bridge?</h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of volunteers and hundreds of verified NGOs working together to create a safer, more connected India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join?role=volunteer" className="btn-primary px-10 py-4 text-lg shadow-2xl shadow-[var(--saffron-glow)]">
              Join as Volunteer
            </Link>
            <Link href="/join?role=ngo" className="px-10 py-4 text-lg font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-700">
              Register NGO
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--saffron)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl" />
      </section>
    </div>
  );
}

