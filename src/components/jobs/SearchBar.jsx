import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Search } from 'lucide-react';
import Button from '../common/Button';
import { JOB_TYPE_FILTERS } from '../../data/constants';
import { filtersToParams, DEFAULT_FILTERS } from '../../utils/jobFilters';
import { cn } from '../../utils/cn';

/**
 * Large hero search. Navigates to /jobs with the query encoded in the URL.
 */
export default function SearchBar({ className, initial = {} }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initial.q || '');
  const [location, setLocation] = useState(initial.location || '');
  const [type, setType] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(filtersToParams({ ...DEFAULT_FILTERS, q: q.trim(), location: location.trim(), types: type ? [type] : [] }));
    navigate(`/jobs?${params.toString()}`);
  };

  const fieldCls = 'h-12 w-full bg-transparent pl-11 pr-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none';

  return (
    <form onSubmit={submit} className={cn('rounded-2xl border border-slate-200 bg-white p-2 shadow-card-hover', className)} role="search">
      <div className="flex flex-col divide-y divide-slate-100 md:flex-row md:items-center md:divide-x md:divide-y-0">
        <label className="relative flex-[1.5]">
          <span className="sr-only">Job title, skill or company</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, skill or company" className={fieldCls} />
        </label>
        <label className="relative flex-1">
          <span className="sr-only">Location</span>
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or remote" className={fieldCls} />
        </label>
        <label className="relative flex-1">
          <span className="sr-only">Job type</span>
          <Briefcase className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <select value={type} onChange={(e) => setType(e.target.value)} className={cn(fieldCls, 'cursor-pointer appearance-none', !type && 'text-slate-400')}>
            <option value="">Any job type</option>
            {JOB_TYPE_FILTERS.map((t) => (
              <option key={t} value={t} className="text-slate-900">
                {t}
              </option>
            ))}
          </select>
        </label>
        <div className="pt-2 md:pl-2 md:pt-0">
          <Button type="submit" size="lg" leftIcon={Search} className="w-full md:w-auto">
            Search Jobs
          </Button>
        </div>
      </div>
    </form>
  );
}
