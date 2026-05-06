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

// Initial state for membership
const initialState = {
  memberships: [],
  activeMembership: null,
  loading: false,
  error: null,
};

// Fetch memberships API Function
export const fetchMemberships = createAsyncThunk(
  'membership/fetchMemberships',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(endPoints.memberships);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Switch active membership API Function
export const switchActiveMembership = createAsyncThunk(
  'membership/switchActiveMembership',
  async (switchData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(endPoints.switchMembership, switchData);
      
      // Update auth tokens after successful switch
      // This would typically update the auth slice, but for now we'll return the tokens
      // The component should handle updating the auth state
      
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Reducers
export const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    setMemberships: (state, action) => {
      state.memberships = action.payload;
    },
    setActiveMembership: (state, action) => {
      state.activeMembership = action.payload;
    },
    clearMemberships: (state) => {
      state.memberships = [];
      state.activeMembership = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Memberships
      .addCase(fetchMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = action.payload?.memberships || [];
        state.activeMembership = action.payload?.memberships?.find(
          (m) => m.id === action.payload?.active_membership_id
        ) || null;
        state.error = null;
      })
      .addCase(fetchMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Switch Membership
      .addCase(switchActiveMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchActiveMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMembership = action.payload?.active_membership;
        // Update the active membership in memberships array
        if (state.activeMembership) {
          state.memberships = state.memberships.map((m) =>
            m.id === state.activeMembership.id
              ? { ...m, ...state.activeMembership }
              : m
          );
        }
        state.error = null;
      })
      .addCase(switchActiveMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setMemberships, setActiveMembership, clearMemberships } = membershipSlice.actions;

export default membershipSlice.reducer;
