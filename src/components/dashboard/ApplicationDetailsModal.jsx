import { CalendarClock, FileText, MapPin, Video } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import CompanyLogo from '../common/CompanyLogo';
import StatusBadge from '../common/StatusBadge';
import StatusTimeline from './StatusTimeline';
import { formatDate, formatSalary, formatTime } from '../../utils/format';

export default function ApplicationDetailsModal({ application, job, company, open, onClose, onWithdraw }) {
  if (!application) return null;
  const canWithdraw = !['Rejected', 'Selected'].includes(application.status);
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Application details"
      footer={
        <>
          {canWithdraw && onWithdraw && (
            <Button variant="danger-soft" onClick={onWithdraw}>
              Withdraw application
            </Button>
          )}
          {job && (
            <Button to={`/jobs/${job.id}`} variant="secondary">
              View job posting
            </Button>
          )}
        </>
      }
    >
      <div className="flex items-start gap-4">
        <CompanyLogo company={company} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold">{job?.title || 'Job removed'}</h3>
          <p className="text-sm text-slate-500">
            {company?.name} {job && `· ${job.location} · ${formatSalary(job.salaryMin, job.salaryMax)}`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={application.status} />
            <span className="text-xs text-slate-500">Applied {formatDate(application.appliedAt)}</span>
          </div>
        </div>
      </div>

      {application.interview && application.status === 'Interview' && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 font-semibold text-amber-900">
            <CalendarClock className="h-5 w-5" /> Interview scheduled
          </p>
          <div className="mt-2 grid gap-1.5 text-sm text-amber-900/80 sm:grid-cols-2">
            <span>
              📅 {formatDate(application.interview.date, { weekday: 'long', month: 'long', day: 'numeric' })} at {formatTime(application.interview.time)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {application.interview.mode === 'Video call' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />} {application.interview.mode}
            </span>
            {application.interview.location && <span className="sm:col-span-2">{application.interview.location}</span>}
            {application.interview.notes && <span className="sm:col-span-2 italic">“{application.interview.notes}”</span>}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-900">Progress</h4>
          <StatusTimeline application={application} />
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-900">Submitted resume</h4>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <FileText className="h-5 w-5 text-red-500" />
              <span className="truncate text-sm">{application.resume?.name || 'No resume'}</span>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-900">Cover letter</h4>
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{application.coverLetter || 'No cover letter submitted.'}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
