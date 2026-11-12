import { cn } from '../../utils/cn';

const sizes = {
  sm: 'h-9 w-9 rounded-lg text-xs',
  md: 'h-12 w-12 rounded-xl text-sm',
  lg: 'h-14 w-14 rounded-xl text-base',
  xl: 'h-20 w-20 rounded-2xl text-xl',
  '2xl': 'h-24 w-24 rounded-2xl text-2xl',
};

export default function CompanyLogo({ company, size = 'md', className }) {
  const cls = cn('flex shrink-0 items-center justify-center overflow-hidden font-display font-bold tracking-tight text-white shadow-sm', sizes[size], className);
  if (!company) return <div className={cn(cls, 'bg-slate-200')} />;
  if (company.logoUrl) {
    return <img src={company.logoUrl} alt={`${company.name} logo`} className={cn(cls, 'bg-white object-cover ring-1 ring-slate-200')} />;
  }
  return (
    <div className={cls} style={{ backgroundColor: company.logo?.bg || '#4f46e5' }} aria-label={`${company.name} logo`} role="img">
      {company.logo?.text || company.name?.slice(0, 2)}
    </div>
  );
}
