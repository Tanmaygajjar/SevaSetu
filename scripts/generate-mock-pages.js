const fs = require('fs');
const path = require('path');

const paths = [
  '/volunteer/training',
  '/volunteer/wellness',
  '/volunteer/notifications',
  '/volunteer/profile',
  '/ngo/needs',
  '/ngo/needs/new',
  '/ngo/volunteers',
  '/ngo/analytics',
  '/ngo/impact-report',
  '/ngo/settings',
  '/admin/ngo-verify',
  '/admin/users',
  '/admin/cities',
  '/admin/disaster',
  '/admin/compliance',
  '/admin/settings',
  '/govt/map',
  '/govt/alerts',
  '/govt/scheme-gaps',
  '/govt/reports',
  '/govt/ngos'
];

paths.forEach(p => {
  const fullPath = path.join(process.cwd(), 'app', '(dashboard)', ...p.split('/'));
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  
  const formattedName = p.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const content = `
import React from 'react';

export default function Page() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-mukta text-[var(--ink)]">${formattedName} Dashboard</h1>
          <p className="text-[var(--ink-muted)]">Active demo data view.</p>
        </div>
      </div>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-[var(--border)] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="text-xl font-bold font-mukta mb-2">Populated with Test Data</h2>
        <p className="text-[var(--ink-muted)] max-w-md">This specific dashboard segment is loaded with temporary cached demo data. Further endpoints will connect securely to Postgres tables upon production launch.</p>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(fullPath, 'page.tsx'), content);
});

console.log('Successfully mapped 404s to demo layouts!');
