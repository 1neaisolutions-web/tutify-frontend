// Library Imports
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Local Imports
import { setAuthToken } from '../redux/http';

const PrivateRoutes = () => {
  // Read persisted auth state
  const user = useSelector((state) => state?.auth?.user);
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated);
  // Some login flows persist the raw access token to localStorage even if redux
  // user hydration lags or the token field name differs.
  const token = user?.token || localStorage.getItem('access_token');

  // Ensure axios has the auth header before children render on first paint
  if (token) {
    setAuthToken(token);
  }

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

  if (token) {
    return <Outlet />;
  }

  return <Navigate to='/login' replace />;
};

export default PrivateRoutes;
