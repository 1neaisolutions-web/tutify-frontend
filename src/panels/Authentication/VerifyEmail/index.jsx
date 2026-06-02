import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { GraduationCap, CheckCircle, XCircle } from 'lucide-react';

// Local Imports
import { AuthLayout } from '../../../components/Auth/AuthLayout';
import { verifyEmail, resendVerification } from '../../../redux/features/auth/authSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { CustomButton } from '../../../components/shared';
import { useTranslation } from 'react-i18next';

export const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useSnackbar();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    }

    if (token) {
      handleVerify(token);
    } else {
      setError(t('verifyEmail.invalidToken'));
      setVerifying(false);
      setLoading(false);
    }
  }, [searchParams]);

  const handleVerify = async (token) => {
    try {
      setLoading(true);
      const result = await dispatch(verifyEmail(token));

      if (result?.meta?.requestStatus === 'fulfilled') {
        setVerified(true);
        toast.success(t('snackbar.verifyEmail.success'));
      } else {
        setError(result?.payload || t('verifyEmail.verificationFailed'));
      }
    } catch (err) {
      console.error('Verify email failed:', err);
      setError(t('verifyEmail.verificationError'));
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error(t('snackbar.verifyEmail.emailRequired'));
      return;
    }

    try {
      setResending(true);
      const result = await dispatch(resendVerification(email));

      if (result?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('snackbar.verifyEmail.resendSuccess'));
      } else {
        toast.error(result?.payload || t('snackbar.verifyEmail.resendError'));
      }
    } catch (err) {
      console.error('Resend verification failed:', err);
      toast.error(t('snackbar.genericError'));
    } finally {
      setResending(false);
    }
  };

  if (loading || verifying) {
    return (
      <AuthLayout>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('verifyEmail.verifyingTitle')}</h1>
          <p className="text-gray-600">{t('verifyEmail.verifyingSubtitle')}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600">{t('verifyEmail.verifyingMessage')}</p>
        </div>
      </AuthLayout>
    );
  }

  if (verified) {
    return (
      <AuthLayout>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('verifyEmail.successTitle')}</h1>
          <p className="text-gray-600">{t('verifyEmail.successMessage')}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 mb-6">
            {t('verifyEmail.successSubtitle')}
          </p>
          <Link to="/login" className="btn-primary inline-block">
            {t('verifyEmail.goToLogin')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('verifyEmail.failedTitle')}</h1>
        <p className="text-gray-600">{error || t('verifyEmail.failedMessage')}</p>
      </div>

      <div className="card text-center">
        <p className="text-gray-600 mb-6">
          {error || t('verifyEmail.expiredMessage')}
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? t('verifyEmail.resending') : t('verifyEmail.resendButton')}
          </button>
          <Link to="/login" className="block text-sm text-primary-600 hover:text-primary-700 font-medium">
            {t('verifyEmail.backToLogin')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

