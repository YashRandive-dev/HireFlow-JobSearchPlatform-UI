import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../forms/Input';
import Select from '../forms/Select';
import Textarea from '../forms/Textarea';

const today = () => new Date().toISOString().slice(0, 10);

export default function InterviewModal({ application, open, onClose, onSubmit }) {
  const [form, setForm] = useState({ date: '', time: '10:00', mode: 'Video call', location: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(application?.interview || { date: '', time: '10:00', mode: 'Video call', location: '', notes: '' });
      setErrors({});
    }
  }, [open, application]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.date) next.date = 'Pick a date';
    else if (form.date < today()) next.date = 'Date cannot be in the past';
    if (!form.time) next.time = 'Pick a time';
    if (!form.location.trim()) next.location = form.mode === 'On-site' ? 'Add an address' : 'Add a meeting link or phone number';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Schedule interview" description={application ? `With ${application.candidate.name}` : ''}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input type="date" label="Date" required min={today()} value={form.date} onChange={set('date')} error={errors.date} />
          <Input type="time" label="Time" required value={form.time} onChange={set('time')} error={errors.time} />
        </div>
        <Select label="Interview type" value={form.mode} onChange={set('mode')} options={['Video call', 'Phone call', 'On-site']} />
        <Input
          label={form.mode === 'On-site' ? 'Address' : form.mode === 'Phone call' ? 'Phone number' : 'Meeting link'}
          required
          value={form.location}
          onChange={set('location')}
          error={errors.location}
          placeholder={form.mode === 'On-site' ? '500 Market St, San Francisco' : form.mode === 'Phone call' ? '+1 555 000 0000' : 'https://meet.example.com/abc'}
        />
        <Textarea label="Notes for the candidate" rows={3} value={form.notes} onChange={set('notes')} placeholder="Who they'll meet, what to prepare…" />
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Send invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
