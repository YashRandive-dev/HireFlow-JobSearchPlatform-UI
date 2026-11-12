import { forwardRef, useId } from 'react';
import Field from './Field';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(function Textarea({ label, error, hint, required, className, rows = 4, id, maxLength, value, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const counter = maxLength ? `${(value || '').length}/${maxLength}` : null;
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint} required={required} className={className} labelRight={counter && <span className="mb-1.5 text-xs text-slate-400">{counter}</span>}>
      <textarea ref={ref} id={inputId} rows={rows} maxLength={maxLength} value={value} aria-invalid={!!error} className={cn('input resize-y', error && 'input-error')} {...props} />
    </Field>
  );
});

export default Textarea;
