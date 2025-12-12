import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected layout that requires authentication
 * Redirects to login if user is not authenticated
 */
function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
