import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { GraduationCap, CheckCircle, XCircle } from 'lucide-react';

// Local Imports
import { AuthLayout } from '../../../components/Auth/AuthLayout';
import { verifyEmail, resendVerification } from '../../../redux/features/auth/authSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { CustomButton } from '../../../components/shared';

export const VerifyEmail = () => {
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
      setError('Invalid verification token');
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
        toast.success('Email verified successfully!');
      } else {
        setError(result?.payload || 'Verification failed. The token may be invalid or expired.');
      }
    } catch (err) {
      console.error('Verify email failed:', err);
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    try {
      setResending(true);
      const result = await dispatch(resendVerification(email));

      if (result?.meta?.requestStatus === 'fulfilled') {
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        toast.error(result?.payload || 'Failed to resend verification email.');
      }
    } catch (err) {
      console.error('Resend verification failed:', err);
      toast.error('An error occurred. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verifying Email</h1>
          <p className="text-gray-600">Please wait...</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600">Verifying your email address...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified</h1>
          <p className="text-gray-600">Your email has been verified successfully!</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 mb-6">
            You can now log in to your account.
          </p>
          <Link to="/login" className="btn-primary inline-block">
            Go to Login
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-600">{error || 'Unable to verify your email address.'}</p>
      </div>

      <div className="card text-center">
        <p className="text-gray-600 mb-6">
          {error || 'The verification link may have expired or is invalid.'}
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <Link to="/login" className="block text-sm text-primary-600 hover:text-primary-700 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

