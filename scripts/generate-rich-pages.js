const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, '../app/(dashboard)');

const updateFile = (route, content) => {
    const fullPath = path.join(BASE_PATH, route, 'page.tsx');
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim());
    console.log(`Injected Govt Template: ${route}`);
};

// 1. GOVT DASHBOARD
updateFile('govt/dashboard', `
'use client';
import React from 'react';
import { 
  Building2, Users, FileBarChart, ShieldCheck, 
  AlertTriangle, Map as MapIcon, ArrowRight, Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">District Command Center</h1>
          <p className="text-[var(--ink-muted)] mt-1 font-medium">Official oversight for Rajkot District resources and volunteer networks.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> Official Session
           </div>
           <button onClick={() => toast.success('Pulling latest district health data...')} className="btn-primary">Sync All Nodes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Registered NGOs', v: '142', d: 'Verified in District', i: Building2 },
          { l: 'Total Volunteers', v: '8,412', d: 'Active in 24h', i: Users },
          { l: 'Reports Filed', v: '184', d: 'Last 7 Days', i: FileBarChart },
          { l: 'Active Alerts', v: '3', d: 'Action Recommended', i: AlertTriangle },
        ].map((s, i) => (
          <div key={i} className="card p-6 border-l-4 border-l-blue-600 hover:shadow-xl transition-all">
             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4"><s.i size={20} /></div>
             <p className="text-3xl font-bold font-mukta text-[var(--ink)]">{s.v}</p>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
             <p className="text-[10px] text-gray-400 mt-2">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="card p-8 bg-white space-y-6">
               <h3 className="font-bold font-mukta text-xl flex items-center justify-between">
                  District Priority Heatmap
                  <button onClick={() => window.location.href = '/govt/map'} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">Full Analytics <ArrowRight size={12} /></button>
               </h3>
               <div className="h-64 bg-[var(--surface-2)] rounded-3xl relative overflow-hidden flex items-center justify-center border border-dashed border-[var(--border)]">
                  <MapIcon size={48} className="text-gray-300 animate-pulse" />
                  <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-lg text-[10px] font-bold border">RAJKOT METRO ZONE</div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded-2xl bg-red-50 border-red-100">
                     <p className="text-xl font-bold text-red-600">High</p>
                     <p className="text-[10px] font-bold uppercase text-red-400">West Zone</p>
                  </div>
                  <div className="text-center p-3 border rounded-2xl bg-blue-50 border-blue-100">
                     <p className="text-xl font-bold text-blue-600">Stable</p>
                     <p className="text-[10px] font-bold uppercase text-blue-400">East Zone</p>
                  </div>
                  <div className="text-center p-3 border rounded-2xl bg-green-50 border-green-100">
                     <p className="text-xl font-bold text-green-600">Optimal</p>
                     <p className="text-[10px] font-bold uppercase text-green-400">Suburbs</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="font-bold font-mukta text-xl">Official Taskforce Feed</h3>
            <div className="space-y-4">
               {[
                 { t: 'Flood Inundation Level Red', d: 'Ward 12 Needs immediate gravel bags' },
                 { t: 'NGO Verification Required', d: 'Surat Relief Org applied for FCRA validation' },
                 { t: 'Citizen Panic Alert Detected', d: 'Social media AI detected distress in Mavdi Area' },
               ].map((f, i) => (
                  <div key={i} className="card p-4 border-none bg-blue-900 text-white hover:scale-105 transition-transform cursor-pointer">
                     <p className="text-xs font-bold mb-1 flex items-center gap-2"><Zap size={10} className="text-yellow-400" /> {f.t}</p>
                     <p className="text-[10px] opacity-70 leading-relaxed">{f.d}</p>
                  </div>
               ))}
               <button className="w-full py-4 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors uppercase tracking-widest">View All Incidents</button>
            </div>
         </div>
      </div>
    </div>
  );
}
`);

