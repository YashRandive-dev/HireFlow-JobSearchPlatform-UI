import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function Logo({ className, light }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)} aria-label="HireFlow home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M6 18V6h3v4.5h6V6h3v12h-3v-4.5H9V18z" fill="currentColor" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-white" />
      </span>
      <span className={cn('font-display text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-slate-900')}>
        Hire<span className="text-primary-600">Flow</span>
      </span>
    </Link>
  );
}
