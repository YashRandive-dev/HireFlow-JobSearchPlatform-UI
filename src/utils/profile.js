const CHECKS = [
  { key: 'avatar', label: 'Profile photo', weight: 10, test: (u) => !!u.avatar },
  { key: 'headline', label: 'Professional headline', weight: 10, test: (u) => !!u.headline },
  { key: 'phone', label: 'Phone number', weight: 5, test: (u) => !!u.phone },
  { key: 'location', label: 'Location', weight: 5, test: (u) => !!u.location },
  { key: 'about', label: 'About me', weight: 15, test: (u) => (u.about || '').length > 30 },
  { key: 'skills', label: 'At least 3 skills', weight: 15, test: (u) => (u.skills || []).length >= 3 },
  { key: 'experience', label: 'Work experience', weight: 15, test: (u) => (u.experience || []).length > 0 },
  { key: 'education', label: 'Education', weight: 10, test: (u) => (u.education || []).length > 0 },
  { key: 'resume', label: 'Resume uploaded', weight: 10, test: (u) => !!u.resume },
  { key: 'socials', label: 'A social or portfolio link', weight: 5, test: (u) => Object.values(u.socials || {}).some(Boolean) },
];

export function profileCompletion(user) {
  if (!user) return { percent: 0, missing: [] };
  let percent = 0;
  const missing = [];
  CHECKS.forEach((c) => {
    if (c.test(user)) percent += c.weight;
    else missing.push(c.label);
  });
  return { percent, missing };
}
