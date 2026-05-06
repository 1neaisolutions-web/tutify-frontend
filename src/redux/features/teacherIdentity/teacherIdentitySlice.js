/**
 * Teacher Identity Redux slice.
 * Integrates with /api/v1/teacher-identity (experience, education, certifications, achievements, documents).
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../http';
import { PERSONALIZATION_ENABLED, syncHubAfterMutation } from '../personalization/personalizationSlice';

const BASE = '/api/v1/teacher-identity';

function dispatchHubSyncAfterIdentity(dispatch, getState, payload) {
  if (!PERSONALIZATION_ENABLED) return;
  const sync = payload?.personalization_sync;
  if (sync && sync.status === 'queued') {
    dispatch(syncHubAfterMutation(sync));
  }
}

function dispatchHubSyncAfterIdentityDelete(dispatch, getState) {
  if (!PERSONALIZATION_ENABLED) return;
  const s = getState().personalization || {};
  dispatch(
    syncHubAfterMutation({
      status: 'queued',
      operation: 'recompute',
      personalization_version: s.personalizationVersion ?? 0,
      last_recomputed_at: s.slateLastRecomputedAt ?? null,
      correlation_id: 'teacher-identity-delete',
    })
  );
}

const handleApiError = (error) => {
  const detail = error?.response?.data?.detail;
  return (
    (typeof detail === 'string' ? detail : null) ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred'
  );
};

// ---------- Fetch all ----------
export const fetchTeacherIdentity = createAsyncThunk(
  'teacherIdentity/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [expRes, eduRes, certRes, achRes, docRes] = await Promise.all([
        axiosInstance.get(`${BASE}/experience`),
        axiosInstance.get(`${BASE}/education`),
        axiosInstance.get(`${BASE}/certifications`),
        axiosInstance.get(`${BASE}/achievements`),
        axiosInstance.get(`${BASE}/documents`),
      ]);
      return {
        experience: expRes.data ?? [],
        education: eduRes.data ?? [],
        certifications: certRes.data ?? [],
        achievements: achRes.data ?? [],
        documents: docRes.data ?? [],
      };
    } catch (error) {
      console.error('[teacherIdentitySlice] fetchTeacherIdentity error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Experience ----------
export const createExperience = createAsyncThunk(
  'teacherIdentity/createExperience',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${BASE}/experience`, payload);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateExperience = createAsyncThunk(
  'teacherIdentity/updateExperience',
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`${BASE}/experience/${id}`, data);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'teacherIdentity/deleteExperience',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/experience/${id}`);
      dispatchHubSyncAfterIdentityDelete(dispatch, getState);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Education ----------
export const createEducation = createAsyncThunk(
  'teacherIdentity/createEducation',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${BASE}/education`, payload);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateEducation = createAsyncThunk(
  'teacherIdentity/updateEducation',
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`${BASE}/education/${id}`, data);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'teacherIdentity/deleteEducation',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/education/${id}`);
      dispatchHubSyncAfterIdentityDelete(dispatch, getState);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Certifications ----------
export const createCertification = createAsyncThunk(
  'teacherIdentity/createCertification',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${BASE}/certifications`, payload);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCertification = createAsyncThunk(
  'teacherIdentity/updateCertification',
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`${BASE}/certifications/${id}`, data);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteCertification = createAsyncThunk(
  'teacherIdentity/deleteCertification',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/certifications/${id}`);
      dispatchHubSyncAfterIdentityDelete(dispatch, getState);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Achievements ----------
export const createAchievement = createAsyncThunk(
  'teacherIdentity/createAchievement',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${BASE}/achievements`, payload);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateAchievement = createAsyncThunk(
  'teacherIdentity/updateAchievement',
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`${BASE}/achievements/${id}`, data);
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteAchievement = createAsyncThunk(
  'teacherIdentity/deleteAchievement',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/achievements/${id}`);
      dispatchHubSyncAfterIdentityDelete(dispatch, getState);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Career documents ----------
export const uploadCareerDocument = createAsyncThunk(
  'teacherIdentity/uploadCareerDocument',
  async ({ file, document_type, title }, { dispatch, getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', document_type);
      if (title != null && title !== '') formData.append('title', title);
      const res = await axiosInstance.post(`${BASE}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatchHubSyncAfterIdentity(dispatch, getState, res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteCareerDocument = createAsyncThunk(
  'teacherIdentity/deleteCareerDocument',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/documents/${id}`);
      dispatchHubSyncAfterIdentityDelete(dispatch, getState);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Initial state ----------
const initialState = {
  experience: [],
  education: [],
  certifications: [],
  achievements: [],
  documents: [],
  loading: false,
  saving: false,
  deleting: false,
  uploading: false,
  error: null,
  success: null,
};

const savingThunks = [
  createExperience,
  updateExperience,
  createEducation,
  updateEducation,
  createCertification,
  updateCertification,
  createAchievement,
  updateAchievement,
];
const deletingThunks = [
  deleteExperience,
  deleteEducation,
  deleteCertification,
  deleteAchievement,
  deleteCareerDocument,
];

const teacherIdentitySlice = createSlice({
  name: 'teacherIdentity',
  initialState,
  reducers: {
    clearTeacherIdentityError: (state) => {
      state.error = null;
    },
    clearTeacherIdentitySuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTeacherIdentity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherIdentity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.experience = action.payload.experience ?? [];
        state.education = action.payload.education ?? [];
        state.certifications = action.payload.certifications ?? [];
        state.achievements = action.payload.achievements ?? [];
        state.documents = action.payload.documents ?? [];
      })
      .addCase(fetchTeacherIdentity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load';
      })
      // Experience
      .addCase(createExperience.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.experience = [action.payload, ...state.experience];
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const idx = state.experience.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.experience[idx] = action.payload;
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        state.experience = state.experience.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      // Education
      .addCase(createEducation.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.education = [action.payload, ...state.education];
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const idx = state.education.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.education[idx] = action.payload;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        state.education = state.education.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      // Certifications
      .addCase(createCertification.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.certifications = [action.payload, ...state.certifications];
      })
      .addCase(createCertification.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const idx = state.certifications.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.certifications[idx] = action.payload;
      })
      .addCase(updateCertification.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        state.certifications = state.certifications.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCertification.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      // Achievements
      .addCase(createAchievement.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.achievements = [action.payload, ...state.achievements];
      })
      .addCase(createAchievement.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateAchievement.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const idx = state.achievements.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.achievements[idx] = action.payload;
      })
      .addCase(updateAchievement.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteAchievement.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        state.achievements = state.achievements.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAchievement.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      // Documents
      .addCase(uploadCareerDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.error = null;
        state.documents = [action.payload, ...state.documents];
      })
      .addCase(uploadCareerDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(uploadCareerDocument.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(deleteCareerDocument.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        state.documents = state.documents.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteCareerDocument.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addCase(deleteCareerDocument.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      // Match all pending save/delete thunks.
      // RTK requires addCase handlers to be registered before addMatcher handlers.
      .addMatcher(
        (a) => savingThunks.some((t) => t.pending.match(a)),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (a) => deletingThunks.some((t) => t.pending.match(a)),
        (state) => {
          state.deleting = true;
          state.error = null;
        }
      );
  },
});

export const { clearTeacherIdentityError, clearTeacherIdentitySuccess } = teacherIdentitySlice.actions;
export default teacherIdentitySlice.reducer;
