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

export const SignUp = () => {
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
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!validateEmail(formData?.email)) newErrors.email = 'Invalid Email';
    if (!formData.password) newErrors.password = 'Password is required';
    
    // Password strength validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.length) {
      newErrors.password = 'Password must be at least 10 characters';
    } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validation
    // School code is only required for school accounts (not individual accounts)
    if (!isIndividualAccount) {
      if (selectedRole === 'teacher' && !formData.school_code) {
        newErrors.school_code = 'School code is required for school accounts';
      }
      if (selectedRole === 'student' && !formData.school_code) {
        newErrors.school_code = 'School code is required for school accounts';
      }
    }
    if (selectedRole === 'parent' && !formData.student_code) {
      newErrors.student_code = 'Student code is required';
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
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/login');
      } else {
        setLoading(false);
        const errorMessage = result?.payload || 'Signup failed. Please try again.';
        // Check if user already exists - provide helpful message
        if (errorMessage.toLowerCase().includes('user already exists') || 
            errorMessage.toLowerCase().includes('already exists')) {
          toast.error('This email is already registered. Please login instead or use a different email.');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('Signup failed:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join Teacher Assistant today</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
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
                  {role.charAt(0).toUpperCase() + role.slice(1)}
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
                  Create individual account (without school)
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                {isIndividualAccount 
                  ? 'Your account will be created as an individual account without school association.'
                  : 'Select a school to join by entering the school code below.'}
              </p>
            </div>
          )}

          <CustomInput
            label="First Name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="John"
            error={!!errors.first_name}
            errorMsg={errors.first_name}
            required
          />

          <CustomInput
            label="Last Name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Doe"
            error={!!errors.last_name}
            errorMsg={errors.last_name}
            required
          />

          <CustomInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={!!errors.email}
            errorMsg={errors.email}
            required
          />

          <CustomInput
            label="Phone (Optional)"
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
              label="School Code"
              name="school_code"
              type="text"
              value={formData.school_code}
              onChange={handleChange}
              placeholder="Enter school code"
              error={!!errors.school_code}
              errorMsg={errors.school_code}
              required
            />
          )}

          {selectedRole === 'student' && !isIndividualAccount && (
            <>
              <CustomInput
                label="School Code"
                name="school_code"
                type="text"
                value={formData.school_code}
                onChange={handleChange}
                placeholder="Enter school code"
                error={!!errors.school_code}
                errorMsg={errors.school_code}
                required
              />
              <CustomInput
                label="Student ID (Optional)"
                name="student_id"
                type="text"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="Enter student ID"
                error={!!errors.student_id}
                errorMsg={errors.student_id}
              />
              <CustomInput
                label="Parent Email (Optional)"
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
              label="Student Code"
              name="student_code"
              type="text"
              value={formData.student_code}
              onChange={handleChange}
              placeholder="Enter student code"
              error={!!errors.student_code}
              errorMsg={errors.student_code}
              required
            />
          )}

          <CustomInput
            label="Password"
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
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

