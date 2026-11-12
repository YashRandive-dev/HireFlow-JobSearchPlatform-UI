import { useRef, useState } from 'react';
import { Briefcase, Github, Globe, GraduationCap, Linkedin, MapPin, Pencil, Phone, Plus, Trash2, Twitter, User } from 'lucide-react';
import { toast } from 'sonner';
import ProfileCard from '../../../components/dashboard/ProfileCard';
import ProfileCompletion from '../../../components/dashboard/ProfileCompletion';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import TagInput from '../../../components/forms/TagInput';
import Checkbox from '../../../components/forms/Checkbox';
import { useAuth } from '../../../context/AuthContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { formatMonth } from '../../../utils/format';
import { isEmail, isPhone, isUrl } from '../../../utils/validators';
import { readFileAsDataUrl } from '../../../utils/download';
import { uid } from '../../../utils/id';

function Section({ title, icon: Icon, action, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Icon className="h-5 w-5 text-slate-400" /> {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const SKILL_SUGGESTIONS = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'SQL', 'Figma', 'AWS', 'Git', 'Communication'];
const emptyExp = { title: '', company: '', location: '', start: '', end: '', current: false, description: '' };
const emptyEdu = { school: '', degree: '', field: '', start: '', end: '' };

export default function Profile() {
  useDocumentTitle('My Profile');
  const { user, updateProfile } = useAuth();
  const confirm = useConfirm();
  const fileRef = useRef(null);
  const [modal, setModal] = useState(null); // 'basic' | 'skills' | 'socials' | {type:'exp'|'edu', item}
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const open = (type, data) => {
    setErrors({});
    setModal(type);
    setForm(data);
  };
  const close = () => setModal(null);
  const set = (k) => (e) => {
    const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const save = async (patch, message = 'Profile updated') => {
    setSaving(true);
    try {
      await updateProfile(patch);
      toast.success(message);
      close();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const submitBasic = (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Name is required';
    if (!isEmail(form.email)) er.email = 'Enter a valid email';
    if (!isPhone(form.phone)) er.phone = 'Enter a valid phone number';
    if (form.headline.length > 100) er.headline = 'Keep it under 100 characters';
    setErrors(er);
    if (Object.keys(er).length) return;
    save({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), headline: form.headline.trim(), location: form.location.trim(), about: form.about.trim() });
  };

  const submitSocials = (e) => {
    e.preventDefault();
    const er = {};
    Object.entries(form).forEach(([k, v]) => {
      if (!isUrl(v)) er[k] = 'Enter a full URL starting with https://';
    });
    setErrors(er);
    if (Object.keys(er).length) return;
    save({ socials: form });
  };

  const submitExp = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.title.trim()) er.title = 'Job title is required';
    if (!form.company.trim()) er.company = 'Company is required';
    if (!form.start) er.start = 'Start date is required';
    if (!form.current && !form.end) er.end = 'End date is required (or tick “I currently work here”)';
    if (!form.current && form.end && form.start && form.end < form.start) er.end = 'End date must be after start date';
    setErrors(er);
    if (Object.keys(er).length) return;
    const item = { ...form, end: form.current ? '' : form.end, id: form.id || uid('exp') };
    const list = form.id ? user.experience.map((x) => (x.id === form.id ? item : x)) : [item, ...(user.experience || [])];
    save({ experience: list }, form.id ? 'Experience updated' : 'Experience added');
  };

  const submitEdu = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.school.trim()) er.school = 'School is required';
    if (!form.degree.trim()) er.degree = 'Degree is required';
    if (form.start && form.end && form.end < form.start) er.end = 'End year must be after start year';
    setErrors(er);
    if (Object.keys(er).length) return;
    const item = { ...form, id: form.id || uid('edu') };
    const list = form.id ? user.education.map((x) => (x.id === form.id ? item : x)) : [item, ...(user.education || [])];
    save({ education: list }, form.id ? 'Education updated' : 'Education added');
  };

  const removeItem = async (key, id, label) => {
    const ok = await confirm({ title: `Delete ${label}?`, message: 'This entry will be removed from your profile.', confirmText: 'Delete' });
    if (!ok) return;
    await updateProfile({ [key]: user[key].filter((x) => x.id !== id) });
    toast.success(`${label[0].toUpperCase() + label.slice(1)} deleted`);
  };

  const onAvatar = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
    if (file.size > 1.5 * 1024 * 1024) return toast.error('Image must be under 1.5MB');
    const dataUrl = await readFileAsDataUrl(file);
    await updateProfile({ avatar: dataUrl });
    toast.success('Profile photo updated');
  };

  const socials = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { key: 'github', label: 'GitHub', icon: Github },
    { key: 'portfolio', label: 'Portfolio', icon: Globe },
    { key: 'twitter', label: 'X / Twitter', icon: Twitter },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <ProfileCard
          user={user}
          onEdit={() => open('basic', { name: user.name, email: user.email, phone: user.phone || '', headline: user.headline || '', location: user.location || '', about: user.about || '' })}
          onAvatarClick={() => fileRef.current?.click()}
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onAvatar(e.target.files?.[0]); e.target.value = ''; }} />

        <Section title="About me" icon={User}>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600">{user.about || <span className="text-slate-400">Tell recruiters about yourself — click “Edit profile” to add a summary.</span>}</p>
        </Section>

        <Section title="Skills" icon={Briefcase} action={<Button variant="ghost" size="sm" leftIcon={Pencil} onClick={() => open('skills', { skills: user.skills || [] })}>Edit</Button>}>
          {user.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span key={s} className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No skills added yet.</p>
          )}
        </Section>

        <Section title="Work experience" icon={Briefcase} action={<Button variant="soft" size="sm" leftIcon={Plus} onClick={() => open('exp', emptyExp)}>Add</Button>}>
          {user.experience?.length ? (
            <ol className="space-y-5">
              {user.experience.map((x) => (
                <li key={x.id} className="group flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-display font-bold text-slate-500">{x.company[0]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{x.title}</p>
                        <p className="text-sm text-slate-600">
                          {x.company}
                          {x.location && ` · ${x.location}`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatMonth(x.start)} – {x.current ? 'Present' : formatMonth(x.end)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => open('exp', x)} aria-label="Edit experience">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeItem('experience', x.id, 'experience')} aria-label="Delete experience">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {x.description && <p className="mt-2 text-sm text-slate-600">{x.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">Add your work history to stand out.</p>
          )}
        </Section>

        <Section title="Education" icon={GraduationCap} action={<Button variant="soft" size="sm" leftIcon={Plus} onClick={() => open('edu', emptyEdu)}>Add</Button>}>
          {user.education?.length ? (
            <ul className="space-y-4">
              {user.education.map((x) => (
                <li key={x.id} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{x.school}</p>
                    <p className="text-sm text-slate-600">
                      {x.degree}
                      {x.field && `, ${x.field}`}
                    </p>
                    {(x.start || x.end) && (
                      <p className="text-xs text-slate-400">
                        {x.start} – {x.end || 'Present'}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => open('edu', x)} aria-label="Edit education">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => removeItem('education', x.id, 'education')} aria-label="Delete education">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Add your education.</p>
          )}
        </Section>
      </div>

      <div className="space-y-6">
        <ProfileCompletion user={user} />
        <Section title="Contact" icon={Phone}>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {user.phone || '—'}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {user.location || '—'}</li>
          </ul>
        </Section>
        <Section title="Social links" icon={Globe} action={<Button variant="ghost" size="sm" leftIcon={Pencil} onClick={() => open('socials', { linkedin: '', github: '', portfolio: '', twitter: '', ...user.socials })}>Edit</Button>}>
          <ul className="space-y-3">
            {socials.map(({ key, label, icon: Icon }) => (
              <li key={key} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                {user.socials?.[key] ? (
                  <a href={user.socials[key]} target="_blank" rel="noreferrer" className="link truncate">
                    {user.socials[key].replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                ) : (
                  <span className="text-slate-400">Add {label}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ---------- Modals ---------- */}
      <Modal open={modal === 'basic'} onClose={close} title="Edit profile" size="lg">
        <form onSubmit={submitBasic} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="Full name" required value={form.name || ''} onChange={set('name')} error={errors.name} />
          <Input label="Email" type="email" required value={form.email || ''} onChange={set('email')} error={errors.email} />
          <Input label="Professional headline" className="sm:col-span-2" value={form.headline || ''} onChange={set('headline')} error={errors.headline} placeholder="e.g. Frontend Developer · React & TypeScript" />
          <Input label="Phone" value={form.phone || ''} onChange={set('phone')} error={errors.phone} placeholder="+1 555 000 0000" />
          <Input label="Location" value={form.location || ''} onChange={set('location')} placeholder="City, State" />
          <Textarea label="About me" className="sm:col-span-2" rows={5} maxLength={1200} value={form.about || ''} onChange={set('about')} />
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={saving}>Save changes</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'skills'} onClose={close} title="Edit skills" description="Add up to 20 skills. These power your job recommendations.">
        <TagInput label="Skills" value={form.skills || []} onChange={set('skills')} suggestions={SKILL_SUGGESTIONS} />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button loading={saving} onClick={() => save({ skills: form.skills }, 'Skills updated')}>Save skills</Button>
        </div>
      </Modal>

      <Modal open={modal === 'socials'} onClose={close} title="Social links">
        <form onSubmit={submitSocials} className="space-y-4" noValidate>
          {socials.map(({ key, label, icon }) => (
            <Input key={key} label={label} icon={icon} value={form[key] || ''} onChange={set(key)} error={errors[key]} placeholder="https://" />
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={saving}>Save links</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'exp'} onClose={close} title={form.id ? 'Edit experience' : 'Add experience'} size="lg">
        <form onSubmit={submitExp} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="Job title" required value={form.title || ''} onChange={set('title')} error={errors.title} />
          <Input label="Company" required value={form.company || ''} onChange={set('company')} error={errors.company} />
          <Input label="Location" className="sm:col-span-2" value={form.location || ''} onChange={set('location')} />
          <Input label="Start date" type="month" required value={form.start || ''} onChange={set('start')} error={errors.start} />
          <Input label="End date" type="month" value={form.end || ''} onChange={set('end')} error={errors.end} disabled={form.current} />
          <Checkbox className="sm:col-span-2" label="I currently work here" checked={!!form.current} onChange={set('current')} />
          <Textarea label="Description" className="sm:col-span-2" rows={4} value={form.description || ''} onChange={set('description')} />
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'edu'} onClose={close} title={form.id ? 'Edit education' : 'Add education'}>
        <form onSubmit={submitEdu} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="School / University" required className="sm:col-span-2" value={form.school || ''} onChange={set('school')} error={errors.school} />
          <Input label="Degree" required value={form.degree || ''} onChange={set('degree')} error={errors.degree} placeholder="B.S." />
          <Input label="Field of study" value={form.field || ''} onChange={set('field')} placeholder="Computer Science" />
          <Input label="Start year" type="number" min="1950" max="2100" value={form.start || ''} onChange={set('start')} />
          <Input label="End year" type="number" min="1950" max="2100" value={form.end || ''} onChange={set('end')} error={errors.end} />
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
