// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axiosInstance from '../../http';
import { logoutUser } from '../auth/authSlice';

// Content type values from backend (content_registry enums) - normalized to lowercase for comparison
const CONTENT_TYPE_MICRO_COURSE = 'micro_course';
const CONTENT_TYPE_AI_GUIDED_TUTORIAL = 'ai_guided_tutorial';
const CONTENT_TYPE_LEARNING_PATH = 'learning_path';
const CONTENT_TYPE_PATH_MODULE = 'path_module';

/** Normalize content_type for case- and whitespace-safe filtering. Backend may return MICRO_COURSE etc. */
const normalizeContentType = (ct) => (ct != null && String(ct).trim() ? String(ct).toLowerCase().trim() : '');

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  const detail = error?.response?.data?.detail;
  const message =
    (typeof detail === 'string' ? detail : null) ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Format estimated_duration_min as "X min"
const formatDuration = (estimatedMin) => {
  if (estimatedMin == null || estimatedMin === '') return '';
  const n = Number(estimatedMin);
  if (Number.isNaN(n) || n < 0) return '';
  return `${n} min`;
};

const PATH_ROUTES = new Set([
  '/learning-hub/student-engagement-path',
  '/learning-hub/advanced-differentiation-path',
  '/learning-hub/ai-assessment-path',
]);

function fallbackRouteForTypeAndCategory(contentType, category = '') {
  const ct = normalizeContentType(contentType);
  const c = String(category || '').toLowerCase();
  if (ct === CONTENT_TYPE_MICRO_COURSE) return '/learning-hub/differentiation-course';
  if (ct === CONTENT_TYPE_AI_GUIDED_TUTORIAL) {
    if (c.includes('assess')) return '/learning-hub/assessment-tutorial';
    if (c.includes('differentiat')) return '/learning-hub/differentiation-tutorial';
    return '/learning-hub/lesson-planner-tutorial';
  }
  if (ct === CONTENT_TYPE_LEARNING_PATH || ct === CONTENT_TYPE_PATH_MODULE) {
    if (c.includes('differentiat')) return '/learning-hub/advanced-differentiation-path';
    if (c.includes('assess')) return '/learning-hub/ai-assessment-path';
    return '/learning-hub/student-engagement-path';
  }
  return '';
}

// ---------- Transform functions: backend home payload -> UI view models ----------

/**
 * @param {Object} homePayload - Raw GET /api/v1/learning-hub/home response
 * @param {Map<string, { progress_percent: number, completed_sessions: number }>} [progressMap] - optional progress per content_id
 * @returns {Array} UI shape: { title, duration, category, progress, difficulty, contentId?, route?, reason?, score? }
 */
const transformMicroCourses = (homePayload, progressMap = new Map()) => {
  if (!homePayload?.primary_recommendations && !homePayload?.secondary_recommendations) return [];
  const primary = homePayload.primary_recommendations || [];
  const secondary = homePayload.secondary_recommendations || [];
  const fallback = homePayload.fallback_cards || [];
  const all = [...primary, ...secondary, ...fallback];
  const seenFingerprints = new Set();
  const filtered = all.filter((card) => {
    if (!card) return false;
    const ct = normalizeContentType(card.content_type);
    if (ct !== CONTENT_TYPE_MICRO_COURSE) return false;
    const fp = `${ct}|${String(card.category || '').toLowerCase().trim()}|${String(card.title || '').toLowerCase().trim()}`;
    if (seenFingerprints.has(fp)) return false;
    seenFingerprints.add(fp);
    return true;
  });
  const ranked = [...filtered].sort((a, b) => {
    const af = String(a?.content_id || '').startsWith('factory-') ? 1 : 0;
    const bf = String(b?.content_id || '').startsWith('factory-') ? 1 : 0;
    return bf - af;
  });
  return ranked.map((card) => {
    const summary = card?.content_id ? progressMap.get(card.content_id) : undefined;
    const progress = summary != null && Number.isFinite(summary.progress_percent) ? summary.progress_percent : 0;
    return {
      title: card.title || '',
      duration: formatDuration(card.estimated_duration_min),
      category: card.category || 'Learning',
      progress,
      difficulty: card.difficulty || 'Beginner',
      contentId: card.content_id,
      contentType: normalizeContentType(card.content_type),
      contentSlug: card.content_slug || null,
      delivery: card.delivery || null,
      route: card.route,
      reason: card.reason,
      score: card.score,
    };
  });
};

