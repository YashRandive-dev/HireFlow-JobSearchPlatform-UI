import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../common/Button';
import ApplyModal from './ApplyModal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function ApplyButton({ job, size = 'md', className, label = 'Apply Now', showIcon }) {
  const { user, isRecruiter } = useAuth();
  const { hasApplied } = useData();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const applied = user && hasApplied(job.id);

  const onClick = () => {
    if (!user) {
      toast('Log in to apply', { description: 'Sign in or create an account to submit your application.' });
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    if (isRecruiter) {
      toast.info('Switch to a job seeker account to apply for jobs.');
      return;
    }
    if (job.status !== 'active') {
      toast.error('This job is no longer accepting applications.');
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {applied ? (
        <Button variant="soft" size={size} className={className} leftIcon={CheckCircle2} to="/dashboard/applications">
          Applied
        </Button>
      ) : (
        <Button size={size} className={className} onClick={onClick} leftIcon={showIcon ? Send : undefined}>
          {label}
        </Button>
      )}
      {user && <ApplyModal job={job} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
