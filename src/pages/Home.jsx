import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, Quote, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import SearchBar from '../components/jobs/SearchBar';
import JobCard from '../components/jobs/JobCard';
import CompanyLogo from '../components/common/CompanyLogo';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import SectionHeader from '../components/common/SectionHeader';
import { CompanyCardSkeleton, JobCardSkeleton } from '../components/common/LoadingSkeleton';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, POPULAR_SEARCHES } from '../data/constants';
import { platformStats, testimonials, whyChooseUs } from '../data/content';
import { getIcon, TONES } from '../utils/icons';
import { isEmail } from '../utils/validators';
import { newsletterApi } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { pluralize } from '../utils/format';
import { cn } from '../utils/cn';

const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.4 } };

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="container-page relative pb-16 pt-14 sm:pb-24 sm:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" /> 1,240 new jobs added this week
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Find Your <span className="text-primary-600">Dream Job</span> Today
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 sm:text-lg">
            Discover thousands of verified opportunities from fast-growing startups and industry leaders. Search, apply and track every application in one place.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mx-auto mt-10 max-w-4xl">
          <SearchBar />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <TrendingUp className="h-4 w-4" /> Popular:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(tag === 'Remote' ? '/jobs?modes=Remote' : tag === 'Internship' ? '/jobs?types=Internship' : `/jobs?q=${encodeURIComponent(tag)}`)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4 text-center">
          {platformStats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCompanies() {
  const { companies, activeJobs, loading } = useData();
  const list = useMemo(() => {
    const counts = {};
    activeJobs.forEach((j) => (counts[j.companyId] = (counts[j.companyId] || 0) + 1));
    return companies
      .map((c) => ({ ...c, openJobs: counts[c.id] || 0 }))
      .sort((a, b) => b.openJobs - a.openJobs)
      .slice(0, 8);
  }, [companies, activeJobs]);

  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Top employers"
        title="Featured companies hiring now"
        description="Work with teams that invest in their people."
        action={
          <Button to="/companies" variant="secondary" rightIcon={ArrowRight}>
            All companies
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CompanyCardSkeleton key={i} />)
          : list.map((c, i) => (
              <motion.div key={c.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.04 }}>
                <Link to={`/companies/${c.id}`} className="card card-hover flex h-full flex-col p-5">
                  <div className="flex items-center gap-3">
                    <CompanyLogo company={c} size="md" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{c.name}</p>
                      <p className="truncate text-sm text-slate-500">{c.industry}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 flex-1 text-sm text-slate-500">{c.tagline}</p>
                  <p className="mt-4 text-sm font-semibold text-accent-600">{pluralize(c.openJobs, 'open position')}</p>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}

function FeaturedJobs() {
  const { activeJobs, loading } = useData();
  const featured = useMemo(() => activeJobs.filter((j) => j.featured).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 6), [activeJobs]);
  return (
    <section className="border-y border-slate-200/70 bg-white py-16 sm:py-20">
      <div className="container-page">
        <SectionHeader
          eyebrow="Hand-picked"
          title="Featured jobs"
          description="High-impact roles from companies with great reviews."
          action={
            <Button to="/jobs" variant="secondary" rightIcon={ArrowRight}>
              Browse all jobs
            </Button>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />) : featured.map((job) => <JobCard key={job.id} job={job} action="apply" />)}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const { activeJobs } = useData();
  const counts = useMemo(() => {
    const c = {};
    activeJobs.forEach((j) => (c[j.category] = (c[j.category] || 0) + 1));
    return c;
  }, [activeJobs]);
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeader center eyebrow="Explore" title="Browse jobs by category" description="Find the field that fits your skills and ambitions." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => {
          const Icon = getIcon(cat.icon);
          return (
            <motion.div key={cat.id} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.04 }}>
              <Link to={`/jobs?category=${encodeURIComponent(cat.name)}`} className="card card-hover group flex h-full flex-col p-5 sm:p-6">
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl ring-1', TONES[cat.tone])}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold sm:text-base">{cat.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  {pluralize(counts[cat.name] || 0, 'open job')}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const { user } = useAuth();
  return (
    <section className="bg-slate-900 py-16 text-white sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">Why HireFlow</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Everything you need to land your next role</h2>
          <p className="mt-4 max-w-lg text-slate-400">We built HireFlow to remove the busywork from job searching, so you can focus on finding work you love.</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            {['No spam, no fake listings', 'Salary ranges on every job', 'Free for job seekers — forever'].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-400" /> {s}
              </li>
            ))}
          </ul>
          {!user && (
            <Button to="/register" variant="accent" size="lg" className="mt-8" rightIcon={ArrowRight}>
              Create free account
            </Button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {whyChooseUs.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <motion.div key={f.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-page py-16 sm:py-24">
      <SectionHeader center eyebrow="Success stories" title="Loved by job seekers and recruiters" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure key={t.id} {...fadeUp} transition={{ duration: 0.4, delay: (i % 3) * 0.06 }} className="card relative flex flex-col p-6">
            <Quote className="absolute right-5 top-5 h-8 w-8 text-primary-100" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className={cn('h-4 w-4', s < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">“{t.quote}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar src={t.avatar} name={t.name} />
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError('Please enter a valid email address');
    setError('');
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("You're subscribed!", { description: 'Expect weekly job picks in your inbox.' });
      setEmail('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="container-page pb-16 sm:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary-600 px-6 py-12 sm:px-12 sm:py-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/60" />
        <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-accent-500/30" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Get the best jobs in your inbox</h2>
            <p className="mt-2 text-primary-100">Weekly curated roles, salary insights and career tips. Unsubscribe anytime.</p>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Email address</span>
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border-0 bg-white pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </label>
              <Button type="submit" variant="accent" size="lg" loading={loading}>
                Subscribe
              </Button>
            </div>
            {error && <p className="mt-2 text-sm font-medium text-amber-200">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentTitle('');
  return (
    <>
      <Hero />
      <FeaturedCompanies />
      <FeaturedJobs />
      <Categories />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
