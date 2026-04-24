'use client';

import { create } from 'zustand';
import { Profile, UserRole } from '@/types';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  loginAsDemo: (role: UserRole) => void;
}

// Demo users for instant login
const DEMO_USERS: Record<string, Profile> = {
  volunteer: {
    id: 'demo-volunteer-001',
    phone: '+919876543210',
    email: 'arjun@resourceiq.org',
    full_name: 'Arjun Mehta',
    avatar_url: null,
    profile_image: 'https://i.pravatar.cc/150?u=demo-volunteer-001',
    role: 'volunteer',
    preferred_lang: 'en',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  ngo_coordinator: {
    id: 'demo-ngo-001',
    phone: '+919876543211',
    email: 'priya@asha-foundation.org',
    full_name: 'Priya Sharma',
    avatar_url: null,
    profile_image: 'https://i.pravatar.cc/150?u=demo-ngo-001',
    role: 'ngo_coordinator',
    preferred_lang: 'en',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  platform_admin: {
    id: 'demo-admin-001',
    phone: '+919876543212',
    email: 'vikram@resourceiq.gov.in',
    full_name: 'Vikram Singh',
    avatar_url: null,
    profile_image: 'https://i.pravatar.cc/150?u=demo-admin-001',
    role: 'platform_admin',
    preferred_lang: 'en',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  govt_officer: {
    id: 'demo-govt-001',
    phone: '+919876543213',
    email: 'kavita.patel@gujarat.gov.in',
    full_name: 'Dr. Kavita Patel',
    avatar_url: null,
    profile_image: 'https://i.pravatar.cc/150?u=demo-govt-001',
    role: 'govt_officer',
    preferred_lang: 'en',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  super_admin: {
    id: 'demo-super-001',
    phone: '+919876543214',
    email: 'admin@resourceiq.org',
    full_name: 'System Admin',
    avatar_url: null,
    profile_image: 'https://i.pravatar.cc/150?u=demo-super-001',
    role: 'super_admin',
    preferred_lang: 'en',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resourceiq_user');
      window.location.href = '/login';
    }
  },

  loginAsDemo: (role) => {
    const roleKey = role === 'ngo_admin' || role === 'ngo_reporter' ? 'ngo_coordinator' : role;
    const user = DEMO_USERS[roleKey];
    if (user) {
      const demoUser = { ...user, role };
      set({ user: demoUser, isAuthenticated: true, isLoading: false });
      if (typeof window !== 'undefined') {
        localStorage.setItem('resourceiq_user', JSON.stringify(demoUser));
      }
    }
  },
}));
