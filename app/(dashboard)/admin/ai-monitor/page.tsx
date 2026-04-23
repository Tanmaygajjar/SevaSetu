'use client';

import { useState, useEffect } from 'react';
import { Bot, AlertCircle, CheckCircle2, Search, Filter, Sparkles, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';

export default function AiMonitor() {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'low_confidence'>('flagged');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mocking AI moderation queue data since we're not recording AI logs directly in a separate table yet
  const logs = [
    {
      id: 'AI-4859',
      timestamp: new Date(Date.now() - 15000).toISOString(),
      action: 'Content Moderation',
      input: 'Urgent help required at slum area, building collapsed...',
      result: 'PASSED',
      confidence: 0.98,
      flagged: false,
      model: 'gemini-1.5-flash'
    },
    {
      id: 'AI-4858',
      timestamp: new Date(Date.now() - 42000).toISOString(),
      action: 'Urgency Scoring',
      input: 'Need 5 volunteers for teaching kids on weekend',
      result: 'SCORE: 3.2',
      confidence: 0.95,
      flagged: false,
      model: 'gemini-pro'
    },
    {
      id: 'AI-4857',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      action: 'Content Moderation',
      input: 'We demand government cash immediately or we will protest violently at MG Road.',
      result: 'FAILED (Violence/Hate)',
      confidence: 0.99,
      flagged: true,
      model: 'gemini-1.5-flash'
    },
    {
      id: 'AI-4856',
      timestamp: new Date(Date.now() - 360000).toISOString(),
      action: 'Speech-to-Text',
      input: '[Audio Blob - GUJ]',
      result: 'મને તાત્કાલિક દવાની જરૂર છે',
      confidence: 0.65,
      flagged: false,
      model: 'sarvam-stt'
    }
  ];

  const filteredLogs = logs.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return l.flagged;
    if (filter === 'low_confidence') return l.confidence < 0.8;
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold font-mukta text-[var(--ink)] flex items-center gap-2">
            <Bot className="text-[var(--saffron)]" /> AI Operations Monitor
          </h1>
          <p className="text-[var(--ink-muted)]">Oversight for Gemini moderation and Sarvam translations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-[var(--surface-2)]">
          <p className="text-sm font-semibold text-[var(--ink-muted)] mb-1">API Requests (24h)</p>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">14,204</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> 99.8% Success Rate</p>
        </div>
        <div className="card bg-[var(--surface-2)]">
          <p className="text-sm font-semibold text-[var(--ink-muted)] mb-1">Moderation Interventions</p>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">42</p>
          <p className="text-xs text-orange-600 mt-2">Spam/Hate prevented</p>
        </div>
        <div className="card bg-[var(--surface-2)]">
          <p className="text-sm font-semibold text-[var(--ink-muted)] mb-1">Avg AI Processing Time</p>
          <p className="text-3xl font-bold font-mukta text-[var(--ink)]">850ms</p>
          <p className="text-xs text-[var(--ink-muted)] mt-2">Combined STT + Moderation</p>
        </div>
      </div>

      <div className="card flex-1 flex flex-col flex-1 p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:bg-[var(--surface-3)]'}`}
            >
              All Activity
            </button>
            <button 
              onClick={() => setFilter('flagged')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'flagged' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-[var(--ink-muted)] hover:bg-[var(--surface-3)]'}`}
            >
               Flagged / Blocked
            </button>
            <button 
              onClick={() => setFilter('low_confidence')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'low_confidence' ? 'bg-orange-50 text-orange-700 shadow-sm' : 'text-[var(--ink-muted)] hover:bg-[var(--surface-3)]'}`}
            >
              Low Confidence (&lt; 0.8)
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" size={16} />
            <input type="text" placeholder="Search Request ID..." className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] text-sm w-64 outline-none focus:border-[var(--saffron)]" />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--surface)] text-[var(--ink-muted)] text-sm border-b border-[var(--border)]">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Action & Model</th>
                <th className="p-4 font-medium max-w-xs">Input Snippet</th>
                <th className="p-4 font-medium">AI Result</th>
                <th className="p-4 font-medium text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredLogs.map(log => (
                <tr key={log.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                  <td className="p-4 align-top">
                    <p className="font-mono text-[var(--ink)]">{log.id}</p>
                    <p className="text-xs text-[var(--ink-muted)]">
                      {isMounted ? new Date(log.timestamp).toLocaleTimeString() : '--:--:--'}
                    </p>
                  </td>
                  <td className="p-4 align-top">
                    <p className="font-bold font-mukta">{log.action}</p>
                    <p className="text-xs text-[var(--ink-faint)] flex items-center gap-1"><Sparkles size={10} /> {log.model}</p>
                  </td>
                  <td className="p-4 align-top max-w-xs truncate text-[var(--ink-muted)]" title={log.input}>
                    {log.input}
                  </td>
                  <td className="p-4 align-top">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                      log.flagged ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {log.flagged ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                      {log.result}
                    </span>
                  </td>
                  <td className="p-4 align-top text-right">
                    <span className={`font-mono font-medium ${log.confidence < 0.8 ? 'text-orange-600' : 'text-green-600'}`}>
                      {(log.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
