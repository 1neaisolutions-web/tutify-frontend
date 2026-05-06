import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../redux/features/auth/signupSlice';
import { AppDispatch } from '../../redux/store';

const OrganizationAdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
    // Organization details
    organization_name: '',
    organization_slug: '',
    // First institution
    institution_name: '',
    institution_slug: '',
    institution_type: 'k12_school',
    is_institution_admin: true,
    institution_admin_email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 10) newErrors.password = 'Password must be at least 10 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.organization_name) newErrors.organization_name = 'Organization name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.institution_name) newErrors.institution_name = 'Institution name is required';
    if (!formData.is_institution_admin && !formData.institution_admin_email) {
      newErrors.institution_admin_email = 'Institution admin email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Allow navigation between steps but prevent actual submission
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
    // Don't submit on step 3 - form is coming soon
  };

  const handleSubmit = async () => {
    const signupData: any = {
      role: 'org_admin',
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
      organization: {
        name: formData.organization_name,
        slug: formData.organization_slug || formData.organization_name.toLowerCase().replace(/\s+/g, '-'),
      },
      institution: {
        name: formData.institution_name,
        slug: formData.institution_slug || formData.institution_name.toLowerCase().replace(/\s+/g, '-'),
        institution_type: formData.institution_type,
      },
      is_institution_admin: formData.is_institution_admin,
    };

    if (!formData.is_institution_admin) {
      // Create invite for institution admin
      signupData.institution_admin_email = formData.institution_admin_email;
    }

    try {
      const result = await dispatch(signup(signupData)).unwrap();
      // Store tokens if they exist, but don't navigate yet - show success modal first
      if (result.tokens) {
        localStorage.setItem('access_token', result.tokens.access_token);
        localStorage.setItem('refresh_token', result.tokens.refresh_token);
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Signup Successful!</h2>
          <p className="text-gray-600 mb-4">Your organization has been created successfully.</p>
          <button
            onClick={() => {
              // Navigate to login page
              navigate('/login');
            }}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Login
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
              <h3 className="text-lg font-bold">🚀 Coming Soon</h3>
              <p className="text-sm opacity-90">Organization signup is currently under development. You can preview the form below.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Signup</h2>

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
            <div className={`flex-1 h-1 mx-2 ${
              step >= 3 ? 'bg-primary-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
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
            <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.organization_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.organization_name && (
                <p className="text-red-500 text-sm mt-1">{errors.organization_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Slug (Optional)</label>
              <input
                type="text"
                name="organization_slug"
                value={formData.organization_slug}
                onChange={handleChange}
                placeholder="Auto-generated if left empty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">First Institution</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type *</label>
              <select
                name="institution_type"
                value={formData.institution_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="k12_school">K-12 School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="training_center">Training Center</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Slug (Optional)</label>
              <input
                type="text"
                name="institution_slug"
                value={formData.institution_slug}
                onChange={handleChange}
                placeholder="Auto-generated if left empty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center">
              <input
                id="is-institution-admin"
                type="checkbox"
                name="is_institution_admin"
                checked={formData.is_institution_admin}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is-institution-admin" className="ml-2 block text-sm text-gray-700">
                I am also the Institution Admin
              </label>
            </div>

            {!formData.is_institution_admin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Admin Email *
                </label>
                <input
                  type="email"
                  name="institution_admin_email"
                  value={formData.institution_admin_email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.institution_admin_email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email for institution admin invite"
                />
                {errors.institution_admin_email && (
                  <p className="text-red-500 text-sm mt-1">{errors.institution_admin_email}</p>
                )}
              </div>
            )}
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
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 3}
            className={`flex-1 py-2 px-4 rounded-md ${
              step === 3 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {step === 3 ? 'Coming Soon' : 'Next'}
          </button>
        </div>

        <button
          onClick={() => navigate('/signup')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          ← Back to Signup Options
        </button>
      </div>
    </div>
  );
};

export default OrganizationAdminSignup;
