# Phase 1 Quiz RAG — Test Plan

This document covers unit, integration, and E2E verification for the Phase 1 Quiz RAG upgrade.
Phase 1 scope: catalog fetch, topic fetch, scope preview, and the wiring of error/retry states.
Generation (LLM pipeline) is Phase 2 and is explicitly out of scope.

---

## Unit Tests

### 1. `fetchCatalog` — URL and query string construction
Verify that calling `fetchCatalog({ subject: 'Mathematics', grade: 'Grade 5', q: 'fraction' })` builds the correct URL:
`GET /api/v1/quiz/catalog?subject=Mathematics&grade=Grade+5&q=fraction`.
Check that omitted optional params are absent from the query string (no `q=` when `q` is empty/undefined).
Check that the `Authorization: Bearer <token>` header is attached.

### 2. `fetchTopicsForPacks` — empty array input
When called with `pack_ids: []`, the function should return an empty topic list without making a network request (or return gracefully from a 200 with empty payload). It must not throw.

### 3. `adaptCatalogBook` — null/missing authors and publisher
When the raw API response has `authors: null` and `publisher: null`, the adapter should default both to empty string `""`. The adapted object must satisfy the `CatalogBook` type with no undefined values.

### 4. `useQuizRagScope` — initial mount triggers catalog fetch
On mount with `subject='Science'` and `grade='Grade 3'`, the hook should call `fetchCatalog` once with those params.
Assert that `catalogBusy` is `true` immediately and transitions to `false` after the fetch resolves.
Assert that `filteredCatalog` is populated from the resolved response.

### 5. `useQuizRagScope` — catalogQuery debounce
Simulate typing 5 characters in rapid succession (each change within 50 ms).
Assert that `fetchCatalog` is called exactly once after the debounce window (e.g. 300 ms) settles, not once per keystroke.

### 6. `useQuizRagScope` — selecting books triggers `fetchTopicsForPacks`
Toggle two books via `toggleBook`. Assert that `topicsIndexing` becomes `true` and then `fetchTopicsForPacks` is called with the two selected book IDs.
After resolution, `topicsIndexing` becomes `false` and `availableTopics` reflects the returned strands.

### 7. `useQuizRagScope` — AbortController cancels in-flight topic request
Select book A (triggers topic fetch). Before that fetch resolves, select book B (replacing A).
Assert that the first request's AbortController was aborted (spy on `abort()`).
Assert that only book B's topics are ultimately set in state — no stale book A topics.

### 8. `useQuizRagScope` — topicsError set on fetch failure, cleared on retry
Simulate `fetchTopicsForPacks` rejecting with `"Network error"`.
Assert that `topicsError === "Network error"` after the rejection.
Trigger the retry action. Assert that `topicsError` is cleared (`null`) immediately on retry and that `fetchTopicsForPacks` is called again.

---

## Integration Tests

### 1. `GET /api/v1/quiz/catalog` — authenticated teacher receives tenant-scoped published packs
Send a valid teacher JWT in the Authorization header.
Assert HTTP 200.
Assert all returned items have `status === "published"` and belong to the requesting teacher's tenant.
Assert that packs from other tenants are absent from the response.

### 2. `GET /api/v1/quiz/catalog?q=math` — full-text search filtering
Insert a pack with title "Advanced Mathematics" and one with title "History of Science" into the test tenant.
Query with `q=math`.
Assert only the Mathematics pack is returned.
Assert the History pack is absent.

### 3. `GET /api/v1/quiz/catalog?subject=Mathematics&grade=Grade+5` — subject + grade filter
Insert packs with varying subject/grade metadata.
Query with the two filter params.
Assert only packs tagged `subject=Mathematics` AND `grade=Grade 5` are returned.

### 4. `POST /api/v1/quiz/catalog/topics` with valid pack_ids — returns topic strands
Send a request body `{ "pack_ids": ["<valid_pack_id>"] }` for a pack that has indexed chunks with topic metadata.
Assert HTTP 200.
Assert response contains a non-empty `topics` array of strings.

