'use client';

import { useState } from 'react';
import { AuditLedger, pushAuditLog } from '@/components/shared/AuditLedger';
import { Radio, Send, ShieldAlert, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BroadcastPage() {
  const [message, setMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    setIsBroadcasting(true);
    await pushAuditLog('SYSTEM_BROADCAST', `Emergency broadcast sent: "${message.slice(0, 30)}..."`, 'CRITICAL');
    toast.success('Broadcast transmitted globally.');
    setMessage('');
    setIsBroadcasting(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-mukta text-slate-900 tracking-tighter">Emergency Radio</h1>
          <p className="text-slate-500 font-medium">Direct low-latency communication with all active nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#0F172A] text-white p-12 rounded-[2.5rem] shadow-2xl flex flex-col justify-center border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 opacity-[0.03] scale-[3] text-white rotate-12"><Radio size={300} /></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 text-red-500 mb-2">
               <ShieldAlert size={32} />
               <h2 className="text-3xl font-black font-mukta uppercase tracking-tight text-white">Global Override Input</h2>
            </div>
            
            <p className="text-slate-300 font-medium text-lg leading-relaxed">This terminal broadcasts directly to the mobile devices of all volunteers and NGOs within the SevaSetu network. Use with extreme caution.</p>
            
            <div className="space-y-4">
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter emergency directive..."
                className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-8 text-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none"
              />
              
              <button 
                onClick={handleBroadcast}
                disabled={isBroadcasting || !message.trim()}
                className="w-full py-6 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white rounded-3xl font-black text-lg tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-900/40 uppercase"
              >
                {isBroadcasting ? 'Transmitting...' : <><Send size={24} /> Execute Broadcast</>}
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
               <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <Globe size={14} /> Network Status: Secure
               </div>
               <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <Radio size={14} /> Channels: 12 Active
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 h-[800px]">
          <AuditLedger />
        </div>
      </div>
    </div>
  );
}
