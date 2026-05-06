import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

// Local Imports
import { AuthLayout } from '../../../components/Auth/AuthLayout';
import { isEmpty, validatePassword } from '../../../utils/utils';
import { resetPassword } from '../../../redux/features/auth/authSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { CustomButton, CustomInput } from '../../../components/shared';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useSnackbar();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error('Invalid reset token');
      navigate('/forgot-password');
    }
  }, [searchParams, navigate, toast]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.length) {
        newErrors.password = 'Password must be at least 10 characters';
      } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(resetPassword({
        token,
        new_password: formData.password,
      }));

      if (result?.meta?.requestStatus === 'fulfilled') {
        setLoading(false);
        toast.success('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        setLoading(false);
        toast.error(result?.payload || 'Failed to reset password. The token may be invalid or expired.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Reset password failed:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  if (!token) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">Enter your new password</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={!!errors.password}
            errorMsg={errors.password}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Must be at least 10 characters with uppercase, lowercase, number, and special character</p>

          <CustomInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            errorMsg={errors.confirmPassword}
            required
          />

          <button
            type="submit"
            disabled={loading || isEmpty(formData)}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

