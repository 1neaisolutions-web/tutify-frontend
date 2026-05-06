/**
 * Personalization Redux slice.
 *
 * Manages:
 * - personalization state (status, version, section readiness)
 * - home slate data per section
 * - job status
 * - unlock states
 *
 * Does NOT replace the learningHubSlice; it extends it with backend-driven data.
 * When PERSONALIZATION_ENABLED is false, the existing learningHubSlice data is used.
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../http';

// ---------------------------------------------------------------------------
// Feature flag (set via import.meta.env.VITE_PERSONALIZATION_ENABLED)
// ---------------------------------------------------------------------------
export const PERSONALIZATION_ENABLED =
  import.meta.env.VITE_PERSONALIZATION_ENABLED === 'true';

// ---------------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------------

export const fetchPersonalizationState = createAsyncThunk(
  'personalization/fetchState',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/v1/personalization/state');
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Failed to load personalization state');
    }
  }
);

export const fetchPersonalizationJobs = createAsyncThunk(
  'personalization/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/v1/personalization/jobs');
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Failed to load jobs');
    }
  }
);

export const startPersonalization = createAsyncThunk(
  'personalization/start',
  async (trigger = 'user_request', { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/personalization/start', { trigger });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Failed to start personalization');
    }
  }
);

export const resetPersonalization = createAsyncThunk(
  'personalization/reset',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/personalization/reset', {
        confirmed: true,
        reason: 'user_request',
      });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Failed to reset personalization');
    }
  }
);

/**
 * Preflight check: evaluate impact of a proposed teaching-context change before saving.
 * Read-only — no DB writes, no jobs enqueued.
 * payload: { proposed_context: { country?, subjects?, grade_band?, ... } }
 */
export const preflightProfileChange = createAsyncThunk(
  'personalization/preflightProfileChange',
  async (proposedContext, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/personalization/preflight', {
        proposed_context: proposedContext,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Preflight check failed');
    }
  }
);

/**
 * Production-safe recovery action for bootstrapping.
 * Triggers another inventory expansion pass for the authenticated user.
 */
export const retryLearningHubBootstrap = createAsyncThunk(
  'personalization/retryHubBootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/learning-hub/bootstrap-retry', {});
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Failed to retry hub bootstrap');
    }
  }
);

/**
 * Fetch the backend slate and build section arrays.
 * Only called when PERSONALIZATION_ENABLED = true.
 * Falls back gracefully if the backend returns legacy format.
 */
export const fetchLearningHubSlate = createAsyncThunk(
  'personalization/fetchSlate',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/v1/learning-hub/home');

      // New personalization format has 'sections' key
      if (data?.sections) {
        return {
          mode: data.mode,
          sections: data.sections,
          last_recomputed_at: data.last_recomputed_at,
          page_readiness_state: data.page_readiness_state ?? null,
          minimum_ready_sections: data.minimum_ready_sections ?? [],
          hero_ready: data.hero_ready ?? false,
          global_generation_stage: data.global_generation_stage ?? null,
          global_progress_percent: data.global_progress_percent ?? 0,
          orchestration: data.orchestration ?? null,
          hub_bootstrap: data.hub_bootstrap ?? null,
          profile_completeness: data.profile_completeness ?? null,
          personalization_version: data.personalization_version ?? null,
        };
      }

      // Legacy format (no `sections`) must never leak arbitrary legacy mode strings
      // into personalization state gating. Treat it as no_profile/cold-start.
      return { mode: 'no_profile', sections: null, profile_completeness: null, personalization_version: null };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err?.message || 'Failed to load learning hub');
    }
  }
);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * After profile or teacher-identity mutation, poll hub home until personalization output advances.
 * `receipt` comes from API `personalization_sync` or a synthetic baseline for DELETE flows.
 */
