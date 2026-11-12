import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
  '2xl': 'h-28 w-28 text-3xl',
};

const palette = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-sky-100 text-sky-700', 'bg-pink-100 text-pink-700', 'bg-violet-100 text-violet-700'];

export default function Avatar({ src, name = '', size = 'md', className, ring }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const color = palette[(name.charCodeAt(0) || 0) % palette.length];
  const base = cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold', sizes[size], ring && 'ring-4 ring-white', className);
  if (src && !failed) {
    return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={cn(base, 'object-cover bg-slate-100')} />;
  }
  return (
    <span className={cn(base, color)} aria-label={name}>
      {initials(name) || '?'}
    </span>
  );
}
