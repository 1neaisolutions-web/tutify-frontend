import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Local Imports
import { AuthLayout } from '../../../components/Auth/AuthLayout';
import { isEmpty, isError, validateEmail } from '../../../utils/utils';
import { loginUser, clearLoginChallenge } from '../../../redux/features/auth/authSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { GraduationCap } from 'lucide-react';
import { getFirstRouteByRole } from '../../../routes/routeHelpers';
import { setAuthToken } from '../../../redux/http';
import { CustomButton, CustomInput } from '../../../components/shared';
import TenantSelection from '@/components/Auth/TenantSelection';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Hooks must be called unconditionally
  const snackbarHook = useSnackbar();
  const toast = snackbarHook?.toast || {
    success: () => {},
    error: (msg) => console.error('[Login Error]:', msg),
    warning: () => {},
    info: () => {},
  };
  
  // Safe Redux state access with fallbacks
  const authState = useSelector((state) => state?.auth) || {};
  const { loginChallenge, user } = authState;
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated) ?? false;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // CRITICAL: If user is already authenticated, redirect immediately
  // This prevents login page from showing after successful login
  useEffect(() => {
    if (user?.token && isRehydrated) {
      // User is already logged in - redirect to dashboard immediately
      const userRole = user?.role || '';
      const firstPath = getFirstRouteByRole(userRole) || '/dashboard';
      console.log('[Login] User already authenticated, redirecting to:', firstPath);
      navigate(firstPath, { replace: true });
    }
  }, [user, isRehydrated, navigate]);

  // CRITICAL: Don't render login form if user is already authenticated
  // This prevents the login page from showing briefly after successful login
  if (user?.token && isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Clear challenge when component unmounts
  useEffect(() => {
    return () => {
      try {
        if (loginChallenge) {
          dispatch(clearLoginChallenge());
        }
      } catch (error) {
        console.error('[Login] Error clearing challenge:', error);
      }
    };
  }, [dispatch, loginChallenge]);

  // Show loading state while Redux is rehydrating.
  // Keep this after hook declarations to preserve hook call order across renders.
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    // Clear login error when user types
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (isEmpty(formData)) {
      return;
    }

    if (!validateEmail(formData?.email)) {
      newErrors.email = 'Invalid Email';
    }

    if (isError(newErrors)) {
      setErrors(newErrors);
      return;
    }

    const loginPayload = {
      email: formData?.email?.trim()?.toLowerCase(),
      password: formData?.password,
    };

    try {
      setLoading(true);
      console.log('[Login] Starting login request...', loginPayload);
      
      const result = await dispatch(loginUser(loginPayload));
      console.log('[Login] Login result:', result);

      // Check if request was fulfilled
      if (result?.meta?.requestStatus === 'fulfilled') {
        const response = result?.payload;
        console.log('[Login] Login fulfilled, response:', response);

        // Check if this is a challenge response
        if (response?.status === 'CHALLENGE' && response?.challenge) {
          // Challenge will be handled by TenantSelection component
          // The challenge data is already in Redux state
          console.log('[Login] Challenge response received');
          setLoading(false);
          return;
        }

        // Success response
        setFormData({
          email: '',
          password: '',
        });

        // Set axios auth token
        const token = response?.access_token || response?.token || response?.accessToken;
        if (token) {
          setAuthToken(token);
          localStorage.setItem('access_token', token);
          const refreshToken = response?.refresh_token || response?.refreshToken;
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          console.log('[Login] Tokens saved successfully');
        }

        // Wait a moment for Redux state to update, then navigate
        // The Redux state will be updated by the loginUser.fulfilled reducer
        setLoading(false);
        
        // Get role from user object for navigation
        const user = response?.user;
        const roles = user?.roles || [];
        
        // Extract primary role (same logic as authSlice)
        const rolePriority = { 
          super_admin: 1, 
          org_admin: 2, 
          institution_admin: 3,
          school_admin: 3,  // Backward compatibility
          teacher: 4, 
          student: 5, 
          parent: 6 
        };
        let role = null;
        if (roles && Array.isArray(roles) && roles.length > 0) {
          const sortedRoles = roles
            .map((r) => ({ ...r, priority: rolePriority[r.name] || 999 }))
            .sort((a, b) => a.priority - b.priority);
          role = sortedRoles[0]?.name || null;
        }
        
        // Use fallback if role is null or route is /login
        let firstPath = getFirstRouteByRole(role);
        if (!firstPath || firstPath === '/login') {
          // If no role found or fallback to login, use dashboard as default
          firstPath = '/dashboard';
          console.warn('[Login] No role found or route is /login, defaulting to /dashboard');
        }
        
        console.log('[Login] Login successful, role:', role, 'navigating to:', firstPath);
        
        // Navigate immediately - Redux state is already updated by the reducer
        // The useEffect above will handle redirect if user is already authenticated
        // Use replace: true to avoid login page appearing in browser history
        navigate(firstPath, { replace: true });
      } else if (result?.meta?.requestStatus === 'rejected') {
        // Request was rejected - extract error message
        setLoading(false);
        const errorPayload = result?.payload;
        console.error('[Login] Login rejected:', errorPayload, result);
        
        // Extract error message from various formats
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (typeof errorPayload === 'string') {
          errorMessage = errorPayload;
        } else if (errorPayload?.message) {
          errorMessage = errorPayload.message;
        } else if (errorPayload?.detail) {
          errorMessage = errorPayload.detail;
        } else if (result?.error?.message) {
          errorMessage = result.error.message;
        }
        
        console.error('[Login] Showing error:', errorMessage);
        setLoginError(errorMessage);
        if (toast?.error) {
          toast.error(errorMessage);
        }
      } else {
        // Unknown status - this shouldn't happen but handle it
        setLoading(false);
        console.error('[Login] Unknown request status:', result?.meta?.requestStatus, result);
        const unknownError = 'Login failed. Please try again.';
        setLoginError(unknownError);
        if (toast?.error) {
          toast.error(unknownError);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('[Login] Exception caught:', err);
      
      // Extract error message from various error types
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      console.error('[Login] Showing exception error:', errorMessage);
      setLoginError(errorMessage);
      if (toast?.error) {
        toast.error(errorMessage);
      }
    }
  };

  // Show tenant selection if challenge is present
  if (loginChallenge && loginChallenge.challengeType === 'TENANT_SELECTION_REQUIRED') {
    return (
      <TenantSelection
        loginToken={loginChallenge.loginToken}
        memberships={loginChallenge.memberships || []}
        onSuccess={(userData) => {
          // Use user data passed from TenantSelection, or fallback to Redux state
          // Extract role from userData if needed (backend returns roles array)
          let role = null;
          if (userData) {
            if (userData.role) {
              role = userData.role;
            } else if (userData.roles && Array.isArray(userData.roles)) {
              // Extract primary role from roles array
              const rolePriority = { 
                super_admin: 1, 
                org_admin: 2, 
                institution_admin: 3,
                school_admin: 3,
                teacher: 4, 
                student: 5, 
                parent: 6 
              };
              const sortedRoles = userData.roles
                .map((r) => ({ ...r, priority: rolePriority[r.name] || 999 }))
                .sort((a, b) => a.priority - b.priority);
              role = sortedRoles[0]?.name || null;
            }
          } else if (user?.role) {
            role = user.role;
          }
          const firstPath = getFirstRouteByRole(role);
          navigate(firstPath || '/dashboard', { replace: true });
        }}
        onError={(error) => {
          if (toast?.error) {
            toast.error(error);
          }
          try {
            dispatch(clearLoginChallenge());
          } catch (err) {
            console.error('[Login] Error clearing challenge:', err);
          }
        }}
      />
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Assistant</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label='Email'
            name='email'
            type='text'
            value={formData.email}
            onChange={handleChange}
            autoComplete='on'
            autoFocus
            placeholder='Enter your email'
            error={!!errors.email}
            errorMsg={errors.email}
          />

          <CustomInput
            label='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter your password'
            error={!!errors.password}
            errorMsg={errors.password}
          />

          {/* Display login error if any */}
          {loginError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/40 dark:border-red-900">
              <p className="text-sm text-red-600 dark:text-red-200">{loginError}</p>
            </div>
          )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type='button'
                onClick={() => navigate('/forgot-password')}
                className='text-sm text-primary-600 cursor-pointer hover:underline'
              >
                Forgot password?
              </button>
            </div>


            <button
              type="submit"
              disabled={loading || isEmpty(formData)}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
      </div>
    </AuthLayout>
  );
};
