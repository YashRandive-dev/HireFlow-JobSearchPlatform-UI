import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { JobCardSkeleton } from '../../../components/common/LoadingSkeleton';
import JobCard from '../../../components/jobs/JobCard';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { recommendJobs } from '../../../utils/recommend';

export default function RecommendedJobs() {
  useDocumentTitle('Recommended Jobs');
  const { user } = useAuth();
  const { jobs, myApplications, loading } = useData();
  const recs = useMemo(() => recommendJobs(jobs, user, { limit: 12, exclude: myApplications.map((a) => a.jobId) }), [jobs, user, myApplications]);

  return (
    <div>
      <PageHeader title="Recommended Jobs" description="Personalised matches based on your skills, headline and activity." />
      {user.skills?.length > 0 && (
        <div className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-amber-500" /> Matching on:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((s) => (
              <span key={s} className="rounded-lg bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                {s}
              </span>
            ))}
          </div>
          <Button to="/dashboard/profile" variant="ghost" size="xs" className="sm:ml-auto">
            Edit skills
          </Button>
        </div>
      )}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : recs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recs.map(({ job, match }) => (
            <JobCard key={job.id} job={job} match={match} action="apply" />
          ))}
        </div>
      ) : (
        <EmptyState icon={Sparkles} title="No recommendations yet" description="Add skills and a headline to your profile so we can match you with relevant roles." action={<Button to="/dashboard/profile">Complete profile</Button>} />
      )}
    </div>
  );
}
