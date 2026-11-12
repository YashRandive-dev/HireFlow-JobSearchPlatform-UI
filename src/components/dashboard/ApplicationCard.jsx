import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import CompanyLogo from '../common/CompanyLogo';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatDate } from '../../utils/format';

export default function ApplicationCard({ application, job, company, onView }) {
  return (
    <div className="card card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <CompanyLogo company={company} size="md" />
        <div className="min-w-0">
          {job ? (
            <Link to={`/jobs/${job.id}`} className="block truncate font-semibold text-slate-900 hover:text-primary-600">
              {job.title}
            </Link>
          ) : (
            <p className="truncate font-semibold text-slate-900">Job no longer available</p>
          )}
          <p className="truncate text-sm text-slate-500">{company?.name}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> Applied {formatDate(application.appliedAt)}
            </span>
            {job && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <StatusBadge status={application.status} />
        <Button variant="secondary" size="sm" onClick={onView}>
          View Details
        </Button>
      </div>
    </div>
  );
}
