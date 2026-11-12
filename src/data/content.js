// Marketing / editorial content for the public site.
const portrait = (g, n) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

export const testimonials = [
  { id: 't1', name: 'Maya Chen', role: 'Product Designer at PixelForge Studio', avatar: portrait('women', 47), rating: 5, quote: 'I applied to six roles in one evening and had three interviews lined up the next week. The application tracking kept me sane through the whole process.' },
  { id: 't2', name: 'Daniel Wright', role: 'Backend Engineer at Nimbus Labs', avatar: portrait('men', 41), rating: 5, quote: 'The filters are genuinely useful — I could narrow down to remote, senior, Node.js roles in seconds. Found my current job in under a month.' },
  { id: 't3', name: 'Fatima Noor', role: 'Data Analyst at Quantix', avatar: portrait('women', 63), rating: 4, quote: 'As a career switcher I loved the recommended jobs. They matched my skills better than any other board I tried.' },
  { id: 't4', name: 'Chris Alvarez', role: 'Head of Talent, Ledgerly', avatar: portrait('men', 85), rating: 5, quote: 'On the hiring side, managing applicants and scheduling interviews in one place cut our time-to-hire by almost two weeks.' },
  { id: 't5', name: 'Olivia Grant', role: 'Customer Success Manager', avatar: portrait('women', 21), rating: 5, quote: 'Clean, fast and no spam. Getting status updates in real time made job hunting feel far less like shouting into the void.' },
  { id: 't6', name: 'Ben Carter', role: 'Software Engineering Intern', avatar: portrait('men', 17), rating: 4, quote: 'Landed my first internship here. The career advice articles helped me prepare for my technical interviews.' },
];

export const whyChooseUs = [
  { icon: 'BadgeCheck', title: 'Thousands of verified jobs', description: 'Every company and listing is reviewed by our team, so you only see real opportunities.' },
  { icon: 'MousePointerClick', title: 'Easy application process', description: 'Build your profile once and apply to any role in a couple of clicks.' },
  { icon: 'Sparkles', title: 'Personalised recommendations', description: 'Smart matching surfaces roles that fit your skills, experience and preferences.' },
  { icon: 'Rocket', title: 'Career growth opportunities', description: 'Expert advice, salary insights and companies that invest in your development.' },
];

export const platformStats = [
  { label: 'Live jobs', value: '12,400+' },
  { label: 'Companies hiring', value: '3,200+' },
  { label: 'Candidates hired', value: '48,000+' },
];

export const articles = [
  {
    id: 'a1', category: 'Resume', title: 'How to Write a Resume That Gets Past Applicant Tracking Systems', readTime: 6, date: '2026-10-21',
    excerpt: 'Most resumes are read by software before a human. Here is how to format and phrase yours so it is parsed correctly and stands out.',
    body: [
      'Applicant tracking systems scan resumes for structure and relevant keywords. Use a simple, single-column layout with standard section headings such as Experience, Education and Skills. Avoid tables, text boxes and images, which are often parsed incorrectly.',
      'Tailor each resume to the job description. Mirror the exact language used for core skills — if the posting says "React" and "TypeScript", make sure those words appear naturally in your experience bullets, not only in a skills list.',
      'Lead every bullet with an action verb and a measurable outcome: "Reduced page load time by 40% by introducing code splitting" says far more than "Worked on performance". Finally, export as PDF unless the employer asks otherwise, and name the file with your full name.',
    ],
  },
  {
    id: 'a2', category: 'Interviews', title: 'The STAR Method: Answering Behavioural Interview Questions', readTime: 5, date: '2026-10-12',
    excerpt: 'Structure your stories with Situation, Task, Action and Result to give interviewers exactly what they are looking for.',
    body: [
      'Behavioural questions such as "Tell me about a time you handled conflict" are designed to predict future behaviour from past examples. The STAR method keeps your answer focused: describe the Situation, the Task you owned, the Actions you took and the Result.',
      'Spend most of your time on the Action — interviewers want to understand your decisions, not your team\'s. Use "I" rather than "we" when describing what you personally did.',
      'Prepare six to eight stories in advance that cover leadership, failure, conflict, ambiguity and impact. Most questions can be answered by adapting one of them.',
    ],
  },
  {
    id: 'a3', category: 'Salary', title: 'Negotiating Your Offer Without Burning Bridges', readTime: 7, date: '2026-09-30',
    excerpt: 'Negotiation is expected. Learn how to research market rates, anchor confidently and handle the conversation professionally.',
    body: [
      'Start by researching market ranges for your role, level and location. Salary ranges listed on job posts are a great anchor, as are peers in similar roles.',
      'When you receive an offer, express enthusiasm first, then ask for time to review. Respond with a specific, well-reasoned number rather than a range, and consider the full package: equity, bonus, PTO and flexibility.',
      'Keep the tone collaborative. Phrases like "Is there flexibility on the base salary?" invite problem solving rather than confrontation.',
    ],
  },
  {
    id: 'a4', category: 'Career Growth', title: 'Switching Careers into Tech: A Practical 6-Month Plan', readTime: 8, date: '2026-09-18',
    excerpt: 'A step-by-step roadmap for moving into product, design or engineering roles from a different industry.',
    body: [
      'Pick a target role first. Breadth is tempting, but focusing on one path — for example data analysis — lets you build a coherent story and portfolio.',
      'Spend the first three months on fundamentals and two or three portfolio projects that solve real problems, ideally connected to your previous industry. Domain knowledge is a genuine advantage.',
      'In months four to six, network intentionally, contribute to communities and apply to roles where your past experience is relevant. Transferable skills such as stakeholder management are valuable.',
    ],
  },
  {
    id: 'a5', category: 'Remote Work', title: 'Thriving in a Remote Job: Habits of Effective Remote Workers', readTime: 4, date: '2026-08-27',
    excerpt: 'Over-communicate, protect your focus time and build relationships deliberately — here is how.',
    body: [
      'Remote work rewards clear written communication. Share progress proactively, document decisions and make it easy for teammates to catch up asynchronously.',
      'Protect deep-work blocks in your calendar and set boundaries for when your workday ends.',
      'Relationships do not happen by accident remotely. Schedule regular one-on-ones and informal coffee chats with teammates across functions.',
    ],
  },
  {
    id: 'a6', category: 'Job Search', title: 'Building a Job Search System That Keeps You Motivated', readTime: 5, date: '2026-08-10',
    excerpt: 'Treat your search like a project: set weekly targets, track applications and review your results regularly.',
    body: [
      'Set weekly goals you control — for example, ten tailored applications and three networking conversations — rather than outcomes you do not control.',
      'Track every application with its status, contact and next step. Patterns quickly emerge: which roles respond, which resumes perform better.',
      'Review your pipeline weekly and celebrate progress. Job searching is a marathon and sustainable habits beat bursts of effort.',
    ],
  },
];