/**
 * @param {Object} homePayload
 * @param {Map<string, { progress_percent: number, completed_sessions: number }>} [progressMap]
 * @returns {Array} UI shape: { title, type, duration, completed, contentId?, route?, reason?, score? }
 */
const transformTutorials = (homePayload, progressMap = new Map()) => {
  if (!homePayload?.primary_recommendations && !homePayload?.secondary_recommendations) return [];
  const primary = homePayload.primary_recommendations || [];
  const secondary = homePayload.secondary_recommendations || [];
  const fallback = homePayload.fallback_cards || [];
  const all = [...primary, ...secondary, ...fallback];
  const seenFingerprints = new Set();
  const filtered = all.filter((card) => {
    if (!card) return false;
    const ct = normalizeContentType(card.content_type);
    if (ct !== CONTENT_TYPE_AI_GUIDED_TUTORIAL) return false;
    const fp = `${ct}|${String(card.category || '').toLowerCase().trim()}|${String(card.title || '').toLowerCase().trim()}`;
    if (seenFingerprints.has(fp)) return false;
    seenFingerprints.add(fp);
    return true;
  });
  const ranked = [...filtered].sort((a, b) => {
    const af = String(a?.content_id || '').startsWith('factory-') ? 1 : 0;
    const bf = String(b?.content_id || '').startsWith('factory-') ? 1 : 0;
    return bf - af;
  });
  return ranked.map((card) => {
    const summary = card?.content_id ? progressMap.get(card.content_id) : undefined;
    const completed =
      summary != null &&
      (Number(summary.progress_percent) >= 100 || Number(summary.completed_sessions) > 0);
    return {
      title: card.title || '',
      type: card.category || 'Step-by-step walkthrough',
      duration: formatDuration(card.estimated_duration_min),
      completed: !!completed,
      contentId: card.content_id,
      contentType: normalizeContentType(card.content_type),
      contentSlug: card.content_slug || null,
      delivery: card.delivery || null,
      route: card.route,
      reason: card.reason,
      score: card.score,
    };
  });
};

/**
 * @param {Object} homePayload
 * @returns {Array} UI shape: { skill, reason, impact, estimatedTime, route?, contentId?, contentType?, contentSlug?, delivery? }
 */
