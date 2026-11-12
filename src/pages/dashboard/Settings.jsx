import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Database, Lock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import PasswordInput from '../../components/forms/PasswordInput';
import Toggle from '../../components/forms/Toggle';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { validatePassword } from '../../utils/validators';
import { resetDemoData } from '../../services/api';

function Card({ icon: Icon, title, description, children, danger }) {
  return (
    <section className={`card p-5 sm:p-6 ${danger ? 'border-red-200' : ''}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${danger ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Settings() {
  useDocumentTitle('Settings');
  const { user, updateProfile, changePassword, deleteAccount, isRecruiter } = useAuth();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const settings = user.settings || {};

  const toggle = async (key, value) => {
    await updateProfile({ settings: { ...settings, [key]: value } });
    toast.success('Preferences updated');
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.current) errs.current = 'Enter your current password';
    const v = validatePassword(pw.next);
    if (v) errs.next = v;
    else if (pw.next === pw.current) errs.next = 'New password must be different';
    if (pw.confirm !== pw.next) errs.confirm = 'Passwords do not match';
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      toast.success('Password updated');
    } catch (err) {
      setPwErrors({ current: err.message });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = await confirm({ title: 'Delete your account?', message: 'Your profile, saved jobs and notifications will be permanently deleted. This cannot be undone.', confirmText: 'Delete account' });
    if (!ok) return;
    await deleteAccount();
    toast.success('Your account has been deleted');
    navigate('/');
  };

  const onReset = async () => {
    const ok = await confirm({ title: 'Reset all demo data?', message: 'Restores the original jobs, companies, users and applications and signs you out.', confirmText: 'Reset data' });
    if (!ok) return;
    resetDemoData();
    window.location.assign('/');
  };

  const setField = (k) => (e) => {
    setPw((p) => ({ ...p, [k]: e.target.value }));
    setPwErrors((er) => ({ ...er, [k]: '' }));
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" description="Manage your account security and preferences." />
      <div className="space-y-6">
        <Card icon={Bell} title="Notifications" description="Choose what we notify you about.">
          <div className="divide-y divide-slate-100">
            <Toggle label="Email alerts" description="Receive important updates by email." checked={!!settings.emailAlerts} onChange={(v) => toggle('emailAlerts', v)} />
            <Toggle label="Application updates" description={isRecruiter ? 'Notify me when candidates apply.' : 'Notify me when an application status changes.'} checked={!!settings.applicationUpdates} onChange={(v) => toggle('applicationUpdates', v)} />
            {!isRecruiter && <Toggle label="Job recommendations" description="Weekly roles that match your profile." checked={!!settings.jobRecommendations} onChange={(v) => toggle('jobRecommendations', v)} />}
            {!isRecruiter && <Toggle label="Profile visible to recruiters" description="Let recruiters discover your profile." checked={!!settings.profileVisible} onChange={(v) => toggle('profileVisible', v)} />}
            <Toggle label="Product news & tips" description="Occasional updates about HireFlow." checked={!!settings.marketing} onChange={(v) => toggle('marketing', v)} />
          </div>
        </Card>

        <Card icon={Lock} title="Change password" description="Use at least 8 characters with letters and numbers.">
          <form onSubmit={submitPassword} className="grid gap-4 sm:grid-cols-2" noValidate>
            <PasswordInput label="Current password" className="sm:col-span-2" value={pw.current} onChange={setField('current')} error={pwErrors.current} autoComplete="current-password" />
            <PasswordInput label="New password" showStrength value={pw.next} onChange={setField('next')} error={pwErrors.next} autoComplete="new-password" />
            <PasswordInput label="Confirm new password" value={pw.confirm} onChange={setField('confirm')} error={pwErrors.confirm} autoComplete="new-password" />
            <div className="sm:col-span-2">
              <Button type="submit" loading={saving}>
                Update password
              </Button>
            </div>
          </form>
        </Card>

        <Card icon={Database} title="Demo data" description="All data in this demo lives in your browser's LocalStorage.">
          <Button variant="secondary" onClick={onReset}>
            Reset demo data
          </Button>
        </Card>

        <Card icon={ShieldAlert} title="Danger zone" description="Permanently delete your account and all associated data." danger>
          <Button variant="danger" onClick={onDelete}>
            Delete account
          </Button>
        </Card>
      </div>
    </div>
  );
}
