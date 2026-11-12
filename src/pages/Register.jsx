import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Mail, User, UserSearch } from 'lucide-react';
import { toast } from 'sonner';
import Input from '../components/forms/Input';
import PasswordInput from '../components/forms/PasswordInput';
import Checkbox from '../components/forms/Checkbox';
import GoogleButton from '../components/forms/GoogleButton';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { isEmail, validatePassword } from '../utils/validators';
import { cn } from '../utils/cn';

const ROLES = [
  { id: 'seeker', title: 'Job Seeker', desc: 'Find and apply to jobs', icon: UserSearch },
  { id: 'recruiter', title: 'Recruiter', desc: 'Post jobs and hire', icon: Briefcase },
];

export default function Register() {
  useDocumentTitle('Create account');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'seeker', companyName: '', terms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((er) => ({ ...er, [k]: '', form: '' }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!isEmail(form.email)) e.email = 'Enter a valid email address';
    const pw = validatePassword(form.password);
    if (pw) e.password = pw;
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (form.role === 'recruiter' && form.companyName.trim().length < 2) e.companyName = 'Company name is required for recruiters';
    if (!form.terms) e.terms = 'You must accept the terms to continue';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created!', { description: `Welcome to HireFlow, ${user.name.split(' ')[0]}.` });
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-slate-500">Join thousands of professionals growing their careers.</p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {errors.form && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{errors.form}</div>}

        <fieldset>
          <legend className="label">I am a…</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => set('role')(r.id)}
                aria-pressed={form.role === r.id}
                className={cn('flex flex-col items-start rounded-xl border-2 p-3 text-left transition', form.role === r.id ? 'border-primary-600 bg-primary-50/60' : 'border-slate-200 hover:border-slate-300')}
              >
                <r.icon className={cn('h-5 w-5', form.role === r.id ? 'text-primary-600' : 'text-slate-400')} />
                <span className="mt-2 text-sm font-semibold text-slate-900">{r.title}</span>
                <span className="text-xs text-slate-500">{r.desc}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <Input label="Full name" icon={User} autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Jane Doe" />
        <Input label="Email" type="email" icon={Mail} autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
        {form.role === 'recruiter' && <Input label="Company name" icon={Building2} value={form.companyName} onChange={set('companyName')} error={errors.companyName} placeholder="Acme Inc." />}
        <PasswordInput label="Password" autoComplete="new-password" showStrength value={form.password} onChange={set('password')} error={errors.password} placeholder="At least 8 characters" />
        <PasswordInput label="Confirm password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="Re-enter password" />
        <Checkbox
          checked={form.terms}
          onChange={set('terms')}
          error={errors.terms}
          label={
            <>
              I agree to the{' '}
              <Link to="/terms" target="_blank" className="link">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" className="link">
                Privacy Policy
              </Link>
            </>
          }
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleButton label="Sign up with Google" />

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="link">
          Log in
        </Link>
      </p>
    </div>
  );
}
