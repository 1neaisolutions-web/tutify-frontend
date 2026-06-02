import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

// Local Imports
import { AuthLayout } from '../../../components/Auth/AuthLayout';
import { isEmpty, isError, validateEmail, validatePassword } from '../../../utils/utils';
import { teacherSignup, studentSignup, parentSignup } from '../../../redux/features/auth/authSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { CustomButton, CustomInput } from '../../../components/shared';
import { useTranslation } from 'react-i18next';

export const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useSnackbar();

  const [selectedRole, setSelectedRole] = useState('teacher');
  const [isIndividualAccount, setIsIndividualAccount] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    school_code: '',
    student_id: '',
    parent_email: '',
    student_code: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    // Basic validation
    if (!formData.first_name) newErrors.first_name = t('signup.validation.firstNameRequired');
    if (!formData.last_name) newErrors.last_name = t('signup.validation.lastNameRequired');
    if (!validateEmail(formData?.email)) newErrors.email = t('signup.validation.emailInvalid');
    if (!formData.password) newErrors.password = t('signup.validation.passwordRequired');
    
    // Password strength validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.length) {
      newErrors.password = t('signup.validation.passwordMinLength');
    } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
      newErrors.password = t('signup.validation.passwordComplexity');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.validation.passwordMismatch');
    }

    // Role-specific validation
    // School code is only required for school accounts (not individual accounts)
    if (!isIndividualAccount) {
      if (selectedRole === 'teacher' && !formData.school_code) {
        newErrors.school_code = t('signup.validation.schoolCodeRequired');
      }
      if (selectedRole === 'student' && !formData.school_code) {
        newErrors.school_code = t('signup.validation.schoolCodeRequired');
      }
    }
    if (selectedRole === 'parent' && !formData.student_code) {
      newErrors.student_code = t('signup.validation.studentCodeRequired');
    }

    if (isError(newErrors)) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      let signupPayload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || undefined,
      };

      let result;
      if (selectedRole === 'teacher') {
        // Only include school_code if it's a school account
        if (!isIndividualAccount && formData.school_code) {
          signupPayload.school_code = formData.school_code;
        }
        result = await dispatch(teacherSignup(signupPayload));
      } else if (selectedRole === 'student') {
        // Only include school_code if it's a school account
        if (!isIndividualAccount && formData.school_code) {
          signupPayload.school_code = formData.school_code;
        }
        if (formData.student_id) signupPayload.student_id = formData.student_id;
        if (formData.parent_email) signupPayload.parent_email = formData.parent_email;
        result = await dispatch(studentSignup(signupPayload));
      } else if (selectedRole === 'parent') {
        signupPayload.student_code = formData.student_code;
        result = await dispatch(parentSignup(signupPayload));
      }

      if (result?.meta?.requestStatus === 'fulfilled') {
        setLoading(false);
        toast.success(t('snackbar.signup.success'));
        navigate('/login');
      } else {
        setLoading(false);
        const errorMessage = result?.payload || t('signup.validation.signupFailed');
        // Check if user already exists - provide helpful message
        if (errorMessage.toLowerCase().includes('user already exists') || 
            errorMessage.toLowerCase().includes('already exists')) {
          toast.error(t('snackbar.signup.emailExists'));
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('Signup failed:', err);
      toast.error(t('snackbar.genericError'));
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('signup.title')}</h1>
        <p className="text-gray-600">{t('signup.subtitle')}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('signup.roleSelection.label')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['teacher', 'student', 'parent'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    // Reset individual account toggle when switching roles (parent always needs student_code)
                    if (role === 'parent') {
                      setIsIndividualAccount(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedRole === role
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t(`signup.roles.${role}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Account Type Selection (only for teacher and student) */}
          {(selectedRole === 'teacher' || selectedRole === 'student') && (
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isIndividualAccount}
                  onChange={(e) => {
                    setIsIndividualAccount(e.target.checked);
                    // Clear school_code when switching to individual account
                    if (e.target.checked) {
                      setFormData((prev) => ({ ...prev, school_code: '' }));
                      setErrors((prev) => ({ ...prev, school_code: '' }));
                    }
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {t('signup.individualAccount.label')}
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                {isIndividualAccount 
                  ? t('signup.individualAccount.descriptionIndividual')
                  : t('signup.individualAccount.descriptionSchool')}
              </p>
            </div>
          )}

          <CustomInput
            label={t('signup.fields.firstName')}
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            placeholder={t('signup.placeholders.firstName')}
            error={!!errors.first_name}
            errorMsg={errors.first_name}
            required
          />

          <CustomInput
            label={t('signup.fields.lastName')}
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            placeholder={t('signup.placeholders.lastName')}
            error={!!errors.last_name}
            errorMsg={errors.last_name}
            required
          />

          <CustomInput
            label={t('signup.fields.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('login.emailPlaceholder')}
            error={!!errors.email}
            errorMsg={errors.email}
            required
          />

          <CustomInput
            label={t('signup.fields.phoneOptional')}
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1234567890"
            error={!!errors.phone}
            errorMsg={errors.phone}
          />

          {selectedRole === 'teacher' && !isIndividualAccount && (
            <CustomInput
              label={t('signup.fields.schoolCode')}
              name="school_code"
              type="text"
              value={formData.school_code}
              onChange={handleChange}
              placeholder={t('signup.fields.schoolCodePlaceholder')}
              error={!!errors.school_code}
              errorMsg={errors.school_code}
              required
            />
          )}

          {selectedRole === 'student' && !isIndividualAccount && (
            <>
              <CustomInput
                label={t('signup.fields.schoolCode')}
                name="school_code"
                type="text"
                value={formData.school_code}
                onChange={handleChange}
                placeholder={t('signup.fields.schoolCodePlaceholder')}
                error={!!errors.school_code}
                errorMsg={errors.school_code}
                required
              />
              <CustomInput
                label={t('signup.fields.studentId')}
                name="student_id"
                type="text"
                value={formData.student_id}
                onChange={handleChange}
                placeholder={t('signup.fields.studentIdPlaceholder')}
                error={!!errors.student_id}
                errorMsg={errors.student_id}
              />
              <CustomInput
                label={t('signup.fields.parentEmail')}
                name="parent_email"
                type="email"
                value={formData.parent_email}
                onChange={handleChange}
                placeholder="parent@example.com"
                error={!!errors.parent_email}
                errorMsg={errors.parent_email}
              />
            </>
          )}

          {selectedRole === 'parent' && (
            <CustomInput
              label={t('signup.fields.studentCode')}
              name="student_code"
              type="text"
              value={formData.student_code}
              onChange={handleChange}
              placeholder={t('signup.fields.studentCodePlaceholder')}
              error={!!errors.student_code}
              errorMsg={errors.student_code}
              required
            />
          )}

          <CustomInput
            label={t('signup.fields.password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('resetPassword.passwordPlaceholder')}
            error={!!errors.password}
            errorMsg={errors.password}
            required
          />
          <p className="mt-1 text-xs text-gray-500">{t('signup.passwordHint')}</p>

          <CustomInput
            label={t('signup.fields.confirmPassword')}
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
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('signup.creatingAccount') : t('signup.createAccount')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('signup.entry.alreadyHaveAccount')}{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('signup.entry.signIn')}
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

