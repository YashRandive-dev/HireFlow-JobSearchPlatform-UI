import { useMemo, useState } from 'react';
import { Building2, MapPin, Search, SearchX } from 'lucide-react';
import CompanyCard from '../components/companies/CompanyCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Select from '../components/forms/Select';
import { CompanyCardSkeleton } from '../components/common/LoadingSkeleton';
import { useData } from '../context/DataContext';
import { useDebounce } from '../hooks/useDebounce';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../utils/cn';

export default function Companies() {
  useDocumentTitle('Companies');
  const { companies, activeJobs, loading } = useData();
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('jobs');
  const q = useDebounce(query, 200);

  const openJobs = useMemo(() => {
    const m = {};
    activeJobs.forEach((j) => (m[j.companyId] = (m[j.companyId] || 0) + 1));
    return m;
  }, [activeJobs]);

  const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))].sort(), [companies]);
  const locations = useMemo(() => [...new Set(companies.map((c) => c.location))].sort(), [companies]);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    return companies
      .filter((c) => !term || `${c.name} ${c.industry} ${c.tagline}`.toLowerCase().includes(term))
      .filter((c) => !industry || c.industry === industry)
      .filter((c) => !location || c.location === location)
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'rating' ? b.rating - a.rating : (openJobs[b.id] || 0) - (openJobs[a.id] || 0)));
  }, [companies, q, industry, location, sort, openJobs]);

  const reset = () => {
    setQuery('');
    setIndustry('');
    setLocation('');
  };

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-10">
          <p className="eyebrow">Company directory</p>
          <h1 className="mt-2 text-3xl font-bold">Discover great places to work</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Explore culture, benefits and open positions at {companies.length || 'top'} companies hiring on HireFlow.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
            <label className="relative">
              <span className="sr-only">Search companies</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by company name or industry" className="input h-11 pl-11" />
            </label>
            <Select icon={Building2} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="All industries" options={industries} selectClassName="h-11" />
            <Select icon={MapPin} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="All locations" options={locations} selectClassName="h-11" />
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {industries.map((i) => (
              <button
                key={i}
                onClick={() => setIndustry(industry === i ? '' : i)}
                className={cn('whitespace-nowrap rounded-full border px-3 py-1 text-sm transition', industry === i ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-700')}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{results.length}</span> companies
          </p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input h-9 w-auto py-0 pr-8 text-sm" aria-label="Sort companies">
            <option value="jobs">Most open jobs</option>
            <option value="rating">Highest rated</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)
          ) : results.length ? (
            results.map((c) => <CompanyCard key={c.id} company={c} openJobs={openJobs[c.id] || 0} />)
          ) : (
            <EmptyState className="sm:col-span-2 lg:col-span-3" icon={SearchX} title="No companies found" description="Try a different search term or clear your filters." action={<Button onClick={reset}>Clear filters</Button>} />
          )}
        </div>
      </div>
    </div>
  );
}
