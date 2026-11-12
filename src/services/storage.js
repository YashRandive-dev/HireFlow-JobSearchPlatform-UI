// Thin, safe wrapper around Web Storage. All keys are namespaced.
const PREFIX = 'hireflow:';

function make(getStore) {
  return {
    get(key, fallback = null) {
      try {
        const raw = getStore().getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        getStore().setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn(`[storage] Could not persist "${key}"`, err);
        return false;
      }
    },
    remove(key) {
      try {
        getStore().removeItem(PREFIX + key);
      } catch {
        /* ignore */
      }
    },
  };
}

export const storage = make(() => window.localStorage);
export const sessionStore = make(() => window.sessionStorage);

export function clearNamespace() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
