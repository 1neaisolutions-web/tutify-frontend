// Learning Progress / Sessions tracking slice
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../http';

const handleApiError = (error) => {
  const detail = error?.response?.data?.detail;
  return (
    (typeof detail === 'string' ? detail : null) ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred'
  );
};

const initialState = {
  activeSessionsByContentId: {}, // { [contentId]: { sessionId, contentType, progressPercent, status } }
  contentProgressMap: {}, // { [contentId]: ContentProgressSummary }
  recentSessions: [],
  inProgressContent: [],
  loading: false,
  saving: false,
  error: null,
};

const isFallbackContentId = (contentId) =>
  !contentId || String(contentId).startsWith('learning-hub:');

const toMillis = (value) => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

export const deriveInProgressContent = (sessions) => {
  if (!Array.isArray(sessions) || sessions.length === 0) return [];
  const byContentId = new Map();

  sessions.forEach((session) => {
    const contentId = session?.content_id;
    if (isFallbackContentId(contentId)) return;

    const status = String(session?.session_status || '').toLowerCase().trim();
    const progressPercent = Number(session?.progress_percent ?? 0) || 0;
    const isCompleted = status === 'completed';
    const isInProgress =
      status === 'started' ||
      status === 'in_progress' ||
      (!isCompleted && progressPercent > 0);

    if (!isInProgress) return;

    const lastActivityAt =
      session?.last_event_at ||
      session?.updated_at ||
      session?.completed_at ||
      session?.started_at ||
      null;

    const nextItem = {
      contentId,
      contentType: session?.content_type || '',
      sessionId: session?.id || '',
      progressPercent: Math.max(0, Math.min(100, progressPercent)),
      lastActivityAt,
      _sortAt: toMillis(lastActivityAt),
    };

    const existing = byContentId.get(contentId);
    if (!existing || nextItem._sortAt >= existing._sortAt) {
      byContentId.set(contentId, nextItem);
    }
  });

  return Array.from(byContentId.values())
    .sort((a, b) => b._sortAt - a._sortAt)
    .slice(0, 3)
    .map(({ _sortAt, ...item }) => item);
};

// ---------- Thunks ----------

