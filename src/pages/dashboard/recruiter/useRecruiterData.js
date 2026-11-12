import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

/** Jobs and applications belonging to the signed-in recruiter's company. */
export function useRecruiterData() {
  const { user } = useAuth();
  const data = useData();
  const company = data.getCompany(user.companyId);
  const myJobs = useMemo(
    () => data.jobs.filter((j) => j.companyId === user.companyId).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)),
    [data.jobs, user.companyId]
  );
  const jobIds = useMemo(() => new Set(myJobs.map((j) => j.id)), [myJobs]);
  const myApplications = useMemo(
    () => data.applications.filter((a) => jobIds.has(a.jobId)).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)),
    [data.applications, jobIds]
  );
  return { ...data, user, company, myJobs, myApplications };
}
