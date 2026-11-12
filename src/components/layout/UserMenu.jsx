import { Bell, Briefcase, LayoutDashboard, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Dropdown, { DropdownDivider, DropdownItem } from '../common/Dropdown';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu({ compact }) {
  const { user, logout, isRecruiter, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const base = isRecruiter ? '/recruiter' : '/dashboard';

  const onLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/');
  };

  return (
    <Dropdown
      label="Account menu"
      triggerClassName="flex items-center gap-2 rounded-full p-0.5 pr-1 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
      trigger={
        <>
          <Avatar src={user.avatar} name={user.name} size="sm" />
          {!compact && <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-700 xl:block">{user.name.split(' ')[0]}</span>}
        </>
      }
      width="w-64"
    >
      <div className="px-3 py-2.5">
        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
        <span className="mt-2 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold capitalize text-primary-700">{isRecruiter ? 'Recruiter' : 'Job seeker'}</span>
      </div>
      <DropdownDivider />
      <DropdownItem icon={LayoutDashboard} to={dashboardPath}>
        Dashboard
      </DropdownItem>
      {isRecruiter ? (
        <DropdownItem icon={Briefcase} to="/recruiter/jobs">
          Manage jobs
        </DropdownItem>
      ) : (
        <DropdownItem icon={User} to="/dashboard/profile">
          My profile
        </DropdownItem>
      )}
      <DropdownItem icon={Bell} to={`${base}/notifications`}>
        Notifications
      </DropdownItem>
      <DropdownItem icon={Settings} to={`${base}/settings`}>
        Settings
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem icon={LogOut} onClick={onLogout} danger>
        Log out
      </DropdownItem>
    </Dropdown>
  );
}
