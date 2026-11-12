import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Briefcase, CalendarClock, Eye, Star } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardStats from '../../../components/dashboard/DashboardStats';
import ChartCard from '../../../components/dashboard/ChartCard';
import ProfileCompletion from '../../../components/dashboard/ProfileCompletion';
import ApplicationCard from '../../../components/dashboard/ApplicationCard';
import ApplicationDetailsModal from '../../../components/dashboard/ApplicationDetailsModal';
import JobCard from '../../../components/jobs/JobCard';
import EmptyState from '../../../components/common/EmptyState';
import Button from '../../../components/common/Button';
import CompanyLogo from '../../../components/common/CompanyLogo';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { recommendJobs } from '../../../utils/recommend';
import { formatDate, formatTime } from '../../../utils/format';
import { APPLICATION_STATUSES } from '../../../data/constants';

const STATUS_COLORS = { Applied: '#94a3b8', 'Under Review': '#0ea5e9', Shortlisted: '#8b5cf6', Interview: '#f59e0b', Rejected: '#ef4444', Selected: '#10b981' };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function SeekerOverview() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const { myApplications, savedIds, jobs, getJob, getCompany, loading } = useData();
  const [selected, setSelected] = useState(null);

  const shortlisted = myApplications.filter((a) => ['Shortlisted', 'Interview', 'Selected'].includes(a.status)).length;
  const stats = [
    { icon: Briefcase, label: 'Total applications', value: myApplications.length, tone: 'primary' },
    { icon: Star, label: 'Shortlisted', value: shortlisted, tone: 'violet' },
    { icon: Bookmark, label: 'Saved jobs', value: savedIds.length, tone: 'amber' },
    { icon: Eye, label: 'Profile views', value: user.profileViews || 0, tone: 'accent', hint: user.profileViews ? '+12%' : undefined },
  ];

  const weekly = useMemo(() => {
    const weeks = Array.from({ length: 6 }, (_, i) => {
      const end = Date.now() - (5 - i) * 7 * 864e5;
      return { label: formatDate(end - 6 * 864e5, { month: 'short', day: 'numeric' }), start: end - 7 * 864e5, end, applications: 0 };
    });
    myApplications.forEach((a) => {
      const t = new Date(a.appliedAt).getTime();
      const w = weeks.find((wk) => t > wk.start && t <= wk.end);
      if (w) w.applications += 1;
    });
    return weeks;
  }, [myApplications]);

  const byStatus = APPLICATION_STATUSES.map((s) => ({ name: s, value: myApplications.filter((a) => a.status === s).length })).filter((d) => d.value);
  const recommended = useMemo(() => recommendJobs(jobs, user, { limit: 3, exclude: myApplications.map((a) => a.jobId) }), [jobs, user, myApplications]);
  const interviews = myApplications.filter((a) => a.status === 'Interview' && a.interview);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {greeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-slate-500">Here&apos;s what&apos;s happening with your job search today.</p>
        </div>
        <Button to="/jobs" rightIcon={ArrowRight}>
          Find jobs
        </Button>
      </div>

      <DashboardStats stats={stats} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Application activity" description="Applications submitted over the last 6 weeks" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="appsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Area type="monotone" dataKey="applications" stroke="#4f46e5" strokeWidth={2.5} fill="url(#appsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ProfileCompletion user={user} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent applications</h2>
            <Link to="/dashboard/applications" className="link text-sm">
              View all
            </Link>
          </div>
          {myApplications.length ? (
            myApplications.slice(0, 3).map((a) => {
              const job = getJob(a.jobId);
              return <ApplicationCard key={a.id} application={a} job={job} company={getCompany(job?.companyId)} onView={() => setSelected(a)} />;
            })
          ) : (
            <EmptyState icon={Briefcase} title="No applications yet" description="Start applying to jobs and track their progress here." action={<Button to="/jobs">Browse jobs</Button>} />
          )}
        </div>
        <div className="space-y-6">
          <ChartCard title="Application status">
            {byStatus.length ? (
              <>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        {byStatus.map((d) => (
                          <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {byStatus.map((d) => (
                    <li key={d.name} className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[d.name] }} /> {d.name} ({d.value})
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No data yet</p>
            )}
          </ChartCard>
          {interviews.length > 0 && (
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <CalendarClock className="h-5 w-5 text-amber-500" /> Upcoming interviews
              </h3>
              <ul className="mt-4 space-y-3">
                {interviews.map((a) => {
                  const job = getJob(a.jobId);
                  return (
                    <li key={a.id}>
                      <button onClick={() => setSelected(a)} className="flex w-full items-center gap-3 rounded-xl bg-amber-50/70 p-3 text-left transition hover:bg-amber-50">
                        <CompanyLogo company={getCompany(job?.companyId)} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{job?.title}</p>
                          <p className="text-xs text-slate-600">
                            {formatDate(a.interview.date, { weekday: 'short', month: 'short', day: 'numeric' })} · {formatTime(a.interview.time)}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {recommended.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended for you</h2>
            <Link to="/dashboard/recommended-jobs" className="link text-sm">
              See more
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommended.map(({ job, match }) => (
              <JobCard key={job.id} job={job} match={match} action="apply" />
            ))}
          </div>
        </section>
      )}

      <ApplicationDetailsModal
        open={!!selected}
        application={selected}
        job={selected && getJob(selected.jobId)}
        company={selected && getCompany(getJob(selected.jobId)?.companyId)}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
