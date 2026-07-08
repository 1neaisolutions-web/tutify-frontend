// Library Imports
import { useEffect, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

//Local Imports
import { getFirstRouteByRole } from './routeHelpers';
import { setAuthToken } from '../redux/http';

const PublicRoutes = () => {
  const user = useSelector((state) => state?.auth?.user);
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated);
  const isAuthenticated = !!user;

  const role = user?.role || '';
  const firstPath = useMemo(() => getFirstRouteByRole(role), [role]);

  // Ensure axios headers persist across reloads for authenticated sessions
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      setAuthToken(user.token);
    }
  }, [isAuthenticated, user?.token]);
  
  // Avoid redirecting while state is still loading from storage
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = firstPath && firstPath !== '/login' ? firstPath : '/dashboard';
    return <Navigate to={destination} replace />;
  }
  
  return <Outlet />;
};

export default PublicRoutes;
