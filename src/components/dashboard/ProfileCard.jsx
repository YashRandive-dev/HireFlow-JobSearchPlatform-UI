import { Mail, MapPin, Phone, Pencil } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

export default function ProfileCard({ user, onEdit, onAvatarClick }) {
  return (
    <div className="card overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-primary-600 to-primary-400" />
      <div className="px-5 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <button type="button" onClick={onAvatarClick} className="group relative w-fit rounded-full" aria-label="Change profile picture">
            <Avatar src={user.avatar} name={user.name} size="2xl" ring />
            {onAvatarClick && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                Change photo
              </span>
            )}
          </button>
          {onEdit && (
            <Button variant="secondary" leftIcon={Pencil} onClick={onEdit}>
              Edit profile
            </Button>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
        <p className="mt-0.5 text-slate-600">{user.headline || 'Add a professional headline'}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-4 w-4" /> {user.email}
          </span>
          {user.phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4" /> {user.phone}
            </span>
          )}
          {user.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {user.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
