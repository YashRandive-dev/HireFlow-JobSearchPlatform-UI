import { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Bookmark, Briefcase, Building2, FileText, LayoutDashboard, Menu, PlusCircle, Settings, Sparkles, User, Users } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import UserMenu from '../components/layout/UserMenu';
import NotificationBell from '../components/layout/NotificationBell';
import PageLoader from '../components/common/PageLoader';

export const SEEKER_NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'My Profile', icon: User },
  { to: '/dashboard/applications', label: 'My Applications', icon: Briefcase },
  { to: '/dashboard/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { to: '/dashboard/recommended-jobs', label: 'Recommended Jobs', icon: Sparkles },
  { to: '/dashboard/resume', label: 'Resume Management', icon: FileText },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const RECRUITER_NAV = [
  { to: '/recruiter/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase, end: true },
  { to: '/recruiter/jobs/create', label: 'Post a Job', icon: PlusCircle },
  { to: '/recruiter/applicants', label: 'Applicants', icon: Users },
  { to: '/recruiter/company-profile', label: 'Company Profile', icon: Building2 },
  { to: '/recruiter/notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
  { to: '/recruiter/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const items = role === 'recruiter' ? RECRUITER_NAV : SEEKER_NAV;

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar items={items} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open sidebar">
              <Menu className="h-6 w-6" />
            </button>
            <Link to={role === 'recruiter' ? '/' : '/jobs'} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              <span>{role === 'recruiter' ? 'Back to site' : 'Browse jobs'}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <UserMenu compact />
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
