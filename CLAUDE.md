# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

React 18 + TypeScript SPA built with Vite, Tailwind CSS, MUI, and Redux Toolkit.

---

## Commands

```bash
# Install dependencies
yarn install          # preferred (yarn.lock is committed)

# Dev server (http://localhost:5173)
yarn dev

# Production build
yarn build            # vite build (TypeScript checked by vite-plugin-checker or tsc separately)

# Lint
yarn lint

# E2E tests (Playwright, Chromium only, base URL: http://localhost:5173)
yarn test:e2e
yarn test:e2e:ui      # interactive UI mode

# Template API smoke tests (Node scripts, no browser required)
yarn test:templates
yarn test:all-templates
yarn test:stream
```

---

## Environment

Copy `.env.example` to `.env`. Key variables:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8001        # preferred — overrides all others
VITE_API_URL=http://127.0.0.1:8001/api         # fallback (strips /api suffix internally)
VITE_PROXY_TARGET=http://127.0.0.1:8000        # optional dev proxy for /api/* in vite.config.ts
VITE_USE_LOCAL=true                             # forces localhost fallback
VITE_PERSONALIZATION_ENABLED=true              # enables learning hub personalization
```

Priority resolution in `src/config/api.ts`:  
`VITE_API_BASE_URL` > `VITE_API_URL` (strips `/api`) > Railway default > `VITE_USE_LOCAL=true` → localhost.

The Vite dev server proxies `/api/*` to `VITE_PROXY_TARGET` (default: `http://127.0.0.1:8000`). This is separate from `VITE_API_BASE_URL` — the proxy handles requests made directly by the browser without a full origin, while `VITE_API_BASE_URL` is used by the TypeScript API client.

---

## Architecture

### API Client

All new fetch calls go through `src/api/client.ts → apiRequest<T>()`. Do **not** use the legacy `src/redux/http.js` (Axios) for new code.

Key behaviours:
- Auto-attaches `Authorization: Bearer <token>` from Redux store / `localStorage`.
- Proactively checks JWT `exp` claim 60 s before expiry → calls `POST /api/v1/auth/refresh`.
- On 401: one refresh attempt, then retry. On second 401: clears auth state and throws `ApiError`.
- Default timeout: **30 s**. Pass `timeout` option to override.
- Parses JSON when `Content-Type: application/json`, otherwise returns raw text.

```ts
import { apiRequest } from '../api/client'

const data = await apiRequest<MyType>('/api/v1/some-endpoint', {
  method: 'POST',
  body: { key: 'value' },
})
```

Domain-specific API modules in `src/api/`: `templates.ts`, `chatbots.ts`, `subscriptions.ts`, `quizApi.ts`, `assignmentApi.ts`, `worksheetApi.ts`, `historyApi.ts`, `examApi.ts`, `contentIngestion.ts`, `pixgen.ts`, `youtubeQuiz.ts`. Add a new file per distinct domain.

### State Management

Redux Toolkit + redux-persist. Persisted slices (localStorage key `persist:root`): **`auth`** and **`preferences`**.

**Standard slices** (`src/redux/features/`):

| Slice | Purpose |
|---|---|
| `auth` | Logged-in user, tokens, auth status — **persisted** |
| `preferences` | Theme, language, timezone — **persisted** |
| `signup` | Multi-step signup flow state |
| `membership` | Active tenant / workspace |
| `subscription` | Subscription/plan state |
| `templates` | Template list & execution state |
| `learningHub` | Personalised home feed |
| `learningHubAdmin` | Admin learning hub controls |
| `learningProgress` | Session / event tracking |
| `teacherIdentity` | Professional profile data |
| `personalization` | Personalization state & jobs |
| `profileContext` | Teacher profile context |
| `snackbar` | Global toast notifications |

**RTK Query API slices** (with automatic caching/invalidation):

| Slice | Purpose |
|---|---|
| `quizApiSlice` | Quiz CRUD |
| `assignmentApiSlice` | Assignment CRUD |
| `worksheetApiSlice` | Worksheet CRUD |
| `statsApiSlice` | Statistics |
| `analyticsApiSlice` | Analytics |
| `historyApiSlice` | Activity history |
| `contentRegistryApiSlice` | Content registry |

Use RTK Query slices for new data-fetching features that benefit from caching. Use `apiRequest` directly for one-shot mutations or streaming.

### Routing

React Router v6 (`src/routes/`). Six user roles each have their own route set defined in `src/routes/config.jsx`: `super_admin`, `org_admin`, `school_admin`, `teacher`, `student`, `parent`.

- `src/routes/index.jsx` — root Router; selects route set by `auth.user.role`
- `src/routes/PrivateRoutes.jsx` — guards that check `auth.isAuthenticated`; waits for redux-persist rehydration before rendering
- `src/routes/sideMenuConfig.jsx` — sidebar nav items (role-filtered)

### i18n

Translation files live in `src/locales/`. The i18n instance is initialized in `src/i18n/` and wrapped in `src/lib/i18n/`. `App.tsx` sets up the provider.

### Path Alias

`@/` resolves to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`).

---

## Styling

Tailwind CSS v3 (utility classes, dark mode via `.dark` class) + MUI v7 (complex components: DatePicker, DataGrid, etc.). Custom primary palette is sky-blue — see `tailwind.config.js`.

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@reduxjs/toolkit` + `react-redux` | State management + RTK Query |
| `redux-persist` | Persist auth & preferences to localStorage |
| `react-router-dom` v6 | Routing |
| `axios` (legacy) / `fetch` (new) | HTTP |
| `@mui/material` v7 | Component library |
| `tailwindcss` v3 | Utility-first CSS |
| `@fullcalendar/*` | Calendar UI |
| `apexcharts` | Charts |
| `docx` + `file-saver` | Export to .docx |
| `react-markdown` + `remark-gfm` | Markdown rendering |
| `dayjs` | Date utilities |
| `playwright` | E2E testing |

---

## Adding a New Feature

1. Create a Redux slice (or RTK Query API slice) under `src/redux/features/<feature>/`.
2. Add API calls in `src/api/<feature>.ts`.
3. Add routes to the appropriate role config in `src/routes/config.jsx`.
4. Page component → `src/pages/`, sub-components → `src/features/<feature>/`.

---

## Deployment

Hosted on **Vercel**. Production URL: `https://1ne-frontend.vercel.app`.  
Set `VITE_API_BASE_URL` in Vercel environment variables to point at the Railway backend.
