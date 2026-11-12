# HireFlow — Job Search Platform (React)

A complete, responsive job search platform with separate **Job Seeker** and **Recruiter** experiences.
Built with React 18, Vite, Tailwind CSS, React Router, Framer Motion, Recharts, Lucide icons and Sonner toasts.
All data is mocked and persisted in **LocalStorage**, behind an async API layer that can be swapped for a real backend.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

### Demo accounts
The login page has **"Try a demo account"** buttons that fill in a job seeker or recruiter account
(seeded from `src/data/users.js`). You can also register new accounts of either type.

Reset everything from **Settings → Reset demo data**.

## Features

- **Public site** — landing page (hero search, featured companies & jobs, categories, testimonials, newsletter),
  Find Jobs with live search, filters, sort, grid/list view, pagination, filter chips and recently viewed;
  job details with sticky apply card and similar jobs; company directory and company pages; career advice.
- **Auth** — login (remember me), registration (seeker / recruiter), forgot password, validation, protected & role-based routes.
- **Job seeker dashboard** — overview with charts and profile strength, editable profile (photo, skills, experience,
  education, socials), applications with status timeline & withdraw, saved jobs, recommendations, resume upload/preview/download/replace/delete,
  notifications (read/unread, mark all, delete), settings (password, preferences, delete account).
- **Recruiter dashboard** — overview with analytics, manage jobs (create, edit, delete, activate/deactivate),
  applicants (filter by job/status, candidate profile & resume preview, download resume, shortlist, reject, schedule interviews),
  company profile editor, notifications, settings.
- Status changes and interview invitations notify the candidate; new applications notify the recruiter.

## Project structure

```
src/
  components/
    common/      Button, Modal, Dropdown, Pagination, EmptyState, LoadingSkeleton, ProtectedRoute, …
    layout/      Navbar, Footer, Sidebar, UserMenu, NotificationBell
    jobs/        JobCard, SearchBar, FilterSidebar, FilterChips, JobDetails, ApplyModal, …
    companies/   CompanyCard
    dashboard/   DashboardStats, ProfileCard, ApplicationCard, NotificationCard, modals, …
    forms/       Input, Select, Textarea, Checkbox, TagInput, FileDrop, JobForm, …
  context/       AuthContext, DataContext, NotificationContext, ConfirmContext
  data/          Mock companies, job templates, candidates, users, content, constants
  hooks/         useDebounce, useLocalStorage, useClickOutside, …
  layouts/       MainLayout, AuthLayout, DashboardLayout
  pages/         Public pages, dashboard/seeker, dashboard/recruiter, info pages
  services/      api.js (mock REST over LocalStorage), storage.js, seed.js
  utils/         Formatting, filtering, validation, recommendations, downloads
```

## Connecting a real backend

UI components never touch LocalStorage directly. Replace the implementations in
`src/services/api.js` (`jobsApi`, `companiesApi`, `applicationsApi`, `notificationsApi`, `authApi`, …)
with HTTP calls returning the same shapes, and the contexts and pages keep working.
