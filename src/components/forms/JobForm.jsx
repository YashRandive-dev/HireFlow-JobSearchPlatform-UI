import { useState } from 'react';
import { Briefcase, Building2, CalendarDays, DollarSign, MapPin } from 'lucide-react';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import TagInput from './TagInput';
import Button from '../common/Button';
import { CATEGORIES, EXPERIENCE_LEVELS, JOB_TYPES, WORK_MODES } from '../../data/constants';

const SKILL_SUGGESTIONS = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Figma', 'Communication', 'Leadership'];

const toLines = (arr) => (arr || []).join('\n');
const fromLines = (text) =>
  text
    .split('\n')
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

export function emptyJob(companyName = '') {
  return {
    title: '',
    companyName,
    category: '',
    description: '',
    responsibilities: [],
    qualifications: [],
    skills: [],
    preferredSkills: [],
    experience: '',
    salaryMin: '',
    salaryMax: '',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: '',
    deadline: '',
  };
}

export default function JobForm({ initial, onSubmit, submitLabel = 'Publish job', onCancel }) {
  const [form, setForm] = useState({
    ...initial,
    responsibilitiesText: toLines(initial.responsibilities),
    qualificationsText: toLines(initial.qualifications),
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = 'Enter a job title (min. 3 characters)';
    if (!form.category) e.category = 'Choose a category';
    if (form.description.trim().length < 50) e.description = 'Description should be at least 50 characters';
    if (fromLines(form.responsibilitiesText).length < 1) e.responsibilitiesText = 'Add at least one responsibility';
    if (fromLines(form.qualificationsText).length < 1) e.qualificationsText = 'Add at least one qualification';
    if (form.skills.length < 1) e.skills = 'Add at least one skill';
    if (!form.experience) e.experience = 'Select an experience level';
    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);
    if (!min || min < 1000) e.salaryMin = 'Enter a valid minimum salary';
    if (!max || max < min) e.salaryMax = 'Max must be greater than min';
    if (!form.location.trim()) e.location = 'Enter a location (or “Remote”)';
    if (!form.deadline) e.deadline = 'Set an application deadline';
    else if (form.deadline < new Date().toISOString().slice(0, 10)) e.deadline = 'Deadline must be in the future';
    setErrors(e);
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      const first = document.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setSaving(true);
    try {
      const { responsibilitiesText, qualificationsText, companyName, ...rest } = form; // eslint-disable-line no-unused-vars
      await onSubmit({
        ...rest,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        responsibilities: fromLines(responsibilitiesText),
        qualifications: fromLines(qualificationsText),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <section className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Basic information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input label="Job title" required icon={Briefcase} value={form.title} onChange={set('title')} error={errors.title} placeholder="e.g. Senior Frontend Engineer" className="sm:col-span-2" />
          <Input label="Company name" icon={Building2} value={form.companyName} disabled hint="Linked to your company profile" />
          <Select label="Job category" required value={form.category} onChange={set('category')} error={errors.category} placeholder="Select category" options={CATEGORIES.map((c) => c.name)} />
          <Select label="Job type" required value={form.type} onChange={set('type')} options={JOB_TYPES} />
          <Select label="Work mode" required value={form.workMode} onChange={set('workMode')} options={WORK_MODES} />
          <Input label="Location" required icon={MapPin} value={form.location} onChange={set('location')} error={errors.location} placeholder="San Francisco, CA or Remote" />
          <Select label="Experience level" required value={form.experience} onChange={set('experience')} error={errors.experience} placeholder="Select level" options={EXPERIENCE_LEVELS} />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Job details</h2>
        <div className="mt-5 space-y-5">
          <Textarea label="Job description" required rows={5} maxLength={2000} value={form.description} onChange={set('description')} error={errors.description} placeholder="Describe the role, team and impact…" />
          <Textarea label="Responsibilities" required rows={5} value={form.responsibilitiesText} onChange={set('responsibilitiesText')} error={errors.responsibilitiesText} hint="One per line" placeholder={'Build new features\nReview code\n…'} />
          <Textarea label="Required qualifications" required rows={4} value={form.qualificationsText} onChange={set('qualificationsText')} error={errors.qualificationsText} hint="One per line" placeholder={'3+ years of experience\n…'} />
          <TagInput label="Skills required" required value={form.skills} onChange={(v) => { setForm((f) => ({ ...f, skills: v })); setErrors((er) => ({ ...er, skills: '' })); }} error={errors.skills} suggestions={SKILL_SUGGESTIONS} />
          <TagInput label="Preferred skills (optional)" value={form.preferredSkills} onChange={(v) => setForm((f) => ({ ...f, preferredSkills: v }))} />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Compensation & deadline</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Input label="Minimum salary (USD / yr)" required type="number" min="0" step="1000" icon={DollarSign} value={form.salaryMin} onChange={set('salaryMin')} error={errors.salaryMin} placeholder="90000" />
          <Input label="Maximum salary (USD / yr)" required type="number" min="0" step="1000" icon={DollarSign} value={form.salaryMax} onChange={set('salaryMax')} error={errors.salaryMax} placeholder="120000" />
          <Input label="Application deadline" required type="date" icon={CalendarDays} value={form.deadline} onChange={set('deadline')} error={errors.deadline} />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="lg" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