export const syncHubAfterMutation = createAsyncThunk(
  'personalization/syncHubAfterMutation',
  async (receipt, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!receipt || receipt.status === 'noop' || receipt.operation === 'noop') {
        return { skipped: true };
      }
      const baselineVersion = Number(receipt.personalization_version ?? 0);
      const baselineRec = receipt.last_recomputed_at ?? null;
      const maxAttempts = 24;
      for (let i = 0; i < maxAttempts; i += 1) {
        await dispatch(fetchLearningHubSlate());
        await dispatch(fetchPersonalizationState());
        const s = getState().personalization;
        const newV = Number(s.personalizationVersion ?? 0);
        const newRec = s.slateLastRecomputedAt || s.lastRecomputedAt || null;
        const op = receipt.operation;
        if (op === 'reset' || op === 'start') {
          if (newV > baselineVersion) {
            return { done: true, reason: 'version' };
          }
        } else {
          const recChanged = newRec && newRec !== baselineRec;
          const verChanged = newV > baselineVersion;
          if (recChanged || verChanged) {
            return { done: true, reason: recChanged ? 'recomputed' : 'version' };
          }
        }
        await delay(400 + i * 50);
      }
      return { done: false, timeout: true };
    } catch (err) {
      return rejectWithValue(err?.message || 'sync failed');
    }
  }
);

// Orchestration for the hub loader is embedded in GET /learning-hub/home as `hub_bootstrap`
// (no separate /bootstrap-status call — avoids 404 on older servers / routing issues).

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState = {
  // Personalization profile state
  status: 'idle',          // idle | loading | succeeded | failed
  personalizationStatus: null,  // active | initializing | stale | failed
  personalizationVersion: 0,
  profileCompleteness: 0,
  personalizationStartedAt: null,
  lastRecomputedAt: null,
  sectionReadiness: [],    // array of { section, status, visible_count_target, visible_count_actual }
  message: null,

  // Home slate data
  slateStatus: 'idle',
  slateMode: null,         // personalized | initializing | partial_ready | no_profile
  slateSections: null,     // { micro_courses: {visible_items, locked_preview_items}, ... } | null
  slateLastRecomputedAt: null,
  pageReadinessState: null, // hub_bootstrapping | hub_ready
  minimumReadySections: [],
  heroReady: false,
  globalGenerationStage: null,
  globalProgressPercent: 0,

  /** Full payload from GET /learning-hub/home `hub_bootstrap` — loader source of truth */
  hubBootstrap: null,

  /** Extracted from hub_bootstrap: true when backend explicitly requests the banner */
  showBootstrapBanner: false,
  /** Extracted from hub_bootstrap: true when backend has ready inventory for the hub */
  hasReadyInventory: false,

  // Retry button / auto-recovery state for bootstrapping
  hubBootstrapRetryStatus: 'idle', // idle | loading | succeeded | failed
  hubBootstrapRetryError: null,

  // Jobs
  jobsStatus: 'idle',
  activeJobs: [],

  // Error state
  error: null,

  /** Profile completeness from GET /learning-hub/home (personalization mode) */
  hubProfileCompleteness: null,

  /** After teaching profile / identity mutation: idle | updating | ready | failed */
  hubSyncStatus: 'idle',
  hubSyncError: null,

  /** Preflight impact assessment for pending profile save */
  preflightStatus: 'idle',   // idle | loading | succeeded | failed
  preflightResult: null,     // ProfilePreflightResponse | null
  preflightError: null,
};

