import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';
import { ConfirmProvider } from './context/ConfirmContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute, { GuestRoute } from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Companies = lazy(() => import('./pages/Companies'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));
const CareerAdvice = lazy(() => import('./pages/CareerAdvice'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const About = lazy(() => import('./pages/info/About'));
const Contact = lazy(() => import('./pages/info/Contact'));
const Legal = lazy(() => import('./pages/info/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Shared dashboard pages
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

// Job seeker
const SeekerOverview = lazy(() => import('./pages/dashboard/seeker/Overview'));
const Profile = lazy(() => import('./pages/dashboard/seeker/Profile'));
const Applications = lazy(() => import('./pages/dashboard/seeker/Applications'));
const SavedJobs = lazy(() => import('./pages/dashboard/seeker/SavedJobs'));
const RecommendedJobs = lazy(() => import('./pages/dashboard/seeker/RecommendedJobs'));
const Resume = lazy(() => import('./pages/dashboard/seeker/Resume'));

// Recruiter
const RecruiterOverview = lazy(() => import('./pages/dashboard/recruiter/Overview'));
const ManageJobs = lazy(() => import('./pages/dashboard/recruiter/ManageJobs'));
const PostJob = lazy(() => import('./pages/dashboard/recruiter/PostJob'));
const Applicants = lazy(() => import('./pages/dashboard/recruiter/Applicants'));
const CompanyProfile = lazy(() => import('./pages/dashboard/recruiter/CompanyProfile'));

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          <ConfirmProvider>
            <ScrollToTop />
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/career-advice" element={<CareerAdvice />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Legal type="privacy" />} />
                <Route path="/terms" element={<Legal type="terms" />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              <Route path="/dashboard" element={<ProtectedRoute role="seeker"><DashboardLayout role="seeker" /></ProtectedRoute>}>
                <Route index element={<SeekerOverview />} />
                <Route path="profile" element={<Profile />} />
                <Route path="applications" element={<Applications />} />
                <Route path="saved-jobs" element={<SavedJobs />} />
                <Route path="recommended-jobs" element={<RecommendedJobs />} />
                <Route path="resume" element={<Resume />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><DashboardLayout role="recruiter" /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<RecruiterOverview />} />
                <Route path="jobs" element={<ManageJobs />} />
                <Route path="jobs/create" element={<PostJob />} />
                <Route path="jobs/edit/:id" element={<PostJob />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="company-profile" element={<CompanyProfile />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors closeButton toastOptions={{ className: 'font-sans' }} />
          </ConfirmProvider>
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
