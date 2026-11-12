import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Information we collect', 'We collect information you provide directly — such as your name, email, profile details and resume — as well as usage data that helps us improve the product. In this demo, all data is stored only in your browser’s LocalStorage.'],
      ['How we use information', 'We use your information to operate HireFlow, match you with relevant jobs, share your applications with the employers you apply to, and send notifications you have opted in to.'],
      ['Sharing', 'We never sell personal data. Your profile and resume are shared only with employers you apply to, or with recruiters if you make your profile visible.'],
      ['Your choices', 'You can edit or delete your profile, change notification preferences and permanently delete your account at any time from Settings.'],
      ['Contact', 'Questions about privacy can be sent to privacy@hireflow.example.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    sections: [
      ['Acceptance of terms', 'By creating an account or using HireFlow you agree to these terms. If you do not agree, please do not use the service.'],
      ['Accounts', 'You are responsible for keeping your login credentials secure and for all activity under your account. Information you provide must be accurate.'],
      ['Job postings', 'Employers must post genuine opportunities with accurate details. We may remove listings that are misleading, discriminatory or fraudulent.'],
      ['Acceptable use', 'Do not scrape, spam, impersonate others or attempt to disrupt the service.'],
      ['Liability', 'HireFlow is provided “as is”. We are not a party to any employment relationship formed through the platform.'],
    ],
  },
};

export default function Legal({ type }) {
  const page = CONTENT[type];
  useDocumentTitle(page.title);
  return (
    <div className="container-page max-w-3xl py-14">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-3xl font-bold">{page.title}</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: November 1, 2026</p>
      <div className="card mt-8 space-y-8 p-6 sm:p-8">
        {page.sections.map(([h, p], i) => (
          <section key={h}>
            <h2 className="text-lg font-semibold">
              {i + 1}. {h}
            </h2>
            <p className="mt-2 leading-relaxed text-slate-600">{p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
