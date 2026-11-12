import { useState } from 'react';
import { Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Textarea from '../../components/forms/Textarea';
import Button from '../../components/common/Button';
import { contactApi } from '../../services/api';
import { isEmail } from '../../utils/validators';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const empty = { name: '', email: '', topic: 'General question', message: '' };

export default function Contact() {
  useDocumentTitle('Contact');
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name';
    if (!isEmail(form.email)) next.email = 'Enter a valid email';
    if (form.message.trim().length < 10) next.message = 'Message should be at least 10 characters';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    await contactApi.send(form);
    setLoading(false);
    setForm(empty);
    toast.success('Message sent!', { description: 'Our team will reply within 1–2 business days.' });
  };

  return (
    <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Get in touch</h1>
        <p className="mt-3 text-slate-500">Questions about your account, hiring on HireFlow or partnerships? We&apos;d love to hear from you.</p>
        <ul className="mt-8 space-y-5">
          {[
            [Mail, 'Email', 'hello@hireflow.example'],
            [Phone, 'Phone', '+1 (555) 010-2030'],
            [MapPin, 'Office', '500 Market Street, San Francisco, CA'],
          ].map(([Icon, label, value]) => (
            <li key={label} className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="font-medium text-slate-800">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" icon={User} value={form.name} onChange={set('name')} error={errors.name} required />
          <Input label="Email" icon={Mail} type="email" value={form.email} onChange={set('email')} error={errors.email} required />
        </div>
        <Select label="Topic" icon={MessageSquare} value={form.topic} onChange={set('topic')} options={['General question', 'Account & billing', 'Hiring on HireFlow', 'Partnerships', 'Report a problem']} />
        <Textarea label="Message" rows={6} maxLength={1000} value={form.message} onChange={set('message')} error={errors.message} required />
        <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
          Send message
        </Button>
      </form>
    </div>
  );
}
