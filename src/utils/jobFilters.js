import { SALARY_RANGES, DATE_POSTED } from '../data/constants';
import { daysSince } from './format';

export const DEFAULT_FILTERS = {
  q: '',
  location: '',
  categories: [],
  types: [],
  modes: [],
  experience: [],
  companies: [],
  salary: 'any',
  posted: 'any',
};

const normalize = (s = '') => s.toLowerCase().trim();

/** Relevance score of a job against a free-text query. */
export function scoreJob(job, company, q) {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return job.featured ? 2 : 1;
  let score = 0;
  const title = normalize(job.title);
  const companyName = normalize(company?.name);
  const skills = job.skills.map(normalize);
  const body = normalize(`${job.description} ${job.category} ${job.preferredSkills.join(' ')}`);
  for (const t of terms) {
    if (title.includes(t)) score += 5;
    if (companyName.includes(t)) score += 4;
    if (skills.some((s) => s.includes(t))) score += 3;
    if (body.includes(t)) score += 1;
    if (normalize(job.workMode) === t || normalize(job.type).includes(t)) score += 2;
  }
  return score;
}

export function filterJobs(jobs, companiesById, filters, sort = 'relevance') {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const salary = SALARY_RANGES.find((r) => r.id === f.salary) || SALARY_RANGES[0];
  const posted = DATE_POSTED.find((d) => d.id === f.posted) || DATE_POSTED[0];
  const loc = normalize(f.location);

  const results = [];
  for (const job of jobs) {
    if (job.status !== 'active') continue;
    const company = companiesById[job.companyId];
    let score = 1;
    if (f.q) {
      score = scoreJob(job, company, f.q);
      if (score === 0) continue;
    }
    if (loc && !normalize(job.location).includes(loc) && !(loc === 'remote' && job.workMode === 'Remote')) continue;
    if (f.categories.length && !f.categories.includes(job.category)) continue;
    if (f.types.length) {
      const ok = f.types.some((t) => (t === 'Remote' ? job.workMode === 'Remote' : job.type === t));
      if (!ok) continue;
    }
    if (f.modes.length && !f.modes.includes(job.workMode)) continue;
    if (f.experience.length && !f.experience.includes(job.experience)) continue;
    if (f.companies.length && !f.companies.includes(job.companyId)) continue;
    if (salary.id !== 'any' && !(job.salaryMax >= salary.min && job.salaryMin <= salary.max)) continue;
    if (posted.days && daysSince(job.postedAt) > posted.days) continue;
    results.push({ job, score });
  }

  results.sort((a, b) => {
    if (sort === 'newest') return new Date(b.job.postedAt) - new Date(a.job.postedAt);
    if (sort === 'salary') return b.job.salaryMax - a.job.salaryMax;
    return b.score - a.score || new Date(b.job.postedAt) - new Date(a.job.postedAt);
  });
  return results.map((r) => r.job);
}

export function countActiveFilters(filters) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  return (
    (f.q ? 1 : 0) +
    (f.location ? 1 : 0) +
    f.categories.length +
    f.types.length +
    f.modes.length +
    f.experience.length +
    f.companies.length +
    (f.salary !== 'any' ? 1 : 0) +
    (f.posted !== 'any' ? 1 : 0)
  );
}

/** Serialise filters <-> URLSearchParams so searches are shareable. */
const ARRAY_KEYS = ['categories', 'types', 'modes', 'experience', 'companies'];
export function filtersFromParams(params) {
  const f = { ...DEFAULT_FILTERS };
  if (params.get('q')) f.q = params.get('q');
  if (params.get('location')) f.location = params.get('location');
  if (params.get('salary')) f.salary = params.get('salary');
  if (params.get('posted')) f.posted = params.get('posted');
  ARRAY_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) f[k] = v.split(',').filter(Boolean);
  });
  // Friendly aliases used by homepage links
  if (params.get('category')) f.categories = [params.get('category')];
  if (params.get('type')) f.types = [params.get('type')];
  return f;
}

export function filtersToParams(filters, extra = {}) {
  const p = {};
  const f = { ...DEFAULT_FILTERS, ...filters };
  if (f.q) p.q = f.q;
  if (f.location) p.location = f.location;
  if (f.salary !== 'any') p.salary = f.salary;
  if (f.posted !== 'any') p.posted = f.posted;
  ARRAY_KEYS.forEach((k) => {
    if (f[k].length) p[k] = f[k].join(',');
  });
  Object.entries(extra).forEach(([k, v]) => {
    if (v) p[k] = String(v);
  });
  return p;
}
