import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';
import { StatSkeleton } from '../common/LoadingSkeleton';

const tones = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  sky: 'bg-sky-50 text-sky-600',
  red: 'bg-red-50 text-red-600',
};

export function StatCard({ icon: Icon, label, value, tone = 'primary', hint, index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card p-5">
      <div className="flex items-start justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {hint && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
            <TrendingUp className="h-3 w-3" /> {hint}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </motion.div>
  );
}

export default function DashboardStats({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {loading ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />) : stats.map((s, i) => <StatCard key={s.label} index={i} {...s} />)}
    </div>
  );
}
