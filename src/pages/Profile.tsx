import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../hooks/useSnackbar';
import { CustomInput, CustomButton, ProfilePictureUpload, SelectDropdown, GradeSelect, GradeBandSelect } from '../components/shared';
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
import { gradeValueForSelect } from '@/catalog/adapters/gradeAdapters';
import { baseURL } from '../redux/constant';
import { Lock, User, Mail, Phone, AtSign, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
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
  
  const formatRoleName = (role) => {
    if (!role) return '';
    const roleStr = typeof role === 'string' ? role : (role?.name ? (typeof role.name === 'string' ? role.name : role.name?.value || role.name?.toString() || '') : role?.toString() || '');
    const key = `profile.roles.${roleStr.toLowerCase()}`;
    const translated = t(key);
    if (translated !== key) return translated;
    return roleStr
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      errors.first_name = t('profile.validation.firstNameRequired');
    } else if (formData.first_name.trim().length > 100) {
      errors.first_name = t('profile.validation.firstNameMax');
    }

    if (!formData.last_name || formData.last_name.trim().length === 0) {
      errors.last_name = t('profile.validation.lastNameRequired');
    } else if (formData.last_name.trim().length > 100) {
      errors.last_name = t('profile.validation.lastNameMax');
    }

    if (!formData.email || formData.email.trim().length === 0) {
      errors.email = t('profile.validation.emailRequired');
    } else if (!validateEmail(formData.email)) {
      errors.email = t('profile.validation.emailInvalid');
    }

    if (formData.phone && formData.phone.trim().length > 20) {
      errors.phone = t('profile.validation.phoneMax');
    }

    if (formData.username) {
      const username = formData.username.trim();
      if (username.length < 3) {
        errors.username = t('profile.validation.usernameMin');
      } else if (username.length > 100) {
        errors.username = t('profile.validation.usernameMax');
      } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.username = t('profile.validation.usernamePattern');
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.current_password) {
      errors.current_password = t('profile.validation.currentPasswordRequired');
    }

    if (!passwordData.new_password) {
      errors.new_password = t('profile.validation.newPasswordRequired');
    } else {
      const passwordValidation = validatePassword(passwordData.new_password);
      if (!passwordValidation.length) {
        errors.new_password = t('profile.validation.passwordMinLength');
      } else if (!passwordValidation.upper || !passwordValidation.lower || !passwordValidation.number || !passwordValidation.specialChar) {
        errors.new_password = t('profile.validation.passwordComplexity');
      }
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = t('profile.validation.confirmPasswordRequired');
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = t('profile.validation.passwordMismatch');
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
    if (!contextForm.country?.trim()) errors.country = t('profile.validation.countryRequired');
    if (!contextForm.region?.trim()) errors.region = t('profile.validation.regionRequired');
    if (!contextForm.school_type?.trim()) errors.school_type = t('profile.validation.schoolTypeRequired');
    if (!contextForm.grade_band?.trim()) errors.grade_band = t('profile.validation.gradeBandRequired');
    if (!Array.isArray(contextForm.subjects) || contextForm.subjects.length === 0) {
      errors.subjects = t('profile.validation.subjectsRequired');
    }
    if (!contextForm.language_preference?.trim()) errors.language_preference = t('profile.validation.languageRequired');
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
          toast.success(t('profile.savedSuccess'));
          if (severity === 'major_reset' || sync.severity === 'major_reset') {
            toast.info(t('profile.toast.rebuildingRecommendations'));
            await dispatch(resetPersonalization());
          } else {
            toast.info(t('profile.toast.updatingRecommendations'));
          }
          await dispatch(syncHubAfterMutation(sync));
          toast.success(t('profile.toast.recommendationsUpdated'));
        } else {
          // Non-queued path: always re-fetch slate to pick up fresh content/banner
          if (severity === 'major_reset') {
            await dispatch(resetPersonalization());
          }
          await dispatch(fetchLearningHubSlate());
          toast.success(t('profile.toast.teachingContextSaved'));
        }
      } else {
        dispatch(fetchLearningHubHome());
        toast.success(t('profile.toast.teachingContextSaved'));
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
      toast.info(t('profile.toast.preflightUnavailable'));
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
      toast.info(t('profile.toast.profileSavedBackground'));
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
      toast.error(t('profile.validation.fixFormErrors'));
      return;
    }

    if (!hasChanges()) {
      toast.info(t('profile.validation.noChanges'));
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
          
          toast.success(response.message || t('profile.toast.emailUpdated'));
        } else {
          toast.success(t('profile.toast.profileUpdated'));
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
        const errorMessage = result?.payload || error || t('profile.toast.updateFailed');
        if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        } else if (errorMessage?.detail) {
          toast.error(errorMessage.detail);
        } else {
          toast.error(t('profile.toast.updateFailedRetry'));
        }
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(t('profile.toast.unexpectedError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error(t('profile.validation.fixFormErrors'));
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await dispatch(changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      }));

      if (result?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('profile.toast.passwordChanged'));
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setPasswordErrors({});
      } else {
        const errorMessage = result?.payload || t('profile.toast.passwordChangeFailed');
        if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        } else if (errorMessage?.detail) {
          toast.error(errorMessage.detail);
        } else {
          toast.error(t('profile.toast.passwordChangeFailedRetry'));
        }
      }
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(t('profile.toast.unexpectedError'));
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
          <p className="text-gray-600">{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-danger mb-4">{t('profile.loadFailed')}</p>
          <CustomButton
            onClick={() => dispatch(getProfileDetails())}
            className="!bg-primary !text-white"
          >
            {t('profile.retry')}
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
              <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
              {formattedRole && formattedRole.trim() && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColor || 'bg-gray-100 text-gray-700'}`}>
                  {formattedRole}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('profile.subtitle')}</p>
          </div>
        </div>
      </div>

      {PERSONALIZATION_ENABLED && hubSyncStatus === 'updating' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900">
          {t('profile.hubSync.updating')}
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
            {t('profile.hubSync.refreshHubData')}
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
                {t('profile.tabs.account')}
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
                  {t('profile.tabs.studentProfile')}
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
                  {t('profile.tabs.teachingProfile')}
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
                    {t('profile.completeness.label', { percent: Math.round((learningHubHome.profile_completeness?.score ?? 0) * 100) })}
                  </p>
                  {Array.isArray(learningHubHome.profile_completeness?.missing_fields) &&
                    learningHubHome.profile_completeness.missing_fields.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {t('profile.completeness.missingHint')}{' '}
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
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">{t('profile.emailWarning.title')}</h3>
                    <p className="text-sm text-amber-700">
                      {t('profile.emailWarning.body')}
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
                    {t('profile.emailWarning.cancel')}
                  </button>
                </div>
              )}

              {/* Profile Picture Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.profilePicture.title')}</h2>
                <ProfilePictureUpload
                  firstName={(() => {
                    // Use full name for initials: first_name + last_name
                    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();
                    return fullName || profileDetails?.full_name || profileDetails?.username || user?.full_name || user?.username || profileDetails?.first_name || t('profile.defaultUser');
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
                <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('profile.personalInfo.title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <CustomInput
                      label={t('profile.personalInfo.firstName')}
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!formErrors.first_name}
                      errorMsg={formErrors.first_name}
                      required
                      disabled={isSubmitting || loading}
                      placeholder={t('profile.personalInfo.firstNamePlaceholder')}
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <CustomInput
                      label={t('profile.personalInfo.lastName')}
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!formErrors.last_name}
                      errorMsg={formErrors.last_name}
                      required
                      disabled={isSubmitting || loading}
                      placeholder={t('profile.personalInfo.lastNamePlaceholder')}
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <CustomInput
                      label={t('profile.personalInfo.email')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!formErrors.email}
                      errorMsg={formErrors.email}
                      required
                      disabled={isSubmitting || loading}
                      placeholder={t('profile.personalInfo.emailPlaceholder')}
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <CustomInput
                      label={t('profile.personalInfo.phone')}
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!formErrors.phone}
                      errorMsg={formErrors.phone}
                      disabled={isSubmitting || loading}
                      placeholder={t('profile.personalInfo.phonePlaceholder')}
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </div>

                  {/* Username */}
                  <div className="md:col-span-2">
                    <CustomInput
                      label={t('profile.personalInfo.username')}
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!formErrors.username}
                      errorMsg={formErrors.username}
                      disabled={isSubmitting || loading}
                      placeholder={t('profile.personalInfo.usernamePlaceholder')}
                      icon={<AtSign className="w-4 h-4" />}
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">{t('profile.personalInfo.usernameHint')}</p>
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
                  {t('profile.actions.cancel')}
                </CustomButton>
                
                <CustomButton
                  type="submit"
                  disabled={!hasChanges() || isSubmitting || loading}
                  loading={isSubmitting}
                  className="!h-10 !min-w-[140px] !rounded-lg !bg-primary !text-white hover:!bg-primary-dark"
                >
                  {isSubmitting ? t('profile.actions.updating') : t('profile.actions.updateProfile')}
                </CustomButton>
              </div>
            </form>
            <form onSubmit={handlePasswordSubmit} className="space-y-6 w-full bg-gray-50 rounded-lg p-6 border border-gray-200 mt-2">
              <h2 className="text-lg font-semibold text-gray-900">{t('profile.password.title')}</h2>
              <div className="space-y-6">
                {/* Current Password */}
                <CustomInput
                  label={t('profile.password.current')}
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.current_password}
                  errorMsg={passwordErrors.current_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder={t('profile.password.currentPlaceholder')}
                  icon={<Lock className="w-4 h-4" />}
                />

                {/* New Password */}
                <CustomInput
                  label={t('profile.password.new')}
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.new_password}
                  errorMsg={passwordErrors.new_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder={t('profile.password.newPlaceholder')}
                  icon={<Lock className="w-4 h-4" />}
                />

                {(passwordData.new_password || passwordData.confirm_password) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-900">{t('profile.password.requirementsTitle')}</h3>
                    </div>
                    <ul className="mt-3 grid gap-1.5 text-sm text-gray-700 sm:grid-cols-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>{t('profile.password.reqMinLength')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>{t('profile.password.reqCase')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>{t('profile.password.reqNumber')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>{t('profile.password.reqSpecial')}</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Confirm Password */}
                <CustomInput
                  label={t('profile.password.confirm')}
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.confirm_password}
                  errorMsg={passwordErrors.confirm_password}
                  required
                  disabled={isChangingPassword || updatePasswordLoading}
                  placeholder={t('profile.password.confirmPlaceholder')}
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
                  {t('profile.password.clear')}
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
                  {isChangingPassword || updatePasswordLoading ? t('profile.password.changing') : t('profile.password.change')}
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
                  <h2 className="text-lg font-semibold text-gray-900">{t('profile.studentProfile.title')}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {t('profile.studentProfile.subtitle')}
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
                      toast(t('profile.toast.studentProfileSaved'), 'success');
                    } catch (err) {
                      console.error(err);
                      toast(t('profile.toast.studentProfileSaveFailed'), 'error');
                    }
                  };

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <CustomInput
                          label={t('profile.studentProfile.name')}
                          name="student_name"
                          value={profile.name || ''}
                          onChange={(e) => {
                            profile = { ...profile, name: e.target.value };
                          }}
                          placeholder={t('profile.studentProfile.namePlaceholder')}
                          icon={<User className="w-4 h-4" />}
                        />
                      </div>
                      <div>
                        <GradeSelect
                          value={gradeValueForSelect(profile.gradeLevel)}
                          onChange={(v) => {
                            profile = { ...profile, gradeLevel: v };
                          }}
                          label={t('profile.studentProfile.gradeLevel')}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomInput
                          label={t('profile.studentProfile.timezone')}
                          name="student_timezone"
                          value={profile.timezone || ''}
                          onChange={(e) => {
                            profile = { ...profile, timezone: e.target.value };
                          }}
                          placeholder={t('profile.studentProfile.timezonePlaceholder')}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomInput
                          label={t('profile.studentProfile.classes')}
                          name="student_classes"
                          value={classes.classes || ''}
                          onChange={(e) => {
                            classes = { classes: e.target.value };
                          }}
                          placeholder={t('profile.studentProfile.classesPlaceholder')}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <CustomInput
                          label={t('profile.studentProfile.goals')}
                          name="student_goals"
                          value={goals.goals || ''}
                          onChange={(e) => {
                            goals = { goals: e.target.value };
                          }}
                          placeholder={t('profile.studentProfile.goalsPlaceholder')}
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <CustomButton
                          type="button"
                          onClick={() => {
                            try {
                              localStorage.removeItem('tutify_student_onboarding_completed');
                              toast(t('profile.toast.onboardingReset'), 'success');
                            } catch (e) {
                              void e;
                            }
                          }}
                          variant="outlined"
                          className="!h-10 !min-w-[170px] !rounded-lg !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                        >
                          {t('profile.studentProfile.resetOnboarding')}
                        </CustomButton>

                        <CustomButton
                          type="button"
                          onClick={save}
                          className="!h-10 !min-w-[150px] !rounded-lg !bg-primary !text-white hover:!bg-primary-dark"
                        >
                          {t('profile.studentProfile.save')}
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
                  <h2 className="text-lg font-semibold text-gray-900">{t('profile.teachingContext.title')}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {t('profile.teachingContext.subtitle')}
                </p>
                {contextError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {contextError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <SelectDropdown label={t('profile.teachingContext.country')} name="country" value={contextForm.country} onChange={handleContextChange} options={countries || []} disabled={metadataLoading} error={!!contextFormErrors.country} errorMsg={contextFormErrors.country} required placeholder={t('profile.teachingContext.selectCountry')} />
                  </div>
                  <div>
                    <SelectDropdown label={t('profile.teachingContext.region')} name="region" value={contextForm.region} onChange={handleContextChange} options={regions || []} disabled={metadataLoading || regionsLoading || !contextForm.country} error={!!contextFormErrors.region} errorMsg={contextFormErrors.region} required placeholder={!contextForm.country ? t('profile.teachingContext.selectCountryFirst') : t('profile.teachingContext.selectRegion')} />
                  </div>
                  <div>
                    <SelectDropdown label={t('profile.teachingContext.schoolType')} name="school_type" value={contextForm.school_type} onChange={handleContextChange} options={schoolTypes || []} disabled={metadataLoading} error={!!contextFormErrors.school_type} errorMsg={contextFormErrors.school_type} required placeholder={t('profile.teachingContext.selectSchoolType')} />
                  </div>
                  <div>
                    <GradeBandSelect
                      label={t('profile.teachingContext.gradeBand')}
                      name="grade_band"
                      value={contextForm.grade_band}
                      onChange={(value) => handleContextChange({ target: { name: 'grade_band', value } })}
                      disabled={metadataLoading}
                      error={!!contextFormErrors.grade_band}
                      errorMsg={contextFormErrors.grade_band}
                      required
                      placeholder={t('profile.teachingContext.selectGradeBand')}
                      context="default"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <SelectDropdown label={t('profile.teachingContext.subjects')} name="subjects" value={contextForm.subjects} onChange={handleContextChange} options={subjects || []} multiSelect disabled={metadataLoading} error={!!contextFormErrors.subjects} errorMsg={contextFormErrors.subjects} required placeholder={t('profile.teachingContext.selectSubjects')} />
                  </div>
                  <div>
                    <SelectDropdown label={t('profile.teachingContext.languagePreference')} name="language_preference" value={contextForm.language_preference} onChange={handleContextChange} options={languages || []} disabled={metadataLoading} error={!!contextFormErrors.language_preference} errorMsg={contextFormErrors.language_preference} required placeholder={t('profile.teachingContext.selectLanguage')} />
                  </div>
                  <div>
                    <SelectDropdown label={t('profile.teachingContext.curriculumFramework')} name="curriculum_framework" value={contextForm.curriculum_framework} onChange={handleContextChange} options={curriculums || []} disabled={metadataLoading} placeholder={t('profile.teachingContext.selectOptional')} />
                  </div>
                  <div>
                    <SelectDropdown label={t('profile.teachingContext.yearsExperience')} name="years_experience" value={contextForm.years_experience} onChange={handleContextChange} options={yearsExperience || []} disabled={metadataLoading} placeholder={t('profile.teachingContext.selectOptional')} />
                  </div>
                  <div>
                    <CustomInput label={t('profile.teachingContext.schoolName')} name="school_name" value={contextForm.school_name} onChange={(e) => handleContextChange({ target: { name: 'school_name', value: e.target.value } })} disabled={contextSaving} placeholder={t('profile.teachingContext.optional')} icon={<BookOpen className="w-4 h-4" />} />
                  </div>
                  <div>
                    <CustomInput label={t('profile.teachingContext.city')} name="city" value={contextForm.city} onChange={(e) => handleContextChange({ target: { name: 'city', value: e.target.value } })} disabled={contextSaving} placeholder={t('profile.teachingContext.optional')} />
                  </div>
                  <div>
                    <CustomInput label={t('profile.teachingContext.postalCode')} name="postal_code" value={contextForm.postal_code} onChange={(e) => handleContextChange({ target: { name: 'postal_code', value: e.target.value } })} disabled={contextSaving} placeholder={t('profile.teachingContext.optional')} />
                  </div>
                  <div className="md:col-span-2">
                    <CustomInput
                      label={t('profile.teachingContext.professionalGoals')}
                      name="professional_goals"
                      value={Array.isArray(contextForm.professional_goals) ? contextForm.professional_goals.join(', ') : ''}
                      onChange={(e) => {
                        const raw = e.target.value || '';
                        const arr = raw.split(',').map((s) => s.trim()).filter(Boolean);
                        handleContextChange({ target: { name: 'professional_goals', value: arr } });
                      }}
                      disabled={contextSaving}
                      placeholder={t('profile.teachingContext.goalsPlaceholder')}
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
                    {contextSaving ? t('profile.teachingContext.saving') : t('profile.teachingContext.save')}
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
