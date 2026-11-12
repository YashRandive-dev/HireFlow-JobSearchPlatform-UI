import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authApi, sessionApi } from '../services/api';

const AuthContext = createContext(null);

function restoreUser() {
  const session = sessionApi.get();
  if (!session) return null;
  const user = authApi.getUserSync(session.userId);
  if (!user) sessionApi.clear();
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreUser);

  const login = useCallback(async (email, password, remember = true) => {
    const u = await authApi.login(email, password);
    sessionApi.set(u.id, remember);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const u = await authApi.register(data);
    sessionApi.set(u.id, true);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    sessionApi.clear();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch) => {
      if (!user) throw new Error('Not signed in');
      const u = await authApi.updateUser(user.id, patch);
      setUser(u);
      return u;
    },
    [user]
  );

  const changePassword = useCallback((current, next) => authApi.changePassword(user.id, current, next), [user]);

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount(user.id);
    sessionApi.clear();
    setUser(null);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isSeeker: user?.role === 'seeker',
      isRecruiter: user?.role === 'recruiter',
      dashboardPath: user?.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard',
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
      requestPasswordReset: authApi.requestPasswordReset,
    }),
    [user, login, register, logout, updateProfile, changePassword, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
