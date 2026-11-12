// Builds the initial demo database written to LocalStorage on first visit.
import { companies } from '../data/companies';
import { buildJobs } from '../data/jobs';
import { candidates } from '../data/candidates';
import { demoUsers } from '../data/users';

const DAY = 24 * 60 * 60 * 1000;
const ORDER = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

function historyFor(status, appliedAt) {
  const start = new Date(appliedAt).getTime();
  const steps = status === 'Rejected' ? ['Applied', 'Under Review', 'Rejected'] : ORDER.slice(0, ORDER.indexOf(status) + 1);
  return steps.map((s, i) => ({ status: s, date: new Date(start + i * 1.5 * DAY).toISOString() }));
}

function candidateSnapshot(c) {
  return {
    name: c.name,
    email: c.email,
    phone: c.phone,
    avatar: c.avatar,
    headline: c.headline,
    location: c.location,
    experienceYears: c.experienceYears,
    skills: c.skills,
    education: c.education,
    summary: c.summary,
  };
}

export function seekerSnapshot(user) {
  const years = (user.experience || []).reduce((sum, e) => {
    const s = new Date(e.start || Date.now());
    const end = e.current || !e.end ? new Date() : new Date(e.end);
    return sum + Math.max(0, (end - s) / (365 * DAY));
  }, 0);
  const edu = (user.education || [])[0];
  return {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || '',
    headline: user.headline || '',
    location: user.location || '',
    experienceYears: Math.round(years),
    skills: user.skills || [],
    education: edu ? `${edu.degree} ${edu.field}, ${edu.school}` : '',
    summary: user.about || '',
  };
}

export function buildSeed(now = Date.now()) {
  const jobs = buildJobs(now);
  const seeker = demoUsers.find((u) => u.id === 'u-seeker');
  const ago = (d) => new Date(now - d * DAY).toISOString();

  const candidateApps = [
    ['j1', 'cand1', 'Shortlisted', 3],
    ['j1', 'cand8', 'Interview', 6],
    ['j1', 'cand6', 'Applied', 0.2],
    ['j2', 'cand2', 'Under Review', 1],
    ['j2', 'cand9', 'Shortlisted', 2],
    ['j2', 'cand6', 'Rejected', 2],
    ['j3', 'cand4', 'Interview', 5],
    ['j3', 'cand12', 'Applied', 1],
    ['j4', 'cand3', 'Selected', 4],
    ['j4', 'cand10', 'Under Review', 2],
    ['j5', 'cand5', 'Applied', 3],
    ['j5', 'cand11', 'Under Review', 6],
    ['j38', 'cand7', 'Shortlisted', 4],
  ].map(([jobId, candId, status, daysAgo], i) => {
    const c = candidates.find((x) => x.id === candId);
    const appliedAt = ago(daysAgo);
    return {
      id: `app-c${i + 1}`,
      jobId,
      userId: null,
      candidate: candidateSnapshot(c),
      coverLetter: `Hi team, I'm excited to apply. ${c.summary}`,
      resume: { name: `${c.name.replace(/\s+/g, '_')}_Resume.pdf`, size: 182000 },
      appliedAt,
      status,
      history: historyFor(status, appliedAt),
      interview:
        status === 'Interview'
          ? { date: new Date(now + 3 * DAY).toISOString().slice(0, 10), time: '14:00', mode: 'Video call', location: 'Google Meet link will be shared', notes: 'Technical deep-dive with the team lead.' }
          : null,
    };
  });

  const seekerApps = [
    ['j1', 'Interview', 7],
    ['j12', 'Shortlisted', 9],
    ['j18', 'Under Review', 4],
    ['j22', 'Applied', 1],
    ['j19', 'Rejected', 14],
  ].map(([jobId, status, daysAgo], i) => {
    const appliedAt = ago(daysAgo);
    return {
      id: `app-s${i + 1}`,
      jobId,
      userId: seeker.id,
      candidate: seekerSnapshot(seeker),
      coverLetter: 'I would love to bring my React and UI engineering experience to your team.',
      resume: { name: 'Alex_Morgan_Resume.pdf', size: 204800 },
      appliedAt,
      status,
      history: historyFor(status, appliedAt),
      interview:
        status === 'Interview'
          ? { date: new Date(now + 2 * DAY).toISOString().slice(0, 10), time: '11:00', mode: 'Video call', location: 'Zoom — link in calendar invite', notes: 'Pairing session with two frontend engineers (60 min).' }
          : null,
    };
  });

  const n = (id, userId, type, title, message, link, read, hoursAgo) => ({
    id,
    userId,
    type,
    title,
    message,
    link,
    read,
    createdAt: new Date(now - hoursAgo * 3600 * 1000).toISOString(),
  });

  const notifications = [
    n('n1', 'u-seeker', 'interview', 'Interview invitation', 'Nimbus Labs invited you to interview for Senior Frontend Engineer.', '/dashboard/applications', false, 2),
    n('n2', 'u-seeker', 'status', 'Application shortlisted', 'Your application for Full Stack Developer at Ledgerly was shortlisted.', '/dashboard/applications', false, 20),
    n('n3', 'u-seeker', 'recommendation', 'New jobs match your profile', '3 new React roles were posted that match your skills.', '/dashboard/recommended-jobs', false, 30),
    n('n4', 'u-seeker', 'message', 'Message from Ledgerly', '"Thanks for applying, Alex! We\'d love to learn more about your design system work."', '/dashboard/applications', true, 50),
    n('n5', 'u-seeker', 'profile_view', 'Your profile was viewed', 'A recruiter from Quantix Analytics viewed your profile.', '/dashboard/profile', true, 72),
    n('n6', 'u-seeker', 'status', 'Application update', 'Your application for Product Designer at PixelForge Studio was not selected.', '/dashboard/applications', true, 120),
    n('n7', 'u-recruiter', 'application', 'New application received', 'Alex Morgan applied for Senior Frontend Engineer.', '/recruiter/applicants?job=j1', false, 4),
    n('n8', 'u-recruiter', 'application', 'New application received', 'Hannah Lee applied for Backend Engineer (Node.js).', '/recruiter/applicants?job=j2', false, 30),
    n('n9', 'u-recruiter', 'interview', 'Upcoming interview', 'Interview with David Kim for DevOps Engineer is in 3 days.', '/recruiter/applicants?job=j3', true, 60),
  ];

  return {
    companies,
    jobs,
    users: demoUsers,
    applications: [...seekerApps, ...candidateApps],
    notifications,
  };
}
