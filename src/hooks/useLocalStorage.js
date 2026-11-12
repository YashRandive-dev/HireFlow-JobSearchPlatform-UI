import { useEffect, useState } from 'react';
import { storage } from '../services/storage';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => storage.get(key, initial));
  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);
  return [value, setValue];
}
