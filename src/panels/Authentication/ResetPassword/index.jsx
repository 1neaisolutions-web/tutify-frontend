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
import { useTranslation } from 'react-i18next';

export const ResetPassword = () => {
  const { t } = useTranslation();
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
      toast.error(t('snackbar.resetPassword.invalidToken'));
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
      newErrors.password = t('resetPassword.validation.passwordRequired');
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.length) {
        newErrors.password = t('resetPassword.validation.passwordMinLength');
      } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
        newErrors.password = t('resetPassword.validation.passwordComplexity');
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('resetPassword.validation.passwordMismatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      toast.error(t('snackbar.resetPassword.invalidToken'));
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
        toast.success(t('snackbar.resetPassword.success'));
        navigate('/login');
      } else {
        setLoading(false);
        toast.error(result?.payload || t('snackbar.resetPassword.error'));
      }
    } catch (err) {
      setLoading(false);
      console.error('Reset password failed:', err);
      toast.error(t('snackbar.genericError'));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('resetPassword.title')}</h1>
        <p className="text-gray-600">{t('resetPassword.subtitle')}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label={t('resetPassword.newPasswordLabel')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('resetPassword.passwordPlaceholder')}
            error={!!errors.password}
            errorMsg={errors.password}
            required
          />
          <p className="mt-1 text-xs text-gray-500">{t('resetPassword.passwordHint')}</p>

          <CustomInput
            label={t('resetPassword.confirmPasswordLabel')}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('resetPassword.passwordPlaceholder')}
            error={!!errors.confirmPassword}
            errorMsg={errors.confirmPassword}
            required
          />

          <button
            type="submit"
            disabled={loading || isEmpty(formData)}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('resetPassword.submitting') : t('resetPassword.submit')}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

