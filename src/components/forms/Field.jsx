import { cn } from '../../utils/cn';

/** Label + error/hint wrapper shared by every form control. */
export default function Field({ label, htmlFor, error, hint, required, className, children, labelRight }) {
  return (
    <div className={className}>
      {(label || labelRight) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={htmlFor} className="label">
              {label}
              {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
          )}
          {labelRight}
        </div>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className={cn('mt-1.5 text-xs text-slate-500')}>{hint}</p>
      )}
    </div>
  );
}
