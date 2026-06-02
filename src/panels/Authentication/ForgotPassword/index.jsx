import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

// Local Imports
import { AuthLayout } from '../../../components/Auth/AuthLayout';
import { isEmpty, validateEmail } from '../../../utils/utils';
import { forgotPassword } from '../../../redux/features/auth/authSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { CustomButton, CustomInput } from '../../../components/shared';
import { useTranslation } from 'react-i18next';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useSnackbar();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email) {
      newErrors.email = t('forgotPassword.validation.emailRequired');
    } else if (!validateEmail(email)) {
      newErrors.email = t('forgotPassword.validation.emailInvalid');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(forgotPassword({ email: email.trim().toLowerCase() }));

      if (result?.meta?.requestStatus === 'fulfilled') {
        setLoading(false);
        setIsSubmitted(true);
        toast.success(t('snackbar.forgotPassword.success'));
      } else {
        setLoading(false);
        toast.error(result?.payload || t('snackbar.forgotPassword.error'));
      }
    } catch (err) {
      setLoading(false);
      console.error('Forgot password failed:', err);
      toast.error(t('snackbar.genericError'));
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forgotPassword.successTitle')}</h1>
          <p className="text-gray-600">
            {t('forgotPassword.successMessage', { email })}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-gray-600 mb-6">
            {t('forgotPassword.successInstructions')}
          </p>
          <Link to="/login" className="btn-primary inline-block">
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forgotPassword.title')}</h1>
        <p className="text-gray-600">{t('forgotPassword.subtitle')}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label={t('forgotPassword.emailLabel')}
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            placeholder={t('forgotPassword.emailPlaceholder')}
            error={!!errors.email}
            errorMsg={errors.email}
            required
          />

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

