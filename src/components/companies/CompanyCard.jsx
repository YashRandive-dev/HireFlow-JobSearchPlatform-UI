import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Star, Users } from 'lucide-react';
import CompanyLogo from '../common/CompanyLogo';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { pluralize } from '../../utils/format';

export default function CompanyCard({ company, openJobs = 0, compact }) {
  if (compact) {
    return (
      <Link to={`/companies/${company.id}`} className="card card-hover flex items-center gap-4 p-4">
        <CompanyLogo company={company} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">{company.name}</p>
          <p className="truncate text-sm text-slate-500">{company.industry}</p>
        </div>
        <Badge tone="accent">{pluralize(openJobs, 'job')}</Badge>
      </Link>
    );
  }
  return (
    <article className="card card-hover flex flex-col p-5">
      <div className="flex items-start gap-4">
        <CompanyLogo company={company} size="lg" />
        <div className="min-w-0 flex-1">
          <Link to={`/companies/${company.id}`} className="font-display text-lg font-bold text-slate-900 hover:text-primary-600">
            {company.name}
          </Link>
          <p className="text-sm text-slate-500">{company.industry}</p>
          {company.rating > 0 && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-600">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {company.rating.toFixed(1)}
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-slate-500">{company.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-slate-400" /> {company.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4 text-slate-400" /> {company.size}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
          <Briefcase className="h-4 w-4" /> {pluralize(openJobs, 'open job')}
        </span>
        <Button to={`/companies/${company.id}`} variant="secondary" size="sm">
          View Company
        </Button>
      </div>
    </article>
  );
}
