import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { signup } from '../../redux/features/auth/signupSlice';
import { AppDispatch } from '../../redux/store';
import { LanguageSearchDropdown } from '../../components/shared/LanguageSearchDropdown';
import { useAuthLanguage } from '../../hooks/useAuthLanguage';

const INSTITUTION_TYPE_KEYS = [
  'k12School',
  'college',
  'university',
  'trainingCenter',
  'other',
] as const;

const INSTITUTION_TYPE_VALUES: Record<(typeof INSTITUTION_TYPE_KEYS)[number], string> = {
  k12School: 'k12_school',
  college: 'college',
  university: 'university',
  trainingCenter: 'training_center',
  other: 'other',
};

const InstitutionAdminSignup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLanguage, handleLanguageChange } = useAuthLanguage();
  const { loading, error, success } = useSelector((state: any) => state.signup);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Admin account
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    // Institution details
    institution_name: '',
    institution_slug: '',
    institution_type: 'k12_school',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = t('signup.validation.emailRequired');
    if (!formData.password) newErrors.password = t('signup.validation.passwordRequired');
    if (formData.password.length < 10) newErrors.password = t('signup.validation.passwordMinLength');
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('signup.validation.passwordsMismatch');
    if (!formData.first_name) newErrors.first_name = t('signup.validation.firstNameRequired');
    if (!formData.last_name) newErrors.last_name = t('signup.validation.lastNameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.institution_name) newErrors.institution_name = t('signup.validation.institutionNameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Allow navigation between steps but prevent actual submission
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
    // Don't submit on step 2 - form is coming soon
  };

  const handleSubmit = async () => {
    const signupData = {
      role: 'institution_admin',
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
      language: selectedLanguage,
      institution: {
        name: formData.institution_name,
        slug: formData.institution_slug || formData.institution_name.toLowerCase().replace(/\s+/g, '-'),
        institution_type: formData.institution_type,
      },
    };

    try {
      await dispatch(signup(signupData)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">{t('signup.institution.successTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('signup.institution.successBody')}</p>
          <button
            onClick={() => {
              navigate('/login');
            }}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            {t('signup.institution.goToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 relative">
        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-4 rounded-t-lg -mt-8 -mx-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">🚀 {t('signup.institution.comingSoonTitle')}</h3>
              <p className="text-sm opacity-90">{t('signup.institution.comingSoonBody')}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <LanguageSearchDropdown
            value={selectedLanguage}
            onChange={handleLanguageChange}
            label={t('signup.fields.language')}
            placeholder={t('signup.languageSearch')}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('signup.institution.title')}</h2>

        <div className="mb-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-primary-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{t('signup.institution.stepAccount')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fields.email')} *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fields.password')} *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fields.confirmPassword')} *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fields.firstName')} *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fields.lastName')} *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.fields.phoneOptional')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{t('signup.institution.stepInstitution')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.institution.institutionName')} *</label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.institution_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.institution_name && (
                <p className="text-red-500 text-sm mt-1">{errors.institution_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.institution.institutionType')} *</label>
              <select
                name="institution_type"
                value={formData.institution_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {INSTITUTION_TYPE_KEYS.map((key) => (
                  <option key={key} value={INSTITUTION_TYPE_VALUES[key]}>
                    {t(`signup.institutionTypes.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('signup.institution.institutionSlug')}</label>
              <input
                type="text"
                name="institution_slug"
                value={formData.institution_slug}
                onChange={handleChange}
                placeholder={t('signup.institution.slugPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              {t('signup.institution.back')}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 2}
            className={`flex-1 py-2 px-4 rounded-md ${
              step === 2 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {step === 2 ? t('signup.institution.comingSoon') : t('signup.institution.next')}
          </button>
        </div>

        <button
          onClick={() => navigate('/signup')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          {t('signup.institution.backToSignup')}
        </button>
      </div>
    </div>
  );
};

export default InstitutionAdminSignup;