const transformAIRecommendations = (homePayload) => {
  const focusAreas = homePayload?.focus_areas || [];
  const nextActions = homePayload?.next_actions || [];
  const cards = [
    ...(homePayload?.primary_recommendations || []),
    ...(homePayload?.secondary_recommendations || []),
    ...(homePayload?.fallback_cards || []),
  ];

  // Prefer real growth items only.
  const pathCards = cards.filter((card) => {
    const ct = normalizeContentType(card?.content_type);
    return ct === CONTENT_TYPE_LEARNING_PATH || ct === CONTENT_TYPE_PATH_MODULE;
  });

  const routeFromCard = (card) => {
    const r = (card?.route || card?.delivery?.route || '').trim()
    if (PATH_ROUTES.has(r)) return r
    return fallbackRouteForTypeAndCategory(card?.content_type, card?.category)
  }

  if (pathCards.length > 0) {
    // Deterministic: keep card text, route, and content_id aligned.
    const impactForIndex = (idx) => {
      const p = focusAreas?.[idx]?.priority
      if (p === 1) return 'High'
      if (p === 2) return 'Medium'
      return 'Medium'
    }

    const ranked = [...pathCards].sort((a, b) => {
      const af = String(a?.content_id || '').startsWith('factory-') ? 1 : 0;
      const bf = String(b?.content_id || '').startsWith('factory-') ? 1 : 0;
      return bf - af;
    });
    return ranked.slice(0, 3).map((card, idx) => ({
      id: card?.content_id || `${idx}-${card?.title || 'growth'}`,
      skill: card?.title || 'Recommended growth path',
      reason: card?.reason || card?.summary || 'Recommended based on your learning profile.',
      impact: impactForIndex(idx),
      estimatedTime: '1–2 hours',
      route: routeFromCard(card),
      contentId: card?.content_id,
      contentType: normalizeContentType(card?.content_type),
      contentSlug: card?.content_slug || null,
      delivery: card?.delivery || null,
      category: card?.category || null,
      score: card?.score,
      estimatedDurationMin: card?.estimated_duration_min ?? null,
    }))
  }

  // Professional fallback (still no dummy):
  // If backend didn’t return learning_path/path_module cards, but it *does* return
  // some items that resolve to growth pages, use those items so the title matches
  // the opened registry content_id.
  const candidatePathCards = cards
    .filter((c) => c?.content_id && (PATH_ROUTES.has((c?.route || '').trim()) || PATH_ROUTES.has((c?.delivery?.route || '').trim())))
    .slice(0, 6)

  const pickImpact = (title, idx) => {
    const fa = focusAreas?.find((x) => x?.title === title)
    const p = fa?.priority
    if (p === 1) return 'High'
    if (p === 2) return 'Medium'
    return idx < 3 ? 'Medium' : 'Medium'
  }

  return candidatePathCards.slice(0, 3).map((card, idx) => {
    const reasonFromNext = nextActions.find((na) => na?.label === card?.title)?.reason
    return {
      id: card?.content_id || `${idx}-${card?.title || 'growth'}`,
      skill: card?.title || 'Recommended growth path',
      reason: reasonFromNext || card?.reason || card?.summary || 'Recommended based on your learning profile.',
      impact: pickImpact(card?.title, idx),
      estimatedTime: '1–2 hours',
      route: routeFromCard(card),
      contentId: card?.content_id,
      contentType: normalizeContentType(card?.content_type) || 'learning_path',
      contentSlug: card?.content_slug || null,
      delivery: card?.delivery || null,
      category: card?.category || null,
      score: card?.score,
      estimatedDurationMin: card?.estimated_duration_min ?? null,
    }
  })
};

/**
 * Backend home payload does not yet provide certificate objects. Return empty array.
 * @param {Object} _homePayload
 * @returns {Array} UI shape: { name, date, hours, badge }
 */
const transformCertificates = (_homePayload) => {
  return [];
};

/**
 * @param {Object} homePayload
 * @returns {Object} UI shape: { coursesCompleted, hoursLogged, certificatesEarned, currentStreak }
 */
const transformProgressStats = (homePayload) => {
  const overview = homePayload?.progress_overview;
  if (!overview) {
    return {
      coursesCompleted: 0,
      hoursLogged: 0,
      certificatesEarned: 0,
      currentStreak: 0,
    };
  }
  const totalMinutes = Number(overview.total_learning_minutes) || 0;
  const hoursLogged = Math.round((totalMinutes / 60) * 10) / 10;
  return {
    coursesCompleted: Number(overview.completed_content_count) || 0,
    hoursLogged,
    certificatesEarned: 0,
    currentStreak: 0,
  };
};

// ---------- Initial state ----------
const initialState = {
  home: null,
  microCourses: [],
  tutorials: [],
  aiRecommendations: [],
  certificates: [],
  progressStats: {
    coursesCompleted: 0,
    hoursLogged: 0,
    certificatesEarned: 0,
    currentStreak: 0,
  },
  loading: false,
  error: null,
};

/**
 * Fetch progress for multiple content ids. Returns Map<content_id, { progress_percent, completed_sessions }>.
 * Failed requests do not fail the whole flow; missing entries default to 0 / false in transforms.
 */
