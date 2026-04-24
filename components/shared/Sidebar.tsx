'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import {
  LayoutDashboard, ListTodo, MapPin, BarChart3, FileText,
  Users, Settings, Bell, Heart, GraduationCap, User,
  Building2, PlusCircle, Columns3, Database, Shield,
  Eye, Activity, Globe, AlertTriangle, Scale, ChevronLeft,
  ChevronRight, LogOut, Menu, ShieldAlert, Radio, TrendingUp
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { UserRole } from '@/types';
import { type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const ROLE_NAV: Record<string, NavItem[]> = {
  volunteer: [
    { href: '/volunteer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/volunteer/tasks', label: 'Browse Tasks', icon: ListTodo },
    { href: '/volunteer/impact', label: 'My Impact', icon: BarChart3 },
    { href: '/volunteer/training', label: 'Training', icon: GraduationCap },
    { href: '/volunteer/wellness', label: 'Wellness', icon: Heart },
    { href: '/volunteer/notifications', label: 'Notifications', icon: Bell },
    { href: '/volunteer/profile', label: 'Profile', icon: User },
  ],
  ngo_admin: [
    { href: '/ngo/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { href: '/ngo/needs', label: 'Needs', icon: AlertTriangle },
    { href: '/ngo/needs/new', label: 'New Need', icon: PlusCircle },
    { href: '/ngo/tasks', label: 'Task Board', icon: Columns3 },
    { href: '/ngo/volunteers', label: 'Volunteers', icon: Users },
    { href: '/ngo/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/ngo/impact-report', label: 'Impact Report', icon: FileText },
    { href: '/ngo/data-intake', label: 'Data Intake', icon: Database },
    { href: '/ngo/settings', label: 'Settings', icon: Settings },
  ],
  ngo_coordinator: [
    { href: '/ngo/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { href: '/ngo/needs', label: 'Needs', icon: AlertTriangle },
    { href: '/ngo/needs/new', label: 'New Need', icon: PlusCircle },
    { href: '/ngo/tasks', label: 'Task Board', icon: Columns3 },
    { href: '/ngo/volunteers', label: 'Volunteers', icon: Users },
    { href: '/ngo/notifications', label: 'Alerts', icon: Bell },
    { href: '/ngo/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/ngo/impact-report', label: 'Impact Report', icon: FileText },
    { href: '/ngo/data-intake', label: 'Data Intake', icon: Database },
    { href: '/ngo/settings', label: 'Settings', icon: Settings },
  ],
  ngo_reporter: [
    { href: '/ngo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ngo/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/ngo/impact-report', label: 'Impact Report', icon: FileText },
  ],
  platform_admin: [
    { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/ngo-verify', label: 'NGO Verification', icon: Shield },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/ai-monitor', label: 'AI Monitor', icon: Eye },
    { href: '/admin/cities', label: 'Cities', icon: Globe },
    { href: '/admin/disaster', label: 'Disaster Mode', icon: AlertTriangle },
    { href: '/admin/compliance', label: 'Compliance', icon: Scale },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  govt_officer: [
    { href: '/govt/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/govt/map', label: 'District Map', icon: MapPin },
    { href: '/govt/alerts', label: 'Critical Alerts', icon: AlertTriangle },
    { href: '/govt/notifications', label: 'System Notifications', icon: Bell },
    { href: '/govt/ngos', label: 'NGOs', icon: Building2 },
    { href: '/govt/scheme-gaps', label: 'Scheme Gaps', icon: Activity },
    { href: '/govt/reports', label: 'Reports', icon: FileText },
    { href: '/govt/settings', label: 'Settings', icon: Settings },
  ],
  super_admin: [
    { href: '/admin/super', label: 'Command Center', icon: ShieldAlert },
    { href: '/admin/super/stats', label: 'Impact Analytics', icon: TrendingUp },
    { href: '/admin/super/telemetry', label: 'System Telemetry', icon: Activity },
    { href: '/admin/super/broadcast', label: 'Emergency Broadcast', icon: Radio },
    { href: '/admin/settings', label: 'Global Settings', icon: Settings },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  volunteer: 'VOLUNTEER',
  ngo_admin: 'NGO ADMIN',
  ngo_coordinator: 'NGO COORDINATOR',
  ngo_reporter: 'NGO REPORTER',
  platform_admin: 'PLATFORM ADMIN',
  govt_officer: 'GOVT OFFICER',
  super_admin: 'SUPREME OVERSEER',
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapse, sidebarOpen, setSidebarOpen } = useUIStore();

  if (!user) return null;

  const navItems = ROLE_NAV[user.role] || [];
  const roleLabel = ROLE_LABELS[user.role] || user.role.toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg"
        style={{ background: 'var(--sidebar-bg)', color: 'white' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <aside
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}
        style={{ width: sidebarCollapsed ? 64 : 260 }}
      >
        {/* Logo */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--sidebar-border)' }}>
          {!sidebarCollapsed && (
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold" style={{ color: 'var(--saffron)', fontFamily: 'var(--font-mukta)' }}>
                  Resource
                </span>
                <span className="text-lg font-bold" style={{ color: 'white', fontFamily: 'var(--font-mukta)' }}>
                  {" "}IQ
                </span>
              </div>
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--sidebar-text)' }}
              >
                {roleLabel}
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <span className="text-lg font-bold mx-auto" style={{ color: 'var(--saffron)', fontFamily: 'var(--font-mukta)' }}>
              RQ
            </span>
          )}
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && item.badge && item.badge > 0 && (
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--saffron)', color: 'white' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="border-t p-3 relative z-[60]" style={{ borderColor: 'var(--sidebar-border)' }}>
          <button
            className="hidden md:flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors mb-2"
            style={{ color: 'var(--sidebar-text)' }}
            onClick={toggleSidebarCollapse}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>

          {/* 🇮🇳 Universal Language Switcher */}
          {!sidebarCollapsed && (
            <div className="px-1 mb-2">
              <LanguageSwitcher isSidebar />
            </div>
          )}

          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2 mt-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'var(--saffron)', color: 'white' }}
            >
              {user.full_name.charAt(0)}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'white' }}>
                  {user.full_name}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors mt-1"
            style={{ color: 'var(--critical)' }}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
