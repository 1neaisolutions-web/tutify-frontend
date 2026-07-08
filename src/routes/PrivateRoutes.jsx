// Library Imports
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Local Imports
import { setAuthToken } from '../redux/http';

const PrivateRoutes = () => {
  const user = useSelector((state) => state?.auth?.user);
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated);
  const isAuthenticated = !!user;

  // Wait until redux-persist finishes rehydration to avoid false redirects
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Stale localStorage token without a persisted user causes a /dashboard ↔ /login loop.
    localStorage.removeItem('access_token');
    setAuthToken(null);
    return <Navigate to='/login' replace />;
  }

  if (user.token) {
    setAuthToken(user.token);
  }

  return <Outlet />;
};

export default PrivateRoutes;
