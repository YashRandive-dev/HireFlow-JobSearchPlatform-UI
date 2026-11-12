import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../common/Modal';
import Button from '../common/Button';
import CompanyLogo from '../common/CompanyLogo';
import Input from '../forms/Input';
import Textarea from '../forms/Textarea';
import FileDrop from '../forms/FileDrop';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatFileSize } from '../../utils/format';
import { isPhone } from '../../utils/validators';
import { readFileAsDataUrl } from '../../utils/download';

export default function ApplyModal({ job, open, onClose }) {
  const { user, updateProfile } = useAuth();
  const { applyToJob, getCompany } = useData();
  const company = getCompany(job?.companyId);
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open && user) {
      setPhone(user.phone || '');
      setResume(user.resume || null);
      setCoverLetter('');
      setErrors({});
      setDone(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = async (file) => {
    try {
      const dataUrl = file.size < 2.5 * 1024 * 1024 ? await readFileAsDataUrl(file) : null;
      const r = { name: file.name, size: file.size, type: file.type, dataUrl, uploadedAt: new Date().toISOString() };
      setResume(r);
      setErrors((e) => ({ ...e, resume: '' }));
      if (!user.resume) updateProfile({ resume: r }).catch(() => {});
    } catch {
      toast.error('Could not read that file.');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!phone.trim()) next.phone = 'Phone number is required';
    else if (!isPhone(phone)) next.phone = 'Enter a valid phone number';
    if (!resume) next.resume = 'Please attach your resume';
    if (coverLetter.length > 0 && coverLetter.trim().length < 30) next.coverLetter = 'Write at least 30 characters, or leave it empty';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await applyToJob(job, { coverLetter: coverLetter.trim(), phone, resume });
      setDone(true);
      toast.success('Application submitted!', { description: `${job.title} at ${company?.name}` });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job || !user) return null;

  return (
    <Modal open={open} onClose={onClose} size="lg" title={done ? undefined : 'Apply for this job'} hideClose={false}>
      {done ? (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-xl font-bold">Application sent!</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            {company?.name} will review your application for <span className="font-medium text-slate-700">{job.title}</span>. You can track its status from your dashboard.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="secondary" onClick={onClose}>
              Keep browsing
            </Button>
            <Button to="/dashboard/applications">Track application</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <CompanyLogo company={company} size="md" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{job.title}</p>
              <p className="truncate text-sm text-slate-500">
                {company?.name} · {job.location}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" icon={User} value={user.name} disabled />
            <Input label="Email" icon={Mail} value={user.email} disabled />
            <Input label="Phone" icon={Phone} required value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="+1 555 000 0000" className="sm:col-span-2" />
          </div>
          <div>
            <p className="label">
              Resume <span className="text-red-500">*</span>
            </p>
            {resume ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{resume.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(resume.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setResume(null)}>
                  Replace
                </Button>
              </div>
            ) : (
              <FileDrop compact onFile={onFile} onError={(m) => setErrors((e) => ({ ...e, resume: m }))} />
            )}
            {errors.resume && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.resume}</p>}
          </div>
          <Textarea
            label="Cover letter (optional)"
            rows={5}
            maxLength={1500}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            error={errors.coverLetter}
            placeholder={`Tell ${company?.name} why you're a great fit…`}
          />
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Submit application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
