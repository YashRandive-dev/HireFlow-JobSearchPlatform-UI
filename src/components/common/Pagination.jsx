import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

function pagesToShow(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page, page - 1, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push('…' + p);
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null;
  const btn = 'inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition';
  return (
    <nav className={cn('flex items-center justify-center gap-1.5', className)} aria-label="Pagination">
      <button className={cn(btn, 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40')} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pagesToShow(page, totalPages).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(btn, p === page ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100')}
          >
            {p}
          </button>
        )
      )}
      <button className={cn(btn, 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40')} onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
