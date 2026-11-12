import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, UserSearch } from 'lucide-react';
import { toast } from 'sonner';
import Input from '../components/forms/Input';
import PasswordInput from '../components/forms/PasswordInput';
import Checkbox from '../components/forms/Checkbox';
import GoogleButton from '../components/forms/GoogleButton';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { isEmail } from '../utils/validators';
import { DEMO_PASSWORD, demoUsers } from '../data/users';

export default function Login() {
  useDocumentTitle('Log in');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    setErrors((er) => ({ ...er, [k]: '', form: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email) next.email = 'Email is required';
    else if (!isEmail(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password, form.remember);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const fallback = user.role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const u = demoUsers.find((d) => d.role === role);
    setForm((f) => ({ ...f, email: u.email, password: DEMO_PASSWORD }));
    setErrors({});
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-slate-500">Log in to continue your job search or manage your hiring.</p>

      <div className="mt-6 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-3">
        <p className="text-xs font-semibold text-primary-800">Try a demo account</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" leftIcon={UserSearch} onClick={() => fillDemo('seeker')}>
            Job seeker
          </Button>
          <Button variant="secondary" size="sm" leftIcon={Briefcase} onClick={() => fillDemo('recruiter')}>
            Recruiter
          </Button>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {errors.form && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{errors.form}</div>}
        <Input label="Email" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          placeholder="Enter your password"
          labelRight={
            <Link to="/forgot-password" className="link mb-1.5 text-xs">
              Forgot password?
            </Link>
          }
        />
        <Checkbox label="Remember me" checked={form.remember} onChange={set('remember')} />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Log in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleButton />

      <p className="mt-8 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" state={location.state} className="link">
          Create one free
        </Link>
      </p>
    </div>
  );
}
