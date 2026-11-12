import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../common/Logo';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useConfirm } from '../../context/ConfirmContext';
import { cn } from '../../utils/cn';

function SidebarContent({ items, onNavigate }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const onLogout = async () => {
    const ok = await confirm({ title: 'Log out?', message: 'You will need to sign in again to access your dashboard.', confirmText: 'Log out', tone: 'primary' });
    if (!ok) return;
    logout();
    toast.success('You have been logged out');
    navigate('/');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <Avatar src={user?.avatar} name={user?.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.role === 'recruiter' ? 'Recruiter' : 'Job seeker'}</p>
        </div>
      </div>
      <nav className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-[18px] w-[18px]', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} />
                <span className="flex-1">{label}</span>
                {badge === 'notifications' && unreadCount > 0 && (
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold', isActive ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600')}>{unreadCount}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600">
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ items, mobileOpen, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent items={items} />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-slate-900/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-2xl"
            >
              <button onClick={onClose} className="absolute right-3 top-3.5 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close sidebar">
                <X className="h-5 w-5" />
              </button>
              <SidebarContent items={items} onNavigate={onClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