async function fetchContentProgressMap(contentIds) {
  if (!Array.isArray(contentIds) || contentIds.length === 0) return new Map();
  const unique = [...new Set(contentIds.filter((id) => id != null && String(id).trim()))];
  const results = await Promise.allSettled(
    unique.map((contentId) =>
      axiosInstance.get(`/api/v1/learning-progress/content/${encodeURIComponent(contentId)}/progress`)
    )
  );
  const map = new Map();
  results.forEach((outcome, i) => {
    const contentId = unique[i];
    if (!contentId) return;
    if (outcome.status === 'fulfilled' && outcome.value?.data) {
      const d = outcome.value.data;
      map.set(contentId, {
        progress_percent: Number(d.progress_percent) || 0,
        completed_sessions: Number(d.completed_sessions) || 0,
      });
    }
  });
  return map;
}

async function fetchGeneratedFallbackCards() {
  const byType = [
    CONTENT_TYPE_MICRO_COURSE,
    CONTENT_TYPE_LEARNING_PATH,
    CONTENT_TYPE_AI_GUIDED_TUTORIAL,
  ];
  const results = await Promise.allSettled(
    byType.map((ct) =>
      axiosInstance.get('/api/v1/content-registry/items', {
        params: { content_type: ct, source_type: 'content_factory', status: 'published', limit: 3 },
      })
    )
  );
  const merged = [];
  results.forEach((r, idx) => {
    if (r.status !== 'fulfilled') return;
    const ct = byType[idx];
    const items = r.value?.data?.items || r.value?.data || [];
    items.forEach((it) => {
      if (!it?.content_id) return;
      merged.push({
        title: it.title || it.content_id,
        summary: it.summary || '',
        category: it.category || 'Learning',
        difficulty: it.difficulty || 'Beginner',
        content_id: it.content_id,
        content_type: normalizeContentType(it.content_type || ct),
        content_slug: it.content_slug || null,
        route: fallbackRouteForTypeAndCategory(it.content_type || ct, it.category),
        estimated_duration_min: it.estimated_duration_min ?? null,
        reason: 'Generated content matched to your profile.',
      });
    });
  });
  return merged;
}

// ---------- Async thunk ----------
export const fetchLearningHubHome = createAsyncThunk(
  'learningHub/fetchLearningHubHome',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/learning-hub/home');
      const data = response.data;
      const primary = data?.primary_recommendations || [];
      const secondary = data?.secondary_recommendations || [];
      const allCards = [...primary, ...secondary];
      const contentIds = allCards.map((c) => c?.content_id).filter(Boolean);
      let progressMap = new Map();
      let fallbackCards = [];
      try {
        progressMap = await fetchContentProgressMap(contentIds);
      } catch (progressErr) {
        console.warn('[learningHubSlice] Progress enrichment failed, using base data:', progressErr);
      }
      try {
        fallbackCards = await fetchGeneratedFallbackCards();
      } catch (fallbackErr) {
        console.warn('[learningHubSlice] Generated fallback fetch failed:', fallbackErr);
      }
      const enrichedHome = { ...data, fallback_cards: fallbackCards };
      return {
        home: enrichedHome,
        microCourses: transformMicroCourses(enrichedHome, progressMap),
        tutorials: transformTutorials(enrichedHome, progressMap),
        aiRecommendations: transformAIRecommendations(enrichedHome),
        certificates: transformCertificates(enrichedHome),
        progressStats: transformProgressStats(enrichedHome),
      };
    } catch (error) {
      console.error('[learningHubSlice] Error fetching Learning Hub home:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------- Slice ----------
const learningHubSlice = createSlice({
  name: 'learningHub',
  initialState,
  reducers: {
    clearLearningHubError: (state) => {
      state.error = null;
    },
    resetLearningHub: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLearningHubHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningHubHome.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.home = action.payload.home;
        state.microCourses = action.payload.microCourses || [];
        state.tutorials = action.payload.tutorials || [];
        state.aiRecommendations = action.payload.aiRecommendations || [];
        state.certificates = action.payload.certificates || [];
        state.progressStats = action.payload.progressStats || initialState.progressStats;
      })
      .addCase(fetchLearningHubHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load Learning Hub';
      })
      .addCase(logoutUser, () => initialState);
  },
});

export const { clearLearningHubError, resetLearningHub } = learningHubSlice.actions;
export default learningHubSlice.reducer;
