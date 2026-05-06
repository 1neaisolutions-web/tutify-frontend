// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axios from '../../http';
import endPoints from '../../constant';

// Helper function to extract primary role from roles array
const getPrimaryRole = (roles) => {
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return null;
  }
  
  // Priority order: super_admin > org_admin > institution_admin > teacher > student > parent
  const rolePriority = {
    super_admin: 1,
    org_admin: 2,
    institution_admin: 3,
    school_admin: 3,  // Backward compatibility
    teacher: 4,
    student: 5,
    parent: 6,
  };
  
  // Extract role name - handle both object format (from API) and string format
  const getRoleName = (role) => {
    if (typeof role === 'string') {
      return role;
    }
    if (role?.name) {
      // Handle enum/object: role.name.value or role.name directly, or if it's an object with value property
      if (typeof role.name === 'string') {
        return role.name;
      }
      // Handle enum objects (RoleName enum from backend)
      return role.name?.value || role.name?.toString() || '';
    }
    return '';
  };
  
  // Sort by priority and return the highest priority role
  const sortedRoles = roles
    .map((role) => {
      const roleName = getRoleName(role);
      return {
        ...role,
        roleName: roleName,
        priority: rolePriority[roleName] || 999,
      };
    })
    .filter((role) => role.roleName && rolePriority[role.roleName] !== undefined)
    .sort((a, b) => a.priority - b.priority);
  
  return sortedRoles[0]?.roleName || null;
};

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Initial state for auth
const initialState = {
  user: null,
  profileDetails: null,
  loading: false,
  updatePasswordLoading: false,
  error: null,
  isAuthenticated: false,
  loginChallenge: null,  // For multi-step login (tenant selection, MFA, etc.)
  memberships: [],  // User memberships
  activeMembership: null,  // Currently active membership
};

