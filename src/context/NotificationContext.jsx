import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { notificationsApi } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    notificationsApi.list().then((list) => {
      if (!active) return;
      setAll(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const notifications = useMemo(
    () => all.filter((n) => n.userId === user?.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [all, user?.id]
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notify = useCallback((data) => {
    if (!data.userId) return null;
    const record = notificationsApi.push(data);
    setAll((prev) => [record, ...prev]);
    return record;
  }, []);

  const markRead = useCallback((id, read = true) => {
    setAll((prev) => prev.map((n) => (n.id === id ? { ...n, read } : n)));
    notificationsApi.update(id, { read });
  }, []);

  const markAllRead = useCallback(async () => {
    setAll((prev) => prev.map((n) => (n.userId === user?.id ? { ...n, read: true } : n)));
    await notificationsApi.markAllRead(user?.id);
  }, [user?.id]);

  const remove = useCallback((id) => {
    setAll((prev) => prev.filter((n) => n.id !== id));
    notificationsApi.remove(id);
  }, []);

  const clearAll = useCallback(async () => {
    setAll((prev) => prev.filter((n) => n.userId !== user?.id));
    await notificationsApi.clearAll(user?.id);
  }, [user?.id]);

  const value = useMemo(
    () => ({ notifications, unreadCount, loading, notify, markRead, markAllRead, remove, clearAll }),
    [notifications, unreadCount, loading, notify, markRead, markAllRead, remove, clearAll]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
