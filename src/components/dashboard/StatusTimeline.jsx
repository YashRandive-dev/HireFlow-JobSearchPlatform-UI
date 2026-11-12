import { Check, X } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

const FLOW = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

export default function StatusTimeline({ application }) {
  const rejected = application.status === 'Rejected';
  const reachedIdx = rejected ? -1 : FLOW.indexOf(application.status);
  const dateOf = (s) => application.history?.findLast?.((h) => h.status === s)?.date || application.history?.filter((h) => h.status === s).pop()?.date;
  const steps = rejected ? [...application.history.map((h) => h.status).filter((s, i, a) => a.indexOf(s) === i)] : FLOW;

  return (
    <ol className="relative space-y-5">
      {steps.map((s, i) => {
        const done = rejected ? true : i <= reachedIdx;
        const isRejectStep = s === 'Rejected';
        return (
          <li key={s} className="relative flex gap-3">
            {i < steps.length - 1 && <span className={cn('absolute left-[13px] top-7 h-[calc(100%-4px)] w-0.5', done && (rejected || i < reachedIdx) ? 'bg-primary-200' : 'bg-slate-200')} />}
            <span
              className={cn(
                'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white',
                isRejectStep ? 'bg-red-500' : done ? 'bg-primary-600' : 'border-2 border-slate-200 bg-white'
              )}
            >
              {isRejectStep ? <X className="h-4 w-4" /> : done && <Check className="h-4 w-4" />}
            </span>
            <div>
              <p className={cn('text-sm font-semibold', done ? 'text-slate-900' : 'text-slate-400')}>{s}</p>
              {done && dateOf(s) && <p className="text-xs text-slate-500">{formatDate(dateOf(s))}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
