/**
 * Learning Hub delivery routes — must stay aligned with backend
 * `app/domains/learning_hub/route_resolver.py` and `routes/config.jsx`.
 */

export const SLUG_TO_ROUTE = {
  'classroom-management-quick-wins': '/learning-hub/classroom-management',
  'classroom-management-learning-path': '/learning-hub/student-engagement-path',
  'student-engagement-strategies': '/learning-hub/student-engagement-course',
  'formative-assessment-essentials': '/learning-hub/assessment-strategies',
  'differentiation-made-simple': '/learning-hub/differentiation-course',
  'lesson-planning-with-ai': '/learning-hub/lesson-planner-tutorial',
  'lesson-planning-learning-path': '/learning-hub/ai-assessment-path',
};

const GROWTH_PATH_ROUTES = new Set([
  '/learning-hub/student-engagement-path',
  '/learning-hub/advanced-differentiation-path',
  '/learning-hub/ai-assessment-path',
]);

/**
 * @param {string | undefined} contentId e.g. starter-en-formative-assessment-essentials
 * @returns {string | null}
 */
export function parseStarterContentSlug(contentId) {
  if (contentId == null || contentId === '') return null;
  const m = /^starter-[a-z]{2}-(.+)$/i.exec(String(contentId).trim());
  return m ? m[1] : null;
}

/**
 * @param {string | undefined} path
 * @returns {boolean}
 */
export function isAllowedHubPath(path) {
  if (path == null || typeof path !== 'string') return false;
  const p = path.trim().startsWith('/') ? path.trim() : `/${path.trim()}`;
  if (p.includes('/learning-hub/content/')) return false;
  return p === '/learning-hub' || p.startsWith('/learning-hub/') || p.startsWith('/profile');
}

/**
 * Resolve a safe in-app path for a hub card or continue row.
 * @param {object} card
 * @param {string} [card.route]
 * @param {string} [card.contentId]
 * @param {string} [card.contentSlug]
 * @param {object} [card.delivery]
 * @returns {string}
 */
export function resolveHubCardRoute(card) {
  if (!card || typeof card !== 'object') return '/learning-hub';
  const ct = String(card.contentType || card.content_type || '').toLowerCase().trim();
  const isPathType = ct === 'learning_path' || ct === 'path_module';
  const raw = card.route;
  if (raw && isAllowedHubPath(raw) && (!isPathType || GROWTH_PATH_ROUTES.has(String(raw).trim()))) {
    return String(raw).trim().startsWith('/') ? String(raw).trim() : `/${String(raw).trim()}`;
  }

  // AI-generated factory content (content_factory) does not use starter slugs,
  // so we need a deterministic safe course route for Continue rows where only contentId is provided.
  const cid = card.contentId || card.content_id;
  if (typeof cid === 'string' && cid.startsWith('factory-')) {
    if (ct === 'learning_path' || ct === 'path_module') {
      return '/learning-hub/student-engagement-path';
    }
    return '/learning-hub/differentiation-course';
  }

  const slug =
    card.contentSlug ||
    card.content_slug ||
    (card.delivery && card.delivery.slug) ||
    parseStarterContentSlug(card.contentId || card.content_id);
  if (slug && SLUG_TO_ROUTE[slug]) {
    const mapped = SLUG_TO_ROUTE[slug];
    if (!isPathType || GROWTH_PATH_ROUTES.has(mapped)) return mapped;
  }
  const dRoute = card.delivery && card.delivery.route;
  if (dRoute && isAllowedHubPath(dRoute) && (!isPathType || GROWTH_PATH_ROUTES.has(String(dRoute).trim()))) {
    return String(dRoute).trim().startsWith('/') ? String(dRoute).trim() : `/${String(dRoute).trim()}`;
  }
  if (isPathType) return '/learning-hub/student-engagement-path';
  return '/learning-hub';
}
