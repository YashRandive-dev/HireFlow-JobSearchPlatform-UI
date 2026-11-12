import { Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { JobCardSkeleton } from '../../../components/common/LoadingSkeleton';
import JobCard from '../../../components/jobs/JobCard';
import { useData } from '../../../context/DataContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function SavedJobs() {
  useDocumentTitle('Saved Jobs');
  const { savedIds, getJob, toggleSave, loading } = useData();
  const confirm = useConfirm();
  const jobs = savedIds.map(getJob).filter(Boolean);

  const removeAll = async () => {
    const ok = await confirm({ title: 'Remove all saved jobs?', message: `This will remove ${jobs.length} bookmarked jobs.`, confirmText: 'Remove all' });
    if (!ok) return;
    jobs.forEach((j) => toggleSave(j.id));
    toast.success('Saved jobs cleared');
  };

  return (
    <div>
      <PageHeader
        title="Saved Jobs"
        description={`${jobs.length} bookmarked ${jobs.length === 1 ? 'job' : 'jobs'}`}
        actions={
          jobs.length > 0 && (
            <Button variant="danger-soft" size="sm" leftIcon={Trash2} onClick={removeAll}>
              Remove all
            </Button>
          )
        }
      />
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="relative">
              <JobCard job={job} action="apply" className="h-full" />
              {job.status !== 'active' && <span className="absolute left-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Closed</span>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Bookmark} title="No saved jobs yet" description="Tap the bookmark icon on any job to save it for later." action={<Button to="/jobs">Explore jobs</Button>} />
      )}
    </div>
  );
}
