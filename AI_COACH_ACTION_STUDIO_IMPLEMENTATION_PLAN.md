# AI Coach Desk Cleanup + Teaching Action Studio — Implementation Plan

Status: draft for review
Scope: `tutify-frontend` only. No backend code, no database changes. Read-only use of existing APIs where wiring is needed (search/filter). Teaching Action Studio is a fully frontend mock feature.

---

## 1. Research Findings

### 1.1 What actually exists today

- Route `/chatbots` → `src/pages/features/SpecializedChatbots.tsx`, the hub/catalog page. Sidebar label: **"Specialized Chatbots"** (`src/routes/sideMenuConfig.jsx`, i18n key `nav.chatbots`).
- 24 individual tool pages mounted under `/chatbots/*` in `src/routes/config.jsx`, each `withDashboardLayout(...)`.
- `src/api/chatbots.ts` exposes: `listChatbots`, `getChatbot` (dead, unused), conversation CRUD (`listConversations`, `getConversation`, `listConversationMessages`, `deleteConversation`), `sendMessage` / `sendMessageStream` (real SSE chat), `executeCapability` (generic guided-tool call), `logChatbotHistory`.
- Exactly **one** page (`GeneralTeachingAssistantChat.tsx`) uses the real chat/streaming surface. Every other "keep" tool uses `executeCapability` — a guided form → structured JSON result, not a chatbot.
- Shared, reusable, and already solid: `useCapabilityCreditGate`, `useChatbotHistorySession`, `useRestoreChatbotConversationFromUrl`, `NoCreditsCard`, `chatbotAdapters` (grade slug mapping). These stay as-is.
- Hub page fakes: every bot card has a **hardcoded star rating** baked into source (no such field exists on the `Chatbot` type), a search `<input>` with no `value`/`onChange`, "All Bots"/"Favorites" filter buttons with no `onClick` and no favorites mechanism anywhere in the codebase, and a static "Credits apply" label not tied to real balance.

### 1.2 KEEP / FIX / HIDE table

| Tool | File | Backend-wired? | Decision | Notes |
|---|---|---|---|---|
| General Teaching Assistant | `GeneralTeachingAssistantChat.tsx` | Yes — real SSE streaming chat | **KEEP** | Becomes the featured "General Teaching Coach" |
| Literacy Lab Coach | `LiteracyLabCoach.tsx` | Yes — `executeCapability` ×3 | **KEEP** (+ FIX dead buttons) | 4 "Download report" buttons have no `onClick` at all |
| Grammar and Writing Mentor | `GrammarWritingMentor.tsx` | Yes — `executeCapability` ×4 | **KEEP** | |
| Literature Analysis Expert | `LiteratureAnalysisExpert.tsx` | Yes — `executeCapability` ×4 | **KEEP** | |
| Adaptive Math Strategist | `AdaptiveMathStrategist.tsx` | Yes — `executeCapability` ×4 | **KEEP** | |
| STEM Inquiry Mentor | `STEMInquiryMentor.tsx` | Yes — `executeCapability` ×3 | **KEEP** | |
| Coding and Programming Tutor | `CodingProgrammingTutor.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Digital Literacy Advisor | `DigitalLiteracyAdvisor.tsx` | Yes — `executeCapability` ×6 | **KEEP** | |
| AI and Machine Learning Educator | `AIMachineLearningEducator.tsx` | Yes — `executeCapability` ×5 | **KEEP** | |
| Visual Arts Studio Assistant | `VisualArtsStudioAssistant.tsx` | Yes — `executeCapability` ×7 | **KEEP** | Not named in original plan doc, verified real |
| Business Studies Mentor | `BusinessStudiesMentor.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Career Readiness Coach | `CareerReadinessCoach.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Lab Safety Protocol Advisor | `LabSafetyProtocolAdvisor.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Environmental Science Guide | `EnvironmentalScienceGuide.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Music Performance Coach | `MusicPerformanceCoach.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Drama Theater Director | `DramaTheaterDirector.tsx` | Yes — `executeCapability` ×7 | **KEEP** | |
| Marketing Branding Strategist | `MarketingBrandingStrategist.tsx` | Yes — `executeCapability` ×6 | **KEEP** | |
| Hub search / category filter | `SpecializedChatbots.tsx` | No — unwired | **FIX** | Wire to real `listChatbots()` data + client-side filter (name/subject/category/chat-vs-guided). No new backend calls needed. |
| Problem-Solving Coach | `ProblemSolvingCoach.tsx` | No — 100% `setTimeout` mock | **HIDE** | No real capability call anywhere in file |
| Algebra and Geometry Tutor | `AlgebraGeometryTutor.tsx` | No — mock, but fakes a History log entry via `logChatbotHistory` | **HIDE** | Actively deceptive: writes fabricated content into real History as if it were generated |
| Computer Science Mentor | — | N/A | **N/A** | Named in original plan's hide list but no file/route exists in this codebase — nothing to hide |
| GPT-4 Teaching Assistant | `GPT4TeachingAssistantChat.tsx` | No — canned string generator | **HIDE** | Model-branded, not connected to GPT-4 |
| Claude Education Pro | `ClaudeEducationProChat.tsx` | No — canned string generator + fully mocked utils | **HIDE** | Model-branded, not connected to Claude |
| Gemini Education Suite | `GeminiEducationSuiteChat.tsx` | No — canned string generator, `localStorage`-only history | **HIDE** | Model-branded, not connected to Gemini |
| UNEC Academic Development | `UNECAcademicDevelopment.tsx` | No — 100% mock | **HIDE** | No backend calls at all |
| Advanced Knowledge Skills Coach | `AdvancedKnowledgeSkillsCoach.tsx` (6,691 lines) | No — literally renders "Coming Soon" for its own chat tab | **HIDE** | Largest file in the feature; mostly dead UI state |

