import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, DollarSign, GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import CompanyLogo from '../common/CompanyLogo';
import Badge from '../common/Badge';
import Button from '../common/Button';
import SaveJobButton from './SaveJobButton';
import ApplyButton from './ApplyButton';
import { useData } from '../../context/DataContext';
import { formatSalary, pluralize, timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';

const typeTone = { 'Full-time': 'primary', 'Part-time': 'amber', Internship: 'violet', Contract: 'sky' };

function Meta({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="truncate">{children}</span>
    </span>
  );
}

function JobCard({ job, view = 'grid', action = 'details', showDescription = false, match, className }) {
  const { getCompany } = useData();
  const company = getCompany(job.companyId);
  const isList = view === 'list';
  const isNew = Date.now() - new Date(job.postedAt) < 2 * 864e5;

  return (
    <motion.article layout="position" className={cn('card card-hover group relative flex flex-col p-5', className)}>
      <div className="flex items-start gap-4">
        <Link to={`/companies/${company?.id}`} className="shrink-0" aria-label={company?.name}>
          <CompanyLogo company={company} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/jobs/${job.id}`} className="font-display text-[17px] font-bold leading-snug text-slate-900 transition hover:text-primary-600">
              {job.title}
            </Link>
            {isNew && <Badge tone="accent">New</Badge>}
            {job.featured && !isNew && <Badge tone="amber">Featured</Badge>}
          </div>
          <Link to={`/companies/${company?.id}`} className="mt-0.5 inline-block text-sm font-medium text-slate-500 hover:text-primary-600">
            {company?.name}
          </Link>
        </div>
        <SaveJobButton job={job} className="-mr-2 -mt-1" />
      </div>

      <div className={cn('mt-4 grid gap-x-4 gap-y-2', isList ? 'sm:grid-cols-4' : 'grid-cols-2')}>
        <Meta icon={MapPin}>{job.location}</Meta>
        <Meta icon={DollarSign}>{formatSalary(job.salaryMin, job.salaryMax)}</Meta>
        <Meta icon={GraduationCap}>{job.experience}</Meta>
        <Meta icon={Clock}>{timeAgo(job.postedAt)}</Meta>
      </div>

      {(showDescription || isList) && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{job.description}</p>}

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge tone={typeTone[job.type] || 'gray'} icon={Briefcase}>
          {job.type}
        </Badge>
        <Badge tone={job.workMode === 'Remote' ? 'accent' : 'outline'}>{job.workMode}</Badge>
        {match != null && <Badge tone="accent">{match}% match</Badge>}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-xs text-slate-400">{pluralize(job.applicants, 'applicant')}</span>
        <div className="flex gap-2">
          {action === 'apply' ? (
            <>
              <Button to={`/jobs/${job.id}`} variant="ghost" size="sm" className="hidden sm:inline-flex">
                Details
              </Button>
              <ApplyButton job={job} size="sm" />
            </>
          ) : (
            <Button to={`/jobs/${job.id}`} variant="secondary" size="sm">
              View Details
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default memo(JobCard);
