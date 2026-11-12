import { Heart, ShieldCheck, Target, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import { platformStats } from '../../data/content';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const values = [
  { icon: Target, title: 'Our mission', text: 'Make finding meaningful work faster, fairer and more transparent for everyone.' },
  { icon: ShieldCheck, title: 'Trust & safety', text: 'Every employer is verified and every listing includes a salary range.' },
  { icon: Users, title: 'Built for both sides', text: 'Tools that respect candidates’ time and help recruiters hire with confidence.' },
  { icon: Heart, title: 'People first', text: 'We measure success by the careers we help launch, not by clicks.' },
];

export default function About() {
  useDocumentTitle('About us');
  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-16 text-center">
          <p className="eyebrow">About HireFlow</p>
          <h1 className="mx-auto mt-2 max-w-3xl text-3xl font-bold sm:text-5xl">We help people do the best work of their lives</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">HireFlow started with a simple idea: job searching shouldn’t feel like a full-time job. Today we connect thousands of candidates with companies building the future.</p>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-6">
            {platformStats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-primary-600">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <div key={v.title} className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <v.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{v.title}</h3>
            <p className="mt-1.5 text-sm text-slate-500">{v.text}</p>
          </div>
        ))}
      </section>
      <section className="container-page pb-16 text-center">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <div className="mt-6 flex justify-center gap-2">
          <Button to="/jobs">Find jobs</Button>
          <Button to="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </section>
    </div>
  );
}
