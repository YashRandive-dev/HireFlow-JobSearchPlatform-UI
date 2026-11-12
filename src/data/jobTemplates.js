// Role templates used to generate realistic mock job postings.
// `{company}` is replaced with the hiring company's name.
export const jobTemplates = {
  frontend: {
    title: 'Senior Frontend Engineer',
    category: 'Software Development',
    overview:
      'Join {company} to build fast, accessible interfaces used by thousands of customers every day. You will shape our component library, partner closely with design and product, and raise the bar for frontend quality across the team.',
    responsibilities: [
      'Build and maintain user-facing features in React and TypeScript',
      'Own the design system and shared component library',
      'Improve Core Web Vitals and overall application performance',
      'Review code and mentor engineers on frontend best practices',
      'Collaborate with designers to translate prototypes into polished UI',
    ],
    qualifications: [
      '5+ years of professional frontend development experience',
      'Deep knowledge of React, hooks and modern state management',
      'Strong TypeScript, HTML semantics and CSS fundamentals',
      'Experience with automated testing (Jest, Testing Library, Playwright)',
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Jest'],
    preferredSkills: ['GraphQL', 'Storybook', 'Web Performance', 'Accessibility'],
  },
  backend: {
    title: 'Backend Engineer (Node.js)',
    category: 'Software Development',
    overview:
      '{company} is looking for a backend engineer to design scalable services and APIs. You will work on high-throughput systems, data pipelines and integrations that power our core product.',
    responsibilities: [
      'Design, build and operate RESTful and event-driven services',
      'Model data and optimise queries in PostgreSQL',
      'Write well-tested, observable and secure code',
      'Participate in on-call rotation and incident reviews',
      'Contribute to architecture decisions and technical roadmaps',
    ],
    qualifications: [
      '3+ years building production backend systems',
      'Strong experience with Node.js or a similar runtime',
      'Solid understanding of relational databases and caching',
      'Familiarity with containerisation and cloud platforms',
    ],
    skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Docker', 'AWS'],
    preferredSkills: ['Kafka', 'Kubernetes', 'Go', 'Redis'],
  },
  fullstack: {
    title: 'Full Stack Developer',
    category: 'Software Development',
    overview:
      'As a Full Stack Developer at {company}, you will deliver features end to end — from database schema to pixel-perfect UI — in a small, high-ownership product team.',
    responsibilities: [
      'Ship full-stack features across React frontends and Node.js services',
      'Write clean APIs and integrate third-party services',
      'Collaborate with product managers on scoping and estimates',
      'Maintain CI pipelines and automated tests',
      'Monitor production and continuously improve reliability',
    ],
    qualifications: [
      '2+ years of full-stack web development experience',
      'Comfortable with JavaScript on both client and server',
      'Experience with SQL or NoSQL databases',
      'Good communication skills and product sense',
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Git'],
    preferredSkills: ['TypeScript', 'AWS', 'Docker'],
  },
  mobile: {
    title: 'Mobile Engineer (React Native)',
    category: 'Software Development',
    overview:
      '{company} is building a best-in-class mobile experience. You will lead development of our React Native app across iOS and Android, from offline support to smooth animations.',
    responsibilities: [
      'Develop new features for our iOS and Android apps',
      'Improve app performance, startup time and stability',
      'Integrate native modules when needed',
      'Work with QA to automate release testing',
      'Ship regular releases to the App Store and Google Play',
    ],
    qualifications: [
      '3+ years of mobile development experience',
      'Production experience with React Native',
      'Understanding of mobile UX patterns and platform guidelines',
      'Experience publishing apps to app stores',
    ],
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Redux'],
    preferredSkills: ['Swift', 'Kotlin', 'Reanimated'],
  },
  devops: {
    title: 'DevOps Engineer',
    category: 'Software Development',
    overview:
      'Help {company} run reliable, secure infrastructure at scale. You will automate everything from provisioning to deployments and champion a strong reliability culture.',
    responsibilities: [
      'Manage cloud infrastructure using Infrastructure as Code',
      'Build and maintain CI/CD pipelines',
      'Operate Kubernetes clusters and observability tooling',
      'Drive cost optimisation and security hardening',
      'Support engineering teams with tooling and documentation',
    ],
    qualifications: [
      '4+ years in DevOps, SRE or platform engineering',
      'Hands-on experience with AWS or GCP',
      'Strong Terraform and Kubernetes knowledge',
      'Scripting skills in Bash or Python',
    ],
    skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Linux'],
    preferredSkills: ['Prometheus', 'Datadog', 'Python'],
  },
  sweIntern: {
    title: 'Software Engineering Intern',
    category: 'Software Development',
    overview:
      'Spend 12 weeks at {company} shipping real features alongside experienced engineers. Our interns own meaningful projects and present their work to the whole company.',
    responsibilities: [
      'Build and ship a scoped project with mentor guidance',
      'Write tests and participate in code reviews',
      'Attend engineering design discussions',
      'Present your work at the end of the internship',
    ],
    qualifications: [
      'Currently pursuing a degree in Computer Science or related field',
      'Familiarity with at least one programming language',
      'Understanding of data structures and algorithms',
      'Eagerness to learn and ask questions',
    ],
    skills: ['JavaScript', 'Python', 'Git', 'Data Structures'],
    preferredSkills: ['React', 'SQL'],
  },
  productDesigner: {
    title: 'Product Designer',
    category: 'UI/UX Design',
    overview:
      '{company} is hiring a Product Designer to own end-to-end experiences — from discovery research to high-fidelity prototypes — and help evolve our design system.',
    responsibilities: [
      'Lead design for key product areas from concept to launch',
      'Run usability tests and synthesise insights',
      'Create wireframes, flows and interactive prototypes',
      'Contribute to and maintain the design system',
      'Partner with engineers to ensure quality implementation',
    ],
    qualifications: [
      '3+ years of product design experience',
      'A portfolio showing strong interaction and visual design',
      'Expertise in Figma and prototyping tools',
      'Experience working in agile product teams',
    ],
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Interaction Design'],
    preferredSkills: ['Framer', 'HTML/CSS', 'Motion Design'],
  },
  uxResearcher: {
    title: 'UX Researcher',
    category: 'UI/UX Design',
    overview:
      'Shape product strategy at {company} by uncovering what customers truly need. You will plan and run qualitative and quantitative studies that directly influence the roadmap.',
    responsibilities: [
      'Plan and conduct interviews, usability tests and surveys',
      'Synthesise findings into clear, actionable insights',
      'Build personas and journey maps',
      'Educate teams on research methods',
    ],
    qualifications: [
      '3+ years of UX research experience',
      'Mastery of qualitative and quantitative methods',
      'Excellent storytelling and presentation skills',
      'Background in HCI, psychology or related field',
    ],
    skills: ['User Research', 'Usability Testing', 'Surveys', 'Journey Mapping'],
    preferredSkills: ['Dovetail', 'SQL', 'Statistics'],
  },
  uiDesigner: {
    title: 'UI Designer',
    category: 'UI/UX Design',
    overview:
      '{company} needs a detail-obsessed UI Designer to craft beautiful, consistent interfaces for web and mobile, working closely with our product and brand teams.',
    responsibilities: [
      'Design high-fidelity screens and visual components',
      'Maintain icon sets, illustrations and UI kits',
      'Ensure visual consistency across platforms',
      'Prepare design specs and assets for developers',
    ],
    qualifications: [
      '2+ years of UI or visual design experience',
      'Strong portfolio of web and mobile interfaces',
      'Excellent typography, colour and layout skills',
      'Proficiency in Figma',
    ],
    skills: ['Figma', 'Visual Design', 'Typography', 'UI Kits'],
    preferredSkills: ['Illustration', 'After Effects'],
  },
  growthMarketer: {
    title: 'Growth Marketing Manager',
    category: 'Marketing',
    overview:
      'Drive acquisition and activation at {company}. You will own paid and organic channels, run rapid experiments and build a data-driven growth engine.',
    responsibilities: [
      'Plan and optimise paid campaigns across search and social',
      'Own SEO strategy and landing page experiments',
      'Build lifecycle email programmes',
      'Report on funnel metrics and CAC/LTV',
      'Collaborate with product on activation experiments',
    ],
    qualifications: [
      '4+ years in growth or performance marketing',
      'Track record of scaling acquisition channels',
      'Strong analytical skills and comfort with data tools',
      'Experience with marketing automation platforms',
    ],
    skills: ['SEO', 'Google Ads', 'HubSpot', 'Google Analytics', 'A/B Testing'],
    preferredSkills: ['SQL', 'Webflow', 'Copywriting'],
  },
  contentMarketer: {
    title: 'Content Marketing Specialist',
    category: 'Marketing',
    overview:
      'Tell the {company} story. You will create blog posts, guides, case studies and newsletters that educate our audience and grow organic traffic.',
    responsibilities: [
      'Write and edit long-form content and case studies',
      'Manage the editorial calendar',
      'Optimise content for SEO',
      'Interview customers and internal experts',
    ],
    qualifications: [
      '2+ years in content marketing or journalism',
      'Excellent writing and editing skills',
      'Understanding of SEO fundamentals',
      'Portfolio of published work',
    ],
    skills: ['Copywriting', 'SEO', 'Content Strategy', 'WordPress'],
    preferredSkills: ['Video Editing', 'Canva'],
  },
  socialMedia: {
    title: 'Social Media Coordinator',
    category: 'Marketing',
    overview:
      'Grow the {company} community across social platforms. You will create engaging content, manage our channels and report on what resonates.',
    responsibilities: [
      'Create and schedule posts across social channels',
      'Engage with our online community',
      'Track performance and share weekly reports',
      'Support campaign launches and events',
    ],
    qualifications: [
      'Experience managing brand social accounts',
      'Creative eye and strong writing skills',
      'Familiarity with social scheduling tools',
    ],
    skills: ['Social Media', 'Canva', 'Copywriting', 'Analytics'],
    preferredSkills: ['Video Editing', 'TikTok'],
  },
  dataScientist: {
    title: 'Data Scientist',
    category: 'Data Science',
    overview:
      '{company} is looking for a Data Scientist to build predictive models and answer critical business questions with data. You will work across product, marketing and operations.',
    responsibilities: [
      'Build, validate and deploy machine learning models',
      'Design and analyse experiments',
      'Translate complex findings into clear recommendations',
      'Partner with engineering to productionise models',
      'Develop dashboards and self-serve analytics',
    ],
    qualifications: [
      '3+ years of experience in data science or analytics',
      'Strong Python and SQL skills',
      'Solid grasp of statistics and machine learning',
      'Experience communicating with non-technical stakeholders',
    ],
    skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Scikit-learn'],
    preferredSkills: ['Spark', 'dbt', 'Causal Inference'],
  },
  dataAnalyst: {
    title: 'Data Analyst',
    category: 'Data Science',
    overview:
      'Help {company} make smarter decisions. You will own key reports, dig into trends and become the go-to partner for data questions across the business.',
    responsibilities: [
      'Build and maintain dashboards and KPI reports',
      'Write SQL to explore and model data',
      'Conduct ad-hoc analyses for business teams',
      'Ensure data quality and documentation',
    ],
    qualifications: [
      '1+ years of analytics experience',
      'Strong SQL and spreadsheet skills',
      'Experience with BI tools like Tableau or Looker',
      'Curious mindset and attention to detail',
    ],
    skills: ['SQL', 'Tableau', 'Excel', 'Python'],
    preferredSkills: ['Looker', 'dbt'],
  },
  mlEngineer: {
    title: 'Machine Learning Engineer',
    category: 'Data Science',
    overview:
      'Build the ML platform that powers {company}. You will train, deploy and monitor models at scale and help researchers move faster from notebook to production.',
    responsibilities: [
      'Design and maintain model training and serving pipelines',
      'Optimise inference latency and cost',
      'Implement model monitoring and retraining',
      'Collaborate with researchers on new architectures',
    ],
    qualifications: [
      '4+ years in ML engineering or backend engineering',
      'Expertise with PyTorch or TensorFlow',
      'Experience with MLOps tooling',
      'Strong software engineering fundamentals',
    ],
    skills: ['Python', 'PyTorch', 'MLOps', 'Docker', 'AWS'],
    preferredSkills: ['Kubernetes', 'Ray', 'LLMs'],
  },
  financialAnalyst: {
    title: 'Financial Analyst',
    category: 'Finance',
    overview:
      'Join the {company} finance team to drive planning, forecasting and strategic analysis. You will partner with leadership on budgets and investment decisions.',
    responsibilities: [
      'Build and maintain financial models and forecasts',
      'Prepare monthly variance analysis and reporting',
      'Support annual budgeting and long-range planning',
      'Analyse unit economics and pricing',
    ],
    qualifications: [
      "Bachelor's degree in Finance, Accounting or Economics",
      '2+ years in FP&A, banking or consulting',
      'Advanced Excel and financial modelling skills',
      'Strong attention to detail',
    ],
    skills: ['Excel', 'Financial Modeling', 'FP&A', 'Forecasting'],
    preferredSkills: ['SQL', 'Power BI', 'CFA'],
  },
  accountant: {
    title: 'Senior Accountant',
    category: 'Finance',
    overview:
      '{company} is seeking a Senior Accountant to own month-end close, reconciliations and audit readiness as we scale our finance operations.',
    responsibilities: [
      'Lead month-end and year-end close processes',
      'Prepare journal entries and reconciliations',
      'Support external audits and tax filings',
      'Improve accounting processes and controls',
    ],
    qualifications: [
      'CPA or progress toward certification',
      '4+ years of accounting experience',
      'Strong knowledge of US GAAP',
      'Experience with ERP systems such as NetSuite',
    ],
    skills: ['GAAP', 'NetSuite', 'Reconciliation', 'Excel'],
    preferredSkills: ['Revenue Recognition', 'SOX'],
  },
  investmentAnalyst: {
    title: 'Investment Analyst',
    category: 'Finance',
    overview:
      'Work on investment research and portfolio analysis at {company}, supporting senior managers with insights across equities and fixed income.',
    responsibilities: [
      'Research companies, industries and market trends',
      'Build valuation models and investment memos',
      'Monitor portfolio performance and risk',
      'Present findings to the investment committee',
    ],
    qualifications: [
      "Bachelor's in Finance, Economics or a quantitative field",
      '1–3 years of investment or research experience',
      'Strong valuation and modelling skills',
    ],
    skills: ['Valuation', 'Excel', 'Equity Research', 'Bloomberg'],
    preferredSkills: ['Python', 'CFA Level I'],
  },
  hrGeneralist: {
    title: 'HR Generalist',
    category: 'Human Resources',
    overview:
      'Be a trusted partner to employees and managers at {company}. You will support the full employee lifecycle, from onboarding to development and employee relations.',
    responsibilities: [
      'Manage onboarding and offboarding processes',
      'Advise managers on policies and employee relations',
      'Administer benefits and HR systems',
      'Support performance review cycles',
    ],
    qualifications: [
      '3+ years of HR generalist experience',
      'Working knowledge of employment law',
      'Excellent interpersonal and communication skills',
    ],
    skills: ['Employee Relations', 'Onboarding', 'HRIS', 'Benefits'],
    preferredSkills: ['SHRM-CP', 'Workday'],
  },
  recruiter: {
    title: 'Talent Acquisition Specialist',
    category: 'Human Resources',
    overview:
      'Help {company} hire exceptional people. You will run full-cycle recruiting for technical and business roles and create a great candidate experience.',
    responsibilities: [
      'Partner with hiring managers to define role requirements',
      'Source and engage passive candidates',
      'Coordinate interviews and manage offers',
      'Improve recruiting processes and employer brand',
    ],
    qualifications: [
      '2+ years of full-cycle recruiting experience',
      'Experience with applicant tracking systems',
      'Strong sourcing skills on LinkedIn and beyond',
    ],
    skills: ['Sourcing', 'Interviewing', 'ATS', 'Employer Branding'],
    preferredSkills: ['Greenhouse', 'Technical Recruiting'],
  },
  peopleOps: {
    title: 'People Operations Manager',
    category: 'Human Resources',
    overview:
      '{company} is looking for a People Operations Manager to design scalable people programmes — compensation, performance and engagement — for a growing team.',
    responsibilities: [
      'Own compensation bands and review cycles',
      'Design performance and career frameworks',
      'Run engagement surveys and action plans',
      'Lead a small team of people partners',
    ],
    qualifications: [
      '6+ years in people operations or HR business partnering',
      'Experience in a high-growth company',
      'Data-driven approach to people programmes',
    ],
    skills: ['Compensation', 'Performance Management', 'People Analytics', 'Leadership'],
    preferredSkills: ['Culture Amp', 'Lattice'],
  },
  accountExecutive: {
    title: 'Account Executive',
    category: 'Sales',
    overview:
      'Grow revenue at {company} by closing new business with mid-market customers. You will run full sales cycles and build long-term relationships with buyers.',
    responsibilities: [
      'Manage the full sales cycle from discovery to close',
      'Deliver compelling product demos',
      'Forecast accurately and maintain pipeline in CRM',
      'Collaborate with SDRs and customer success',
    ],
    qualifications: [
      '3+ years of B2B SaaS closing experience',
      'Consistent track record of exceeding quota',
      'Excellent negotiation and presentation skills',
    ],
    skills: ['B2B Sales', 'Salesforce', 'Negotiation', 'Pipeline Management'],
    preferredSkills: ['MEDDICC', 'Gong'],
  },
  sdr: {
    title: 'Sales Development Representative',
    category: 'Sales',
    overview:
      'Kick-start your sales career at {company}. You will generate qualified pipeline through outbound outreach and be the first voice prospects hear.',
    responsibilities: [
      'Prospect and engage potential customers by email, phone and LinkedIn',
      'Qualify inbound leads',
      'Book meetings for Account Executives',
      'Track activity in the CRM',
    ],
    qualifications: [
      '0–2 years of sales or customer-facing experience',
      'Resilient, coachable and goal-oriented',
      'Clear written and verbal communication',
    ],
    skills: ['Cold Outreach', 'CRM', 'Communication', 'Lead Qualification'],
    preferredSkills: ['Outreach.io', 'HubSpot'],
  },
  salesManager: {
    title: 'Regional Sales Manager',
    category: 'Sales',
    overview:
      'Lead a high-performing sales team at {company}. You will coach reps, own regional targets and help shape our go-to-market strategy.',
    responsibilities: [
      'Hire, coach and develop a team of account executives',
      'Own regional revenue targets and forecasting',
      'Build strategic relationships with key accounts',
      'Refine sales playbooks and processes',
    ],
    qualifications: [
      '7+ years of sales experience, 2+ in leadership',
      'Proven record of building and scaling teams',
      'Strong analytical and forecasting skills',
    ],
    skills: ['Sales Leadership', 'Forecasting', 'Coaching', 'Salesforce'],
    preferredSkills: ['Enterprise Sales'],
  },
  csm: {
    title: 'Customer Success Manager',
    category: 'Customer Support',
    overview:
      'Ensure {company} customers get maximum value from our product. You will own a portfolio of accounts, drive adoption and identify expansion opportunities.',
    responsibilities: [
      'Onboard new customers and drive product adoption',
      'Run quarterly business reviews',
      'Monitor account health and reduce churn',
      'Advocate for customers with the product team',
    ],
    qualifications: [
      '2+ years in customer success or account management',
      'Strong relationship-building skills',
      'Comfortable with SaaS products and data',
    ],
    skills: ['Customer Success', 'Onboarding', 'Account Management', 'Gainsight'],
    preferredSkills: ['SQL', 'Zendesk'],
  },
  supportSpecialist: {
    title: 'Customer Support Specialist',
    category: 'Customer Support',
    overview:
      'Be the friendly expert our customers rely on. At {company}, you will resolve questions across chat and email and help improve our help centre.',
    responsibilities: [
      'Respond to customer enquiries via chat, email and phone',
      'Troubleshoot issues and escalate bugs',
      'Write and update help centre articles',
      'Share customer feedback with product teams',
    ],
    qualifications: [
      '1+ years in a customer-facing role',
      'Excellent written communication',
      'Patience and a problem-solving mindset',
    ],
    skills: ['Zendesk', 'Communication', 'Troubleshooting', 'Empathy'],
    preferredSkills: ['Intercom', 'Bilingual'],
  },
  techSupport: {
    title: 'Technical Support Engineer',
    category: 'Customer Support',
    overview:
      '{company} is hiring a Technical Support Engineer to solve complex customer issues involving APIs, integrations and infrastructure.',
    responsibilities: [
      'Investigate and resolve technical tickets',
      'Reproduce bugs and work with engineering on fixes',
      'Build internal tools and runbooks',
      'Support enterprise customers during incidents',
    ],
    qualifications: [
      '2+ years in technical support or software engineering',
      'Comfortable reading logs and debugging APIs',
      'Familiarity with SQL and scripting',
    ],
    skills: ['APIs', 'SQL', 'Debugging', 'Linux'],
    preferredSkills: ['Python', 'Postman'],
  },
};
