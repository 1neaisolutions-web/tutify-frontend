// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axiosInstance from '../../http';

// Helper to normalize API error
const handleApiError = (error) => {
  const detail = error?.response?.data?.detail;
  const message =
    (typeof detail === 'string' ? detail : null) ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Normalize backend list to { value, label } if needed (backend already returns that shape)
const toOptions = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (item && typeof item === 'object' && 'value' in item && 'label' in item) {
      return { value: item.value, label: item.label };
    }
    if (typeof item === 'string') return { value: item, label: item };
    return { value: String(item), label: String(item) };
  });
};

// ---------- Async thunks ----------

/** Fetch all metadata for profile dropdowns (except regions). */
export const fetchProfileMetadata = createAsyncThunk(
  'profileContext/fetchProfileMetadata',
  async (_, { rejectWithValue }) => {
    try {
      const base = '/api/v1/metadata';
      const [countriesRes, subjectsRes, curriculumsRes, gradeBandsRes, schoolTypesRes, languagesRes, yearsRes] =
        await Promise.all([
          axiosInstance.get(`${base}/countries`),
          axiosInstance.get(`${base}/subjects`),
          axiosInstance.get(`${base}/curriculums`),
          axiosInstance.get(`${base}/grade-bands`),
          axiosInstance.get(`${base}/school-types`),
          axiosInstance.get(`${base}/languages`),
          axiosInstance.get(`${base}/years-experience`),
        ]);
      return {
        countries: toOptions(countriesRes.data),
        subjects: toOptions(subjectsRes.data),
        curriculums: toOptions(curriculumsRes.data),
        gradeBands: toOptions(gradeBandsRes.data),
        schoolTypes: toOptions(schoolTypesRes.data),
        languages: toOptions(languagesRes.data),
        yearsExperience: toOptions(yearsRes.data),
      };
    } catch (error) {
      console.error('[profileContextSlice] fetchProfileMetadata error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/** Fetch regions for a country (query param: country). */
export const fetchRegions = createAsyncThunk(
  'profileContext/fetchRegions',
  async (countryCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/v1/metadata/regions', {
        params: { country: countryCode || '' },
      });
      return toOptions(res.data);
    } catch (error) {
      console.error('[profileContextSlice] fetchRegions error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Update profile (teaching context and/or personal fields) via PATCH /api/v1/users/profile.
 * Payload: { first_name?, last_name?, email?, phone?, username?, teaching_context? }
 * teaching_context must match backend TeacherContextUpdate when present.
 */
export const updateProfileContext = createAsyncThunk(
  'profileContext/updateProfileContext',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch('/api/v1/users/profile', payload);
      return res.data;
    } catch (error) {
      console.error('[profileContextSlice] updateProfileContext error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Initial state ----------
const initialState = {
  countries: [],
  regions: [],
  subjects: [],
  curriculums: [],
  gradeBands: [],
  schoolTypes: [],
  languages: [],
  yearsExperience: [],
  loading: false,
  regionsLoading: false,
  saving: false,
  error: null,
  success: false,
};

// ---------- Slice ----------
const profileContextSlice = createSlice({
  name: 'profileContext',
  initialState,
  reducers: {
    clearProfileContextError: (state) => {
      state.error = null;
    },
    clearProfileContextSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.countries = action.payload.countries || [];
        state.subjects = action.payload.subjects || [];
        state.curriculums = action.payload.curriculums || [];
        state.gradeBands = action.payload.gradeBands || [];
        state.schoolTypes = action.payload.schoolTypes || [];
        state.languages = action.payload.languages || [];
        state.yearsExperience = action.payload.yearsExperience || [];
      })
      .addCase(fetchProfileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load options';
      })
      .addCase(fetchRegions.pending, (state) => {
        state.regionsLoading = true;
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regionsLoading = false;
        state.regions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.regionsLoading = false;
        state.regions = [];
      })
      .addCase(updateProfileContext.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfileContext.fulfilled, (state) => {
        state.saving = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateProfileContext.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to update profile';
        state.success = false;
      });
  },
});

export const { clearProfileContextError, clearProfileContextSuccess } = profileContextSlice.actions;
export default profileContextSlice.reducer;