// 2. GOVT MAP
updateFile('govt/map', `
'use client';
import React from 'react';
import { MapPin, Search, Filter, Layers, Navigation, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-[var(--surface)] overflow-hidden">
      <div className="w-full md:w-80 bg-white border-r border-[var(--border)] flex flex-col">
         <div className="p-6 border-b">
            <h2 className="text-xl font-bold font-mukta text-[var(--ink)] mb-4">GIS Surveillance</h2>
            <div className="relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search ward or site..." className="input pl-10 text-xs" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Live Heat Signature</p>
            {[
              { n: 'Mavdi Market Area', l: 'Critical', c: 'text-red-500' },
              { n: 'Rajkot Bus Port', l: 'High Active', c: 'text-orange-500' },
              { n: 'Metoda GIDC Zone', l: 'Stable', c: 'text-green-500' },
              { n: 'Nana Mava Site', l: 'Verified', c: 'text-blue-500' },
            ].map((s, i) => (
              <div key={i} className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] hover:border-blue-600 transition-all cursor-pointer">
                 <div className="flex justify-between items-center mb-1"><p className="font-bold text-sm">{s.n}</p><span className={\`text-[9px] font-bold uppercase \${s.c}\`}>{s.l}</span></div>
                 <p className="text-[10px] text-gray-400">Last heartbeat: 42 seconds ago</p>
              </div>
            ))}
         </div>
         <div className="p-6 border-t bg-gray-50">
            <button onClick={() => toast.success('Reporting official incident...')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-blue-700">Flag Incident</button>
         </div>
      </div>
      <div className="flex-1 relative bg-slate-200">
         {/* Live OpenStreetMap simulation */}
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.682020295!2d70.7301056!3d22.299105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c98ac1682521%3A0x1da901c530e38600!2sRajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            className="w-full h-full grayscale opacity-80"
            loading="lazy"
         ></iframe>
         <div className="absolute top-6 right-6 flex flex-col gap-3">
            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all"><Layers size={24} /></button>
            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all"><Navigation size={24} /></button>
            <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:scale-110 active:scale-95 transition-all"><Info size={24} /></button>
         </div>
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-4 bg-white/90 backdrop-blur rounded-3xl shadow-2xl flex items-center gap-6 border border-white">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> <span className="text-[10px] font-bold uppercase">Danger Hub</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-full" /> <span className="text-[10px] font-bold uppercase">Active Deployment</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full" /> <span className="text-[10px] font-bold uppercase">Official Center</span></div>
         </div>
      </div>
    </div>
  );
}
`);

// 3. GOVT ANALYTICS
updateFile('govt/analytics', `
'use client';
import React from 'react';
import { AreaChart, BarChart4, TrendingUp, TrendingDown, Target, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">District Benchmarks</h1><p className="text-[var(--ink-muted)]">Official fulfillment velocity and resource gap analysis.</p></div>
        <button onClick={() => toast.success('Recalculating district growth index...')} className="btn-primary flex items-center gap-2"><AreaChart size={18} /> Performance Audit</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card md:col-span-2 p-8 h-[400px] flex flex-col bg-white">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Response Velocity Audit</h3>
               <select className="input w-36 py-1 h-auto text-xs"><option>Last Quarter</option><option>Last Year</option></select>
            </div>
            <div className="flex-1 w-full bg-[var(--surface-2)] rounded-3xl relative overflow-hidden flex items-end p-4">
                {[20, 30, 45, 10, 60, 40, 85, 30, 90].map((h, i) => (
                   <div key={i} className="flex-1 px-1 group relative">
                      <div className="w-full bg-blue-600 opacity-20 group-hover:opacity-60 transition-all rounded-t-lg" style={{ height: \`\${h}%\` }} />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-blue-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Idx: {h}</div>
                   </div>
                ))}
            </div>
         </div>

         <div className="card p-8 bg-blue-900 text-white flex flex-col justify-center items-center text-center border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rotate-45 rounded-full translate-x-16 -translate-y-16" />
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6"><Target size={32} /></div>
            <h3 className="text-2xl font-bold font-mukta mb-2">District Goal Meta</h3>
            <p className="text-xs text-blue-200 mb-8 px-4 font-medium opacity-80">Currently at 92% of the mandatory resource allocation target for the current session.</p>
            <div className="w-full h-1 bg-blue-800 rounded-full mb-2"><div className="h-full bg-yellow-400 w-[92%]" /></div>
            <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Progress: 92%</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[
           { l: 'Fulfillment Delta', v: '+12%', i: <TrendingUp size={24} />, c: 'text-green-500' },
           { l: 'Avg Latency', v: '14.2m', i: <Clock size={24} />, c: 'text-orange-500' },
           { l: 'Energy Spent', v: '4.2 GW', i: <Zap size={24} />, c: 'text-blue-500' },
         ].map((s, i) => (
            <div key={i} className="card p-6 flex items-center gap-4">
               <div className={\`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center \${s.c}\`}>{s.i}</div>
               <div><p className="text-2xl font-bold text-[var(--ink)]">{s.v}</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.l}</p></div>
            </div>
         ))}
      </div>
    </div>
  );
}
`);

