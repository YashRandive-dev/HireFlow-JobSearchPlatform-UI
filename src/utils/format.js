const DAY = 24 * 60 * 60 * 1000;

export function formatMoneyShort(value) {
  if (value == null || Number.isNaN(Number(value))) return '';
  const n = Number(value);
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}

export function formatSalary(min, max) {
  if (!min && !max) return 'Not disclosed';
  if (min && max) return `${formatMoneyShort(min)} – ${formatMoneyShort(max)}`;
  return formatMoneyShort(min || max);
}

export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 60 * 1000) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / DAY);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(date);
}

export function daysSince(date) {
  return (Date.now() - new Date(date).getTime()) / DAY;
}

export function formatDate(date, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', opts);
}

export function formatMonth(ym) {
  if (!ym) return 'Present';
  const [y, m] = String(ym).split('-');
  if (!m) return y;
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export const pluralize = (n, word, plural = `${word}s`) => `${n} ${n === 1 ? word : plural}`;
