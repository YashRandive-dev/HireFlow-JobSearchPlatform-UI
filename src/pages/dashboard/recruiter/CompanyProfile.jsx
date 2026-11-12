import { useEffect, useRef, useState } from 'react';
import { Building2, Calendar, ExternalLink, Globe, ImagePlus, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import CompanyLogo from '../../../components/common/CompanyLogo';
import PageLoader from '../../../components/common/PageLoader';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Textarea from '../../../components/forms/Textarea';
import TagInput from '../../../components/forms/TagInput';
import { useRecruiterData } from './useRecruiterData';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { COMPANY_SIZES } from '../../../data/constants';
import { isUrl } from '../../../utils/validators';
import { readFileAsDataUrl } from '../../../utils/download';

const BRAND_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#0f172a'];

export default function CompanyProfile() {
  useDocumentTitle('Company Profile');
  const { company, updateCompany, loading } = useRecruiterData();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (company && !form) setForm({ ...company, culture: company.culture || [], benefits: company.benefits || [] });
  }, [company, form]);

  if (loading || !form) return <PageLoader />;

  const set = (k) => (e) => {
    const v = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const setCulture = (i, key, value) => setForm((f) => ({ ...f, culture: f.culture.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)) }));

  const onLogo = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image');
    if (file.size > 1024 * 1024) return toast.error('Logo must be under 1MB');
    const logoUrl = await readFileAsDataUrl(file);
    setForm((f) => ({ ...f, logoUrl }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Company name is required';
    if (!form.industry.trim()) er.industry = 'Industry is required';
    if (!form.location.trim()) er.location = 'Location is required';
    if (form.website && !isUrl(form.website)) er.website = 'Enter a full URL starting with https://';
    if (form.about.trim().length < 30) er.about = 'Write at least 30 characters about your company';
    const yr = Number(form.founded);
    if (form.founded && (yr < 1800 || yr > new Date().getFullYear())) er.founded = 'Enter a valid year';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    const initials = form.name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    await updateCompany(company.id, {
      ...form,
      name: form.name.trim(),
      founded: form.founded ? Number(form.founded) : '',
      logo: { ...form.logo, text: form.logo?.text || initials },
      culture: form.culture.filter((c) => c.title.trim()),
    });
    setSaving(false);
    toast.success('Company profile saved');
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-5xl">
      <PageHeader
        title="Company Profile"
        description="This information appears on your public company page and job posts."
        actions={
          <>
            <Button to={`/companies/${company.id}`} variant="secondary" rightIcon={ExternalLink} target="_blank">View public page</Button>
            <Button type="submit" loading={saving}>Save changes</Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold">Company details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Company name" required icon={Building2} value={form.name} onChange={set('name')} error={errors.name} />
              <Input label="Industry" required value={form.industry} onChange={set('industry')} error={errors.industry} />
              <Input label="Tagline" className="sm:col-span-2" maxLength={90} value={form.tagline} onChange={set('tagline')} />
              <Select label="Company size" icon={Users} value={form.size} onChange={set('size')} options={COMPANY_SIZES.map((s) => ({ value: s, label: `${s} employees` }))} />
              <Input label="Founded" type="number" icon={Calendar} value={form.founded} onChange={set('founded')} error={errors.founded} />
              <Input label="Location" required icon={MapPin} value={form.location} onChange={set('location')} error={errors.location} />
              <Input label="Headquarters" value={form.headquarters} onChange={set('headquarters')} />
              <Input label="Website" icon={Globe} className="sm:col-span-2" value={form.website} onChange={set('website')} error={errors.website} placeholder="https://" />
              <Textarea label="About the company" required className="sm:col-span-2" rows={5} maxLength={1500} value={form.about} onChange={set('about')} error={errors.about} />
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Culture & values</h2>
              <Button variant="soft" size="sm" leftIcon={Plus} onClick={() => setForm((f) => ({ ...f, culture: [...f.culture, { title: '', description: '' }] }))} disabled={form.culture.length >= 6}>
                Add value
              </Button>
            </div>
            <div className="mt-5 space-y-4">
              {form.culture.length === 0 && <p className="text-sm text-slate-400">Describe what makes your workplace unique.</p>}
              {form.culture.map((c, i) => (
                <div key={i} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <Input placeholder="Title (e.g. Remote-friendly)" value={c.title} onChange={(e) => setCulture(i, 'title', e.target.value)} aria-label="Culture title" />
                    <Textarea rows={2} placeholder="Short description" value={c.description} onChange={(e) => setCulture(i, 'description', e.target.value)} aria-label="Culture description" />
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => setForm((f) => ({ ...f, culture: f.culture.filter((_, idx) => idx !== i) }))} aria-label="Remove value">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold">Benefits</h2>
            <div className="mt-5">
              <TagInput label="Benefits & perks" value={form.benefits} onChange={set('benefits')} suggestions={['Health insurance', 'Remote work', 'Equity', '401(k) match', 'Learning budget', 'Flexible PTO']} hint="Shown on your company page and new job posts." />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="text-base font-semibold">Logo & brand</h2>
            <div className="mt-4 flex items-center gap-4">
              <CompanyLogo company={form} size="xl" />
              <div className="space-y-2">
                <Button variant="secondary" size="sm" leftIcon={ImagePlus} onClick={() => fileRef.current?.click()}>Upload logo</Button>
                {form.logoUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setForm((f) => ({ ...f, logoUrl: '' }))}>Remove</Button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ''; }} />
            </div>
            <p className="mt-5 text-sm font-medium text-slate-700">Brand color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, logo: { ...f.logo, bg: c }, banner: [c, f.banner?.[1] || c] }))}
                  className={`h-8 w-8 rounded-full ring-offset-2 transition ${form.logo?.bg === c ? 'ring-2 ring-slate-900' : ''}`}
                  style={{ background: c }}
                  aria-label={`Use color ${c}`}
                />
              ))}
            </div>
            <Input className="mt-4" label="Logo initials" maxLength={3} value={form.logo?.text || ''} onChange={(e) => setForm((f) => ({ ...f, logo: { ...f.logo, text: e.target.value.toUpperCase() } }))} />
          </section>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="h-20" style={{ background: `linear-gradient(120deg, ${form.banner?.[0] || '#4f46e5'}, ${form.banner?.[1] || '#818cf8'})` }} />
            <div className="bg-white p-4">
              <p className="text-xs text-slate-500">Banner preview</p>
              <p className="font-semibold text-slate-900">{form.name}</p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