// 4. GOVT REPORTS
updateFile('govt/reports', `
'use client';
import React from 'react';
import { FileText, FileDown, CheckCircle2, Search, Calendar, Filter, Archive } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const reports = [
    { title: 'District Relief Audit Q3', date: 'Oct 12, 2025', size: '4.2 MB', code: 'SST-GAZ-94' },
    { title: 'NGO Compliance Log', date: 'Oct 01, 2025', size: '1.2 MB', code: 'SST-GAZ-88' },
    { title: 'Flood Mitigation Analysis', date: 'Sep 22, 2025', size: '12.8 MB', code: 'SST-GAZ-82' },
    { title: 'Volunteer Contribution NFT Sign', date: 'Sep 15, 2025', size: '0.8 MB', code: 'SST-GAZ-77' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex justify-between items-end">
         <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Official Gazette</h1><p className="text-[var(--ink-muted)]">Signed legislative documentation and operational audits.</p></div>
         <button onClick={() => toast.success('Syncing with state archives...')} className="btn-primary flex items-center gap-2"><Archive size={18} /> State Archive</button>
      </div>

      <div className="flex gap-4 mb-6">
         <div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search gazette ID or keyword..." className="input pl-12 bg-white" /></div>
         <button className="p-3 bg-white border border-[var(--border)] rounded-xl hover:bg-gray-50 transition-colors"><Filter size={20} className="text-gray-400" /></button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {reports.map((r, i) => (
            <div key={i} className="card p-6 flex items-center justify-between hover:border-blue-600 transition-all group cursor-default">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><FileText size={28} /></div>
                  <div>
                     <h3 className="font-bold text-lg text-[var(--ink)]">{r.title}</h3>
                     <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {r.date}</span>
                        <span>•</span>
                        <span>{r.size}</span>
                        <span>•</span>
                        <span className="text-blue-600">{r.code}</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => toast.success('Opening secure viewer...')} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors border border-[var(--border)]"><FileText size={18} /></button>
                  <button onClick={() => toast.success('Report downloaded and logged')} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"><FileDown size={16} /> Official PDF</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
`);

// 5. GOVT NGOS
updateFile('govt/ngos', `
'use client';
import React from 'react';
import { Building2, Search, Filter, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const ngos = [
    { n: 'Red Cross Rajkot', t: 'Medical / Disaster', d: 'District Zone 1', s: 'Verified', h: '98%' },
    { n: 'Asha Relief Foundation', t: 'Food / Education', d: 'District Zone 2', s: 'Verified', h: '94%' },
    { n: 'Sanjeevani NGO', t: 'Healthcare Specialists', d: 'District Zone 1', s: 'Pending Review', h: 'N/A' },
    { n: 'Disha Social Hub', t: 'Women Empowerment', d: 'District Zone 4', s: 'Verified', h: '88%' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Institutional Registry</h1><p className="text-[var(--ink-muted)]">Oversight for all NGOs operating within district boundaries.</p></div>
        <div className="flex gap-4">
           <div className="relative w-64"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search by name..." className="input pl-10" /></div>
           <button className="p-3 bg-white border border-[var(--border)] rounded-xl"><Filter size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {ngos.map((n, i) => (
            <div key={i} className="card p-8 flex flex-col group hover:shadow-2xl transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 opacity-10 rotate-45 translate-x-10 -translate-y-10 group-hover:bg-blue-600 transition-all" />
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-white border-2 border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">{n.n[0]}</div>
                  <span className={\`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest \${n.s === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}\`}>{n.s}</span>
               </div>
               <h3 className="text-xl font-bold font-mukta mb-2 group-hover:text-blue-600 transition-colors leading-tight">{n.n}</h3>
               <p className="border-l-2 border-blue-600 pl-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{n.t}</p>
               
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100"><p className="text-lg font-bold text-[var(--ink)]">{n.h}</p><p className="text-[10px] text-gray-400 font-bold uppercase">Integrity Index</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100"><p className="text-lg font-bold text-[var(--ink)]">{n.d}</p><p className="text-[10px] text-gray-400 font-bold uppercase">Primary Sector</p></div>
               </div>

               <div className="flex gap-2">
                  <button onClick={() => toast.success('Profile View Authorized')} className="flex-1 py-3 bg-[var(--surface-2)] text-[var(--ink)] rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors flex items-center justify-center gap-2"><ExternalLink size={14} /> Profile</button>
                  <button onClick={() => toast.success('Audit Request Sent to NGO Admin')} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-blue-700 transition-all">Audit</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
`);

