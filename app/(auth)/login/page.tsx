'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import { Shield, Building2, UserCircle, Map, LayoutDashboard, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'otp' | 'dev'>('otp');
  const router = useRouter();
  const loginAsDemo = useAuthStore(s => s.loginAsDemo);

  const handleDemoLogin = (role: UserRole | 'public') => {
    if (role === 'public') {
      router.push('/');
      return;
    }
    loginAsDemo(role);
    toast.success(`Logged in as ${role}`);
    
    // Redirect based on role
    switch (role) {
      case 'volunteer': router.push('/volunteer/dashboard'); break;
      case 'ngo_coordinator': router.push('/ngo/dashboard'); break;
      case 'platform_admin': router.push('/admin/overview'); break;
      case 'govt_officer': router.push('/govt/dashboard'); break;
      default: router.push('/');
    }
  };

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone === 'ADMIN' && password === 'Admin_seva') {
      loginAsDemo('platform_admin');
      toast.success('Super Admin Mode: Global Access Granted', {
        icon: '🛡️',
        style: { background: '#1e1b4b', color: '#fff' }
      });
      window.location.href = '/admin/super';
    } else {
      toast.error('Invalid Developer Credentials');
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[var(--border)]">
      {/* Left Panel - Branding */}
      <div className="w-full md:w-5/12 bg-[var(--sidebar-bg)] p-8 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-8">
            <span className="text-3xl font-bold font-mukta text-[var(--saffron)]">Resource</span>
            <span className="text-3xl font-bold font-mukta text-white"> IQ</span>
          </div>
          <h2 className="text-2xl font-bold font-mukta mb-4">Connecting community needs to volunteers in minutes.</h2>
          <p className="text-gray-600 text-sm mb-8">
            Join thousands of volunteers and NGOs working together to create measurable impact across India.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-sm italic text-gray-300">"Sahaayak completely transformed how we respond during floods. We found volunteers in 10 minutes instead of hours."</p>
              <p className="text-xs text-[var(--saffron)] mt-2 font-bold">— Sanjeevani Relief NGO</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-sm italic text-gray-300">"I love being able to help out in my own neighborhood and track the real impact I'm making."</p>
              <p className="text-xs text-[var(--saffron)] mt-2 font-bold">— Arjun M., Volunteer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col">
        
        {/* Demo Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-[var(--ink-muted)] uppercase tracking-wider mb-4">
            Try Sahaayak instantly (No signup needed)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={() => handleDemoLogin('volunteer')}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--saffron)] bg-[var(--saffron-light)] text-[var(--saffron-dark)] hover:bg-[var(--saffron)] hover:text-white transition-all text-left"
            >
              <UserCircle size={24} />
              <div>
                <p className="font-bold font-mukta">Volunteer</p>
                <p className="text-xs opacity-80">Arjun Mehta, Rajkot</p>
              </div>
            </button>
            
            <button 
              onClick={() => handleDemoLogin('ngo_coordinator')}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--teal)] bg-[var(--teal-light)] text-[var(--teal-dark)] hover:bg-[var(--teal)] hover:text-white transition-all text-left"
            >
              <Building2 size={24} />
              <div>
                <p className="font-bold font-mukta">NGO Coordinator</p>
                <p className="text-xs opacity-80">Disha Foundation</p>
              </div>
            </button>
            
            <button 
              onClick={() => handleDemoLogin('platform_admin')}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-700 hover:text-white transition-all text-left"
            >
              <LayoutDashboard size={24} />
              <div>
                <p className="font-bold font-mukta">Platform Admin</p>
                <p className="text-xs opacity-80">Global Access</p>
              </div>
            </button>
            
            <button 
              onClick={() => handleDemoLogin('govt_officer')}
              className="flex items-center gap-3 p-3 rounded-xl border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white transition-all text-left"
            >
              <Shield size={24} />
              <div>
                <p className="font-bold font-mukta">Govt Officer</p>
                <p className="text-xs opacity-80">Rajkot District</p>
              </div>
            </button>
            
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--ink-faint)] uppercase font-semibold">Or manual login</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <div className="flex gap-4 mb-6 relative">
          <button 
            type="button" 
            onClick={() => setLoginMode('otp')}
            className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${loginMode === 'otp' ? 'border-[var(--saffron)] text-[var(--saffron)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            OTP Login
          </button>
          <button 
            type="button" 
            onClick={() => setLoginMode('dev')}
            className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${loginMode === 'dev' ? 'border-[var(--saffron)] text-[var(--saffron)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Developer Login
          </button>
        </div>

        {loginMode === 'otp' ? (
          <div className="text-center py-6 text-gray-600 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
            OTP Services disabled for local dev. Use Demo Buttons or Developer Login.
          </div>
        ) : (
          <form onSubmit={handleDevLogin} className="space-y-4 max-w-sm mx-auto w-full">
            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1">Developer ID</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ADMIN"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] focus:ring-2 focus:ring-[var(--saffron-glow)] focus:border-[var(--saffron)] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1">Developer Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin_seva"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] focus:ring-2 focus:ring-[var(--saffron-glow)] focus:border-[var(--saffron)] transition-all outline-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3 text-base flex gap-2 shadow-[0_4px_20px_var(--saffron-glow)]">
              Authorize Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
