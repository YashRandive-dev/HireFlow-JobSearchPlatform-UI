import Badge from './Badge';

const STATUS_TONES = {
  Applied: 'gray',
  'Under Review': 'sky',
  Shortlisted: 'violet',
  Interview: 'amber',
  Rejected: 'red',
  Selected: 'accent',
};

export const statusTone = (status) => STATUS_TONES[status] || 'gray';

export default function StatusBadge({ status, className }) {
  return (
    <Badge tone={statusTone(status)} dot className={className}>
      {status}
    </Badge>
  );
}
