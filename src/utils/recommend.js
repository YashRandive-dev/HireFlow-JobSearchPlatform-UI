/** Rank jobs for a seeker by skill overlap, headline keywords and recency. */
export function recommendJobs(jobs, user, { limit = 6, exclude = [] } = {}) {
  if (!user) return jobs.filter((j) => j.status === 'active').slice(0, limit);
  const skills = (user.skills || []).map((s) => s.toLowerCase());
  const headline = (user.headline || '').toLowerCase();
  return jobs
    .filter((j) => j.status === 'active' && !exclude.includes(j.id))
    .map((job) => {
      const jobSkills = [...job.skills, ...job.preferredSkills].map((s) => s.toLowerCase());
      const overlap = jobSkills.filter((s) => skills.includes(s)).length;
      const titleHit = job.title
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3 && headline.includes(w)).length;
      const ageDays = (Date.now() - new Date(job.postedAt)) / 864e5;
      const score = overlap * 3 + titleHit * 2 + Math.max(0, 2 - ageDays / 10);
      const match = Math.min(98, Math.round(45 + overlap * 11 + titleHit * 6));
      return { job, score, match };
    })
    .filter((r) => r.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
