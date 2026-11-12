// Demo accounts seeded into LocalStorage on first load.
// These are demo-only credentials for exploring the app (never use real passwords here).
export const DEMO_PASSWORD = 'Demo@1234';

export const demoUsers = [
  {
    id: 'u-seeker',
    role: 'seeker',
    name: 'Alex Morgan',
    email: 'seeker@hireflow.demo',
    password: DEMO_PASSWORD,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    headline: 'Frontend Developer · React & UI Engineering',
    phone: '+1 415 555 0199',
    location: 'San Francisco, CA',
    about:
      'Frontend developer with 4 years of experience building responsive web apps. I care about clean UI, accessibility and fast, delightful user experiences. Currently looking for a product-focused team.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Figma', 'Jest'],
    experience: [
      { id: 'exp1', title: 'Frontend Developer', company: 'Brightwave Digital', location: 'San Francisco, CA', start: '2023-03', end: '', current: true, description: 'Lead developer on a customer analytics dashboard used by 40k users. Introduced a shared component library and visual regression tests.' },
      { id: 'exp2', title: 'Junior Web Developer', company: 'Pinecone Agency', location: 'Oakland, CA', start: '2021-06', end: '2023-02', current: false, description: 'Built marketing sites and e-commerce storefronts for 20+ clients using React and headless CMSs.' },
    ],
    education: [
      { id: 'edu1', school: 'San José State University', degree: 'B.S.', field: 'Computer Science', start: '2017', end: '2021' },
    ],
    socials: { linkedin: 'https://www.linkedin.com/in/alex-morgan-demo', github: 'https://github.com/alex-morgan-demo', portfolio: 'https://alexmorgan.example', twitter: '' },
    resume: null,
    profileViews: 128,
    settings: { emailAlerts: true, jobRecommendations: true, applicationUpdates: true, marketing: false, profileVisible: true },
    createdAt: '2026-01-14T10:00:00.000Z',
  },
  {
    id: 'u-recruiter',
    role: 'recruiter',
    name: 'Jordan Lee',
    email: 'recruiter@hireflow.demo',
    password: DEMO_PASSWORD,
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    headline: 'Senior Technical Recruiter at Nimbus Labs',
    phone: '+1 415 555 0123',
    location: 'San Francisco, CA',
    about: 'Hiring engineers, designers and go-to-market talent for Nimbus Labs.',
    companyId: 'c1',
    skills: [],
    experience: [],
    education: [],
    socials: { linkedin: '', github: '', portfolio: '', twitter: '' },
    resume: null,
    profileViews: 0,
    settings: { emailAlerts: true, jobRecommendations: false, applicationUpdates: true, marketing: false, profileVisible: true },
    createdAt: '2025-11-02T10:00:00.000Z',
  },
];
