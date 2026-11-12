/**
 * Mock API layer backed by LocalStorage.
 * Every function is async and returns plain data, mirroring a REST client.
 * To integrate a real backend, replace the implementations in this file only.
 */
import { storage, sessionStore, clearNamespace } from './storage';
import { buildSeed } from './seed';
import { uid } from '../utils/id';

const SEED_VERSION = 4;
const LATENCY = 350;

export const sleep = (ms = LATENCY) => new Promise((resolve) => setTimeout(resolve, ms));

function ensureSeeded() {
  if (storage.get('seedVersion') === SEED_VERSION) return;
  const seed = buildSeed();
  Object.entries(seed).forEach(([key, value]) => storage.set(key, value));
  storage.set('seedVersion', SEED_VERSION);
}
ensureSeeded();

const read = (key) => storage.get(key, []);
const write = (key, value) => storage.set(key, value);
const withoutPassword = (user) => {
  if (!user) return null;
  const { password, ...rest } = user; // eslint-disable-line no-unused-vars
  return rest;
};

class ApiError extends Error {}

function createCollection(key, prefix) {
  return {
    async list(predicate) {
      await sleep();
      const all = read(key);
      return predicate ? all.filter(predicate) : all;
    },
    async get(id) {
      await sleep(150);
      return read(key).find((item) => item.id === id) || null;
    },
    async create(data) {
      await sleep(250);
      const record = { id: uid(prefix), ...data };
      write(key, [record, ...read(key)]);
      return record;
    },
    async update(id, patch) {
      await sleep(200);
      let updated = null;
      const next = read(key).map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...(typeof patch === 'function' ? patch(item) : patch) };
        return updated;
      });
      if (!updated) throw new ApiError('Record not found');
      write(key, next);
      return updated;
    },
    async remove(id) {
      await sleep(200);
      write(key, read(key).filter((item) => item.id !== id));
      return id;
    },
  };
}

export const jobsApi = createCollection('jobs', 'job');
export const companiesApi = createCollection('companies', 'co');
export const applicationsApi = createCollection('applications', 'app');

export const notificationsApi = {
  ...createCollection('notifications', 'n'),
  /** Synchronous push so other flows can notify without awaiting. */
  push(data) {
    const record = { id: uid('n'), read: false, createdAt: new Date().toISOString(), ...data };
    write('notifications', [record, ...read('notifications')]);
    return record;
  },
  async markAllRead(userId) {
    await sleep(150);
    write('notifications', read('notifications').map((n) => (n.userId === userId ? { ...n, read: true } : n)));
  },
  async clearAll(userId) {
    await sleep(150);
    write('notifications', read('notifications').filter((n) => n.userId !== userId));
  },
};

// ---------- Auth & users ----------
export const sessionApi = {
  get() {
    return storage.get('session') || sessionStore.get('session');
  },
  set(userId, remember) {
    const value = { userId, at: new Date().toISOString() };
    if (remember) storage.set('session', value);
    else sessionStore.set('session', value);
  },
  clear() {
    storage.remove('session');
    sessionStore.remove('session');
  },
};

export const authApi = {
  async login(email, password) {
    await sleep(600);
    const user = read('users').find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) throw new ApiError('Invalid email or password.');
    return withoutPassword(user);
  },

  async register({ name, email, password, role, companyName }) {
    await sleep(700);
    const users = read('users');
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new ApiError('An account with this email already exists.');
    }
    let companyId;
    if (role === 'recruiter') {
      const companies = read('companies');
      const existing = companies.find((c) => c.name.toLowerCase() === (companyName || '').trim().toLowerCase());
      if (existing) companyId = existing.id;
      else {
        const initials = companyName.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
        const company = {
          id: uid('co'),
          name: companyName.trim(),
          tagline: 'Building great teams.',
          industry: 'Technology',
          size: '11-50',
          location: 'Remote',
          headquarters: '',
          founded: new Date().getFullYear(),
          website: '',
          logo: { bg: '#4f46e5', text: initials || 'CO' },
          banner: ['#4f46e5', '#10b981'],
          rating: 0,
          about: `${companyName.trim()} is hiring on HireFlow.`,
          culture: [],
          benefits: [],
        };
        write('companies', [...companies, company]);
        companyId = company.id;
      }
    }
    const user = {
      id: uid('u'),
      role,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      avatar: '',
      headline: role === 'recruiter' ? `Recruiter at ${companyName.trim()}` : '',
      phone: '',
      location: '',
      about: '',
      companyId,
      skills: [],
      experience: [],
      education: [],
      socials: { linkedin: '', github: '', portfolio: '', twitter: '' },
      resume: null,
      profileViews: 0,
      settings: { emailAlerts: true, jobRecommendations: true, applicationUpdates: true, marketing: false, profileVisible: true },
      createdAt: new Date().toISOString(),
    };
    write('users', [...users, user]);
    notificationsApi.push({
      userId: user.id,
      type: 'message',
      title: 'Welcome to HireFlow 👋',
      message: role === 'recruiter' ? 'Post your first job to start receiving applications.' : 'Complete your profile to get better job recommendations.',
      link: role === 'recruiter' ? '/recruiter/jobs/create' : '/dashboard/profile',
    });
    return withoutPassword(user);
  },

  getUserSync(id) {
    return withoutPassword(read('users').find((u) => u.id === id));
  },

  async updateUser(id, patch) {
    await sleep(300);
    let updated = null;
    write(
      'users',
      read('users').map((u) => (u.id === id ? (updated = { ...u, ...patch }) : u))
    );
    if (!updated) throw new ApiError('User not found');
    return withoutPassword(updated);
  },

  async changePassword(id, current, next) {
    await sleep(500);
    const user = read('users').find((u) => u.id === id);
    if (!user || user.password !== current) throw new ApiError('Current password is incorrect.');
    write('users', read('users').map((u) => (u.id === id ? { ...u, password: next } : u)));
  },

  async requestPasswordReset(email) {
    await sleep(800);
    // Always resolves so the UI never reveals which emails are registered.
    return { email };
  },

  async deleteAccount(id) {
    await sleep(400);
    write('users', read('users').filter((u) => u.id !== id));
    write('notifications', read('notifications').filter((n) => n.userId !== id));
    storage.remove(`saved:${id}`);
    storage.remove(`recent:${id}`);
  },
};

export const usersApi = {
  incrementProfileViews(userId) {
    write('users', read('users').map((u) => (u.id === userId ? { ...u, profileViews: (u.profileViews || 0) + 1 } : u)));
  },
};

// ---------- Per-user preferences (synchronous) ----------
export const userPrefsApi = {
  getSaved: (userId) => storage.get(`saved:${userId}`, []),
  setSaved: (userId, ids) => storage.set(`saved:${userId}`, ids),
  getRecent: (userId) => storage.get(`recent:${userId || 'guest'}`, []),
  setRecent: (userId, ids) => storage.set(`recent:${userId || 'guest'}`, ids),
};

export const newsletterApi = {
  async subscribe(email) {
    await sleep(500);
    const list = storage.get('newsletter', []);
    if (list.includes(email.toLowerCase())) throw new ApiError('This email is already subscribed.');
    storage.set('newsletter', [...list, email.toLowerCase()]);
  },
};

export const contactApi = {
  async send(message) {
    await sleep(600);
    storage.set('contactMessages', [...storage.get('contactMessages', []), { ...message, at: new Date().toISOString() }]);
  },
};

export function resetDemoData() {
  clearNamespace();
  ensureSeeded();
}
