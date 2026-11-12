import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Briefcase, Building2, Home, LayoutDashboard, LogOut, Menu, Newspaper, X } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../utils/cn';

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/career-advice', label: 'Career Advice', icon: Newspaper },
  { to: '/dashboard/saved-jobs', label: 'Saved Jobs', icon: Bookmark, seekerOnly: true },
];

export default function Navbar() {
  const { user, isRecruiter, dashboardPath, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useLockBodyScroll(open);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visibleLinks = links.filter((l) => !(l.seekerOnly && isRecruiter));

  const linkCls = ({ isActive }) =>
    cn('rounded-lg px-3 py-2 text-sm font-medium transition', isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900');

  return (
    <header className={cn('sticky top-0 z-40 border-b bg-white/85 backdrop-blur-lg transition', scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent')}>
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {visibleLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isRecruiter && (
                <Button to="/recruiter/jobs/create" size="sm" variant="soft" className="hidden sm:inline-flex">
                  Post a job
                </Button>
              )}
              <NotificationBell />
              <div className="hidden lg:block">
                <UserMenu />
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button to="/register" size="sm">
                Sign up
              </Button>
            </div>
          )}
          <button onClick={() => setOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-slate-900/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
                <Logo />
                <button onClick={() => setOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {user && (
                <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                  <Avatar src={user.avatar} name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="flex-1 space-y-1 overflow-y-auto p-3">
                {visibleLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      cn('flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium', isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50')
                    }
                  >
                    <l.icon className="h-5 w-5" />
                    {l.label}
                  </NavLink>
                ))}
                {user && (
                  <Link to={dashboardPath} className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-slate-700 hover:bg-slate-50">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="space-y-2 border-t border-slate-100 p-4">
                {user ? (
                  <Button variant="secondary" className="w-full" leftIcon={LogOut} onClick={logout}>
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button to="/register" className="w-full">
                      Sign up free
                    </Button>
                    <Button to="/login" variant="secondary" className="w-full">
                      Log in
                    </Button>
                  </>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
