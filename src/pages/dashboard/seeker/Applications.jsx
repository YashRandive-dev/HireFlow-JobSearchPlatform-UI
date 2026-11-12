import { useMemo, useState } from 'react';
import { Briefcase, Search } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { RowSkeleton } from '../../../components/common/LoadingSkeleton';
import ApplicationCard from '../../../components/dashboard/ApplicationCard';
import ApplicationDetailsModal from '../../../components/dashboard/ApplicationDetailsModal';
import { useData } from '../../../context/DataContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { APPLICATION_STATUSES } from '../../../data/constants';
import { cn } from '../../../utils/cn';

export default function Applications() {
  useDocumentTitle('My Applications');
  const { myApplications, getJob, getCompany, loading, withdrawApplication } = useData();
  const confirm = useConfirm();
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const selected = myApplications.find((a) => a.id === selectedId);

  const counts = useMemo(() => {
    const c = { All: myApplications.length };
    APPLICATION_STATUSES.forEach((s) => (c[s] = myApplications.filter((a) => a.status === s).length));
    return c;
  }, [myApplications]);

  const list = myApplications.filter((a) => {
    if (status !== 'All' && a.status !== status) return false;
    if (!query) return true;
    const job = getJob(a.jobId);
    const company = getCompany(job?.companyId);
    return `${job?.title} ${company?.name}`.toLowerCase().includes(query.toLowerCase());
  });

  const onWithdraw = async () => {
    const ok = await confirm({ title: 'Withdraw application?', message: 'The employer will no longer see your application. You can re-apply later if the job is still open.', confirmText: 'Withdraw' });
    if (!ok) return;
    await withdrawApplication(selectedId);
    setSelectedId(null);
    toast.success('Application withdrawn');
  };

  const selectedJob = selected && getJob(selected.jobId);

  return (
    <div>
      <PageHeader title="My Applications" description="Track the status of every job you've applied to." />
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {['All', ...APPLICATION_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn('whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition', status === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50')}
          >
            {s} <span className="opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>
      <label className="relative mb-5 block max-w-sm">
        <span className="sr-only">Search applications</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by job or company" className="input pl-10" />
      </label>
      {loading ? (
        <RowSkeleton />
      ) : list.length ? (
        <div className="space-y-3">
          {list.map((a) => {
            const job = getJob(a.jobId);
            return <ApplicationCard key={a.id} application={a} job={job} company={getCompany(job?.companyId)} onView={() => setSelectedId(a.id)} />;
          })}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title={myApplications.length ? 'No applications match' : 'No applications yet'}
          description={myApplications.length ? 'Try a different status or search term.' : 'When you apply for jobs, you can follow their progress here.'}
          action={!myApplications.length && <Button to="/jobs">Find jobs</Button>}
        />
      )}
      <ApplicationDetailsModal open={!!selected} application={selected} job={selectedJob} company={getCompany(selectedJob?.companyId)} onClose={() => setSelectedId(null)} onWithdraw={onWithdraw} />
    </div>
  );
}
