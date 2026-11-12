export const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isUrl = (v = '') => !v || /^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(v.trim());
export const isPhone = (v = '') => !v || /^[+\d][\d\s()-]{6,}$/.test(v.trim());

export function passwordStrength(pw = '') {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}

export function validatePassword(pw = '') {
  if (!pw) return 'Password is required';
  if (pw.length < 8) return 'Use at least 8 characters';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Include letters and at least one number';
  return '';
}
