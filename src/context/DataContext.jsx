import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { applicationsApi, companiesApi, jobsApi, userPrefsApi, usersApi } from '../services/api';
import { seekerSnapshot } from '../services/seed';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const DataContext = createContext(null);
const MAX_RECENT = 8;

export function DataProvider({ children }) {
  const { user } = useAuth();
  const { notify } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([jobsApi.list(), companiesApi.list(), applicationsApi.list()]).then(([j, c, a]) => {
      if (!active) return;
      setJobs(j);
      setCompanies(c);
      setApplications(a);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSavedIds(user ? userPrefsApi.getSaved(user.id) : []);
    setRecentIds(userPrefsApi.getRecent(user?.id));
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const companiesById = useMemo(() => Object.fromEntries(companies.map((c) => [c.id, c])), [companies]);
  const jobsById = useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j])), [jobs]);
  const activeJobs = useMemo(() => jobs.filter((j) => j.status === 'active'), [jobs]);

  const getJob = useCallback((id) => jobsById[id] || null, [jobsById]);
  const getCompany = useCallback((id) => companiesById[id] || null, [companiesById]);
  const jobsForCompany = useCallback((companyId) => activeJobs.filter((j) => j.companyId === companyId), [activeJobs]);

  // ----- Saved jobs -----
  const isSaved = useCallback((jobId) => savedIds.includes(jobId), [savedIds]);
  const toggleSave = useCallback(
    (jobId) => {
      if (!user) return null;
      const exists = savedIds.includes(jobId);
      const next = exists ? savedIds.filter((id) => id !== jobId) : [jobId, ...savedIds];
      setSavedIds(next);
      userPrefsApi.setSaved(user.id, next);
      return !exists;
    },
    [savedIds, user]
  );

  // ----- Recently viewed -----
  const addRecentlyViewed = useCallback(
    (jobId) => {
      setRecentIds((prev) => {
        const next = [jobId, ...prev.filter((id) => id !== jobId)].slice(0, MAX_RECENT);
        userPrefsApi.setRecent(user?.id, next);
        return next;
      });
    },
    [user?.id]
  );
  const clearRecentlyViewed = useCallback(() => {
    setRecentIds([]);
    userPrefsApi.setRecent(user?.id, []);
  }, [user?.id]);

  // ----- Jobs (recruiter) -----
  const createJob = useCallback(
    async (data) => {
      const company = companiesById[user.companyId];
      const job = await jobsApi.create({
        ...data,
        companyId: user.companyId,
        recruiterId: user.id,
        postedAt: new Date().toISOString(),
        applicants: 0,
        featured: false,
        status: 'active',
        currency: 'USD',
        benefits: data.benefits?.length ? data.benefits : company?.benefits || [],
      });
      setJobs((prev) => [job, ...prev]);
      return job;
    },
    [user, companiesById]
  );

  const updateJob = useCallback(async (id, patch) => {
    const job = await jobsApi.update(id, patch);
    setJobs((prev) => prev.map((j) => (j.id === id ? job : j)));
    return job;
  }, []);

  const toggleJobStatus = useCallback(
    (id) => {
      const job = jobsById[id];
      return updateJob(id, { status: job.status === 'active' ? 'inactive' : 'active' });
    },
    [jobsById, updateJob]
  );

  const deleteJob = useCallback(async (id) => {
    await jobsApi.remove(id);
    const related = (await applicationsApi.list((a) => a.jobId === id)).map((a) => a.id);
    await Promise.all(related.map((appId) => applicationsApi.remove(appId)));
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setApplications((prev) => prev.filter((a) => a.jobId !== id));
  }, []);

  // ----- Applications -----
  const myApplications = useMemo(
    () => applications.filter((a) => a.userId && a.userId === user?.id).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)),
    [applications, user?.id]
  );
  const hasApplied = useCallback((jobId) => myApplications.some((a) => a.jobId === jobId), [myApplications]);

  const applyToJob = useCallback(
    async (job, { coverLetter, phone, resume }) => {
      const now = new Date().toISOString();
      const app = await applicationsApi.create({
        jobId: job.id,
        userId: user.id,
        candidate: { ...seekerSnapshot(user), phone: phone || user.phone },
        coverLetter,
        resume: resume ? { name: resume.name, size: resume.size, dataUrl: resume.dataUrl } : null,
        appliedAt: now,
        status: 'Applied',
        history: [{ status: 'Applied', date: now }],
        interview: null,
      });
      setApplications((prev) => [app, ...prev]);
      const updatedJob = await jobsApi.update(job.id, (j) => ({ applicants: (j.applicants || 0) + 1 }));
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
      if (job.recruiterId) {
        notify({
          userId: job.recruiterId,
          type: 'application',
          title: 'New application received',
          message: `${user.name} applied for ${job.title}.`,
          link: `/recruiter/applicants?job=${job.id}`,
        });
      }
      notify({
        userId: user.id,
        type: 'status',
        title: 'Application submitted',
        message: `Your application for ${job.title} at ${companiesById[job.companyId]?.name} was sent.`,
        link: '/dashboard/applications',
      });
      return app;
    },
    [user, notify, companiesById]
  );

  const withdrawApplication = useCallback(async (appId) => {
    const app = applications.find((a) => a.id === appId);
    await applicationsApi.remove(appId);
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    if (app) {
      const updatedJob = await jobsApi.update(app.jobId, (j) => ({ applicants: Math.max(0, (j.applicants || 1) - 1) }));
      setJobs((prev) => prev.map((j) => (j.id === app.jobId ? updatedJob : j)));
    }
  }, [applications]);

  const updateApplicationStatus = useCallback(
    async (appId, status, { interview, note } = {}) => {
      const updated = await applicationsApi.update(appId, (a) => ({
        status,
        interview: interview !== undefined ? interview : a.interview,
        history: [...(a.history || []), { status, date: new Date().toISOString(), note }],
      }));
      setApplications((prev) => prev.map((a) => (a.id === appId ? updated : a)));
      const job = jobsById[updated.jobId];
      const company = companiesById[job?.companyId];
      if (updated.userId && job) {
        const isInterview = status === 'Interview';
        notify({
          userId: updated.userId,
          type: isInterview ? 'interview' : 'status',
          title: isInterview ? 'Interview invitation' : `Application ${status.toLowerCase()}`,
          message: isInterview
            ? `${company?.name} invited you to interview for ${job.title} on ${interview?.date} at ${interview?.time}.`
            : `Your application for ${job.title} at ${company?.name} is now "${status}".`,
          link: '/dashboard/applications',
        });
      }
      return updated;
    },
    [jobsById, companiesById, notify]
  );

  const recordProfileView = useCallback(
    (app) => {
      if (!app.userId || !user) return;
      usersApi.incrementProfileViews(app.userId);
      const company = companiesById[user.companyId];
      notify({
        userId: app.userId,
        type: 'profile_view',
        title: 'Your profile was viewed',
        message: `A recruiter from ${company?.name || 'a company'} viewed your profile.`,
        link: '/dashboard/profile',
      });
    },
    [user, companiesById, notify]
  );

  // ----- Companies -----
  const updateCompany = useCallback(async (id, patch) => {
    const c = await companiesApi.update(id, patch);
    setCompanies((prev) => prev.map((x) => (x.id === id ? c : x)));
    return c;
  }, []);

  const value = useMemo(
    () => ({
      loading,
      jobs,
      activeJobs,
      companies,
      applications,
      companiesById,
      jobsById,
      getJob,
      getCompany,
      jobsForCompany,
      savedIds,
      isSaved,
      toggleSave,
      recentIds,
      addRecentlyViewed,
      clearRecentlyViewed,
      createJob,
      updateJob,
      deleteJob,
      toggleJobStatus,
      myApplications,
      hasApplied,
      applyToJob,
      withdrawApplication,
      updateApplicationStatus,
      recordProfileView,
      updateCompany,
    }),
    [loading, jobs, activeJobs, companies, applications, companiesById, jobsById, getJob, getCompany, jobsForCompany, savedIds, isSaved, toggleSave, recentIds, addRecentlyViewed, clearRecentlyViewed, createJob, updateJob, deleteJob, toggleJobStatus, myApplications, hasApplied, applyToJob, withdrawApplication, updateApplicationStatus, recordProfileView, updateCompany]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
