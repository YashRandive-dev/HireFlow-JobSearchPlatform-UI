import { jobTemplates } from './jobTemplates';
import { companies } from './companies';

const DAY = 24 * 60 * 60 * 1000;

// [template, companyId, location, workMode, type, experience, salaryMin, salaryMax, daysAgo, applicants, featured]
const rows = [
  ['frontend', 'c1', 'San Francisco, CA', 'Hybrid', 'Full-time', 'Senior Level', 150000, 185000, 0, 42, true],
  ['backend', 'c1', 'Remote', 'Remote', 'Full-time', 'Mid Level', 130000, 160000, 2, 67, true],
  ['devops', 'c1', 'San Francisco, CA', 'On-site', 'Full-time', 'Senior Level', 145000, 175000, 6, 23, false],
  ['productDesigner', 'c1', 'San Francisco, CA', 'Hybrid', 'Full-time', 'Mid Level', 120000, 150000, 4, 88, false],
  ['sweIntern', 'c1', 'San Francisco, CA', 'On-site', 'Internship', 'Entry Level', 40000, 52000, 9, 214, false],
  ['dataScientist', 'c2', 'New York, NY', 'Hybrid', 'Full-time', 'Mid Level', 135000, 165000, 1, 51, true],
  ['dataAnalyst', 'c2', 'New York, NY', 'On-site', 'Full-time', 'Entry Level', 75000, 90000, 3, 132, false],
  ['mlEngineer', 'c2', 'Remote', 'Remote', 'Full-time', 'Senior Level', 170000, 210000, 12, 39, true],
  ['techSupport', 'c3', 'Boston, MA', 'Hybrid', 'Full-time', 'Mid Level', 80000, 98000, 5, 27, false],
  ['uxResearcher', 'c3', 'Boston, MA', 'Hybrid', 'Full-time', 'Mid Level', 105000, 128000, 8, 34, false],
  ['hrGeneralist', 'c3', 'Boston, MA', 'On-site', 'Full-time', 'Mid Level', 70000, 85000, 15, 46, false],
  ['fullstack', 'c4', 'Austin, TX', 'Remote', 'Full-time', 'Mid Level', 115000, 140000, 1, 58, true],
  ['accountant', 'c4', 'Austin, TX', 'Hybrid', 'Full-time', 'Senior Level', 90000, 110000, 10, 19, false],
  ['csm', 'c4', 'Remote', 'Remote', 'Full-time', 'Mid Level', 70000, 88000, 4, 41, false],
  ['backend', 'c5', 'Seattle, WA', 'On-site', 'Full-time', 'Senior Level', 160000, 195000, 7, 33, false],
  ['sweIntern', 'c5', 'Seattle, WA', 'On-site', 'Internship', 'Entry Level', 45000, 55000, 2, 176, false],
  ['dataAnalyst', 'c6', 'Denver, CO', 'Hybrid', 'Full-time', 'Mid Level', 85000, 102000, 3, 29, false],
  ['frontend', 'c6', 'Remote', 'Remote', 'Contract', 'Senior Level', 120000, 145000, 11, 22, false],
  ['productDesigner', 'c7', 'Los Angeles, CA', 'Hybrid', 'Full-time', 'Senior Level', 125000, 155000, 0, 61, true],
  ['uiDesigner', 'c7', 'Remote', 'Remote', 'Contract', 'Mid Level', 70000, 90000, 6, 48, false],
  ['socialMedia', 'c7', 'Los Angeles, CA', 'On-site', 'Part-time', 'Entry Level', 30000, 38000, 13, 72, false],
  ['mobile', 'c8', 'Chicago, IL', 'Hybrid', 'Full-time', 'Mid Level', 125000, 150000, 2, 37, true],
  ['growthMarketer', 'c8', 'Chicago, IL', 'Hybrid', 'Full-time', 'Senior Level', 110000, 135000, 5, 44, false],
  ['supportSpecialist', 'c8', 'Chicago, IL', 'On-site', 'Part-time', 'Entry Level', 38000, 45000, 1, 95, false],
  ['mlEngineer', 'c9', 'San Diego, CA', 'On-site', 'Full-time', 'Senior Level', 165000, 200000, 9, 26, false],
  ['dataScientist', 'c9', 'San Diego, CA', 'Hybrid', 'Internship', 'Entry Level', 48000, 58000, 20, 120, false],
  ['devops', 'c10', 'Remote', 'Remote', 'Full-time', 'Mid Level', 130000, 155000, 3, 31, true],
  ['techSupport', 'c10', 'Remote', 'Remote', 'Contract', 'Mid Level', 85000, 100000, 14, 18, false],
  ['recruiter', 'c10', 'Remote', 'Remote', 'Full-time', 'Mid Level', 80000, 98000, 8, 24, false],
  ['contentMarketer', 'c11', 'New York, NY', 'Hybrid', 'Full-time', 'Mid Level', 65000, 82000, 2, 57, false],
  ['socialMedia', 'c11', 'New York, NY', 'Hybrid', 'Internship', 'Entry Level', 32000, 40000, 4, 140, false],
  ['peopleOps', 'c11', 'New York, NY', 'On-site', 'Full-time', 'Lead / Manager', 120000, 145000, 18, 15, false],
  ['financialAnalyst', 'c12', 'Charlotte, NC', 'Hybrid', 'Full-time', 'Mid Level', 80000, 98000, 1, 63, true],
  ['investmentAnalyst', 'c12', 'Charlotte, NC', 'On-site', 'Full-time', 'Entry Level', 72000, 88000, 6, 81, false],
  ['accountExecutive', 'c12', 'Charlotte, NC', 'Hybrid', 'Full-time', 'Mid Level', 75000, 120000, 3, 36, false],
  ['sdr', 'c2', 'New York, NY', 'On-site', 'Full-time', 'Entry Level', 55000, 70000, 0, 54, false],
  ['salesManager', 'c8', 'Chicago, IL', 'On-site', 'Full-time', 'Lead / Manager', 140000, 175000, 22, 12, false],
  ['accountExecutive', 'c1', 'Remote', 'Remote', 'Full-time', 'Mid Level', 90000, 140000, 5, 29, false],
];

export function buildJobs(now = Date.now()) {
  return rows.map(([key, companyId, location, workMode, type, experience, salaryMin, salaryMax, daysAgo, applicants, featured], i) => {
    const t = jobTemplates[key];
    const company = companies.find((c) => c.id === companyId);
    const postedAt = new Date(now - daysAgo * DAY - (i % 8) * 3600 * 1000).toISOString();
    const fill = (s) => s.replaceAll('{company}', company.name);
    return {
      id: `j${i + 1}`,
      title: t.title,
      companyId,
      category: t.category,
      location,
      workMode,
      type,
      experience,
      salaryMin,
      salaryMax,
      currency: 'USD',
      postedAt,
      deadline: new Date(now + (40 - daysAgo) * DAY).toISOString().slice(0, 10),
      applicants,
      featured,
      status: 'active',
      recruiterId: companyId === 'c1' ? 'u-recruiter' : null,
      description: fill(t.overview),
      responsibilities: t.responsibilities,
      qualifications: t.qualifications,
      skills: t.skills,
      preferredSkills: t.preferredSkills,
      benefits: company.benefits,
    };
  });
}
