import { useMemo, useState } from 'react';
import { ChevronDown, RotateCcw, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Checkbox from '../forms/Checkbox';
import Select from '../forms/Select';
import { CATEGORIES, DATE_POSTED, EXPERIENCE_LEVELS, JOB_TYPE_FILTERS, SALARY_RANGES, WORK_MODES } from '../../data/constants';
import { cn } from '../../utils/cn';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-sm font-semibold text-slate-900" aria-expanded={open}>
        {title}
        <ChevronDown className={cn('h-4 w-4 text-slate-400 transition', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="space-y-2.5 pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Radio({ name, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 hover:text-slate-900">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 cursor-pointer accent-primary-600" />
      {label}
    </label>
  );
}

export default function FilterSidebar({ filters, onChange, onReset, jobs, companies }) {
  const [companyQuery, setCompanyQuery] = useState('');
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  const counts = useMemo(() => {
    const c = { category: {}, type: {}, mode: {}, exp: {}, company: {} };
    jobs.forEach((j) => {
      c.category[j.category] = (c.category[j.category] || 0) + 1;
      c.type[j.type] = (c.type[j.type] || 0) + 1;
      if (j.workMode === 'Remote') c.type.Remote = (c.type.Remote || 0) + 1;
      c.mode[j.workMode] = (c.mode[j.workMode] || 0) + 1;
      c.exp[j.experience] = (c.exp[j.experience] || 0) + 1;
      c.company[j.companyId] = (c.company[j.companyId] || 0) + 1;
    });
    return c;
  }, [jobs]);

  const locations = useMemo(() => [...new Set(jobs.map((j) => j.location))].sort(), [jobs]);

  const toggle = (key, value) => {
    const list = filters[key];
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const companyList = companies
    .filter((c) => counts.company[c.id])
    .filter((c) => c.name.toLowerCase().includes(companyQuery.toLowerCase()));
  const visibleCompanies = showAllCompanies || companyQuery ? companyList : companyList.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-base font-bold">Filters</h2>
        <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <Section title="Job category">
        {CATEGORIES.map((c) => (
          <Checkbox key={c.id} label={c.name} count={counts.category[c.name] || 0} checked={filters.categories.includes(c.name)} onChange={() => toggle('categories', c.name)} />
        ))}
      </Section>

      <Section title="Location">
        <Select value={filters.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="All locations" options={locations} />
      </Section>

      <Section title="Salary range">
        {SALARY_RANGES.map((r) => (
          <Radio key={r.id} name="salary" label={r.label} checked={filters.salary === r.id} onChange={() => onChange({ salary: r.id })} />
        ))}
      </Section>

      <Section title="Experience level">
        {EXPERIENCE_LEVELS.map((e) => (
          <Checkbox key={e} label={e} count={counts.exp[e] || 0} checked={filters.experience.includes(e)} onChange={() => toggle('experience', e)} />
        ))}
      </Section>

      <Section title="Job type">
        {JOB_TYPE_FILTERS.map((t) => (
          <Checkbox key={t} label={t} count={counts.type[t] || 0} checked={filters.types.includes(t)} onChange={() => toggle('types', t)} />
        ))}
      </Section>

      <Section title="Work mode">
        {WORK_MODES.map((m) => (
          <Checkbox key={m} label={m} count={counts.mode[m] || 0} checked={filters.modes.includes(m)} onChange={() => toggle('modes', m)} />
        ))}
      </Section>

      <Section title="Date posted">
        {DATE_POSTED.map((d) => (
          <Radio key={d.id} name="posted" label={d.label} checked={filters.posted === d.id} onChange={() => onChange({ posted: d.id })} />
        ))}
      </Section>

      <Section title="Company" defaultOpen={false}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={companyQuery} onChange={(e) => setCompanyQuery(e.target.value)} placeholder="Search companies" className="input h-9 pl-9 text-sm" />
        </div>
        {visibleCompanies.map((c) => (
          <Checkbox key={c.id} label={c.name} count={counts.company[c.id]} checked={filters.companies.includes(c.id)} onChange={() => toggle('companies', c.id)} />
        ))}
        {!companyQuery && companyList.length > 6 && (
          <button type="button" onClick={() => setShowAllCompanies((s) => !s)} className="text-xs font-semibold text-primary-600">
            {showAllCompanies ? 'Show less' : `Show all ${companyList.length}`}
          </button>
        )}
      </Section>
    </div>
  );
}