export const startLearningSession = createAsyncThunk(
  'learningProgress/startSession',
  async ({ contentId, contentType, locale, sessionMetadata }, { rejectWithValue }) => {
    try {
      const payload = {
        content_id: contentId,
        content_type: contentType,
        locale,
        session_metadata: sessionMetadata || {},
      };
      const res = await axiosInstance.post('/api/v1/learning-progress/sessions/start', payload);
      return res.data;
    } catch (error) {
      console.error('[learningProgress] startLearningSession error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateLearningSession = createAsyncThunk(
  'learningProgress/updateSession',
  async ({ sessionId, progress_percent, duration_seconds, session_metadata }, { rejectWithValue }) => {
    try {
      const payload = {
        ...(progress_percent != null && { progress_percent }),
        ...(duration_seconds != null && { duration_seconds }),
        ...(session_metadata != null && { session_metadata }),
      };
      const res = await axiosInstance.patch(`/api/v1/learning-progress/sessions/${sessionId}`, payload);
      return res.data;
    } catch (error) {
      console.error('[learningProgress] updateLearningSession error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const completeLearningSession = createAsyncThunk(
  'learningProgress/completeSession',
  async ({ sessionId, progress_percent }, { rejectWithValue }) => {
    try {
      const params = progress_percent != null ? { progress_percent } : undefined;
      const res = await axiosInstance.post(
        `/api/v1/learning-progress/sessions/${sessionId}/complete`,
        null,
        { params }
      );
      return res.data;
    } catch (error) {
      console.error('[learningProgress] completeLearningSession error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const recordLearningEvent = createAsyncThunk(
  'learningProgress/recordLearningEvent',
  async ({ session_id, content_id, event_type, event_metadata }, { rejectWithValue }) => {
    try {
      const payload = {
        session_id,
        content_id,
        event_type,
        event_metadata: event_metadata || {},
      };
      const res = await axiosInstance.post('/api/v1/learning-progress/events', payload);
      return res.data;
    } catch (error) {
      console.error('[learningProgress] recordLearningEvent error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const recordRecommendationEvent = createAsyncThunk(
  'learningProgress/recordRecommendationEvent',
  async ({ content_id, content_type, recommendation_source, event_type, event_metadata }, { rejectWithValue }) => {
    try {
      const payload = {
        content_id,
        content_type,
        recommendation_source,
        event_type,
        event_metadata: event_metadata || {},
      };
      const res = await axiosInstance.post('/api/v1/learning-progress/recommendations/events', payload);
      return res.data;
    } catch (error) {
      console.error('[learningProgress] recordRecommendationEvent error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchContentProgress = createAsyncThunk(
  'learningProgress/fetchContentProgress',
  async (contentId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/learning-progress/content/${encodeURIComponent(contentId)}/progress`);
      return res.data;
    } catch (error) {
      console.error('[learningProgress] fetchContentProgress error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchContentProgressBatch = createAsyncThunk(
  'learningProgress/fetchContentProgressBatch',
  async (contentIds, { rejectWithValue }) => {
    try {
      if (!Array.isArray(contentIds) || contentIds.length === 0) {
        return {};
      }
      const unique = [...new Set(contentIds.filter((id) => id != null && String(id).trim()))];
      const results = await Promise.allSettled(
        unique.map((id) =>
          axiosInstance.get(`/api/v1/learning-progress/content/${encodeURIComponent(id)}/progress`)
        )
      );
      const map = {};
      results.forEach((outcome, index) => {
        const id = unique[index];
        if (outcome.status === 'fulfilled' && outcome.value?.data) {
          map[id] = outcome.value.data;
        }
      });
      return map;
    } catch (error) {
      console.error('[learningProgress] fetchContentProgressBatch error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchRecentSessions = createAsyncThunk(
  'learningProgress/fetchRecentSessions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/v1/learning-progress/sessions');
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error('[learningProgress] fetchRecentSessions error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

/** Full session including session_metadata (for tutorial step restore). */
export const fetchLearningSession = createAsyncThunk(
  'learningProgress/fetchLearningSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/learning-progress/sessions/${sessionId}`);
      return res.data;
    } catch (error) {
      console.error('[learningProgress] fetchLearningSession error', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Slice ----------

const learningProgressSlice = createSlice({
  name: 'learningProgress',
  initialState,
  reducers: {
    clearLearningProgressError: (state) => {
      state.error = null;
    },
    resetLearningProgress: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(startLearningSession.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(startLearningSession.fulfilled, (state, action) => {
        state.saving = false;
        const s = action.payload;
        if (s?.content_id) {
          state.activeSessionsByContentId[s.content_id] = {
            sessionId: s.id,
            contentType: s.content_type,
            progressPercent: s.progress_percent,
            status: s.session_status,
          };
        }
      })
      .addCase(startLearningSession.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateLearningSession.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateLearningSession.fulfilled, (state, action) => {
        state.saving = false;
        const s = action.payload;
        if (s?.content_id && state.activeSessionsByContentId[s.content_id]) {
          state.activeSessionsByContentId[s.content_id] = {
            sessionId: s.id,
            contentType: s.content_type,
            progressPercent: s.progress_percent,
            status: s.session_status,
          };
        }
      })
      .addCase(updateLearningSession.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(completeLearningSession.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(completeLearningSession.fulfilled, (state, action) => {
        state.saving = false;
        const s = action.payload;
        if (s?.content_id && state.activeSessionsByContentId[s.content_id]) {
          state.activeSessionsByContentId[s.content_id] = {
            sessionId: s.id,
            contentType: s.content_type,
            progressPercent: s.progress_percent,
            status: s.session_status,
          };
        }
      })
      .addCase(completeLearningSession.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(fetchContentProgress.fulfilled, (state, action) => {
        const summary = action.payload;
        if (summary?.content_id) {
          state.contentProgressMap[summary.content_id] = summary;
        }
      })
      .addCase(fetchContentProgressBatch.fulfilled, (state, action) => {
        const map = action.payload || {};
        Object.keys(map).forEach((id) => {
          state.contentProgressMap[id] = map[id];
        });
      })
      .addCase(fetchRecentSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentSessions.fulfilled, (state, action) => {
        state.loading = false;
        const sessions = Array.isArray(action.payload) ? action.payload : [];
        state.recentSessions = sessions;
        state.inProgressContent = deriveInProgressContent(sessions);
      })
      .addCase(fetchRecentSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.recentSessions = [];
        state.inProgressContent = [];
      });
  },
});

export const { clearLearningProgressError, resetLearningProgress } = learningProgressSlice.actions;
export default learningProgressSlice.reducer;

