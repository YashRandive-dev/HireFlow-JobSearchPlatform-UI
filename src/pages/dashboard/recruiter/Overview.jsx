import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarCheck, PlusCircle, Star, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardStats from '../../../components/dashboard/DashboardStats';
import ChartCard from '../../../components/dashboard/ChartCard';
import Button from '../../../components/common/Button';
import Avatar from '../../../components/common/Avatar';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { useRecruiterData } from './useRecruiterData';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { APPLICATION_STATUSES } from '../../../data/constants';
import { formatDate, formatTime, timeAgo } from '../../../utils/format';

const PIPE_COLORS = { Applied: 'bg-slate-400', 'Under Review': 'bg-sky-500', Shortlisted: 'bg-violet-500', Interview: 'bg-amber-500', Rejected: 'bg-red-500', Selected: 'bg-accent-500' };

export default function RecruiterOverview() {
  useDocumentTitle('Recruiter Dashboard');
  const { user, company, myJobs, myApplications, jobsById, loading } = useRecruiterData();

  const activeJobs = myJobs.filter((j) => j.status === 'active');
  const interviews = myApplications.filter((a) => a.status === 'Interview');
  const stats = [
    { icon: Briefcase, label: 'Active jobs', value: activeJobs.length, tone: 'primary' },
    { icon: Users, label: 'Total applicants', value: myApplications.length, tone: 'sky' },
    { icon: Star, label: 'Shortlisted', value: myApplications.filter((a) => a.status === 'Shortlisted').length, tone: 'violet' },
    { icon: CalendarCheck, label: 'Interviews scheduled', value: interviews.length, tone: 'accent' },
  ];

  const perJob = useMemo(
    () =>
      myJobs
        .map((j) => ({ name: j.title.length > 18 ? j.title.slice(0, 17) + '…' : j.title, applicants: myApplications.filter((a) => a.jobId === j.id).length }))
        .slice(0, 8),
    [myJobs, myApplications]
  );
  const pipeline = APPLICATION_STATUSES.map((s) => ({ status: s, count: myApplications.filter((a) => a.status === s).length }));
  const max = Math.max(1, ...pipeline.map((p) => p.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-slate-500">Hiring overview for {company?.name}.</p>
        </div>
        <Button to="/recruiter/jobs/create" leftIcon={PlusCircle}>
          Post a new job
        </Button>
      </div>

      <DashboardStats stats={stats} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Applicants per job" description="Applications received for each posting" className="lg:col-span-2">
          {perJob.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perJob} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#eef2ff' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="applicants" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-slate-500">Post a job to start seeing data.</p>
          )}
        </ChartCard>
        <ChartCard title="Hiring pipeline">
          <ul className="space-y-3.5">
            {pipeline.map((p) => (
              <li key={p.status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{p.status}</span>
                  <span className="font-semibold text-slate-900">{p.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${PIPE_COLORS[p.status]} transition-all duration-700`} style={{ width: `${(p.count / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-semibold">Recent applications</h3>
            <Link to="/recruiter/applicants" className="link text-sm">
              View all
            </Link>
          </div>
          {myApplications.length ? (
            <ul className="divide-y divide-slate-100">
              {myApplications.slice(0, 6).map((a) => (
                <li key={a.id}>
                  <Link to={`/recruiter/applicants?job=${a.jobId}`} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50">
                    <Avatar src={a.candidate.avatar} name={a.candidate.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{a.candidate.name}</p>
                      <p className="truncate text-xs text-slate-500">{jobsById[a.jobId]?.title}</p>
                    </div>
                    <span className="hidden text-xs text-slate-400 sm:block">{timeAgo(a.appliedAt)}</span>
                    <StatusBadge status={a.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact icon={Users} title="No applications yet" description="Applications to your jobs will show up here." />
          )}
        </div>
        <div className="card p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="h-5 w-5 text-accent-600" /> Upcoming interviews
          </h3>
          {interviews.length ? (
            <ul className="mt-4 space-y-3">
              {interviews.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <Avatar src={a.candidate.avatar} name={a.candidate.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{a.candidate.name}</p>
                    <p className="text-xs text-slate-500">
                      {a.interview ? `${formatDate(a.interview.date, { month: 'short', day: 'numeric' })} · ${formatTime(a.interview.time)}` : 'Time TBD'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No interviews scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
