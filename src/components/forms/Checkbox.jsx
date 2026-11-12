import { useId } from 'react';
import { cn } from '../../utils/cn';

export default function Checkbox({ label, description, checked, onChange, className, error, count, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn('mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-primary-600', error && 'outline outline-1 outline-red-400')}
          {...props}
        />
        <span className="flex flex-1 items-center justify-between gap-2 text-sm">
          <span>
            <span className="text-slate-700 group-hover:text-slate-900">{label}</span>
            {description && <span className="block text-xs text-slate-500">{description}</span>}
          </span>
          {count !== undefined && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{count}</span>}
        </span>
      </label>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
