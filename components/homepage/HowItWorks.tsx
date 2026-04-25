import { MessageSquare, Cpu, Users } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare size={32} />,
      title: "1. Collect",
      desc: "Community members report needs via app, voice, or WhatsApp in their native language."
    },
    {
      icon: <Cpu size={32} />,
      title: "2. Prioritize",
      desc: "Our AI scores every need by urgency — severity, reach, and time sensitivity — so nothing critical is missed."
    },
    {
      icon: <Users size={32} />,
      title: "3. Connect",
      desc: "The right volunteer is matched, notified in their language, and guided to the location in minutes."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold font-mukta text-center mb-16 text-[var(--ink)]">
          How Sahaayak works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[var(--border)]"
                style={{ background: 'var(--surface)' }}
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[var(--saffron)] bg-[var(--saffron-light)]">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold font-mukta mb-3 text-[var(--ink)]">{step.title}</h3>
              <p className="text-[var(--ink-muted)] text-base max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
