import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { toast } from 'sonner';
import JobForm, { emptyJob } from '../../../components/forms/JobForm';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import PageLoader from '../../../components/common/PageLoader';
import { useRecruiterData } from './useRecruiterData';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function PostJob() {
  const { id } = useParams();
  const isEdit = !!id;
  useDocumentTitle(isEdit ? 'Edit Job' : 'Post a Job');
  const navigate = useNavigate();
  const { company, myJobs, loading, createJob, updateJob } = useRecruiterData();
  const job = isEdit ? myJobs.find((j) => j.id === id) : null;

  if (loading) return <PageLoader />;
  if (isEdit && !job) {
    return <EmptyState icon={SearchX} title="Job not found" description="This job doesn't exist or belongs to another company." action={<Button to="/recruiter/jobs">Back to jobs</Button>} />;
  }

  const initial = isEdit ? { ...emptyJob(company?.name), ...job, companyName: company?.name } : emptyJob(company?.name);

  const onSubmit = async (data) => {
    if (isEdit) {
      await updateJob(id, data);
      toast.success('Job updated', { description: data.title });
    } else {
      const created = await createJob(data);
      toast.success('Job published!', { description: `${created.title} is now live.` });
    }
    navigate('/recruiter/jobs');
  };

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <PageHeader title={isEdit ? 'Edit job' : 'Post a new job'} description={isEdit ? 'Update the details of your job posting.' : `Reach thousands of candidates. Your job will be listed under ${company?.name}.`} />
      <JobForm key={id || 'new'} initial={initial} onSubmit={onSubmit} submitLabel={isEdit ? 'Save changes' : 'Publish job'} onCancel={() => navigate('/recruiter/jobs')} />
    </div>
  );
}
