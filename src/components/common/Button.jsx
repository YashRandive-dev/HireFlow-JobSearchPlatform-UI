import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-500/30',
  accent: 'bg-accent-500 text-white shadow-sm hover:bg-accent-600 focus-visible:ring-accent-500/30',
  secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400/20',
  soft: 'bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-500/20',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400/20',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/30',
  'danger-soft': 'bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500/20',
  white: 'bg-white text-primary-700 shadow-sm hover:bg-primary-50 focus-visible:ring-white/40',
};

const sizes = {
  xs: 'h-8 gap-1.5 rounded-lg px-2.5 text-xs',
  sm: 'h-9 gap-1.5 rounded-lg px-3 text-sm',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm',
  lg: 'h-12 gap-2 rounded-xl px-6 text-base',
  icon: 'h-10 w-10 rounded-xl',
  'icon-sm': 'h-8 w-8 rounded-lg',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, loading = false, disabled, className, children, leftIcon: LeftIcon, rightIcon: RightIcon, type = 'button', ...props },
  ref
) {
  const cls = cn(
    'inline-flex select-none items-center justify-center whitespace-nowrap font-semibold transition focus:outline-none focus-visible:ring-4 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className
  );
  const iconCls = size === 'xs' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const content = (
    <>
      {loading ? <Loader2 className={cn(iconCls, 'animate-spin')} /> : LeftIcon && <LeftIcon className={iconCls} />}
      {children}
      {RightIcon && !loading && <RightIcon className={iconCls} />}
    </>
  );
  if (to)
    return (
      <Link ref={ref} to={to} className={cls} {...props}>
        {content}
      </Link>
    );
  if (href)
    return (
      <a ref={ref} href={href} className={cls} {...props}>
        {content}
      </a>
    );
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
});

export default Button;
