import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { profileCompletion } from '../../utils/profile';

export default function ProfileCompletion({ user }) {
  const { percent, missing } = profileCompletion(user);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r={r} stroke="#e2e8f0" strokeWidth="8" fill="none" />
            <circle cx="40" cy="40" r={r} stroke={percent >= 80 ? '#10b981' : '#4f46e5'} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * percent) / 100} className="transition-all duration-700" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-slate-900">{percent}%</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold">Profile strength</h3>
          <p className="mt-0.5 text-sm text-slate-500">{percent === 100 ? 'Your profile is complete — great job!' : 'Complete profiles get up to 3× more recruiter views.'}</p>
        </div>
      </div>
      {missing.length > 0 && (
        <>
          <ul className="mt-4 space-y-1.5">
            {missing.slice(0, 3).map((m) => (
              <li key={m} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Add {m.toLowerCase()}
              </li>
            ))}
          </ul>
          <Link to="/dashboard/profile" className="link mt-4 inline-flex items-center gap-1 text-sm">
            Complete profile <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </div>
  );
}
