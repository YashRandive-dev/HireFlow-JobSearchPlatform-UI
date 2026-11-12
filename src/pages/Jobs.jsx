import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { History, LayoutGrid, List, MapPin, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import FilterSidebar from '../components/jobs/FilterSidebar';
import FilterChips from '../components/jobs/FilterChips';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import CompanyLogo from '../components/common/CompanyLogo';
import { JobCardSkeleton } from '../components/common/LoadingSkeleton';
import { useData } from '../context/DataContext';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { countActiveFilters, filterJobs, filtersFromParams, filtersToParams } from '../utils/jobFilters';
import { PAGE_SIZE, SORT_OPTIONS } from '../data/constants';
import { cn } from '../utils/cn';

function RecentlyViewed() {
  const { recentIds, getJob, getCompany, clearRecentlyViewed } = useData();
  const jobs = recentIds.map(getJob).filter(Boolean).slice(0, 4);
  if (!jobs.length) return null;
  return (
    <div className="card mt-5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <History className="h-4 w-4 text-slate-400" /> Recently viewed
        </h3>
        <button onClick={clearRecentlyViewed} className="text-xs text-slate-400 hover:text-slate-700">
          Clear
        </button>
      </div>
      <div className="space-y-1">
        {jobs.map((j) => (
          <Link key={j.id} to={`/jobs/${j.id}`} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-50">
            <CompanyLogo company={getCompany(j.companyId)} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{j.title}</p>
              <p className="truncate text-xs text-slate-500">{getCompany(j.companyId)?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Jobs() {
  useDocumentTitle('Find Jobs');
  const { activeJobs, companies, companiesById, loading } = useData();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const sort = params.get('sort') || 'relevance';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [view, setView] = useLocalStorage('jobsView', 'grid');
  const [drawer, setDrawer] = useState(false);
  useLockBodyScroll(drawer);

  // Local text inputs, debounced into the URL for live filtering.
  const [q, setQ] = useState(filters.q);
  const [loc, setLoc] = useState(filters.location);
  const dq = useDebounce(q, 300);
  const dloc = useDebounce(loc, 300);

  // Any filter change resets pagination to page 1.
  const update = (patch, { nextSort = sort } = {}) => {
    setParams(filtersToParams({ ...filters, ...patch }, { sort: nextSort !== 'relevance' ? nextSort : '' }), { replace: true });
  };

  useEffect(() => {
    if (dq !== filters.q || dloc !== filters.location) update({ q: dq.trim(), location: dloc.trim() });
  }, [dq, dloc]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep inputs in sync if URL changes externally (chips, navigation).
  useEffect(() => {
    setQ(filters.q);
    setLoc(filters.location);
  }, [filters.q, filters.location]);

  const results = useMemo(() => filterJobs(activeJobs, companiesById, filters, sort), [activeJobs, companiesById, filters, sort]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const activeCount = countActiveFilters(filters);

  const reset = () => {
    setQ('');
    setLoc('');
    setParams({}, { replace: true });
  };

  const goToPage = (p) => {
    setParams(filtersToParams(filters, { sort: sort !== 'relevance' ? sort : '', page: p > 1 ? p : '' }), { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebar = <FilterSidebar filters={filters} onChange={(p) => update(p)} onReset={reset} jobs={activeJobs} companies={companies} />;

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Find your next opportunity</h1>
          <p className="mt-1 text-slate-500">Search by job title, company, skill or location.</p>
          <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 sm:flex-row">
            <label className="relative flex-[2]">
              <span className="sr-only">Search jobs</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, company or skill (e.g. React)" className="input h-11 border-transparent pl-11 shadow-none" />
              {q && (
                <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <label className="relative flex-1">
              <span className="sr-only">Location</span>
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="City, state or remote" className="input h-11 border-transparent pl-11 shadow-none" />
            </label>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-5 scrollbar-thin">{sidebar}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500" aria-live="polite">
              {loading ? 'Loading jobs…' : (
                <>
                  Showing <span className="font-semibold text-slate-900">{results.length}</span> {results.length === 1 ? 'job' : 'jobs'}
                  {filters.q && (
                    <>
                      {' '}for <span className="font-semibold text-slate-900">“{filters.q}”</span>
                    </>
                  )}
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="lg:hidden" leftIcon={SlidersHorizontal} onClick={() => setDrawer(true)}>
                Filters{activeCount > 0 && <span className="ml-1 rounded-full bg-primary-600 px-1.5 text-[10px] text-white">{activeCount}</span>}
              </Button>
              <label className="sr-only" htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => update({}, { nextSort: e.target.value })} className="input h-9 w-auto cursor-pointer py-0 pr-8 text-sm">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="hidden rounded-lg border border-slate-200 bg-white p-0.5 sm:flex">
                {[
                  ['grid', LayoutGrid],
                  ['list', List],
                ].map(([v, Icon]) => (
                  <button key={v} onClick={() => setView(v)} className={cn('rounded-md p-1.5 transition', view === v ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-700')} aria-label={`${v} view`} aria-pressed={view === v}>
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <FilterChips filters={filters} onChange={(p) => update(p)} onClear={reset} companiesById={companiesById} />
          </div>

          <div className={cn('mt-5 grid gap-4', view === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1')}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} view={view} />)
            ) : pageItems.length ? (
              pageItems.map((job) => <JobCard key={job.id} job={job} view={view} showDescription />)
            ) : (
              <EmptyState
                className="md:col-span-2"
                icon={SearchX}
                title="No jobs match your search"
                description="Try different keywords, remove some filters or broaden your location."
                action={<Button onClick={reset}>Clear all filters</Button>}
              />
            )}
          </div>

          <Pagination className="mt-10" page={current} totalPages={totalPages} onChange={goToPage} />

          <RecentlyViewed />
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-slate-900/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <span className="mx-auto h-1 w-10 rounded-full bg-slate-200 absolute left-1/2 top-2 -translate-x-1/2" />
                <h2 className="text-base font-bold">Filter jobs</h2>
                <button onClick={() => setDrawer(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-4">{sidebar}</div>
              <div className="border-t border-slate-100 p-4">
                <Button className="w-full" size="lg" onClick={() => setDrawer(false)}>
                  Show {results.length} jobs
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