const personalizationSlice = createSlice({
  name: 'personalization',
  initialState,
  reducers: {
    clearPersonalizationError(state) {
      state.error = null;
    },
    updateHubBootstrapFromSSE(state, action) {
      state.hubBootstrap = action.payload;
      state.pageReadinessState = action.payload.page_readiness_state ?? state.pageReadinessState;
      state.showBootstrapBanner = action.payload.show_bootstrap_banner ?? state.showBootstrapBanner;
      state.hasReadyInventory = action.payload.has_ready_inventory ?? state.hasReadyInventory;
      if (action.payload.can_enter_hub) {
        state.slateMode = 'personalized';
      }
    },
    // Clears only the slateMode (not slateSections) before a fresh fetch.
    // This prevents a stale 'no_profile' mode from showing the cold_start banner
    // while the new request is in-flight, while still keeping any cached sections
    // so users with personalized content don't see a loader flash during navigation.
    clearSlateMode(state) {
      state.slateMode = null;
    },
    clearHubSyncStatus(state) {
      state.hubSyncStatus = 'idle';
      state.hubSyncError = null;
    },
    clearPreflightResult(state) {
      state.preflightStatus = 'idle';
      state.preflightResult = null;
      state.preflightError = null;
    },
    applyOptimisticUnlock(state, action) {
      // When backend returns newly_unlocked, update slate items optimistically
      const { unlockedAssignmentIds } = action.payload;
      if (!state.slateSections) return;
      for (const sectionKey of Object.keys(state.slateSections)) {
        const section = state.slateSections[sectionKey];
        if (!section) continue;
        for (const item of section.locked_preview_items || []) {
          if (unlockedAssignmentIds.includes(String(item.assignment_id))) {
            item.locked = false;
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // fetchPersonalizationState
    builder
      .addCase(fetchPersonalizationState.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPersonalizationState.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const d = action.payload;
        state.personalizationStatus = d.status;
        state.personalizationVersion = d.personalization_version;
        state.profileCompleteness = d.profile_completeness;
        state.personalizationStartedAt = d.personalization_started_at;
        state.lastRecomputedAt = d.last_recomputed_at;
        state.sectionReadiness = d.section_readiness || [];
        state.message = d.message || null;
      })
      .addCase(fetchPersonalizationState.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // retryLearningHubBootstrap
    builder
      .addCase(retryLearningHubBootstrap.pending, (state) => {
        state.hubBootstrapRetryStatus = 'loading';
        state.hubBootstrapRetryError = null;
      })
      .addCase(retryLearningHubBootstrap.fulfilled, (state) => {
        state.hubBootstrapRetryStatus = 'succeeded';
        state.hubBootstrapRetryError = null;
      })
      .addCase(retryLearningHubBootstrap.rejected, (state, action) => {
        state.hubBootstrapRetryStatus = 'failed';
        state.hubBootstrapRetryError = action.payload;
      });

    // fetchLearningHubSlate
    builder
      .addCase(fetchLearningHubSlate.pending, (state) => {
        state.slateStatus = 'loading';
      })
      .addCase(fetchLearningHubSlate.fulfilled, (state, action) => {
        state.slateStatus = 'succeeded';
        state.slateMode = action.payload.mode;
        state.slateSections = action.payload.sections;
        state.slateLastRecomputedAt = action.payload.last_recomputed_at;
        if (action.payload.profile_completeness != null) {
          state.hubProfileCompleteness = action.payload.profile_completeness;
        }
        if (action.payload.personalization_version != null) {
          state.personalizationVersion = action.payload.personalization_version;
        }
        state.pageReadinessState = action.payload.page_readiness_state ?? null;
        state.minimumReadySections = action.payload.minimum_ready_sections ?? [];
        state.heroReady = !!action.payload.hero_ready;
        state.globalGenerationStage = action.payload.global_generation_stage ?? null;
        state.globalProgressPercent = Number(action.payload.global_progress_percent || 0);
        const hb = action.payload.hub_bootstrap;
        if (hb && typeof hb === 'object') {
          state.hubBootstrap = hb;
          state.showBootstrapBanner = hb.show_bootstrap_banner ?? false;
          state.hasReadyInventory = hb.has_ready_inventory ?? false;
        } else {
          // No hub_bootstrap in response → hub is in personalized/ready state, not orchestrating.
          // Clear banner flags so stale true values from a prior orchestration session don't persist.
          state.showBootstrapBanner = false;
          state.hasReadyInventory = true;
          const orch = action.payload.orchestration;
          if (orch) {
            state.hubBootstrap = {
              ...orch,
              stage_message: action.payload.global_generation_stage,
              progress_percent: action.payload.global_progress_percent,
              can_enter_hub:
                orch.can_enter_hub !== undefined ? orch.can_enter_hub : action.payload.hero_ready,
              page_readiness_state: action.payload.page_readiness_state,
            };
          } else {
            state.hubBootstrap = null;
          }
        }
      })
      .addCase(fetchLearningHubSlate.rejected, (state, action) => {
        state.slateStatus = 'failed';
        state.error = action.payload;
        // Keep slateSections as is (show stale) on failure
      });

    builder
      .addCase(syncHubAfterMutation.pending, (state) => {
        state.hubSyncStatus = 'updating';
        state.hubSyncError = null;
      })
      .addCase(syncHubAfterMutation.fulfilled, (state, action) => {
        if (action.payload?.skipped) {
          state.hubSyncStatus = 'idle';
          return;
        }
        if (action.payload?.timeout) {
          state.hubSyncStatus = 'failed';
          state.hubSyncError =
            'Recommendations are still updating. Use “Refresh hub data” or open the Learning Hub in a moment.';
        } else {
          state.hubSyncStatus = 'idle';
          state.hubSyncError = null;
        }
      })
      .addCase(syncHubAfterMutation.rejected, (state, action) => {
        state.hubSyncStatus = 'failed';
        state.hubSyncError = action.payload || 'Sync failed';
      });

    // startPersonalization
    builder
      .addCase(startPersonalization.fulfilled, (state, action) => {
        state.personalizationStatus = 'initializing';
        state.personalizationVersion = action.payload.personalization_version;
        state.message = action.payload.message;
      });

    // resetPersonalization
    builder
      .addCase(resetPersonalization.fulfilled, (state, action) => {
        state.personalizationStatus = 'initializing';
        state.slateSections = null;
        state.message = action.payload.message;
      });

    // fetchPersonalizationJobs
    builder
      .addCase(fetchPersonalizationJobs.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.activeJobs = action.payload.filter(
          (j) => j.status === 'queued' || j.status === 'running'
        );
      });

    // preflightProfileChange
    builder
      .addCase(preflightProfileChange.pending, (state) => {
        state.preflightStatus = 'loading';
        state.preflightResult = null;
        state.preflightError = null;
      })
      .addCase(preflightProfileChange.fulfilled, (state, action) => {
        state.preflightStatus = 'succeeded';
        state.preflightResult = action.payload;
        state.preflightError = null;
      })
      .addCase(preflightProfileChange.rejected, (state, action) => {
        state.preflightStatus = 'failed';
        state.preflightResult = null;
        state.preflightError = action.payload;
      });

  },
});

export const { clearPersonalizationError, applyOptimisticUnlock, clearSlateMode, clearHubSyncStatus, clearPreflightResult, updateHubBootstrapFromSSE } =
  personalizationSlice.actions;
export default personalizationSlice.reducer;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectPersonalizationStatus = (state) => state.personalization?.personalizationStatus;
export const selectSlateMode = (state) => state.personalization?.slateMode;
export const selectSlateSections = (state) => state.personalization?.slateSections;
export const selectSectionReadiness = (state) => state.personalization?.sectionReadiness || [];
export const selectPersonalizationVersion = (state) => state.personalization?.personalizationVersion || 0;
export const selectHubBootstrap = (state) => state.personalization?.hubBootstrap ?? null;

/**
 * Returns the readiness status for a given section key.
 * @param {string} section - e.g. 'micro_courses'
 */
export const selectSectionReadinessStatus = (section) => (state) => {
  const readiness = state.personalization?.sectionReadiness || [];
  const found = readiness.find((r) => r.section === section);
  return found?.status || 'not_started';
};

export const selectHubBootstrapRetryStatus = (state) =>
  state.personalization?.hubBootstrapRetryStatus ?? 'idle';

export const selectShowBootstrapBanner = (state) => state.personalization?.showBootstrapBanner ?? false;
export const selectHasReadyInventory = (state) => state.personalization?.hasReadyInventory ?? false;
