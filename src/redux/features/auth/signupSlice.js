// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axios from '../../http';
import endPoints from '../../constant';

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Initial state for signup
const initialState = {
  loading: false,
  error: null,
  success: false,
  user: null,
  memberships: null,
  tokens: null,
};

// Unified signup API Function
export const signup = createAsyncThunk(
  'signup/signup',
  async (signupData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(endPoints.signup, signupData);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Reducers
export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    clearSignupState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.user = null;
      state.memberships = null;
      state.tokens = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user;
        state.memberships = action.payload?.memberships;
        state.tokens = {
          access_token: action.payload?.access_token,
          refresh_token: action.payload?.refresh_token,
        };
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.user = null;
        state.memberships = null;
        state.tokens = null;
      });
  },
});

export const { clearSignupState, clearError } = signupSlice.actions;

export default signupSlice.reducer;
