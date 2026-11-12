import { useId, useState } from 'react';
import { X } from 'lucide-react';
import Field from './Field';
import { cn } from '../../utils/cn';

/** Chip-style multi value input (skills, benefits…). Enter or comma adds a tag. */
export default function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter', error, hint, required, suggestions = [], max = 20 }) {
  const [draft, setDraft] = useState('');
  const id = useId();

  const add = (raw) => {
    const tag = raw.trim().replace(/,$/, '');
    if (!tag || value.some((v) => v.toLowerCase() === tag.toLowerCase()) || value.length >= max) return;
    onChange([...value, tag]);
    setDraft('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const remaining = suggestions.filter((s) => !value.includes(s)).slice(0, 8);

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <div className={cn('input flex min-h-[44px] flex-wrap items-center gap-1.5 py-2', error && 'input-error')}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-primary-50 py-1 pl-2.5 pr-1 text-xs font-medium text-primary-700">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="rounded p-0.5 hover:bg-primary-100" aria-label={`Remove ${tag}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[120px] flex-1 border-0 bg-transparent p-0.5 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
        />
      </div>
      {remaining.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {remaining.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-lg border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 transition hover:border-primary-400 hover:text-primary-600">
              + {s}
            </button>
          ))}
        </div>
      )}
    </Field>
  );
}
