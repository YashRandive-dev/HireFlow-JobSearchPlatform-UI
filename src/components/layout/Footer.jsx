import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import Logo from '../common/Logo';

const columns = [
  { title: 'For job seekers', links: [['Find jobs', '/jobs'], ['Companies', '/companies'], ['Career advice', '/career-advice'], ['Saved jobs', '/dashboard/saved-jobs']] },
  { title: 'For employers', links: [['Post a job', '/recruiter/jobs/create'], ['Recruiter dashboard', '/recruiter/dashboard'], ['Manage applicants', '/recruiter/applicants']] },
  { title: 'Company', links: [['About us', '/about'], ['Contact', '/contact'], ['Privacy policy', '/privacy'], ['Terms & conditions', '/terms']] },
];

const socials = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { icon: Twitter, label: 'X / Twitter', href: 'https://x.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com' },
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            HireFlow connects ambitious people with companies that are building the future. Search verified jobs, track your applications and hire faster.
          </p>
          <a href="mailto:hello@hireflow.example" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600">
            <Mail className="h-4 w-4" /> hello@hireflow.example
          </a>
          <div className="mt-6 flex gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-slate-500 transition hover:text-primary-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} HireFlow, Inc. All rights reserved.</p>
          <p>Demo application — all companies and data are fictional.</p>
        </div>
      </div>
    </footer>
  );
}
