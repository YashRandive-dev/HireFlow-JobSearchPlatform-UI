import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DATE_POSTED, SALARY_RANGES } from '../../data/constants';

export default function FilterChips({ filters, onChange, onClear, companiesById }) {
  const chips = [];
  if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”`, remove: () => onChange({ q: '' }) });
  if (filters.location) chips.push({ key: 'loc', label: filters.location, remove: () => onChange({ location: '' }) });
  ['categories', 'types', 'modes', 'experience'].forEach((k) =>
    filters[k].forEach((v) => chips.push({ key: `${k}-${v}`, label: v, remove: () => onChange({ [k]: filters[k].filter((x) => x !== v) }) }))
  );
  filters.companies.forEach((id) =>
    chips.push({ key: `co-${id}`, label: companiesById[id]?.name || id, remove: () => onChange({ companies: filters.companies.filter((x) => x !== id) }) })
  );
  if (filters.salary !== 'any') chips.push({ key: 'salary', label: SALARY_RANGES.find((r) => r.id === filters.salary)?.label, remove: () => onChange({ salary: 'any' }) });
  if (filters.posted !== 'any') chips.push({ key: 'posted', label: DATE_POSTED.find((d) => d.id === filters.posted)?.label, remove: () => onChange({ posted: 'any' }) });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((c) => (
          <motion.span
            key={c.key}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 py-1 pl-3 pr-1 text-xs font-medium text-primary-700"
          >
            {c.label}
            <button onClick={c.remove} className="rounded-full p-0.5 hover:bg-primary-100" aria-label={`Remove filter ${c.label}`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <button onClick={onClear} className="px-2 text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">
        Clear all
      </button>
    </div>
  );
}
