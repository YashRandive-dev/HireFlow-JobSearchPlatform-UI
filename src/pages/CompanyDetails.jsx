import { useParams } from 'react-router-dom';
import { Briefcase, Building2, Calendar, ExternalLink, Gift, Globe, Heart, MapPin, SearchX, Star, Users } from 'lucide-react';
import CompanyLogo from '../components/common/CompanyLogo';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { DetailsSkeleton } from '../components/common/LoadingSkeleton';
import JobCard from '../components/jobs/JobCard';
import { useData } from '../context/DataContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { pluralize } from '../utils/format';

export default function CompanyDetails() {
  const { id } = useParams();
  const { getCompany, jobsForCompany, loading } = useData();
  const company = getCompany(id);
  const jobs = company ? jobsForCompany(company.id) : [];
  useDocumentTitle(company?.name || 'Company');

  if (loading) return <DetailsSkeleton />;
  if (!company) {
    return (
      <div className="container-page py-16">
        <EmptyState icon={SearchX} title="Company not found" description="We couldn't find this company." action={<Button to="/companies">Browse companies</Button>} />
      </div>
    );
  }

  const [from, to] = company.banner || ['#4f46e5', '#818cf8'];
  const facts = [
    { icon: Building2, label: 'Industry', value: company.industry },
    { icon: Users, label: 'Company size', value: `${company.size} employees` },
    { icon: MapPin, label: 'Headquarters', value: company.headquarters || company.location },
    { icon: Calendar, label: 'Founded', value: company.founded },
  ];

  return (
    <div>
      <div className="h-44 sm:h-56" style={{ background: `linear-gradient(120deg, ${from}, ${to})` }}>
        <div className="h-full w-full opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>
      <div className="container-page">
        <div className="card -mt-16 p-5 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <CompanyLogo company={company} size="2xl" className="-mt-16 ring-4 ring-white sm:-mt-20" />
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
                <p className="mt-1 text-slate-500">{company.tagline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {company.location}
                  </span>
                  {company.rating > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {company.rating.toFixed(1)} rating
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 font-semibold text-accent-600">
                    <Briefcase className="h-4 w-4" /> {pluralize(jobs.length, 'open position')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {company.website && (
                <Button href={company.website} target="_blank" rel="noreferrer" variant="secondary" leftIcon={Globe} rightIcon={ExternalLink}>
                  Website
                </Button>
              )}
              <Button href="#open-positions">See open jobs</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-6">
            <section className="card p-5 sm:p-7">
              <h2 className="text-lg font-bold">About {company.name}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{company.about}</p>
            </section>

            {company.culture?.length > 0 && (
              <section className="card p-5 sm:p-7">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Heart className="h-5 w-5 text-pink-500" /> Culture & values
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {company.culture.map((c) => (
                    <div key={c.title} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <h3 className="text-sm font-semibold">{c.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-500">{c.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section id="open-positions" className="scroll-mt-24">
              <h2 className="mb-4 text-lg font-bold">Open positions ({jobs.length})</h2>
              {jobs.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {jobs.map((j) => (
                    <JobCard key={j.id} job={j} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Briefcase} title="No open positions right now" description="Check back soon — new roles are posted regularly." />
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="card p-5 lg:sticky lg:top-24">
              <h3 className="font-semibold">Company overview</h3>
              <dl className="mt-4 space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="text-sm font-medium text-slate-800">{value}</dd>
                    </div>
                  </div>
                ))}
                {company.website && (
                  <div className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Globe className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-500">Website</dt>
                      <dd className="truncate text-sm font-medium">
                        <a href={company.website} target="_blank" rel="noreferrer" className="link">
                          {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
              {company.benefits?.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold">Benefits</h3>
                  <ul className="mt-3 space-y-2">
                    {company.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                        <Gift className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" /> {b}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
