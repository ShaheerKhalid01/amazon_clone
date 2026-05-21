import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import LoadingSpinner from '@components/ui/Spinner/Spinner';

/**
 * Admin Protected Route Component
 * Ensures the user is authenticated and has ADMIN role.
 * Redirects to login if not authenticated, or to home if not admin.
 */
const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Debug: show auth state and localStorage values
  const tokenExists = !!localStorage.getItem('accessToken');
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('AdminProtectedRoute debug -> isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user);
  console.log('LocalStorage -> tokenExists:', tokenExists, 'storedUser:', storedUser);


  // Debug logging (remove in production)
  console.log('AdminProtectedRoute: isAuthenticated', isAuthenticated, 'user', user);

  // Use token from localStorage as fallback for auth status
  const auth = isAuthenticated || tokenExists;

  // Show loading while auth state is being resolved
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not logged in → go to login page
  if (!auth) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  // Ensure user role is ADMIN. If user is undefined (e.g., page refresh), attempt to read role from stored user data
  if ((user?.role || storedUser?.role) !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // All good, render child routes
  return <Outlet />;
};

export default AdminProtectedRoute;
