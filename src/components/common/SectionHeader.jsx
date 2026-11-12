import { cn } from '../../utils/cn';

export default function SectionHeader({ eyebrow, title, description, action, center, className }) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', center && 'items-center text-center sm:flex-col sm:items-center', className)}>
      <div className={cn(center && 'mx-auto max-w-2xl')}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title mt-2">{title}</h2>
        {description && <p className="mt-2 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
