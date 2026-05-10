import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../hooks/useSnackbar';
import { CustomInput, CustomButton, ProfilePictureUpload, SelectDropdown } from '../components/shared';
import { getProfileDetails, updateProfile, changePassword, updateUserEmail } from '../redux/features/auth/authSlice';
import {
  fetchProfileMetadata,
  fetchRegions,
  updateProfileContext,
  clearProfileContextError,
  clearProfileContextSuccess,
} from '../redux/features/profileContext/profileContextSlice';
import { fetchTeacherIdentity } from '../redux/features/teacherIdentity/teacherIdentitySlice';
import { fetchLearningHubHome } from '../redux/features/learningHub/learningHubSlice';
import {
  PERSONALIZATION_ENABLED,
  fetchLearningHubSlate,
  syncHubAfterMutation,
  preflightProfileChange,
  clearPreflightResult,
  resetPersonalization,
  clearHubSyncStatus,
} from '../redux/features/personalization/personalizationSlice';
import { PersonalizationImpactModal } from '../features/personalization/PersonalizationImpactModal';
import type { PreflightResult } from '../features/personalization/PersonalizationImpactModal';
import ProfileProfessionalIdentitySection from './ProfileProfessionalIdentitySection';
import { setAuthToken } from '../redux/http';
import { validateEmail, validatePassword } from '../utils/utils';
import { baseURL } from '../redux/constant';
import { Lock, User, Mail, Phone, AtSign, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const { profileDetails, loading, error, updatePasswordLoading, user } = useSelector((state) => state.auth);
  const legacyLearningHubHome = useSelector((state) => state.learningHub?.home);
  const hubProfileCompleteness = useSelector((state) => state.personalization?.hubProfileCompleteness);
  const hubSyncStatus = useSelector((state) => state.personalization?.hubSyncStatus ?? 'idle');
  const hubSyncError = useSelector((state) => state.personalization?.hubSyncError);
  const learningHubHome = PERSONALIZATION_ENABLED
    ? { profile_completeness: hubProfileCompleteness }
    : legacyLearningHubHome;
  const {
    countries,
    regions,
    subjects,
    curriculums,
    gradeBands,
    schoolTypes,
    languages,
    yearsExperience,
    loading: metadataLoading,
    regionsLoading,
    saving: contextSaving,
    error: contextError,
    success: contextSuccess,
  } = useSelector((state) => state.profileContext) ?? {};
  
  // Helper function to format role name professionally
  const formatRoleName = (role) => {
    if (!role) return '';
    
    const roleStr = typeof role === 'string' ? role : (role?.name ? (typeof role.name === 'string' ? role.name : role.name?.value || role.name?.toString() || '') : role?.toString() || '');
    
    // Map role names to display format
    const roleMap = {
      'super_admin': 'Super Admin',
      'org_admin': 'Organization Admin',
      'organization_admin': 'Organization Admin',
      'school_admin': 'School Admin',
      'institution_admin': 'Institution Admin',
      'teacher': 'Teacher',
      'student': 'Student',
      'parent': 'Parent',
    };
    
    return roleMap[roleStr.toLowerCase()] || roleStr
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    if (!role) return 'bg-gray-100 text-gray-700';
    
    const roleStr = typeof role === 'string' ? role : (role?.name ? (typeof role.name === 'string' ? role.name : role.name?.value || role.name?.toString() || '') : role?.toString() || '').toLowerCase();
    
    const colorMap = {
      'super_admin': 'bg-purple-100 text-purple-700',
      'org_admin': 'bg-blue-100 text-blue-700',
      'organization_admin': 'bg-blue-100 text-blue-700',
      'school_admin': 'bg-indigo-100 text-indigo-700',
      'institution_admin': 'bg-indigo-100 text-indigo-700',
      'teacher': 'bg-green-100 text-green-700',
      'student': 'bg-amber-100 text-amber-700',
      'parent': 'bg-teal-100 text-teal-700',
    };
    
    return colorMap[roleStr] || 'bg-gray-100 text-gray-700';
  };
  
  // Get user role - handle enum format
  const getUserRole = () => {
    try {
      // Try profileDetails roles first
      if (profileDetails?.roles && Array.isArray(profileDetails.roles) && profileDetails.roles.length > 0) {
        const firstRole = profileDetails.roles[0];
        if (firstRole?.name) {
          // Handle enum format: role.name.value or role.name directly
          if (typeof firstRole.name === 'string') {
            return firstRole.name;
          }
          const roleValue = firstRole.name?.value || firstRole.name?.toString() || '';
          return roleValue || null;
        }
      }
      // Fallback to user.role
      return user?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };
  
  const userRole = getUserRole();
  const formattedRole = userRole ? formatRoleName(userRole) : '';
  const roleBadgeColor = userRole ? getRoleBadgeColor(userRole) : 'bg-gray-100 text-gray-700';
  const isStudent = String(userRole || '').toLowerCase() === 'student';

  // Active tab state
  const [activeTab, setActiveTab] = useState('account');

  // Profile Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
  });

  // Initial form data for change detection
  const [initialFormData, setInitialFormData] = useState(null);

  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile picture state
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email change warning
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState(false);

  // Personalization preflight modal state
  const [preflightModal, setPreflightModal] = useState<{
    open: boolean
    preflight: PreflightResult | null
    pendingPayload: object | null
  }>({ open: false, preflight: null, pendingPayload: null });
  const [contextSavingAfterPreflight, setContextSavingAfterPreflight] = useState(false);

  // Teaching context form state
  const [contextForm, setContextForm] = useState({
    country: '',
    region: '',
    school_type: '',
    grade_band: '',
    subjects: [],
    language_preference: '',
    school_name: '',
    city: '',
    postal_code: '',
    curriculum_framework: '',
    years_experience: '',
    professional_goals: [],
  });
  const [initialContextForm, setInitialContextForm] = useState(null);
  const [contextFormErrors, setContextFormErrors] = useState({});

  // Load profile data on mount
  useEffect(() => {
    dispatch(getProfileDetails());
  }, [dispatch]);

  // Ensure students never land on teaching-only tab
  useEffect(() => {
    if (isStudent && activeTab === 'teaching-profile') {
      setActiveTab('account');
    }
  }, [isStudent, activeTab]);

  // Fetch profile metadata (dropdown options) on mount
  useEffect(() => {
    dispatch(fetchProfileMetadata());
  }, [dispatch]);

  // Fetch teacher identity data when on profile tab / on mount
  useEffect(() => {
    dispatch(fetchTeacherIdentity());
  }, [dispatch]);

  // Load hub profile completeness: personalization path uses GET /learning-hub/home slate payload
  useEffect(() => {
    if (PERSONALIZATION_ENABLED) {
      dispatch(fetchLearningHubSlate());
    } else if (!legacyLearningHubHome) {
      dispatch(fetchLearningHubHome());
    }
  }, [dispatch, legacyLearningHubHome]);

  // Populate form when profileDetails loads
  useEffect(() => {
    if (profileDetails) {
      const data = {
        first_name: profileDetails.first_name || '',
        last_name: profileDetails.last_name || '',
        email: profileDetails.email || '',
        phone: profileDetails.phone || '',
        username: profileDetails.username || '',
      };
      
      setFormData(data);
      setInitialFormData(data);
      
      // Set profile picture URL
      if (profileDetails.profile_picture_url) {
        const urlValue = profileDetails.profile_picture_url;
        let fullUrl;
        
        if (urlValue.startsWith('http')) {
          fullUrl = urlValue;
        } else if (urlValue.startsWith('/')) {
          fullUrl = `${baseURL}${urlValue}`;
        } else {
          fullUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
        }
        
        setProfilePictureUrl(fullUrl);
      } else {
        setProfilePictureUrl(null);
      }

      // Prefill teaching context from teacher_context
      const tc = profileDetails.teacher_context;
      if (tc) {
        const ctxData = {
          country: tc.country || '',
          region: tc.region || '',
          school_type: tc.school_type || '',
          grade_band: tc.grade_band || '',
          subjects: Array.isArray(tc.subjects) ? tc.subjects : [],
          language_preference: tc.language_preference || '',
          school_name: tc.school_name || '',
          city: tc.city || '',
          postal_code: tc.postal_code || '',
          curriculum_framework: tc.curriculum_framework || '',
          years_experience: tc.years_experience || '',
          professional_goals: Array.isArray(tc.professional_goals) ? tc.professional_goals : [],
        };
        setContextForm(ctxData);
        setInitialContextForm(ctxData);
      } else {
        const empty = {
          country: '',
          region: '',
          school_type: '',
          grade_band: '',
          subjects: [],
          language_preference: '',
          school_name: '',
          city: '',
          postal_code: '',
          curriculum_framework: '',
          years_experience: '',
          professional_goals: [],
        };
        setContextForm(empty);
        setInitialContextForm(empty);
      }
    }
  }, [profileDetails]);

  // When country changes, fetch regions and reset region
  useEffect(() => {
    if (contextForm.country) {
      dispatch(fetchRegions(contextForm.country));
    } else {
      setContextForm((prev) => ({ ...prev, region: '' }));
    }
  }, [contextForm.country, dispatch]);

  // When regions load, clear region if it is not in the list for current country
  useEffect(() => {
    if (!contextForm.region || !Array.isArray(regions) || regions.length === 0) return;
    const values = regions.map((r) => r.value || r);
    if (!values.includes(contextForm.region)) {
      setContextForm((prev) => ({ ...prev, region: '' }));
    }
  }, [regions]);

  // Resolve dropdown value (option object -> value string)
  const resolveValue = (v) => {
    if (v == null || v === '') return '';
    if (typeof v === 'object' && v !== null && 'value' in v) return v.value ?? '';
    return String(v);
  };

  // Handle teaching context field change (single value or dropdown option object)
  const handleContextChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const countryVal = resolveValue(value);
      setContextForm((prev) => ({ ...prev, country: countryVal, region: '' }));
      dispatch(fetchRegions(countryVal));
    } else if (name === 'subjects') {
      const arr = Array.isArray(value) ? value.map((o) => (typeof o === 'string' ? o : o?.value)).filter(Boolean) : [];
      setContextForm((prev) => ({ ...prev, subjects: arr }));
    } else if (name === 'professional_goals') {
      const arr = Array.isArray(value) ? value : [];
      setContextForm((prev) => ({ ...prev, professional_goals: arr }));
    } else {
      setContextForm((prev) => ({ ...prev, [name]: resolveValue(value) ?? '' }));
    }
    setContextFormErrors((prev) => ({ ...prev, [name]: '' }));
    dispatch(clearProfileContextError());
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if email is being changed
    if (name === 'email' && initialFormData && value !== initialFormData.email) {
      if (!showEmailWarning && !pendingEmailChange) {
        setShowEmailWarning(true);
        setPendingEmailChange(true);
      }
    } else if (name === 'email' && initialFormData && value === initialFormData.email) {
      setShowEmailWarning(false);
      setPendingEmailChange(false);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Validate profile form
  const validateForm = () => {
    const errors = {};

    if (!formData.first_name || formData.first_name.trim().length === 0) {
      errors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length > 100) {
      errors.first_name = 'First name must be 100 characters or less';
    }

    if (!formData.last_name || formData.last_name.trim().length === 0) {
      errors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length > 100) {
      errors.last_name = 'Last name must be 100 characters or less';
    }

    if (!formData.email || formData.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.phone && formData.phone.trim().length > 20) {
      errors.phone = 'Phone number must be 20 characters or less';
    }

    if (formData.username) {
      const username = formData.username.trim();
      if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (username.length > 100) {
        errors.username = 'Username must be 100 characters or less';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.current_password) {
      errors.current_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      errors.new_password = 'New password is required';
    } else {
      const passwordValidation = validatePassword(passwordData.new_password);
      if (!passwordValidation.length) {
        errors.new_password = 'Password must be at least 10 characters';
      } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
        errors.new_password = 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = 'Please confirm your new password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if profile form has changes
  const hasChanges = () => {
    if (!initialFormData) return false;

    const textFieldsChanged = 
      formData.first_name !== initialFormData.first_name ||
      formData.last_name !== initialFormData.last_name ||
      formData.email !== initialFormData.email ||
      formData.phone !== initialFormData.phone ||
      formData.username !== initialFormData.username;

    const pictureChanged = profilePictureFile !== null || removeProfilePicture;

    return textFieldsChanged || pictureChanged;
  };

  // Validate teaching context (required fields for PATCH)
  const validateContextForm = () => {
    const errors = {};
    if (!contextForm.country?.trim()) errors.country = 'Country is required';
    if (!contextForm.region?.trim()) errors.region = 'Region is required';
    if (!contextForm.school_type?.trim()) errors.school_type = 'School type is required';
    if (!contextForm.grade_band?.trim()) errors.grade_band = 'Grade band is required';
    if (!Array.isArray(contextForm.subjects) || contextForm.subjects.length === 0) {
      errors.subjects = 'At least one subject is required';
    }
    if (!contextForm.language_preference?.trim()) errors.language_preference = 'Language preference is required';
    setContextFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasContextChanges = () => {
    if (!initialContextForm) return false;
    const c = contextForm;
    const i = initialContextForm;
    return (
      c.country !== i.country ||
      c.region !== i.region ||
      c.school_type !== i.school_type ||
      c.grade_band !== i.grade_band ||
      JSON.stringify([...(c.subjects || [])].sort()) !== JSON.stringify([...(i.subjects || [])].sort()) ||
      c.language_preference !== i.language_preference ||
      (c.school_name || '') !== (i.school_name || '') ||
      (c.city || '') !== (i.city || '') ||
      (c.postal_code || '') !== (i.postal_code || '') ||
      (c.curriculum_framework || '') !== (i.curriculum_framework || '') ||
      (c.years_experience || '') !== (i.years_experience || '') ||
      JSON.stringify([...(c.professional_goals || [])].sort()) !== JSON.stringify([...(i.professional_goals || [])].sort())
    );
  };

  /** Build the teaching_context payload from current form state. */
  const buildTeachingContextPayload = () => ({
    teaching_context: {
      country: contextForm.country.trim(),
      region: contextForm.region.trim(),
      school_type: contextForm.school_type.trim(),
      grade_band: contextForm.grade_band.trim(),
      subjects: contextForm.subjects || [],
      language_preference: contextForm.language_preference.trim(),
      ...(contextForm.school_name?.trim() && { school_name: contextForm.school_name.trim() }),
      ...(contextForm.city?.trim() && { city: contextForm.city.trim() }),
      ...(contextForm.postal_code?.trim() && { postal_code: contextForm.postal_code.trim() }),
      ...(contextForm.curriculum_framework?.trim() && { curriculum_framework: contextForm.curriculum_framework.trim() }),
      ...(contextForm.years_experience?.trim() && { years_experience: contextForm.years_experience.trim() }),
      ...(Array.isArray(contextForm.professional_goals) && contextForm.professional_goals.length > 0 && { professional_goals: contextForm.professional_goals }),
    },
  });

  /** Perform the actual PATCH after confirmation (or after preflight shows noop/minor). */
  const executeTeachingContextSave = async (payload: object, severity?: string) => {
    const result = await dispatch(updateProfileContext(payload));
    if (updateProfileContext.fulfilled.match(result)) {
      dispatch(clearProfileContextSuccess());
      dispatch(clearHubSyncStatus());
      dispatch(getProfileDetails());
      const sync = result.payload?.personalization_sync;
      if (PERSONALIZATION_ENABLED) {
        if (sync && sync.status === 'queued') {
          toast.success('Profile saved.');
          if (severity === 'major_reset' || sync.severity === 'major_reset') {
            toast.info('Rebuilding your personalized recommendations…');
            await dispatch(resetPersonalization());
          } else {
            toast.info('Updating recommendations…');
          }
          await dispatch(syncHubAfterMutation(sync));
          toast.success('Recommendations updated.');
        } else {
          // Non-queued path: always re-fetch slate to pick up fresh content/banner
          if (severity === 'major_reset') {
            await dispatch(resetPersonalization());
          }
          await dispatch(fetchLearningHubSlate());
          toast.success('Teaching context saved successfully.');
        }
      } else {
        dispatch(fetchLearningHubHome());
        toast.success('Teaching context saved successfully.');
      }
      setInitialContextForm({ ...contextForm });
    }
  };

  const handleSaveTeachingContext = async () => {
    if (!validateContextForm()) return;
    const payload = buildTeachingContextPayload();

    if (!PERSONALIZATION_ENABLED) {
      // Legacy path: save directly, no preflight
      await executeTeachingContextSave(payload);
      return;
    }

    // Preflight: evaluate impact before saving
    const preflightAction = await dispatch(
      preflightProfileChange(payload.teaching_context)
    );

    if (!preflightProfileChange.fulfilled.match(preflightAction)) {
      // Preflight failed — fall back to direct save with a warning toast
      toast.info('Impact check unavailable — saving directly.');
      await executeTeachingContextSave(payload);
      return;
    }

    const preflight = preflightAction.payload as PreflightResult;

    if (preflight.severity === 'major_reset') {
      // Show blocking confirmation modal
      setPreflightModal({ open: true, preflight, pendingPayload: payload });
      return;
    }

    if (preflight.severity === 'minor_recompute' && preflight.changed_fields.length > 0) {
      // Non-blocking info toast, then save
      toast.info('Profile saved. Your recommendations will update in the background.');
    }

    await executeTeachingContextSave(payload, preflight.severity);
    dispatch(clearPreflightResult());
  };

  /** Called when user confirms in the MAJOR_RESET modal. */
  const handlePreflightConfirm = async () => {
    if (!preflightModal.pendingPayload) return;
    setContextSavingAfterPreflight(true);
    setPreflightModal((prev) => ({ ...prev, open: false }));
    try {
      await executeTeachingContextSave(preflightModal.pendingPayload, 'major_reset');
    } finally {
      setContextSavingAfterPreflight(false);
      dispatch(clearPreflightResult());
      setPreflightModal({ open: false, preflight: null, pendingPayload: null });
    }
  };

  /** Called when user cancels in the modal. */
  const handlePreflightCancel = () => {
    dispatch(clearPreflightResult());
    setPreflightModal({ open: false, preflight: null, pendingPayload: null });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      setRemoveProfilePicture(false);
    }
  };

  // Handle profile picture remove
  const handleProfilePictureRemove = () => {
    setProfilePictureFile(null);
    setRemoveProfilePicture(true);
    setProfilePictureUrl(null);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!hasChanges()) {
      toast.info('No changes to save');
      return;
    }

    // Warn about email change requiring re-login
    const emailChanged = initialFormData && formData.email !== initialFormData.email;
    if (emailChanged && !showEmailWarning) {
      setShowEmailWarning(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      if (initialFormData) {
        if (formData.first_name !== initialFormData.first_name) {
          submitFormData.append('first_name', formData.first_name.trim());
        }
        if (formData.last_name !== initialFormData.last_name) {
          submitFormData.append('last_name', formData.last_name.trim());
        }
        if (formData.email !== initialFormData.email) {
          submitFormData.append('email', formData.email.trim().toLowerCase());
        }
        // Only send phone if it's changed and not empty
        if (formData.phone !== initialFormData.phone) {
          const phoneValue = formData.phone.trim();
          if (phoneValue) {
            submitFormData.append('phone', phoneValue);
          } else {
            // If phone is cleared (empty), send empty string to remove it
            submitFormData.append('phone', '');
          }
        }
        // Only send username if it's changed and not empty
        if (formData.username !== initialFormData.username) {
          const usernameValue = formData.username.trim();
          if (usernameValue) {
            submitFormData.append('username', usernameValue);
          } else {
            // If username is cleared (empty), send empty string to remove it
            submitFormData.append('username', '');
          }
        }
      } else {
        submitFormData.append('first_name', formData.first_name.trim());
        submitFormData.append('last_name', formData.last_name.trim());
        submitFormData.append('email', formData.email.trim().toLowerCase());
        // Only append optional fields if they have values
        const phoneValue = formData.phone.trim();
        if (phoneValue) {
          submitFormData.append('phone', phoneValue);
        }
        const usernameValue = formData.username.trim();
        if (usernameValue) {
          submitFormData.append('username', usernameValue);
        }
      }

      if (removeProfilePicture) {
        submitFormData.append('remove_profile_picture', 'true');
      } else if (profilePictureFile) {
        submitFormData.append('profile_picture', profilePictureFile);
      }

      const result = await dispatch(updateProfile(submitFormData));

      if (result?.meta?.requestStatus === 'fulfilled') {
        const response = result.payload;
        
        // Check if email was changed and handle new token
        const emailChanged = initialFormData && formData.email !== initialFormData.email;
        
        if (emailChanged && response?.access_token) {
          // Update auth token without logout
          setAuthToken(response.access_token);
          localStorage.setItem('access_token', response.access_token);
          
          // Update Redux user state with new email
          if (response.email) {
            dispatch(updateUserEmail({
              email: response.email,
              email_verified: false
            }));
          }
          
          toast.success(response.message || 'Email updated successfully! Please check your new email for verification.');
        } else {
          toast.success('Profile updated successfully!');
        }
        
        // Clear form state
        setProfilePictureFile(null);
        setRemoveProfilePicture(false);
        setShowEmailWarning(false);
        setPendingEmailChange(false);
        
        // Refresh profile data to get updated data (including username removal)
        const refreshResult = await dispatch(getProfileDetails());
        if (refreshResult?.meta?.requestStatus === 'fulfilled') {
          // Update all form data with refreshed profile data
          const updatedProfile = refreshResult.payload;
          setInitialFormData(updatedProfile);
          setFormData({
            first_name: updatedProfile.first_name || '',
            last_name: updatedProfile.last_name || '',
            email: updatedProfile.email || '',
            phone: updatedProfile.phone || '',
            username: updatedProfile.username || '',
          });
          
          // Update profile picture URL from refreshed data
          if (updatedProfile?.profile_picture_url) {
            const urlValue = updatedProfile.profile_picture_url;
            let fullUrl;
            if (urlValue.startsWith('http')) {
              fullUrl = urlValue;
            } else if (urlValue.startsWith('/')) {
              fullUrl = `${baseURL}${urlValue}`;
            } else {
              fullUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
            }
            setProfilePictureUrl(fullUrl);
          } else {
            setProfilePictureUrl(null);
          }
        }
      } else {
        const errorMessage = result?.payload || error || 'Failed to update profile';
        if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        } else if (errorMessage?.detail) {
          toast.error(errorMessage.detail);
        } else {
          toast.error('Failed to update profile. Please try again.');
        }
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await dispatch(changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      }));

      if (result?.meta?.requestStatus === 'fulfilled') {
        toast.success('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setPasswordErrors({});
      } else {
        const errorMessage = result?.payload || 'Failed to change password';
        if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        } else if (errorMessage?.detail) {
          toast.error(errorMessage.detail);
        } else {
          toast.error('Failed to change password. Please try again.');
        }
      }
    } catch (err) {
      console.error('Password change error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Loading state
  if (loading && !profileDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-danger mb-4">Failed to load profile data</p>
          <CustomButton
            onClick={() => dispatch(getProfileDetails())}
            className="!bg-primary !text-white"
          >
            Retry
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Personalization impact modal (MAJOR_RESET confirmation) */}
      {preflightModal.open && preflightModal.preflight && (
        <PersonalizationImpactModal
          preflight={preflightModal.preflight}
          onConfirm={handlePreflightConfirm}
          onCancel={handlePreflightCancel}
          isSaving={contextSavingAfterPreflight}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              {formattedRole && formattedRole.trim() && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColor || 'bg-gray-100 text-gray-700'}`}>
                  {formattedRole}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your account information and security</p>
          </div>
        </div>
      </div>

      {PERSONALIZATION_ENABLED && hubSyncStatus === 'updating' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900">
          Updating recommendations for your Professional Learning Hub…
        </div>
      )}
      {PERSONALIZATION_ENABLED && hubSyncStatus === 'failed' && hubSyncError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-900 flex flex-wrap items-center justify-between gap-2">
          <span>{hubSyncError}</span>
          <button
            type="button"
            onClick={() => dispatch(fetchLearningHubSlate())}
            className="text-sm font-medium text-amber-900 underline"
          >
            Refresh hub data
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'account'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Account & Security
              </div>
            </button>
            {isStudent ? (
              <button
                onClick={() => setActiveTab('student-profile')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'student-profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Student Profile
                </div>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('teaching-profile')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'teaching-profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Teaching Profile
                </div>
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Account & Security Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile completeness (from Learning Hub home) */}
              {learningHubHome?.profile_completeness != null && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Profile completeness: {Math.round((learningHubHome.profile_completeness?.score ?? 0) * 100)}%
                  </p>
                  {Array.isArray(learningHubHome.profile_completeness?.missing_fields) &&
                    learningHubHome.profile_completeness.missing_fields.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Complete these to improve AI recommendations:{' '}
                      {learningHubHome.profile_completeness.missing_fields
                        .map((f) => f.replace(/_/g, ' '))
                        .join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Email Change Warning */}
              {showEmailWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">Email Change Notice</h3>
                    <p className="text-sm text-amber-700">
                      Changing your email address will send a verification email to your new address. 
                      Please check your new email and verify it to complete the change. You'll stay logged in.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailWarning(false);
                      setPendingEmailChange(false);
                      if (initialFormData) {
                        setFormData((prev) => ({ ...prev, email: initialFormData.email }));
                      }
                    }}
                    className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Profile Picture Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
                <ProfilePictureUpload
                  firstName={(() => {
                    // Use full name for initials: first_name + last_name
                    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();
                    return fullName || profileDetails?.full_name || profileDetails?.username || user?.full_name || user?.username || profileDetails?.first_name || 'User';
                  })()}
                  currentImageUrl={profilePictureUrl}
                  value={profilePictureFile}
                  onChange={handleProfilePictureChange}
                  onRemove={handleProfilePictureRemove}
                  showRemoveButton={!!profilePictureUrl || !!profilePictureFile}
                  disabled={isSubmitting || loading}
                  label=""
                  avatarSize="w-24 h-24 md:w-32 md:h-32"
                />
              </div>

              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <CustomInput
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!formErrors.first_name}
                      errorMsg={formErrors.first_name}
                      required
                      disabled={isSubmitting || loading}
                      placeholder="Enter your first name"
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <CustomInput
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!formErrors.last_name}
                      errorMsg={formErrors.last_name}
                      required
                      disabled={isSubmitting || loading}
                      placeholder="Enter your last name"
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <CustomInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!formErrors.email}
                      errorMsg={formErrors.email}
                      required
                      disabled={isSubmitting || loading}
                      placeholder="Enter your email"
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <CustomInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!formErrors.phone}
                      errorMsg={formErrors.phone}
                      disabled={isSubmitting || loading}
                      placeholder="Enter your phone number"
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </div>

                  {/* Username */}
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!formErrors.username}
                      errorMsg={formErrors.username}
                      disabled={isSubmitting || loading}
                      placeholder="Enter your username (optional)"
                      icon={<AtSign className="w-4 h-4" />}
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">Choose a unique username for your profile</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <CustomButton
                  type="button"
                  onClick={() => {
                    if (initialFormData) {
                      setFormData(initialFormData);
                      setFormErrors({});
                      setProfilePictureFile(null);
                      setRemoveProfilePicture(false);
                      setShowEmailWarning(false);
                      setPendingEmailChange(false);
                      if (profileDetails?.profile_picture_url) {
                        const urlValue = profileDetails.profile_picture_url;
                        let fullUrl;
                        if (urlValue.startsWith('http')) {
                          fullUrl = urlValue;
                        } else if (urlValue.startsWith('/')) {
                          fullUrl = `${baseURL}${urlValue}`;
                        } else {
                          fullUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
                        }
                        setProfilePictureUrl(fullUrl);
                      } else {
                        setProfilePictureUrl(null);
                      }
                    }
                  }}
                  disabled={!hasChanges() || isSubmitting || loading}
                  variant="outlined"
                  className="!h-10 !min-w-[120px] !rounded-lg !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                  Cancel
                </CustomButton>
                
                <CustomButton
                  type="submit"
                  disabled={!hasChanges() || isSubmitting || loading}
                  loading={isSubmitting}
                  className="!h-10 !min-w-[140px] !rounded-lg !bg-primary !text-white hover:!bg-primary-dark"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </CustomButton>
              </div>
            </form>
            <form onSubmit={handlePasswordSubmit} className="space-y-6 w-full bg-gray-50 rounded-lg p-6 border border-gray-200 mt-2">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <div className="space-y-6">
                {/* Current Password */}
                <CustomInput
                  label="Current Password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.current_password}
                  errorMsg={passwordErrors.current_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder="Enter your current password"
                  icon={<Lock className="w-4 h-4" />}
                />

                {/* New Password */}
                <CustomInput
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.new_password}
                  errorMsg={passwordErrors.new_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder="Enter your new password"
                  icon={<Lock className="w-4 h-4" />}
                />

                {(passwordData.new_password || passwordData.confirm_password) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Password Requirements</h3>
                    </div>
                    <ul className="mt-3 grid gap-1.5 text-sm text-gray-700 sm:grid-cols-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>At least 10 characters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>Uppercase and lowercase letters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>At least one number</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>At least one special character</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Confirm Password */}
                <CustomInput
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.confirm_password}
                  errorMsg={passwordErrors.confirm_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder="Confirm your new password"
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <CustomButton
                  type="button"
                  onClick={() => {
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                    setPasswordErrors({});
                  }}
                  disabled={
                    !passwordData.current_password && !passwordData.new_password && !passwordData.confirm_password ||
                    isChangingPassword ||
                    updatePasswordLoading
                  }
                  variant="outlined"
                  className="!h-10 !min-w-[120px] !rounded-lg !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                  Clear
                </CustomButton>
                
                <CustomButton
                  type="submit"
                  disabled={
                    !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password ||
                    isChangingPassword ||
                    updatePasswordLoading
                  }
                  loading={isChangingPassword || updatePasswordLoading}
                  className="!h-10 !min-w-[140px] !rounded-lg !bg-primary !text-white hover:!bg-primary-dark"
                >
                  {isChangingPassword || updatePasswordLoading ? 'Changing...' : 'Change Password'}
                </CustomButton>
              </div>
            </form>
            </div>
          )}

          {/* Student Profile Tab */}
          {isStudent && activeTab === 'student-profile' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Student Profile</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  This profile is used for student onboarding context (stored locally in Phase 1).
                </p>

                {(() => {
                  const PROFILE_KEY = 'tutify_student_profile';
                  const CLASSES_KEY = 'tutify_student_classes';
                  const GOALS_KEY = 'tutify_student_goals';

                  let profile = { name: '', gradeLevel: '', timezone: '' };
                  let classes = { classes: '' };
                  let goals = { goals: '' };

                  try {
                    profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || profile;
                    classes = JSON.parse(localStorage.getItem(CLASSES_KEY) || 'null') || classes;
                    goals = JSON.parse(localStorage.getItem(GOALS_KEY) || 'null') || goals;
                  } catch (e) {
                    void e;
                  }

                  const save = () => {
                    try {
                      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
                      localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
                      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
                      toast('Student profile saved (local demo).', 'success');
                    } catch (err) {
                      console.error(err);
                      toast('Failed to save student profile.', 'error');
                    }
                  };

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <CustomInput
                          label="Name"
                          name="student_name"
                          value={profile.name || ''}
                          onChange={(e) => {
                            profile = { ...profile, name: e.target.value };
                          }}
                          placeholder="Alex"
                          icon={<User className="w-4 h-4" />}
                        />
                      </div>
                      <div>
                        <CustomInput
                          label="Grade / Level"
                          name="student_grade"
                          value={profile.gradeLevel || ''}
                          onChange={(e) => {
                            profile = { ...profile, gradeLevel: e.target.value };
                          }}
                          placeholder="Grade 10"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomInput
                          label="Timezone"
                          name="student_timezone"
                          value={profile.timezone || ''}
                          onChange={(e) => {
                            profile = { ...profile, timezone: e.target.value };
                          }}
                          placeholder="America/New_York"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomInput
                          label="Classes"
                          name="student_classes"
                          value={classes.classes || ''}
                          onChange={(e) => {
                            classes = { classes: e.target.value };
                          }}
                          placeholder="Math, Biology, English…"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomInput
                          label="Goals"
                          name="student_goals"
                          value={goals.goals || ''}
                          onChange={(e) => {
                            goals = { goals: e.target.value };
                          }}
                          placeholder="Improve algebra, prepare for next week’s exam…"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <CustomButton
                          type="button"
                          onClick={() => {
                            try {
                              localStorage.removeItem('tutify_student_onboarding_completed');
                              toast('Onboarding will show again next time.', 'success');
                            } catch (e) {
                              void e;
                            }
                          }}
                          variant="outlined"
                          className="!h-10 !min-w-[170px] !rounded-lg !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                        >
                          Reset onboarding
                        </CustomButton>

                        <CustomButton
                          type="button"
                          onClick={save}
                          className="!h-10 !min-w-[150px] !rounded-lg !bg-primary !text-white hover:!bg-primary-dark"
                        >
                          Save student profile
                        </CustomButton>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Teaching Profile Tab */}
          {!isStudent && activeTab === 'teaching-profile' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Teaching Context</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Completing your teaching context improves your Learning Hub recommendations.
                </p>
                {contextError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {contextError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <SelectDropdown label="Country" name="country" value={contextForm.country} onChange={handleContextChange} options={countries || []} disabled={metadataLoading} error={!!contextFormErrors.country} errorMsg={contextFormErrors.country} required placeholder="Select country" />
                  </div>
                  <div>
                    <SelectDropdown label="Region" name="region" value={contextForm.region} onChange={handleContextChange} options={regions || []} disabled={metadataLoading || regionsLoading || !contextForm.country} error={!!contextFormErrors.region} errorMsg={contextFormErrors.region} required placeholder={!contextForm.country ? 'Select country first' : 'Select region'} />
                  </div>
                  <div>
                    <SelectDropdown label="School type" name="school_type" value={contextForm.school_type} onChange={handleContextChange} options={schoolTypes || []} disabled={metadataLoading} error={!!contextFormErrors.school_type} errorMsg={contextFormErrors.school_type} required placeholder="Select school type" />
                  </div>
                  <div>
                    <SelectDropdown label="Grade band" name="grade_band" value={contextForm.grade_band} onChange={handleContextChange} options={gradeBands || []} disabled={metadataLoading} error={!!contextFormErrors.grade_band} errorMsg={contextFormErrors.grade_band} required placeholder="Select grade band" />
                  </div>
                  <div className="md:col-span-2">
                    <SelectDropdown label="Subjects" name="subjects" value={contextForm.subjects} onChange={handleContextChange} options={subjects || []} multiSelect disabled={metadataLoading} error={!!contextFormErrors.subjects} errorMsg={contextFormErrors.subjects} required placeholder="Select at least one subject" />
                  </div>
                  <div>
                    <SelectDropdown label="Language preference" name="language_preference" value={contextForm.language_preference} onChange={handleContextChange} options={languages || []} disabled={metadataLoading} error={!!contextFormErrors.language_preference} errorMsg={contextFormErrors.language_preference} required placeholder="Select language" />
                  </div>
                  <div>
                    <SelectDropdown label="Curriculum framework" name="curriculum_framework" value={contextForm.curriculum_framework} onChange={handleContextChange} options={curriculums || []} disabled={metadataLoading} placeholder="Select (optional)" />
                  </div>
                  <div>
                    <SelectDropdown label="Years of experience" name="years_experience" value={contextForm.years_experience} onChange={handleContextChange} options={yearsExperience || []} disabled={metadataLoading} placeholder="Select (optional)" />
                  </div>
                  <div>
                    <CustomInput label="School name" name="school_name" value={contextForm.school_name} onChange={(e) => handleContextChange({ target: { name: 'school_name', value: e.target.value } })} disabled={contextSaving} placeholder="Optional" icon={<BookOpen className="w-4 h-4" />} />
                  </div>
                  <div>
                    <CustomInput label="City" name="city" value={contextForm.city} onChange={(e) => handleContextChange({ target: { name: 'city', value: e.target.value } })} disabled={contextSaving} placeholder="Optional" />
                  </div>
                  <div>
                    <CustomInput label="Postal code" name="postal_code" value={contextForm.postal_code} onChange={(e) => handleContextChange({ target: { name: 'postal_code', value: e.target.value } })} disabled={contextSaving} placeholder="Optional" />
                  </div>
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Professional goals"
                      name="professional_goals"
                      value={Array.isArray(contextForm.professional_goals) ? contextForm.professional_goals.join(', ') : ''}
                      onChange={(e) => {
                        const raw = e.target.value || '';
                        const arr = raw.split(',').map((s) => s.trim()).filter(Boolean);
                        handleContextChange({ target: { name: 'professional_goals', value: arr } });
                      }}
                      disabled={contextSaving}
                      placeholder="Comma-separated (e.g. classroom management, differentiation)"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 mt-6">
                  <CustomButton
                    type="button"
                    onClick={handleSaveTeachingContext}
                    disabled={contextSaving || metadataLoading || !hasContextChanges()}
                    className="!h-10 !min-w-[170px] !rounded-lg !bg-primary !text-white hover:!bg-primary-dark"
                  >
                    {contextSaving ? 'Saving…' : 'Save teaching context'}
                  </CustomButton>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <ProfileProfessionalIdentitySection />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