### 5. `POST /api/v1/quiz/catalog/topics` with cross-tenant pack_ids — returns empty, not 403
Create pack P in tenant A. Authenticate as a user in tenant B.
POST with `pack_ids: [P.id]`.
Assert HTTP 200 (not 403).
Assert response `topics` is an empty array.

### 6. `POST /api/v1/quiz/catalog/scope-preview` — positive `estimated_segments` for published packs with chunks
Send a valid scope-preview request with `pack_ids` pointing to packs that have at least one indexed chunk.
Assert HTTP 200.
Assert `estimated_segments > 0`.

### 7. Unauthenticated request to catalog — 401
Send `GET /api/v1/quiz/catalog` with no Authorization header.
Assert HTTP 401 with `{ "detail": "..." }` error shape.

### 8. Teacher from a different tenant cannot see other tenant's packs
Tenant A has 3 packs. Teacher B (different tenant) authenticates and calls `GET /api/v1/quiz/catalog`.
Assert none of Tenant A's pack IDs appear in the response items.

---

## E2E Test Scenarios

### 1. Search books
1. Open the quiz create page and navigate to Step 2 (Source materials).
2. Verify the book grid renders real catalog titles (not placeholder text).
3. Type a search term in the catalog search input.
4. Verify the displayed books filter to match the query.
5. Clear the search input.
6. Verify the full catalog returns.

### 2. Select multiple books
1. Click 3 distinct book cards.
2. Verify all 3 cards show the selected (emerald checkmark) state.
3. Verify the "Selected for retrieval" panel lists all 3 titles.
4. Verify the Scope preview "Sources" counter shows 3.

### 3. Load topics
1. Select 2 books.
2. Verify Step 3 shows a loading pulse skeleton while topics are fetching.
3. After loading, verify topic chips appear and `topic count > 0`.
4. Verify the chips reflect actual backend topic data, not hardcoded strings.

### 4. Topic search
1. With at least 2 books selected and topics loaded, type a partial topic name in the topic search input.
2. Verify only matching topic chips are shown.
3. Click a matching chip.
4. Verify it appears in the "Selected (N)" tags row below.

### 5. Empty state
1. Type a search query that matches no catalog titles.
2. Verify the empty-state card appears with the message "No catalog titles match this search".
3. Click the "Clear search" button.
4. Verify the full catalog reloads and the empty-state card disappears.

### 6. Catalog error state
1. Simulate the catalog API returning HTTP 500 (via network intercept or test env flag).
2. Verify the red error banner appears with the text "Could not load catalog".
3. Verify the banner displays the error detail string.
4. Click the "Retry" button.
5. Verify the catalog re-fetches and, on success, the error banner disappears and books render.

### 7. Race condition — rapid book selection shows only final selection's topics
1. Select book A. Immediately (before topic fetch resolves) deselect A and select book B.
2. Wait for topic loading to complete.
3. Verify only book B's topics are shown.
4. Verify none of book A's exclusive topic strands appear.

---

## Done Checklist

- [ ] `GET /api/v1/quiz/catalog` returns real content packs
- [ ] Search/filter by subject, grade, q works server-side
- [ ] `POST /api/v1/quiz/catalog/topics` returns aggregated topic strands
- [ ] `POST /api/v1/quiz/catalog/scope-preview` returns estimated_segments
- [ ] `useQuizRagScope` fetches from API, not demo data
- [ ] Debounced search with AbortController implemented
- [ ] catalogError + retryCatalog wired in UI
- [ ] topicsError shown in topics section
- [ ] Loading skeletons show during initial catalog fetch
- [ ] Race condition: rapid book selection → correct topics shown
- [ ] All dummy demo imports removed from hook
- [ ] QuizRagBuildSection.tsx unchanged visually/structurally
- [ ] No hardcoded book/topic lists anywhere in the flow
- [ ] Tenant isolation enforced (backend only returns own-tenant packs)
- [ ] Phase 2 (generation/LLM) NOT implemented

---

## Non-Goals (Phase 2)

The following were intentionally NOT implemented in Phase 1:

- Quiz question generation / LLM pipeline
- POST endpoint for quiz generation job submission
- Question draft/review backend
- Publish/scoring logic for generated quiz content
- Any changes to the generation overlay, review section, or question editor
