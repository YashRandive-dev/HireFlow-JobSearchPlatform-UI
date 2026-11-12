import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BellOff, CheckCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { RowSkeleton } from '../../components/common/LoadingSkeleton';
import NotificationCard, { NOTIFICATION_TYPES } from '../../components/dashboard/NotificationCard';
import { useNotifications } from '../../context/NotificationContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { cn } from '../../utils/cn';

export default function Notifications() {
  useDocumentTitle('Notifications');
  const { notifications, unreadCount, loading, markRead, markAllRead, remove, clearAll } = useNotifications();
  const confirm = useConfirm();
  const [filter, setFilter] = useState('all');

  const types = useMemo(() => [...new Set(notifications.map((n) => n.type))], [notifications]);
  const list = notifications.filter((n) => (filter === 'all' ? true : filter === 'unread' ? !n.read : n.type === filter));

  const onClear = async () => {
    const ok = await confirm({ title: 'Delete all notifications?', message: 'This permanently removes every notification. This cannot be undone.', confirmText: 'Delete all' });
    if (!ok) return;
    await clearAll();
    toast.success('All notifications deleted');
  };

  const onDelete = (id) => {
    remove(id);
    toast('Notification deleted');
  };

  const tabs = [
    ['all', `All (${notifications.length})`],
    ['unread', `Unread (${unreadCount})`],
    ...types.map((t) => [t, NOTIFICATION_TYPES[t]?.label || t]),
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unreadCount ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : "You're all caught up."}
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={CheckCheck} onClick={() => markAllRead().then(() => toast.success('All marked as read'))} disabled={!unreadCount}>
              Mark all as read
            </Button>
            <Button variant="danger-soft" size="sm" leftIcon={Trash2} onClick={onClear} disabled={!notifications.length}>
              Delete all
            </Button>
          </>
        }
      />
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn('whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition', filter === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50')}
          >
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <RowSkeleton rows={5} />
      ) : list.length ? (
        <div className="card divide-y divide-slate-100 overflow-hidden">
          <AnimatePresence initial={false}>
            {list.map((n) => (
              <NotificationCard key={n.id} notification={n} onRead={markRead} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState icon={BellOff} title="No notifications" description={filter === 'all' ? 'Updates about your activity will appear here.' : 'Nothing matches this filter.'} />
      )}
    </div>
  );
}
