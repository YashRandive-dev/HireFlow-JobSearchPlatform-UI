import { forwardRef, useId } from 'react';
import Field from './Field';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input({ label, error, hint, icon: Icon, right, required, className, inputClassName, id, labelRight, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint} required={required} className={className} labelRight={labelRight}>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={cn('input', Icon && 'pl-10', right && 'pr-11', error && 'input-error', inputClassName)}
          {...props}
        />
        {right && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{right}</div>}
      </div>
    </Field>
  );
});

export default Input;
