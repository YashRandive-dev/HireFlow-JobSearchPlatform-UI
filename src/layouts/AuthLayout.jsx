import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CheckCircle2, Star } from 'lucide-react';
import Logo from '../components/common/Logo';
import PageLoader from '../components/common/PageLoader';
import Avatar from '../components/common/Avatar';
import { testimonials } from '../data/content';

export default function AuthLayout() {
  const t = testimonials[1];
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400">© {new Date().getFullYear()} HireFlow. Demo application.</p>
      </div>
      <div className="relative hidden overflow-hidden bg-primary-700 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.5),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.35),transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative flex h-full flex-col justify-center p-14 text-white">
          <h2 className="max-w-md font-display text-4xl font-bold leading-tight text-white">Your next career move starts here.</h2>
          <ul className="mt-8 space-y-3 text-primary-100">
            {['12,000+ verified jobs from top companies', 'One profile, one-click applications', 'Real-time application tracking'].map((s) => (
              <li key={s} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent-400" /> {s}
              </li>
            ))}
          </ul>
          <figure className="mt-12 max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <blockquote className="mt-3 text-[15px] leading-relaxed text-white/90">“{t.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar src={t.avatar} name={t.name} size="sm" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-primary-200">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
