export const CATEGORIES = [
  { id: 'software-development', name: 'Software Development', icon: 'Code2', tone: 'indigo' },
  { id: 'ui-ux-design', name: 'UI/UX Design', icon: 'PenTool', tone: 'pink' },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone', tone: 'amber' },
  { id: 'data-science', name: 'Data Science', icon: 'BarChart3', tone: 'sky' },
  { id: 'finance', name: 'Finance', icon: 'Landmark', tone: 'emerald' },
  { id: 'human-resources', name: 'Human Resources', icon: 'Users', tone: 'violet' },
  { id: 'sales', name: 'Sales', icon: 'TrendingUp', tone: 'orange' },
  { id: 'customer-support', name: 'Customer Support', icon: 'Headphones', tone: 'teal' },
];

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
export const JOB_TYPE_FILTERS = [...JOB_TYPES, 'Remote'];
export const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];
export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Manager'];
export const EXPERIENCE_YEARS = {
  'Entry Level': '0–2 years',
  'Mid Level': '2–5 years',
  'Senior Level': '5–8 years',
  'Lead / Manager': '8+ years',
};

export const SALARY_RANGES = [
  { id: 'any', label: 'Any salary', min: 0, max: Infinity },
  { id: 'u50', label: 'Under $50k', min: 0, max: 50000 },
  { id: '50-100', label: '$50k – $100k', min: 50000, max: 100000 },
  { id: '100-150', label: '$100k – $150k', min: 100000, max: 150000 },
  { id: '150+', label: '$150k+', min: 150000, max: Infinity },
];

export const DATE_POSTED = [
  { id: 'any', label: 'Any time', days: null },
  { id: '1', label: 'Last 24 hours', days: 1 },
  { id: '3', label: 'Last 3 days', days: 3 },
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
];

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Most relevant' },
  { id: 'newest', label: 'Newest first' },
  { id: 'salary', label: 'Highest salary' },
];

export const APPLICATION_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];

export const POPULAR_SEARCHES = ['React Developer', 'Product Designer', 'Data Analyst', 'Remote', 'Marketing', 'Internship'];

export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

export const PAGE_SIZE = 8;
