import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../http';
import { logoutUser } from '../auth/authSlice';

const handleApiError = (error) => {
  const data = error?.response?.data;
  const detail = data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (typeof e === 'string' ? e : e?.msg || e?.message || JSON.stringify(e)))
      .filter(Boolean)
      .join('; ');
  }
  return data?.message || error?.message || 'An unexpected error occurred';
};

const buildQuery = (params) => {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : '';
};

export const fetchContentGenerationJobs = createAsyncThunk(
  'learningHubAdmin/fetchContentGenerationJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const q = buildQuery({
        status: filters.status,
        content_type: filters.content_type,
        locale: filters.locale,
        source: filters.source,
        sort: filters.sort ?? 'ops',
        limit: filters.limit ?? 100,
        skip: filters.skip ?? 0,
      });
      const res = await axiosInstance.get(`/api/v1/content-factory/jobs${q}`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error('[learningHubAdmin] fetchContentGenerationJobs', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchJobsSummary = createAsyncThunk(
  'learningHubAdmin/fetchJobsSummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/v1/content-factory/jobs/summary');
      return res.data && typeof res.data === 'object' ? res.data : {};
    } catch (error) {
      console.error('[learningHubAdmin] fetchJobsSummary', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const requestMicroCourseGeneration = createAsyncThunk(
  'learningHubAdmin/requestMicroCourseGeneration',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/v1/content-factory/generate/micro-course', payload);
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] requestMicroCourseGeneration', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const stopGapGenerationWorker = createAsyncThunk(
  'learningHubAdmin/stopGapGenerationWorker',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/v1/content-factory/ops/stop');
      return res.data || {};
    } catch (error) {
      console.error('[learningHubAdmin] stopGapGenerationWorker', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchContentGenerationJobDetail = createAsyncThunk(
  'learningHubAdmin/fetchContentGenerationJobDetail',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/content-factory/jobs/${jobId}`);
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] fetchContentGenerationJobDetail', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchJobReviews = createAsyncThunk(
  'learningHubAdmin/fetchJobReviews',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/content-factory/jobs/${jobId}/reviews`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error('[learningHubAdmin] fetchJobReviews', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const approveContentJob = createAsyncThunk(
  'learningHubAdmin/approveContentJob',
  async ({ jobId, notes }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/v1/content-factory/jobs/${jobId}/approve`, {
        notes: notes || null,
      });
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] approveContentJob', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const rejectContentJob = createAsyncThunk(
  'learningHubAdmin/rejectContentJob',
  async ({ jobId, notes }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/v1/content-factory/jobs/${jobId}/reject`, {
        notes: notes || null,
      });
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] rejectContentJob', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const requestContentJobChanges = createAsyncThunk(
  'learningHubAdmin/requestContentJobChanges',
  async ({ jobId, notes }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/v1/content-factory/jobs/${jobId}/request-changes`, {
        notes: notes || null,
      });
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] requestContentJobChanges', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const retryContentJob = createAsyncThunk(
  'learningHubAdmin/retryContentJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/v1/content-factory/jobs/${jobId}/retry`);
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] retryContentJob', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteContentJob = createAsyncThunk(
  'learningHubAdmin/deleteContentJob',
  async (jobId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/content-factory/jobs/${jobId}`);
      return { jobId };
    } catch (error) {
      console.error('[learningHubAdmin] deleteContentJob', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Fetch per-user job stats + profile completeness for admin inspection.
 * Calls GET /api/v1/content-factory/jobs/by-user/{userId}
 */
export const fetchUserJobStats = createAsyncThunk(
  'learningHubAdmin/fetchUserJobStats',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/content-factory/jobs/by-user/${userId}`);
      return res.data;
    } catch (error) {
      console.error('[learningHubAdmin] fetchUserJobStats', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchRegistryItems = createAsyncThunk(
  'learningHubAdmin/fetchRegistryItems',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const q = buildQuery({
        status: filters.status,
        content_type: filters.content_type,
        locale: filters.locale,
        source_type: filters.source_type,
        limit: filters.limit ?? 200,
        skip: filters.skip ?? 0,
      });
      const res = await axiosInstance.get(`/api/v1/content-registry/items${q}`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error('[learningHubAdmin] fetchRegistryItems', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  jobs: [],
  jobsLoading: false,
  jobsError: null,
  jobsSummary: null,
  jobsSummaryLoading: false,
  jobsSummaryError: null,
  jobFilters: {
    status: '',
    content_type: '',
    locale: '',
    source: '',
  },
  selectedJobId: null,
  jobDetail: null,
  jobDetailLoading: false,
  jobDetailError: null,
  jobReviews: [],
  jobReviewsLoading: false,
  jobReviewsError: null,
  registryItems: [],
  registryLoading: false,
  registryError: null,
  registryFilters: {
    status: 'published',
    content_type: '',
    locale: '',
    source_type: '',
  },
  actionLoading: false,
  actionError: null,
  // Per-user job stats (admin inspection)
  userJobStats: null,
  userJobStatsLoading: false,
  userJobStatsError: null,
};

const learningHubAdminSlice = createSlice({
  name: 'learningHubAdmin',
  initialState,
  reducers: {
    setJobFilters: (state, action) => {
      state.jobFilters = { ...state.jobFilters, ...action.payload };
    },
    setRegistryFilters: (state, action) => {
      state.registryFilters = { ...state.registryFilters, ...action.payload };
    },
    selectJob: (state, action) => {
      state.selectedJobId = action.payload;
      if (!action.payload) {
        state.jobDetail = null;
        state.jobReviews = [];
      }
    },
    clearLearningHubAdminErrors: (state) => {
      state.jobsError = null;
      state.jobsSummaryError = null;
      state.jobDetailError = null;
      state.jobReviewsError = null;
      state.registryError = null;
      state.actionError = null;
    },
    resetLearningHubAdmin: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentGenerationJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchContentGenerationJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchContentGenerationJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload;
        state.jobs = [];
      })
      .addCase(fetchJobsSummary.pending, (state) => {
        state.jobsSummaryLoading = true;
        state.jobsSummaryError = null;
      })
      .addCase(fetchJobsSummary.fulfilled, (state, action) => {
        state.jobsSummaryLoading = false;
        state.jobsSummary = action.payload;
      })
      .addCase(fetchJobsSummary.rejected, (state, action) => {
        state.jobsSummaryLoading = false;
        state.jobsSummaryError = action.payload;
      })
      .addCase(fetchContentGenerationJobDetail.pending, (state) => {
        state.jobDetailLoading = true;
        state.jobDetailError = null;
      })
      .addCase(fetchContentGenerationJobDetail.fulfilled, (state, action) => {
        state.jobDetailLoading = false;
        state.jobDetail = action.payload;
      })
      .addCase(fetchContentGenerationJobDetail.rejected, (state, action) => {
        state.jobDetailLoading = false;
        state.jobDetailError = action.payload;
        state.jobDetail = null;
      })
      .addCase(fetchJobReviews.pending, (state) => {
        state.jobReviewsLoading = true;
        state.jobReviewsError = null;
      })
      .addCase(fetchJobReviews.fulfilled, (state, action) => {
        state.jobReviewsLoading = false;
        state.jobReviews = action.payload;
      })
      .addCase(fetchJobReviews.rejected, (state, action) => {
        state.jobReviewsLoading = false;
        state.jobReviewsError = action.payload;
        state.jobReviews = [];
      })
      .addCase(fetchRegistryItems.pending, (state) => {
        state.registryLoading = true;
        state.registryError = null;
      })
      .addCase(fetchRegistryItems.fulfilled, (state, action) => {
        state.registryLoading = false;
        state.registryItems = action.payload;
      })
      .addCase(fetchRegistryItems.rejected, (state, action) => {
        state.registryLoading = false;
        state.registryError = action.payload;
        state.registryItems = [];
      })
      .addCase(approveContentJob.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(approveContentJob.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.jobDetail = action.payload;
      })
      .addCase(approveContentJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(rejectContentJob.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(rejectContentJob.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.jobDetail = action.payload;
      })
      .addCase(rejectContentJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(requestContentJobChanges.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(requestContentJobChanges.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.jobDetail = action.payload;
      })
      .addCase(requestContentJobChanges.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(retryContentJob.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(retryContentJob.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.jobDetail = action.payload;
      })
      .addCase(retryContentJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(deleteContentJob.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteContentJob.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload?.jobId;
        if (id) {
          state.jobs = state.jobs.filter((j) => j.id !== id);
          if (state.selectedJobId === id) {
            state.selectedJobId = null;
            state.jobDetail = null;
            state.jobReviews = [];
          }
        }
      })
      .addCase(deleteContentJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(requestMicroCourseGeneration.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(requestMicroCourseGeneration.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.jobDetail = action.payload;
      })
      .addCase(requestMicroCourseGeneration.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(stopGapGenerationWorker.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(stopGapGenerationWorker.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionError = null;
        // Return value not stored; admin page will refresh jobs/summary/registry.
      })
      .addCase(stopGapGenerationWorker.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(fetchUserJobStats.pending, (state) => {
        state.userJobStatsLoading = true;
        state.userJobStatsError = null;
      })
      .addCase(fetchUserJobStats.fulfilled, (state, action) => {
        state.userJobStatsLoading = false;
        state.userJobStats = action.payload;
      })
      .addCase(fetchUserJobStats.rejected, (state, action) => {
        state.userJobStatsLoading = false;
        state.userJobStatsError = action.payload;
        state.userJobStats = null;
      })
      .addCase(logoutUser, () => initialState);
  },
});

export const {
  setJobFilters,
  setRegistryFilters,
  selectJob,
  clearLearningHubAdminErrors,
  resetLearningHubAdmin,
} = learningHubAdminSlice.actions;

export default learningHubAdminSlice.reducer;
