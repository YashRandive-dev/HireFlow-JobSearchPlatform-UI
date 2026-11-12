import { CheckCircle2, Circle, Gift, Sparkles } from 'lucide-react';
import { EXPERIENCE_YEARS } from '../../data/constants';
import { formatSalary } from '../../utils/format';

function Block({ title, children }) {
  return (
    <section className="py-6 first:pt-0 last:pb-0">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function List({ items, icon: Icon = CheckCircle2, iconCls = 'text-accent-500' }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconCls}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Long-form description sections for a job posting. */
export default function JobDetails({ job, company }) {
  return (
    <div className="divide-y divide-slate-100">
      <Block title="About the company">
        <p>{company?.about}</p>
      </Block>
      <Block title="Job overview">
        <p className="whitespace-pre-line">{job.description}</p>
      </Block>
      {job.responsibilities?.length > 0 && (
        <Block title="Responsibilities">
          <List items={job.responsibilities} icon={Circle} iconCls="text-primary-400 h-2 w-2 mt-2 fill-current" />
        </Block>
      )}
      {job.qualifications?.length > 0 && (
        <Block title="Required qualifications">
          <List items={job.qualifications} />
        </Block>
      )}
      <Block title="Skills">
        <div className="flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <span key={s} className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
              {s}
            </span>
          ))}
        </div>
        {job.preferredSkills?.length > 0 && (
          <>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Sparkles className="h-4 w-4 text-amber-500" /> Preferred / nice to have
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.preferredSkills.map((s) => (
                <span key={s} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
      </Block>
      {job.benefits?.length > 0 && (
        <Block title="Benefits & perks">
          <div className="grid gap-3 sm:grid-cols-2">
            {job.benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                <Gift className="h-5 w-5 shrink-0 text-accent-600" />
                {b}
              </div>
            ))}
          </div>
        </Block>
      )}
      <Block title="Salary information">
        <div className="rounded-xl border border-accent-100 bg-accent-50/60 p-4">
          <p className="font-display text-2xl font-bold text-slate-900">
            {formatSalary(job.salaryMin, job.salaryMax)} <span className="text-sm font-medium text-slate-500">/ year</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Base salary for a {job.experience.toLowerCase()} candidate ({EXPERIENCE_YEARS[job.experience]} experience). Final offer depends on skills, experience and location. Equity and benefits are offered in addition.
          </p>
        </div>
      </Block>
    </div>
  );
}
