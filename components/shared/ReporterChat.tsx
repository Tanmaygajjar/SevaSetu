'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Phone, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Need } from '@/types';

interface Message {
  role: 'reporter' | 'volunteer';
  text: string;
  time: string;
}

interface ReporterChatProps {
  need: Need;
  isOpen: boolean;
  onClose: () => void;
}

export function ReporterChat({ need, isOpen, onClose }: ReporterChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting from AI Reporter
      setMessages([
        { 
          role: 'reporter', 
          text: `Hello, I'm the reporter for "${need.title}". Thank you for your interest in helping. What would you like to know about this situation in ${need.city}?`, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }
  }, [isOpen, need.title, need.city]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: 'volunteer',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Reporter Response
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('location') || lowerInput.includes('where')) {
        aiResponse = `The exact location is in ${need.city}, specifically the ${need.district} district. We are near the main landmark, but I'll send the precise coordinates once you accept the mission.`;
      } else if (lowerInput.includes('urgency') || lowerInput.includes('important')) {
        aiResponse = `It's quite urgent. Our urgency score is ${need.urgency_score.toFixed(1)}/10. We need help within the next few hours to prevent further issues.`;
      } else if (lowerInput.includes('what') || lowerInput.includes('help')) {
        aiResponse = `The situation is: "${need.description}". We mainly need someone who can handle ${need.category} tasks. Do you have experience in that?`;
      } else {
        aiResponse = `I understand. As the reporter, I can tell you that the community in ${need.city} is really counting on this support. Is there anything specific about the ${need.category} requirements you're unsure about?`;
      }

      const reporterMsg: Message = {
        role: 'reporter',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reporterMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative bg-white w-full max-w-lg h-[600px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                     <Bot size={24} />
                  </div>
                  <div>
                     <h3 className="font-black font-mukta leading-none mb-1 text-lg">AI Reporter Emulation</h3>
                     <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Bridging the field gap</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>

            {/* Warning Banner */}
            <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-3">
               <ShieldAlert size={14} className="text-amber-500" />
               <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Simulation Mode: Talking to Need Reporter</p>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex flex-col ${msg.role === 'volunteer' ? 'items-end' : 'items-start'} gap-1`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm ${msg.role === 'volunteer' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                       {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2">{msg.time}</span>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex flex-col items-start gap-1">
                    <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex gap-1">
                       <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" />
                       <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-75" />
                       <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-150" />
                    </div>
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
               <div className="flex gap-3 bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about location, urgency, or details..."
                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium text-slate-700"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-90 shadow-lg"
                  >
                     <Send size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