// Login user API Function
export const loginUser = createAsyncThunk(
  'auth/login',
  async (values, { rejectWithValue }) => {
    try {
      console.log('Login attempt:', values.email);
      console.log('Login endpoint:', endPoints.login);
      const { data } = await axios.post(endPoints.login, {
        ...values,
      });
      console.log('Login response received:', data?.status || 'SUCCESS');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error response:', error?.response?.data);
      console.error('Login error status:', error?.response?.status);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Complete login challenge (step 2 - tenant selection, MFA, etc.)
export const completeLoginChallenge = createAsyncThunk(
  'auth/completeLoginChallenge',
  async (challengeData, { rejectWithValue }) => {
    try {
      console.log('Complete login challenge attempt');
      const { data } = await axios.post(endPoints.login, {
        login_token: challengeData.login_token,
        selected_membership_id: challengeData.selected_membership_id,
        scope_type: challengeData.scope_type,
      });
      console.log('Challenge completion response received:', data?.status || 'SUCCESS');
      return data;
    } catch (error) {
      console.error('Challenge completion error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Register User API Function
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('Register attempt:', formData.email);
      const { data } = await axios.post(endPoints.register, formData);
      console.log('Register response received');
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Teacher Signup API Function
export const teacherSignup = createAsyncThunk(
  'auth/teacherSignup',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(endPoints.teacherSignup, formData);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Student Signup API Function
export const studentSignup = createAsyncThunk(
  'auth/studentSignup',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(endPoints.studentSignup, formData);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Parent Signup API Function
export const parentSignup = createAsyncThunk(
  'auth/parentSignup',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(endPoints.parentSignup, formData);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Forgot Password API Function
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (values, { rejectWithValue }) => {
    try {
      console.log('Forgot password attempt:', values.email);
      await axios.post(endPoints.forgotPassword, {
        ...values,
      });
      console.log('Forgot password response received');
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Reset Password API Function
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (values, { rejectWithValue }) => {
    try {
      console.log('Reset password attempt');
      await axios.post(endPoints.resetPassword, {
        ...values,
      });
      console.log('Reset password response received');
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Refresh Token API Function
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refresh_token, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(endPoints.refreshToken, {
        refresh_token,
      });
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Logout User API Function
export const logoutUserAPI = createAsyncThunk(
  'auth/logoutUserAPI',
  async (refresh_token, { rejectWithValue }) => {
    try {
      await axios.post(endPoints.logout, {
        refresh_token,
      });
      return { success: true };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Verify Email API Function
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      console.log('Verify email attempt');
      await axios.post(endPoints.verifyEmail, {
        token,
      });
      console.log('Verify email response received');
      return { success: true };
    } catch (error) {
      console.error('Verify email error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Resend Verification API Function
export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(endPoints.resendVerification, {
        email,
      });
      return { success: true };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Get Profile Details API Function
export const getProfileDetails = createAsyncThunk(
  'auth/getProfileDetails',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      console.log('[getProfileDetails] Starting profile fetch...');
      console.log('[getProfileDetails] Endpoint:', endPoints.profileDetails);
      
      // Check if we have a token
      const state = getState();
      const token = state?.auth?.user?.token;
      console.log('[getProfileDetails] Token available:', !!token);
      
      const response = await axios.get(endPoints.profileDetails);
      console.log('[getProfileDetails] ✅ Response received:', response);
      console.log('[getProfileDetails] ✅ Response data:', response.data);
      
      if (!response.data) {
        console.warn('[getProfileDetails] ⚠️ Response data is empty');
        return rejectWithValue('No data received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('[getProfileDetails] ❌ Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        }
      });
      
      // More detailed error handling
      let errorMessage = 'Failed to load profile';
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Please check if the backend is running.';
      } else {
        // Error setting up the request
        errorMessage = error.message || 'Failed to make request';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Profile API Function
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('Update profile attempt');
      const { data } = await axios.put(endPoints.updateProfile, formData);
      console.log('Update profile response received');
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Change Password API Function
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (values, { rejectWithValue }) => {
    try {
      console.log('Change password attempt');
      await axios.post(endPoints.changePassword, {
        ...values,
      });
      console.log('Change password response received');
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Reducers
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profileDetails = null;
      state.loginChallenge = null;
      state.memberships = [];
      state.activeMembership = null;
    },
    updateUserEmail: (state, action) => {
      if (state.user) {
        state.user.email = action.payload.email;
        state.user.email_verified = action.payload.email_verified || false;
      }
      if (state.profileDetails) {
        state.profileDetails.email = action.payload.email;
        state.profileDetails.email_verified = action.payload.email_verified || false;
      }
    },
    clearTempSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loginChallenge = null;
    },
    clearLoginChallenge: (state) => {
      state.loginChallenge = null;
    },
    setMemberships: (state, action) => {
      state.memberships = action.payload;
    },
    setActiveMembership: (state, action) => {
      state.activeMembership = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        
        // Check if this is a challenge response
        if (response?.status === 'CHALLENGE' && response?.challenge) {
          state.loginChallenge = {
            challengeType: response.challenge.challenge_type,
            loginToken: response.challenge.login_token,
            message: response.challenge.message,
            memberships: response.challenge.memberships || [],
          };
          state.error = null;
          state.isAuthenticated = false;
          return;
        }
        
        // Success response
        const userData = response?.user;
        const primaryRole = getPrimaryRole(userData?.roles || []);
        
        const transformedUser = {
          id: userData?.id,
          email: userData?.email,
          first_name: userData?.first_name,
          last_name: userData?.last_name,
          full_name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim(),
          phone: userData?.phone,
          username: userData?.username,
          tenant_id: userData?.tenant_id,
          status: userData?.status,
          email_verified: userData?.email_verified,
          roles: userData?.roles || [],
          role: primaryRole,
          token: response?.access_token || response?.token || response?.accessToken,
          refresh_token: response?.refresh_token || response?.refreshToken,
        };
        
        state.user = transformedUser;
        state.loginChallenge = null;  // Clear challenge
        state.error = null;
        state.isAuthenticated = true;
        
        // Fetch memberships after successful login
        // This will be handled by the component that needs memberships
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.loginChallenge = null;
      })
      // Complete Login Challenge
      .addCase(completeLoginChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLoginChallenge.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;
        const userData = response?.user;
        const primaryRole = getPrimaryRole(userData?.roles || []);
        
        const transformedUser = {
          id: userData?.id,
          email: userData?.email,
          first_name: userData?.first_name,
          last_name: userData?.last_name,
          full_name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim(),
          phone: userData?.phone,
          username: userData?.username,
          tenant_id: userData?.tenant_id,
          status: userData?.status,
          email_verified: userData?.email_verified,
          roles: userData?.roles || [],
          role: primaryRole,
          token: response?.access_token,
          refresh_token: response?.refresh_token,
        };
        
        state.user = transformedUser;
        state.loginChallenge = null;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(completeLoginChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Registration doesn't automatically log in the user
        state.user = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      // Teacher Signup
      .addCase(teacherSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(teacherSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Signup doesn't automatically log in - user is pending approval
      })
      .addCase(teacherSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Student Signup
      .addCase(studentSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studentSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(studentSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Parent Signup
      .addCase(parentSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(parentSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (state.user) {
          state.user.token = action.payload?.access_token;
          state.user.refresh_token = action.payload?.refresh_token;
        }
      })
      // Logout API
      .addCase(logoutUserAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUserAPI.rejected, (state) => {
        state.loading = false;
        // Even if API fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        if (state.user) {
          state.user.email_verified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile Details
      .addCase(getProfileDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileDetails.fulfilled, (state, action) => {
        state.loading = false;
        try {
          // Store complete profile data - backend returns UserProfile directly
          const profileData = action.payload || null;
          state.profileDetails = profileData;
          
          // Update user role if roles are present in profile
          if (profileData?.roles && Array.isArray(profileData.roles) && profileData.roles.length > 0) {
            try {
              const primaryRole = getPrimaryRole(profileData.roles);
              if (primaryRole && state.user) {
                state.user.role = primaryRole;
                state.user.roles = profileData.roles;
              }
            } catch (roleError) {
              console.error('[getProfileDetails.fulfilled] Error extracting role:', roleError);
              // Continue without updating role if extraction fails
            }
          }
          
          state.error = null;
        } catch (error) {
          console.error('[getProfileDetails.fulfilled] Error processing profile data:', error);
          state.profileDetails = action.payload || null; // Still store the data even if processing fails
          state.error = null; // Don't set error state, just log it
        }
      })
      .addCase(getProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Response could be direct user data or nested in data property
        const userData = action.payload?.user || action.payload || action.payload?.data;
        if (userData) {
          const primaryRole = getPrimaryRole(userData?.roles || []);
          
          // Update user state
          if (state.user) {
            state.user.first_name = userData.first_name || state.user.first_name;
            state.user.last_name = userData.last_name || state.user.last_name;
            state.user.full_name = userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            state.user.phone = userData.phone !== undefined ? userData.phone : state.user.phone;
            state.user.username = userData.username !== undefined ? userData.username : state.user.username;
            state.user.email = userData.email || state.user.email;
            state.user.roles = userData.roles || state.user.roles || [];
            state.user.role = primaryRole || state.user.role;
          }
          
          // Update profileDetails state with complete profile data
          state.profileDetails = {
            ...state.profileDetails,
            ...userData,
            profile_picture_url: userData.profile_picture_url !== undefined ? userData.profile_picture_url : state.profileDetails?.profile_picture_url,
          };
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.updatePasswordLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.updatePasswordLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.updatePasswordLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearTempSession, clearLoginChallenge, setMemberships, setActiveMembership, updateUserEmail } = authSlice.actions;

export default authSlice.reducer;

