import { useState } from 'react';
import { CalendarPlus, Download, FileText, GraduationCap, Mail, MapPin, Phone, Star, X as XIcon, Briefcase } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import { buildResumeText, downloadDataUrl, downloadText } from '../../utils/download';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

export function downloadResume(app) {
  if (app.resume?.dataUrl) return downloadDataUrl(app.resume.dataUrl, app.resume.name);
  const name = (app.resume?.name || `${app.candidate.name}_Resume`).replace(/\.(pdf|docx?)$/i, '');
  downloadText(buildResumeText(app.candidate), `${name}.txt`);
}

/** Resume rendered from candidate data (stands in for a PDF viewer in the demo). */
export function ResumePreview({ candidate }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 font-serif text-[13px] leading-relaxed text-slate-700 shadow-inner">
      <h3 className="font-display text-xl font-bold text-slate-900">{candidate.name}</h3>
      <p className="text-slate-500">{candidate.headline}</p>
      <p className="mt-1 text-xs text-slate-400">{[candidate.email, candidate.phone, candidate.location].filter(Boolean).join(' · ')}</p>
      <hr className="my-4 border-slate-200" />
      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary-600">Summary</h4>
      <p className="mt-1">{candidate.summary || '—'}</p>
      <h4 className="mt-4 font-sans text-xs font-bold uppercase tracking-wider text-primary-600">Experience</h4>
      <p className="mt-1">{candidate.experienceYears}+ years of professional experience.</p>
      <h4 className="mt-4 font-sans text-xs font-bold uppercase tracking-wider text-primary-600">Skills</h4>
      <p className="mt-1">{candidate.skills?.join(' · ') || '—'}</p>
      <h4 className="mt-4 font-sans text-xs font-bold uppercase tracking-wider text-primary-600">Education</h4>
      <p className="mt-1">{candidate.education || '—'}</p>
    </div>
  );
}

export default function CandidateProfileModal({ application: app, job, open, onClose, onStatus, onSchedule }) {
  const [tab, setTab] = useState('profile');
  if (!app) return null;
  const c = app.candidate;
  const closed = ['Rejected', 'Selected'].includes(app.status);

  return (
    <Modal
      open={open}
      onClose={() => {
        setTab('profile');
        onClose();
      }}
      size="xl"
      footer={
        <>
          <Button variant="secondary" leftIcon={Download} onClick={() => downloadResume(app)}>
            Download resume
          </Button>
          {!closed && (
            <>
              <Button variant="danger-soft" leftIcon={XIcon} onClick={() => onStatus(app, 'Rejected')}>
                Reject
              </Button>
              {app.status !== 'Shortlisted' && app.status !== 'Interview' && (
                <Button variant="soft" leftIcon={Star} onClick={() => onStatus(app, 'Shortlisted')}>
                  Shortlist
                </Button>
              )}
              <Button leftIcon={CalendarPlus} onClick={() => onSchedule(app)}>
                {app.status === 'Interview' ? 'Reschedule' : 'Schedule interview'}
              </Button>
            </>
          )}
          {app.status === 'Interview' && (
            <Button variant="accent" onClick={() => onStatus(app, 'Selected')}>
              Mark selected
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar src={c.avatar} name={c.name} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">{c.name}</h2>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-slate-600">{c.headline}</p>
          <p className="mt-1 text-sm text-slate-500">
            Applied for <span className="font-medium text-slate-700">{job?.title}</span> · {formatDate(app.appliedAt)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {[
          ['profile', 'Profile'],
          ['resume', 'Resume preview'],
          ['letter', 'Cover letter'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn('flex-1 rounded-lg px-3 py-2 text-sm font-medium transition', tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800')}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'profile' && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" /> <a href={`mailto:${c.email}`} className="truncate hover:text-primary-600">{c.email}</a>
              </p>
              {c.phone && (
                <p className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" /> {c.phone}
                </p>
              )}
              {c.location && (
                <p className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" /> {c.location}
                </p>
              )}
              <p className="flex items-center gap-2 text-slate-600">
                <Briefcase className="h-4 w-4 text-slate-400" /> {c.experienceYears} years experience
              </p>
              {c.education && (
                <p className="flex items-start gap-2 text-slate-600">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> {c.education}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-slate-900">About</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.summary || 'No summary provided.'}</p>
              <h4 className="mt-5 text-sm font-semibold text-slate-900">Skills</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.skills?.map((s) => (
                  <span key={s} className={cn('rounded-lg px-2.5 py-1 text-xs font-medium', job?.skills?.includes(s) ? 'bg-accent-50 text-accent-700' : 'bg-slate-100 text-slate-600')}>
                    {s}
                  </span>
                ))}
              </div>
              {app.interview && app.status === 'Interview' && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Interview on <strong>{formatDate(app.interview.date)}</strong> at <strong>{app.interview.time}</strong> · {app.interview.mode}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'resume' && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" /> {app.resume?.name || 'Resume'}
            </div>
            {app.resume?.dataUrl && app.resume.dataUrl.startsWith('data:application/pdf') ? (
              <iframe title="Resume" src={app.resume.dataUrl} className="h-[480px] w-full rounded-xl border border-slate-200" />
            ) : (
              <ResumePreview candidate={c} />
            )}
          </div>
        )}
        {tab === 'letter' && <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">{app.coverLetter || 'No cover letter was submitted.'}</p>}
      </div>
    </Modal>
  );
}
