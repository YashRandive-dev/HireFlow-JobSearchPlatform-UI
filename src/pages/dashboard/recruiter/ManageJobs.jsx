import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, MoreVertical, Pencil, PlusCircle, Power, Search, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import EmptyState from '../../../components/common/EmptyState';
import Dropdown, { DropdownDivider, DropdownItem } from '../../../components/common/Dropdown';
import { RowSkeleton } from '../../../components/common/LoadingSkeleton';
import { useRecruiterData } from './useRecruiterData';
import { useConfirm } from '../../../context/ConfirmContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { formatDate, formatSalary, pluralize } from '../../../utils/format';
import { cn } from '../../../utils/cn';

function StatusSwitch({ job, onToggle }) {
  const on = job.status === 'active';
  return (
    <button onClick={() => onToggle(job)} role="switch" aria-checked={on} aria-label={on ? 'Deactivate job' : 'Activate job'} className="flex items-center gap-2">
      <span className={cn('relative inline-flex h-5 w-9 rounded-full transition', on ? 'bg-accent-500' : 'bg-slate-300')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition', on ? 'left-[18px]' : 'left-0.5')} />
      </span>
      <span className={cn('text-xs font-medium', on ? 'text-accent-700' : 'text-slate-500')}>{on ? 'Active' : 'Inactive'}</span>
    </button>
  );
}

export default function ManageJobs() {
  useDocumentTitle('Manage Jobs');
  const { myJobs, myApplications, loading, toggleJobStatus, deleteJob } = useRecruiterData();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');

  const appCount = (id) => myApplications.filter((a) => a.jobId === id).length;
  const list = myJobs.filter((j) => (tab === 'all' || j.status === tab) && j.title.toLowerCase().includes(query.toLowerCase()));

  const onToggle = async (job) => {
    await toggleJobStatus(job.id);
    toast.success(job.status === 'active' ? 'Job deactivated' : 'Job activated', { description: job.title });
  };

  const onDelete = async (job) => {
    const ok = await confirm({ title: 'Delete this job?', message: `“${job.title}” and its ${appCount(job.id)} applications will be permanently deleted.`, confirmText: 'Delete job' });
    if (!ok) return;
    await deleteJob(job.id);
    toast.success('Job deleted');
  };

  const actions = (job) => (
    <Dropdown label="Job actions" triggerClassName="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" trigger={<MoreVertical className="h-4 w-4" />}>
      <DropdownItem icon={Eye} to={`/jobs/${job.id}`}>View details</DropdownItem>
      <DropdownItem icon={Pencil} to={`/recruiter/jobs/edit/${job.id}`}>Edit job</DropdownItem>
      <DropdownItem icon={Users} to={`/recruiter/applicants?job=${job.id}`}>View applications</DropdownItem>
      <DropdownItem icon={Power} onClick={() => onToggle(job)}>{job.status === 'active' ? 'Deactivate' : 'Activate'}</DropdownItem>
      <DropdownDivider />
      <DropdownItem icon={Trash2} danger onClick={() => onDelete(job)}>Delete</DropdownItem>
    </Dropdown>
  );

  const counts = { all: myJobs.length, active: myJobs.filter((j) => j.status === 'active').length, inactive: myJobs.filter((j) => j.status !== 'active').length };

  return (
    <div>
      <PageHeader title="Manage Jobs" description="Create, edit and track all of your job postings." actions={<Button to="/recruiter/jobs/create" leftIcon={PlusCircle}>Post new job</Button>} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200">
          {['all', 'active', 'inactive'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition', tab === t ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50')}>
              {t} ({counts[t]})
            </button>
          ))}
        </div>
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search jobs</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs" className="input pl-10" />
        </label>
      </div>

      {loading ? (
        <RowSkeleton />
      ) : !list.length ? (
        <EmptyState icon={Briefcase} title={myJobs.length ? 'No jobs match' : 'No jobs posted yet'} description={myJobs.length ? 'Try a different filter.' : 'Post your first job to start receiving applications.'} action={!myJobs.length && <Button to="/recruiter/jobs/create">Post a job</Button>} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-visible md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Job</th>
                  <th className="px-5 py-3 font-semibold">Applications</th>
                  <th className="px-5 py-3 font-semibold">Posted</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((job) => (
                  <tr key={job.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <Link to={`/recruiter/jobs/edit/${job.id}`} className="font-semibold text-slate-900 hover:text-primary-600">{job.title}</Link>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {job.location} · {job.type} · {formatSalary(job.salaryMin, job.salaryMax)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => navigate(`/recruiter/applicants?job=${job.id}`)} className="inline-flex items-center gap-1.5 font-medium text-primary-600 hover:underline">
                        <Users className="h-4 w-4" /> {appCount(job.id)}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(job.postedAt)}
                      <p className="text-xs">Closes {formatDate(job.deadline)}</p>
                    </td>
                    <td className="px-5 py-4"><StatusSwitch job={job} onToggle={onToggle} /></td>
                    <td className="px-5 py-4 text-right">{actions(job)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {list.map((job) => (
              <div key={job.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.location} · {job.type}</p>
                  </div>
                  {actions(job)}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusSwitch job={job} onToggle={onToggle} />
                  <Badge tone="primary" icon={Users}>{pluralize(appCount(job.id), 'applicant')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
