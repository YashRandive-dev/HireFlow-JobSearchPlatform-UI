import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, CalendarClock, Clock, DollarSign, ExternalLink, Globe, GraduationCap, Laptop, MapPin, SearchX, Share2, Users } from 'lucide-react';
import { toast } from 'sonner';
import CompanyLogo from '../components/common/CompanyLogo';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { DetailsSkeleton } from '../components/common/LoadingSkeleton';
import JobDetailsContent from '../components/jobs/JobDetails';
import JobCard from '../components/jobs/JobCard';
import SaveJobButton from '../components/jobs/SaveJobButton';
import ApplyButton from '../components/jobs/ApplyButton';
import { useData } from '../context/DataContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate, formatSalary, timeAgo } from '../utils/format';
import { EXPERIENCE_YEARS } from '../data/constants';

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, getCompany, activeJobs, loading, addRecentlyViewed } = useData();
  const job = getJob(id);
  const company = getCompany(job?.companyId);
  useDocumentTitle(job ? `${job.title} at ${company?.name}` : 'Job details');

  useEffect(() => {
    if (job) addRecentlyViewed(job.id);
  }, [job?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const similar = useMemo(() => {
    if (!job) return [];
    return activeJobs
      .filter((j) => j.id !== job.id && (j.category === job.category || j.skills.some((s) => job.skills.includes(s))))
      .sort((a, b) => (b.category === job.category) - (a.category === job.category))
      .slice(0, 3);
  }, [activeJobs, job]);

  if (loading) return <DetailsSkeleton />;
  if (!job) {
    return (
      <div className="container-page py-16">
        <EmptyState icon={SearchX} title="Job not found" description="This job may have been removed or the link is incorrect." action={<Button to="/jobs">Browse jobs</Button>} />
      </div>
    );
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  const inactive = job.status !== 'active';

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page py-6 sm:py-8">
        <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-6">
            <div className="card p-5 sm:p-7">
              {inactive && <div className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">This job is currently not accepting applications.</div>}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <CompanyLogo company={company} size="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="primary">{job.category}</Badge>
                    {job.featured && <Badge tone="amber">Featured</Badge>}
                  </div>
                  <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{job.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <Link to={`/companies/${company?.id}`} className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-primary-600">
                      <Building2 className="h-4 w-4" /> {company?.name}
                    </Link>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> Posted {timeAgo(job.postedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Fact icon={DollarSign} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
                <Fact icon={Briefcase} label="Job type" value={job.type} />
                <Fact icon={GraduationCap} label="Experience" value={`${job.experience} · ${EXPERIENCE_YEARS[job.experience]}`} />
                <Fact icon={Laptop} label="Work mode" value={job.workMode} />
                <Fact icon={Clock} label="Posted" value={formatDate(job.postedAt)} />
                <Fact icon={Users} label="Applicants" value={job.applicants} />
                <Fact icon={CalendarClock} label="Apply before" value={formatDate(job.deadline)} />
                <Fact icon={MapPin} label="Location" value={job.location} />
              </div>
            </div>

            <div className="card p-5 sm:p-7">
              <JobDetailsContent job={job} company={company} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-5 lg:sticky lg:top-24">
              <p className="text-sm text-slate-500">Salary range</p>
              <p className="font-display text-2xl font-bold text-slate-900">
                {formatSalary(job.salaryMin, job.salaryMax)}
                <span className="text-sm font-medium text-slate-400"> /yr</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="primary">{job.type}</Badge>
                <Badge tone="accent">{job.workMode}</Badge>
                <Badge>{job.experience}</Badge>
              </div>
              <div className="mt-5 space-y-2">
                <ApplyButton job={job} size="lg" className="w-full" showIcon />
                <div className="flex gap-2">
                  <SaveJobButton job={job} variant="button" className="flex-1" />
                  <Button variant="secondary" size="icon" onClick={share} aria-label="Copy link to job">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" /> {job.applicants} people have applied · Deadline {formatDate(job.deadline)}
              </p>

              <hr className="my-5 border-slate-100" />

              <div className="flex items-center gap-3">
                <CompanyLogo company={company} size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{company?.name}</p>
                  <p className="text-sm text-slate-500">{company?.tagline}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Industry', company?.industry],
                  ['Company size', `${company?.size} employees`],
                  ['Headquarters', company?.headquarters || company?.location],
                  ['Founded', company?.founded],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-medium text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex gap-2">
                <Button to={`/companies/${company?.id}`} variant="secondary" size="sm" className="flex-1">
                  View company
                </Button>
                {company?.website && (
                  <Button href={company.website} target="_blank" rel="noreferrer" variant="ghost" size="sm" leftIcon={Globe} rightIcon={ExternalLink}>
                    Website
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-xl font-bold">Similar jobs</h2>
              <Link to={`/jobs?category=${encodeURIComponent(job.category)}`} className="link text-sm">
                See all
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <SaveJobButton job={job} variant="button" />
        <ApplyButton job={job} size="md" className="flex-1" />
      </div>
    </div>
  );
}
