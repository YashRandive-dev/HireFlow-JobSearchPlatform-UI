import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import Field from './Field';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select({ label, error, hint, required, className, options = [], placeholder, icon: Icon, id, selectClassName, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint} required={required} className={className}>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <select ref={ref} id={inputId} aria-invalid={!!error} className={cn('input appearance-none pr-10', Icon && 'pl-10', error && 'input-error', selectClassName)} {...props}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </Field>
  );
});

export default Select;
