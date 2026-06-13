// Library Imports
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

//Local Imports
import { getFirstRouteByRole } from './routeHelpers';
import { setAuthToken } from '../redux/http';

const normalizePath = (path) => {
  if (typeof path !== 'string') return '/';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed.length ? trimmed : '/';
};

const PublicRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated);

  const role = user?.role || '';
  // Only trust the persisted Redux session for redirects. A stale `access_token`
  // in localStorage (without a Redux user) caused PublicRoutes <-> app redirect loops.
  const token = user?.token || null;

  const firstPath = useMemo(() => getFirstRouteByRole(role), [role]);
  const destination = useMemo(() => {
    const path = firstPath && firstPath !== '/login' ? firstPath : '/dashboard';
    return normalizePath(path);
  }, [firstPath]);

  useEffect(() => {
    if (!isRehydrated) return;

    if (token) {
      setAuthToken(token);
      return;
    }

    setAuthToken(null);
    try {
      if (localStorage.getItem('access_token')) {
        localStorage.removeItem('access_token');
      }
    } catch {
      // ignore storage errors
    }
  }, [isRehydrated, token]);

  useEffect(() => {
    if (!isRehydrated || !token) return;
    if (normalizePath(location.pathname) === destination) return;
    navigate(destination, { replace: true });
  }, [isRehydrated, token, destination, location.pathname, navigate]);

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

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default PublicRoutes;
