import { cn } from '../../utils/cn';

const tones = {
  gray: 'bg-slate-100 text-slate-600',
  primary: 'bg-primary-50 text-primary-700',
  accent: 'bg-accent-50 text-accent-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600',
  sky: 'bg-sky-50 text-sky-700',
  violet: 'bg-violet-50 text-violet-700',
  outline: 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200',
};

export default function Badge({ tone = 'gray', icon: Icon, className, children, dot }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
