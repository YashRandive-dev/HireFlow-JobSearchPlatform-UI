import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, CalendarPlus, Download, Eye, MapPin, Search, Star, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import Avatar from '../../../components/common/Avatar';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import Select from '../../../components/forms/Select';
import { RowSkeleton } from '../../../components/common/LoadingSkeleton';
import CandidateProfileModal, { downloadResume } from '../../../components/dashboard/CandidateProfileModal';
import InterviewModal from '../../../components/dashboard/InterviewModal';
import { useRecruiterData } from './useRecruiterData';
import { useConfirm } from '../../../context/ConfirmContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { APPLICATION_STATUSES } from '../../../data/constants';
import { formatDate } from '../../../utils/format';
import { cn } from '../../../utils/cn';

export default function Applicants() {
  useDocumentTitle('Applicants');
  const { myJobs, myApplications, jobsById, loading, updateApplicationStatus, recordProfileView } = useRecruiterData();
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();
  const jobFilter = params.get('job') || '';
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [profileId, setProfileId] = useState(null);
  const [interviewId, setInterviewId] = useState(null);

  const profileApp = myApplications.find((a) => a.id === profileId);
  const interviewApp = myApplications.find((a) => a.id === interviewId);

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return myApplications
      .filter((a) => !jobFilter || a.jobId === jobFilter)
      .filter((a) => status === 'All' || a.status === status)
      .filter((a) => !q || `${a.candidate.name} ${a.candidate.headline} ${a.candidate.skills.join(' ')}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === 'experience' ? b.candidate.experienceYears - a.candidate.experienceYears : sort === 'name' ? a.candidate.name.localeCompare(b.candidate.name) : new Date(b.appliedAt) - new Date(a.appliedAt)));
  }, [myApplications, jobFilter, status, query, sort]);

  const counts = useMemo(() => {
    const base = myApplications.filter((a) => !jobFilter || a.jobId === jobFilter);
    const c = { All: base.length };
    APPLICATION_STATUSES.forEach((s) => (c[s] = base.filter((a) => a.status === s).length));
    return c;
  }, [myApplications, jobFilter]);

  const changeStatus = async (app, next) => {
    if (next === app.status) return;
    if (next === 'Interview') return setInterviewId(app.id);
    if (next === 'Rejected') {
      const ok = await confirm({ title: 'Reject this application?', message: `${app.candidate.name} will be notified that they were not selected.`, confirmText: 'Reject' });
      if (!ok) return;
    }
    await updateApplicationStatus(app.id, next);
    toast.success(`${app.candidate.name} moved to “${next}”`);
  };

  const scheduleInterview = async (interview) => {
    await updateApplicationStatus(interviewApp.id, 'Interview', { interview });
    toast.success('Interview scheduled', { description: `Invitation sent to ${interviewApp.candidate.name}` });
    setInterviewId(null);
  };

  const openProfile = (app) => {
    setProfileId(app.id);
    recordProfileView(app);
  };

  const setJob = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set('job', id);
    else next.delete('job');
    setParams(next, { replace: true });
  };

  return (
    <div>
      <PageHeader title="Applicants" description="Review candidates, update statuses and schedule interviews." />

      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Search applicants</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, title or skill" className="input pl-10" />
        </label>
        <Select icon={Briefcase} value={jobFilter} onChange={(e) => setJob(e.target.value)} placeholder="All jobs" options={myJobs.map((j) => ({ value: j.id, label: j.title }))} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto" aria-label="Sort applicants">
          <option value="newest">Newest first</option>
          <option value="experience">Most experienced</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {['All', ...APPLICATION_STATUSES].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={cn('whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition', status === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50')}>
            {s} <span className="opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <RowSkeleton />
      ) : list.length ? (
        <div className="space-y-3">
          {list.map((app) => {
            const c = app.candidate;
            const job = jobsById[app.jobId];
            const closed = ['Rejected', 'Selected'].includes(app.status);
            return (
              <div key={app.id} className="card card-hover p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <button onClick={() => openProfile(app)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                    <Avatar src={c.avatar} name={c.name} size="lg" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900 hover:text-primary-600">{c.name}</p>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="truncate text-sm text-slate-600">{c.headline}</p>
                      <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                        <span>For <span className="font-medium text-slate-700">{job?.title}</span></span>
                        <span>{c.experienceYears} yrs exp.</span>
                        {c.location && <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{c.location}</span>}
                        <span>Applied {formatDate(app.appliedAt)}</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.skills.slice(0, 5).map((s) => (
                          <span key={s} className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', job?.skills?.includes(s) ? 'bg-accent-50 text-accent-700' : 'bg-slate-100 text-slate-600')}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <select value={app.status} onChange={(e) => changeStatus(app, e.target.value)} className="input h-9 w-auto py-0 pr-8 text-sm" aria-label={`Status for ${c.name}`}>
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Button variant="ghost" size="icon-sm" onClick={() => openProfile(app)} aria-label="View profile" title="View profile"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => { downloadResume(app); toast.success('Resume downloaded'); }} aria-label="Download resume" title="Download resume"><Download className="h-4 w-4" /></Button>
                    {!closed && (
                      <>
                        {app.status !== 'Shortlisted' && app.status !== 'Interview' && (
                          <Button variant="soft" size="sm" leftIcon={Star} onClick={() => changeStatus(app, 'Shortlisted')}>Shortlist</Button>
                        )}
                        <Button variant="secondary" size="sm" leftIcon={CalendarPlus} onClick={() => setInterviewId(app.id)}>Interview</Button>
                        <Button variant="danger-soft" size="icon-sm" onClick={() => changeStatus(app, 'Rejected')} aria-label="Reject" title="Reject"><X className="h-4 w-4" /></Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Users} title="No applicants found" description={myApplications.length ? 'Try adjusting your filters.' : 'Applicants will appear here once candidates apply to your jobs.'} action={!myJobs.length && <Button to="/recruiter/jobs/create">Post a job</Button>} />
      )}

      <CandidateProfileModal
        open={!!profileApp}
        application={profileApp}
        job={profileApp && jobsById[profileApp.jobId]}
        onClose={() => setProfileId(null)}
        onStatus={(app, s) => changeStatus(app, s)}
        onSchedule={(app) => {
          setProfileId(null);
          setInterviewId(app.id);
        }}
      />
      <InterviewModal open={!!interviewApp} application={interviewApp} onClose={() => setInterviewId(null)} onSubmit={scheduleInterview} />
    </div>
  );
}