**Decision on HIDE mechanics:** routes stay mounted (so any pre-existing History deep links to these slugs don't 404) but every discovery surface (hub cards, category pages, `Dashboard.tsx` quick links) stops linking to them. This is "hide," not "delete," per the constraint against destructive backend/DB-adjacent surprises — nothing in this repo is a git history to preserve, but existing user History entries pointing at these routes are a real concern worth not breaking.

**Decision on FIX scope:** "fix unwired but real" only applies to (a) the hub search/filter — real data exists (`listChatbots()`), it's just not wired — and (b) a mechanical sweep of decorative no-op buttons (buttons with no `onClick`, confirmed in Literacy Lab Coach, likely present elsewhere) which get wired to genuine client-side actions (copy to clipboard, plain-text export of the actual result already in state) or removed if not worth building. We are **not** attempting to wire Problem-Solving Coach / Algebra & Geometry Tutor to `executeCapability`, because there is no evidence the backend has ever registered capabilities for those slugs — guessing capability keys against an unverified contract would risk building another "looks real, isn't" tool, which is exactly what we're trying to eliminate.

---

## 2. Product Structure

```
AI Coach Desk        "Can you help me think about this?"   → quick advice / guided mini-tool   (route: /chatbots, renamed in nav to "AI Coach Desk")
Classroom Templates  "Can you create this document?"       → one finished document              (route: /templates, unchanged)
Teaching Action Studio "Can you help me complete this task?" → one connected multi-section plan (route: /action-studio, new)
```

AI Coach Desk is reorganized from a flat 24-card list into 7 categories (matches `updatedPlan.md` §5.3, mapped onto the verified KEEP tools):

| Category | Tools |
|---|---|
| General Teaching Coach | General Teaching Assistant (real chat) |
| Literacy & Writing Coach | Literacy Lab Coach, Grammar and Writing Mentor, Literature Analysis Expert |
| Math Coach | Adaptive Math Strategist |
| STEM Coach | STEM Inquiry Mentor, Lab Safety Protocol Advisor, Environmental Science Guide |
| Digital Learning Coach | Digital Literacy Advisor, AI and Machine Learning Educator, Coding and Programming Tutor |
| Creative Arts Coach | Visual Arts Studio Assistant, Music Performance Coach, Drama Theater Director |
| Career & Business Coach | Business Studies Mentor, Career Readiness Coach, Marketing Branding Strategist |

Each existing specialist page is kept as its working, already-real implementation. We are **not** rewriting all 16 large files into new full-page workspaces from scratch — that is disproportionate effort for tools that already work. Instead the *discovery layer* (hub → category → capability card) is rebuilt, and it routes into the existing pages. Cosmetic/trust cleanup (dead buttons, fake ratings) happens inside those pages without restructuring their working logic.

---

## 3. Silicon-Level UI Direction

Matches and extends the existing design language — confirmed from `DashboardHome.tsx`, `TemplatesLibrary.tsx`, and the coach pages themselves. No new color system, no purple/glow AI cliché (the one legitimate purple moment in the app, Learning Hub's AI-personalizing loader, stays scoped to that feature and is not copied here).

- **Palette:** sky-blue `primary` scale from `tailwind.config.js` (`primary-600` #0284c7 as workhorse), existing per-feature accent hues (each coach category keeps a distinct hue, e.g. amber/orange for Math, emerald for STEM, rose for Creative Arts) — consistent with the convention already established across coach pages, just applied one level higher (category, not per-tool).
- **Icons:** `lucide-react` only (matches 107+ existing usages; `@mui/icons-material` stays out of new feature pages).
- **Structure:**
  - Compact header (title + one-line supporting copy), no big marketing hero — per `updatedPlan.md` §5.1.
  - Featured General Teaching Coach card, full width, visually distinct (keeps its real-chat CTA).
  - Category cards grid below (7 cards, `.card`-style: `rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md`, colored icon chip, 1-line description, tool count).
  - Category page → capability cards grid (per tool, cards state: what it does / input / output type / chat vs guided / credit note), same visual grammar as `TemplatesLibrary.tsx` cards.
  - Capability cards route straight into the existing specialist page (no new full-page workspace shell forced onto working pages, since instructions call this "where appropriate" — appropriate here means: don't touch what already works).
- **Loading/streaming:** reuse existing primitives — `AiDocumentRenderer`'s blinking-cursor affordance, `QuizGeneratingOverlay`-style full-screen generating modal — for the new Action Studio mock-generation step, so it feels native rather than bespoke.
- **No new dependency** (no framer-motion) — all motion stays Tailwind (`animate-pulse`, `animate-spin`, `transition`), matching current app-wide convention.

---

## 4. Teaching Action Studio — Intervention Sprint Studio

Frontend-only, fully mock, no backend calls, no DB writes. This is the flagship and gets the bulk of new engineering effort (everything here is greenfield — confirmed no existing Action Studio/Intervention/MTSS code exists anywhere in the repo).

### 4.1 Studio home (`/action-studio`)
- Compact header: "Teaching Action Studio" + one-line description ("Turn a real classroom problem into one complete, connected action plan.")
- Flagship card: **Intervention Sprint Studio** — clickable, opens the wizard.
- 3–4 additional module cards shown as **explicitly labeled "Coming soon"**, disabled/non-clickable (Behavior Support Planner, Attendance Recovery Planner, Assessment Action Planner, Family Communication Planner) — communicates the intended product surface honestly without faking functionality (per `updatedPlan.md` §8, only one flagship ships now).
- "My Sprints" section: list of previously saved sprints (see §4.4), empty state if none.

### 4.2 Guided flow (`/action-studio/intervention-sprint`)
Single page, internal step state (not separate routes, mirrors a wizard, keeps back/forward and edit-in-place simple):

1. **Select task** — currently one live option ("Create a Student Intervention Sprint"), auto-advances.
2. **Enter classroom context** — form (reuses `GradeSelect`/`GradeBandSelect`/`SubjectSelect` where applicable):
   - Grade level, subject/skill area, topic or skill (free text)
   - Student group type (select: 1:1 / small group 3–6 / whole-class subgroup)
   - Main concern (textarea)
   - Evidence/observation data (textarea; placeholder text models anonymous labels — "Group 1 scored 40% on the equivalent-fractions exit ticket" — never a real-name prompt)
   - Time available per day (10 / 15 / 20 / 30 min)
   - Support needs (multi-select chips: EL support, IEP/504 accommodations, behavior support, gifted extension)
   - Intervention duration (5 / 10 / 15 / 20 school days)
   - Expected goal (optional free text)
3. **Generate connected plan (mock)** — a deterministic, input-driven composition function (`interventionSprintMockEngine.ts`), not a single hardcoded example: it selects strategy/activity banks keyed by subject + topic keywords, and generates the day-by-day plan proportional to the chosen duration and time-per-day, so different inputs visibly produce different output. Shown behind a short staged "Building your intervention plan…" progress state (reusing existing generating-overlay/streaming-cursor visuals). No model-name branding, no claim of a live AI call.
4. **Review / adjust** — action bar above the plan: "Make easier," "More rigorous," "Add EL support," "Change daily time," plus a per-section "Regenerate this section" icon button. Each mutates the plan via the same mock engine with adjusted parameters — real interactivity, honestly mock data.
5. **Save / history / export** — "Save" persists to `localStorage` (see §4.4); "Export" produces a real `.docx` (via existing `docx` + `file-saver` deps, same approach as `TemplateRunner.handleExport`) or falls back to `.txt`; "Print" uses `window.print()` on the plan content; "Copy section" copies that card's text.

### 4.3 Output — one connected plan, 8 sections, each its own card (not one text blob)
1. Problem summary
2. Intervention goal
3. Daily action plan (expandable day-by-day)
4. Differentiation
5. Progress monitoring
6. Teacher guidance
7. Family communication
8. Admin / MTSS summary

### 4.4 Mock data architecture & persistence
- All generation logic lives in `src/pages/features/action-studio/interventionSprintMockEngine.ts` — pure functions, typed inputs (`SprintContext`) → typed output (`SprintPlan`), no network calls.
- Saved sprints persist to `localStorage` under a dedicated key (e.g. `tutify.actionStudio.sprints`), **not** written into the real backend History system — this avoids fabricating entries in real user history data (the same trap `AlgebraGeometryTutor.tsx` fell into) while still giving a genuine "save/reopen/list" experience scoped entirely to the browser.
- "My Sprints" list lives inside the Action Studio home/section, separate from the global `/history` page, so there's no risk of the global History UI implying backend-verified provenance for mock content.

---

## 5. File / Route Changes

**New files**
- `src/data/coachCatalog.ts` — category → tool → route/capability metadata, `visible: boolean` flag, replaces the hardcoded `subjectCatalog` array in the hub
- `src/pages/features/ai-coach/CoachDeskHome.tsx` — new hub (featured coach + category cards + wired search/filter)
- `src/pages/features/ai-coach/CoachCategoryPage.tsx` — category → capability card grid
- `src/pages/features/action-studio/ActionStudioHome.tsx`
- `src/pages/features/action-studio/InterventionSprintStudio.tsx` (wizard shell + steps)
- `src/pages/features/action-studio/interventionSprintMockEngine.ts`
- `src/pages/features/action-studio/interventionSprintTypes.ts`
- `src/pages/features/action-studio/interventionSprintStorage.ts` (localStorage save/list/load/delete)

**Modified files**
- `src/routes/config.jsx` — swap `/chatbots` render to `CoachDeskHome`, add `/chatbots/category/:categorySlug` → `CoachCategoryPage`, add `/action-studio` and `/action-studio/intervention-sprint`; leave all 24 existing `/chatbots/*` tool routes mounted as-is (including hidden ones, for deep-link safety)
- `src/routes/sideMenuConfig.jsx` — rename `'Specialized Chatbots'` → `'AI Coach Desk'` (path `/chatbots` unchanged), add `'Teaching Action Studio'` nav item → `/action-studio`
- `src/pages/Dashboard.tsx` — remove quick links to GPT-4/Claude/Gemini pages
- `src/pages/features/SpecializedChatbots.tsx` — retired/replaced by `CoachDeskHome.tsx` (delete file once new hub is confirmed working, since it becomes dead code — not a "keep both" situation)
- `src/pages/features/LiteracyLabCoach.tsx` — wire or remove the 4 no-op "Download report" buttons
- Sweep (grep-driven) across the 16 KEEP specialist pages for other no-op buttons; wire with real client-side actions (copy/plain-text export of actual result state) or remove
- `src/locales/*` — add/rename i18n keys for `nav.chatbots` label text and new `nav.actionStudio` key

**Untouched (by design)**
- `src/api/chatbots.ts`, all backend endpoints, `useCapabilityCreditGate`, `useChatbotHistorySession`, `historyApiSlice`, any database/schema

---

## 6. Implementation Order

1. **Teaching Action Studio** (leading showcase, per instructions) — types → mock engine → wizard UI → output cards → adjust actions → save/export/history. Ship this first since it's the flagship and entirely new surface.
2. **AI Coach Desk cleanup** — build `coachCatalog.ts`, new `CoachDeskHome` + `CoachCategoryPage`, wire real search/filter, remove fake ratings/unwired favorites/decorative junk, retire `SpecializedChatbots.tsx`.
3. **Nav/route wiring** — rename sidebar label, add Action Studio nav entry, update `Dashboard.tsx` links, confirm hidden tools are unreachable from any discovery surface but still resolve by direct URL.
4. **Trust sweep** — no-op button audit across kept specialist pages.
5. **Pass over i18n keys** touched by renames.

---

## 7. Acceptance Criteria (senior demo)

- `/action-studio` → Intervention Sprint Studio runs end-to-end: context form → generated 8-section plan → at least one working "adjust" action visibly changes plan content → save persists and reopens → export produces a real downloadable file.
- `/chatbots` (AI Coach Desk) shows: featured General Teaching Coach (real chat) + 7 category cards; no hardcoded ratings; search/filter actually filters the real tool list; no dead buttons visible in the cleaned pages.
- GPT-4/Claude/Gemini/UNEC/Advanced Knowledge Skills Coach/Problem-Solving Coach/Algebra & Geometry Tutor are not linked from anywhere in discovery (hub, categories, Dashboard).
- Sidebar reads "AI Coach Desk" and "Teaching Action Studio."
- No backend files touched, no DB migrations/writes, `yarn build` and `yarn lint` clean.

## 8. Non-Goals

- No backend or database changes of any kind.
- No attempt to make Problem-Solving Coach / Algebra & Geometry Tutor "real" by guessing at unverified backend capability contracts.
- No rewrite of the 16 already-working specialist pages into new full workspace shells — only trust/dead-button cleanup.
- No new animation dependency (framer-motion etc.).
- No fabricated backend-model branding (no "Powered by GPT-4/Claude/Gemini" language anywhere in the rebuilt UI).
- Action Studio history is a local, browser-scoped feature — not merged into the real global History/backend system.
