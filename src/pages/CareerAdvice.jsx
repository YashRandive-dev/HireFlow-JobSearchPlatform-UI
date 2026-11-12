import { useMemo, useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { articles } from '../data/content';
import { formatDate } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../utils/cn';

const COLORS = ['from-indigo-500 to-violet-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-sky-500 to-indigo-500', 'from-pink-500 to-rose-500', 'from-slate-700 to-slate-500'];

export default function CareerAdvice() {
  useDocumentTitle('Career Advice');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(null);
  const categories = ['All', ...new Set(articles.map((a) => a.category))];
  const list = useMemo(() => (category === 'All' ? articles : articles.filter((a) => a.category === category)), [category]);
  const [featured, ...rest] = list;

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-12 text-center">
          <p className="eyebrow">Career advice</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Grow your career with expert guidance</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">Practical advice on resumes, interviews, negotiation and career growth from recruiters and hiring managers.</p>
          <div className="no-scrollbar mt-6 flex justify-start gap-2 overflow-x-auto sm:justify-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn('whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition', category === c ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        {featured && (
          <button onClick={() => setOpen(featured)} className="card card-hover grid w-full overflow-hidden text-left md:grid-cols-2">
            <div className={cn('flex min-h-[200px] items-center justify-center bg-gradient-to-br', COLORS[articles.indexOf(featured) % COLORS.length])}>
              <BookOpen className="h-16 w-16 text-white/80" />
            </div>
            <div className="p-6 sm:p-8">
              <Badge tone="primary">{featured.category}</Badge>
              <h2 className="mt-3 text-2xl font-bold">{featured.title}</h2>
              <p className="mt-3 text-slate-500">{featured.excerpt}</p>
              <p className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                <Clock className="h-4 w-4" /> {featured.readTime} min read · {formatDate(featured.date)}
              </p>
            </div>
          </button>
        )}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <motion.button key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setOpen(a)} className="card card-hover flex flex-col overflow-hidden text-left">
              <div className={cn('flex h-32 items-center justify-center bg-gradient-to-br', COLORS[articles.indexOf(a) % COLORS.length])}>
                <BookOpen className="h-10 w-10 text-white/80" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Badge tone="primary" className="w-fit">{a.category}</Badge>
                <h3 className="mt-3 font-semibold leading-snug">{a.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">{a.excerpt}</p>
                <p className="mt-4 text-xs text-slate-400">
                  {a.readTime} min read · {formatDate(a.date)}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} size="lg" title={open?.title} description={open ? `${open.category} · ${open.readTime} min read` : ''}>
        {open && (
          <article className="space-y-4 text-[15px] leading-relaxed text-slate-600">
            {open.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <div className="flex justify-end pt-2">
              <Button to="/jobs" onClick={() => setOpen(null)}>
                Put it into practice — browse jobs
              </Button>
            </div>
          </article>
        )}
      </Modal>
    </div>
  );
}
