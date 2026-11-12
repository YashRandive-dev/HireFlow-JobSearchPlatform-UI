import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Briefcase, CalendarCheck, Check, Eye, MessageSquare, Sparkles, Trash2, UserPlus } from 'lucide-react';
import { timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';

const TYPES = {
  status: { icon: Briefcase, cls: 'bg-primary-50 text-primary-600', label: 'Application update' },
  recommendation: { icon: Sparkles, cls: 'bg-amber-50 text-amber-600', label: 'Recommendation' },
  message: { icon: MessageSquare, cls: 'bg-sky-50 text-sky-600', label: 'Message' },
  interview: { icon: CalendarCheck, cls: 'bg-accent-50 text-accent-600', label: 'Interview' },
  profile_view: { icon: Eye, cls: 'bg-violet-50 text-violet-600', label: 'Profile view' },
  application: { icon: UserPlus, cls: 'bg-primary-50 text-primary-600', label: 'New applicant' },
};

export const NOTIFICATION_TYPES = TYPES;

export default function NotificationCard({ notification: n, onRead, onDelete }) {
  const t = TYPES[n.type] || { icon: Bell, cls: 'bg-slate-100 text-slate-600' };
  const Icon = t.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className={cn('group relative flex gap-4 p-4 transition sm:p-5', !n.read ? 'bg-primary-50/40' : 'bg-white hover:bg-slate-50/70')}
    >
      {!n.read && <span className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary-600" aria-label="Unread" />}
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', t.cls)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <p className={cn('text-sm', n.read ? 'font-medium text-slate-700' : 'font-semibold text-slate-900')}>{n.title}</p>
          <span className="text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{n.message}</p>
        {n.link && (
          <Link to={n.link} onClick={() => onRead(n.id, true)} className="link mt-2 inline-block text-xs">
            View details →
          </Link>
        )}
      </div>
      <div className="flex shrink-0 items-start gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <button onClick={() => onRead(n.id, !n.read)} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-primary-600" aria-label={n.read ? 'Mark as unread' : 'Mark as read'} title={n.read ? 'Mark as unread' : 'Mark as read'}>
          <Check className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(n.id)} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-600" aria-label="Delete notification" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
