// @ts-nocheck
/**
 * useLearningHubHomeData
 *
 * Returns section arrays + personalization status for the Learning Hub home page.
 *
 * Key contract:
 *  - isPersonalizationActive: true whenever backend has acknowledged personalization
 *    is in progress (slateMode = 'initializing' | 'partial_ready' | 'personalized')
 *    OR slateStatus is still loading. This is used by the component to decide
 *    whether to show the AI loader vs dummy sections.
 *  - usingSlate: true only when we have real sections with content to render.
 *  - slateMode: the raw mode string from backend, always passed through.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLearningHubSlate,
  clearSlateMode,
  PERSONALIZATION_ENABLED,
  selectSlateSections,
  selectSlateMode,
} from '../redux/features/personalization/personalizationSlice';
import { fetchLearningHubHome } from '../redux/features/learningHub/learningHubSlice';

export interface SlateCard {
  assignment_id: string;
  content_id: string;
  content_type: string;
  section: string;
  bucket: string;
  position: number;
  locked: boolean;
  title: string | null;
  route: string | null;
  content_slug: string | null;
  score: number;
  reason_codes: string[];
  display_meta: Record<string, unknown>;
}

export interface SectionData {
  readiness: string;
  visible_items: SlateCard[];
  locked_preview_items: SlateCard[];
  message?: string | null;
}

export interface LearningHubHomeData {
  microCourses: SectionData | null;
  growthRecommendations: SectionData | null;
  tutorials: SectionData | null;
  researchInsights: SectionData | null;
  specialistTracks: SectionData | null;
  /** true = backend has committed to personalization (show AI loader or real content, never dummy) */
  isPersonalizationActive: boolean;
  /** true = real sections with content are available to render */
  usingSlate: boolean;
  loading: boolean;
  slateMode: string | null;
  pageReadinessState: string | null;
  minimumReadySections: string[];
  heroReady: boolean;
  globalGenerationStage: string | null;
  globalProgressPercent: number;
}

export function useLearningHubHomeData(): LearningHubHomeData {
  const dispatch = useDispatch();

  const slateSections = useSelector(selectSlateSections);
  const slateMode = useSelector(selectSlateMode) ?? null;
  const slateStatus = useSelector((s) => s.personalization?.slateStatus);
  const legacyLoading = useSelector((s) => s.learningHub?.homeLoading ?? false);
  const pageReadinessState = useSelector((s) => s.personalization?.pageReadinessState ?? null);
  const minimumReadySections = useSelector((s) => s.personalization?.minimumReadySections ?? []);
  const heroReady = useSelector((s) => !!s.personalization?.heroReady);
  const globalGenerationStage = useSelector((s) => s.personalization?.globalGenerationStage ?? null);
  const globalProgressPercent = useSelector((s) => Number(s.personalization?.globalProgressPercent || 0));

  useEffect(() => {
    if (PERSONALIZATION_ENABLED) {
      // Clear only the stale slateMode before fetching so a cached 'no_profile'
      // mode never shows the cold_start banner while the new request is in-flight.
      // Sections are intentionally kept so users with personalized content see
      // their cached grid instantly instead of a loader flash during navigation.
      dispatch(clearSlateMode());
      dispatch(fetchLearningHubSlate());
    } else {
      dispatch(fetchLearningHubHome());
    }
  }, [dispatch]);

  const loading = PERSONALIZATION_ENABLED
    ? slateStatus === 'idle' || slateStatus === 'loading'
    : legacyLoading;

  // Backend has acknowledged personalization: slate is loading, initializing, or has content
  // Any of these states means we should NOT fall back to dummy sections
  const PERSONALIZATION_ACTIVE_MODES = ['initializing', 'partial_ready', 'personalized'];
  const isPersonalizationActive =
    PERSONALIZATION_ENABLED &&
    (loading || PERSONALIZATION_ACTIVE_MODES.includes(slateMode));

  // Only render real sections when backend explicitly says the slate is usable.
  // Important: when we clear slateMode to null before refetch, cached sections may still exist;
  // we must NOT render them until mode is confirmed to avoid refresh-time fallback flashes.
  const hasSections = slateSections != null && Object.keys(slateSections).length > 0;
  // Include `initializing` when we already have section payloads: mode can stay "initializing"
  // while section readiness rows catch up; excluding it left users with hub_ready + empty grids.
  const SLATE_RENDERABLE_MODES = ['personalized', 'partial_ready', 'initializing'];
  const usingSlate =
    PERSONALIZATION_ENABLED &&
    hasSections &&
    SLATE_RENDERABLE_MODES.includes(String(slateMode || ''));

  if (usingSlate) {
    return {
      microCourses: slateSections['micro_courses'] ?? null,
      growthRecommendations: slateSections['growth_recommendations'] ?? null,
      tutorials: slateSections['tutorials'] ?? null,
      researchInsights: slateSections['research_insights'] ?? null,
      specialistTracks: slateSections['specialist_tracks'] ?? null,
      isPersonalizationActive,
      usingSlate: true,
      loading,
      slateMode,
      pageReadinessState,
      minimumReadySections,
      heroReady,
      globalGenerationStage,
      globalProgressPercent,
    };
  }

  return {
    microCourses: null,
    growthRecommendations: null,
    tutorials: null,
    researchInsights: null,
    specialistTracks: null,
    isPersonalizationActive,
    usingSlate: false,
    loading,
    slateMode,
    pageReadinessState,
    minimumReadySections,
    heroReady,
    globalGenerationStage,
    globalProgressPercent,
  };
}
