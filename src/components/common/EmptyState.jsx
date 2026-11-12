import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function EmptyState({ icon: Icon = Inbox, title, description, action, className, compact }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-10' : 'card px-6 py-16', className)}>
      <div className="relative">
        <div className="absolute inset-0 -m-3 rounded-full bg-primary-50" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-card ring-1 ring-slate-200">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
