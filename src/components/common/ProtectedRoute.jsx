import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Guards a route by authentication and (optionally) role. */
export default function ProtectedRoute({ role, children }) {
  const { user, dashboardPath } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (role && user.role !== role) return <Navigate to={dashboardPath} replace />;
  return children;
}

/** Redirects signed-in users away from auth screens. */
export function GuestRoute({ children }) {
  const { user, dashboardPath } = useAuth();
  if (user) return <Navigate to={dashboardPath} replace />;
  return children;
}
