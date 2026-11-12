import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, MailCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Input from '../components/forms/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { isEmail } from '../utils/validators';

export default function ForgotPassword() {
  useDocumentTitle('Reset password');
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError('Enter a valid email address');
    setError('');
    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Check your inbox</h1>
          <p className="mt-2 text-slate-500">
            If an account exists for <span className="font-semibold text-slate-800">{email}</span>, you&apos;ll receive a password reset link within a few minutes.
          </p>
          <Button to="/login" size="lg" className="mt-8 w-full">
            Back to log in
          </Button>
          <button onClick={() => setSent(false)} className="mt-4 text-sm text-slate-500 hover:text-slate-800">
            Didn&apos;t get it? <span className="link">Try another email</span>
          </button>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Forgot password?</h1>
          <p className="mt-2 text-slate-500">No worries — enter the email you signed up with and we&apos;ll send you a reset link.</p>
          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <Input label="Email" type="email" icon={Mail} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} error={error} placeholder="you@example.com" autoFocus />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Send reset link
            </Button>
          </form>
          <Link to="/login" className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" /> Back to log in
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
