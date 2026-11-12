import { Bookmark } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils/cn';

export function useSaveJob() {
  const { user, isRecruiter } = useAuth();
  const { toggleSave, isSaved } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  return {
    isSaved,
    toggle(job) {
      if (!user) {
        toast('Log in to save jobs', { description: 'Create a free account to bookmark roles.' });
        navigate('/login', { state: { from: location.pathname + location.search } });
        return;
      }
      if (isRecruiter) {
        toast.info('Saving jobs is available for job seeker accounts.');
        return;
      }
      const saved = toggleSave(job.id);
      if (saved) toast.success('Job saved', { description: job.title });
      else toast('Removed from saved jobs');
    },
  };
}

export default function SaveJobButton({ job, variant = 'icon', className }) {
  const { isSaved, toggle } = useSaveJob();
  const saved = isSaved(job.id);

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={() => toggle(job)}
        className={cn(
          'inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition active:scale-[0.98]',
          saved ? 'border-primary-200 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
          className
        )}
        aria-pressed={saved}
      >
        <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
        {saved ? 'Saved' : 'Save job'}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(job);
      }}
      className={cn(
        'rounded-xl p-2 transition',
        saved ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
        className
      )}
      aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
      aria-pressed={saved}
    >
      <Bookmark className={cn('h-5 w-5', saved && 'fill-current')} />
    </motion.button>
  );
}