// 6. GOVT INVENTORY
updateFile('govt/inventory', `
'use client';
import React from 'react';
import { Package, ShieldCheck, AlertCircle, TrendingUp, Ship, HardDrive, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  const supplies = [
    { n: 'Emergency Grain Stock', q: '124 Tons', s: 'Critical', c: 'red', p: 12 },
    { n: 'Medical Aid Kits', q: '8,210 Units', s: 'In Stock', c: 'green', p: 88 },
    { n: 'Oxygen Canisters', q: '450 Units', s: 'Low', c: 'orange', p: 32 },
    { n: 'Flood Tents', q: '1,200 Sets', s: 'In Stock', c: 'green', p: 75 },
    { n: 'Potable Water Packs', q: '42,000 Pcs', s: 'Optimal', c: 'blue', p: 95 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 fade-in min-h-screen">
      <div className="flex justify-between items-end">
        <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Supply Chain Inventory</h1><p className="text-[var(--ink-muted)]">Official monitoring of district-wide emergency resources.</p></div>
        <button onClick={() => toast.success('Requesting state-level grain allocation...')} className="btn-primary flex items-center gap-2"><TrendingUp size={18} /> Request Supplies</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="card p-8 space-y-6">
            <h3 className="font-bold font-mukta text-xl">Stock Telemetry</h3>
            <div className="space-y-6">
               {supplies.map((s, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                           <div className={\`w-2 h-2 rounded-full \${s.c === 'red' ? 'bg-red-500' : s.c === 'orange' ? 'bg-orange-500' : 'bg-green-500'}\`} />
                           <p className="text-sm font-bold">{s.n}</p>
                        </div>
                        <p className="text-xs font-bold text-gray-400">{s.q}</p>
                     </div>
                     <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={\`h-full \${s.c === 'red' ? 'bg-red-500' : s.c === 'orange' ? 'bg-orange-500' : 'bg-blue-600'} transition-all duration-1000\`} style={{ width: \`\${s.p}%\` }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            <div className="card p-6 bg-blue-900 text-white flex flex-col justify-center border-none shadow-2xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 opacity-20 -rotate-12 translate-x-10 translate-y-10" />
               <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2"><ShoppingCart size={14} /> Critical Pipeline</h4>
               <p className="text-2xl font-bold font-mukta mb-2">4 Missions Waiting</p>
               <p className="text-xs text-blue-200 opacity-70 mb-6">Insufficient grain stock detected for Rajkot West wards. Expected state delivery: Wednesday.</p>
               <button className="w-full py-4 bg-white text-blue-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors">Accelerate Logistics</button>
            </div>
            
            <div className="card p-6 border-dashed border-blue-200">
               <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-blue-700"><Ship size={16} /> Regional Ports</h4>
               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-relaxed">External supply intake channels: Kandla (Active), Mundra (Active), Navlakhi (Maintenance).</p>
            </div>
         </div>
      </div>
    </div>
  );
}
`);

// 7. GOVT SETTINGS
updateFile('govt/settings', `
'use client';
import React from 'react';
import { Save, Bell, Globe, Cog, Shield, Map, Phone, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Page() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 fade-in min-h-screen pb-20">
      <div><h1 className="text-3xl font-bold font-mukta text-[var(--ink)]">Officer Guidelines & Logic</h1><p className="text-[var(--ink-muted)]">Configure district boundaries, official alert thresholds, and department keys.</p></div>

      <div className="space-y-8">
         <section className="space-y-4">
            <h3 className="text-lg font-bold font-mukta flex items-center gap-2 text-blue-600"><Map size={20} /> Boundary Logic</h3>
            <div className="card p-8 space-y-6">
                <div><label className="label">Managed District Code</label><input type="text" defaultValue="GUJ-RAJKOT-360001" className="input bg-gray-50 border-gray-100 font-mono" readOnly /></div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-3xl border border-blue-100">
                   <div><p className="font-bold text-sm text-blue-900">Automated State Sync</p><p className="text-[10px] text-blue-600">Sync all reports with GSWAN Network hourly.</p></div>
                   <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                </div>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="text-lg font-bold font-mukta flex items-center gap-2 text-orange-600"><Bell size={20} /> Alert Configuration</h3>
            <div className="card p-8 space-y-6 text-xs">
               <div className="flex justify-between items-center"><p className="font-bold">Incident Escalation Threshold</p><select className="input w-36 py-1 h-auto text-[10px]"><option>High (Score &gt; 8.5)</option><option>Med (Score &gt; 6.0)</option></select></div>
               <div className="flex justify-between items-center"><p className="font-bold">Official Response SLA</p><select className="input w-36 py-1 h-auto text-[10px]"><option>30 Minutes</option><option>60 Minutes</option></select></div>
            </div>
         </section>
      </div>

      <div className="flex justify-end items-center gap-4 pt-10 border-t">
         <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">Wipe Local Logs</button>
         <button onClick={() => toast.success('Official district settings updated!')} className="px-10 py-4 bg-blue-900 text-white rounded-2xl font-bold shadow-2xl flex items-center gap-2"><Save size={18} /> Apply Governance</button>
      </div>
    </div>
  );
}
`);
