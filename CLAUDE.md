# 1ne.ai Frontend

React 18 + TypeScript SPA built with Vite, Tailwind CSS, MUI, and Redux Toolkit.  
See the [root CLAUDE.md](../CLAUDE.md) for the full API contract and shared conventions.

---

## Commands

```bash
# Install dependencies
yarn install          # preferred (yarn.lock is committed)
# npm ci               # fallback

# Dev server (http://localhost:5173)
yarn dev

# Production build
yarn build            # tsc + vite build

# Lint
yarn lint

# Template API smoke tests
yarn test:templates
yarn test:all-templates
yarn test:stream
```

---

## Environment

Copy `.env.example` to `.env`:

```bash
# Point at the local backend (port 8001 by default)
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_API_URL=http://127.0.0.1:8001/api
```

Priority resolution in `src/config/api.ts`:  
`VITE_API_BASE_URL` > `VITE_API_URL` (strips `/api`) > Railway default > `VITE_USE_LOCAL=true` → localhost.

---

## Project Structure

```
src/
├── api/               # Typed API layer
│   ├── client.ts      # apiRequest(), auth token injection, refresh & retry
│   ├── chatbots.ts    # Chatbot API calls
│   ├── subscriptions.ts
│   ├── templates.ts
│   └── types.ts       # Shared TypeScript types (TemplateResponse, StreamEvent, …)
├── config/
│   └── api.ts         # API_URL, API_BASE_URL, HEALTH_URL constants
├── components/        # Shared UI components
├── features/          # Feature-level components (co-located with their logic)
├── pages/             # Route-level page components
├── panels/            # Overlay / slide-in panel components
├── redux/
│   ├── store.js       # Redux store + redux-persist config
│   ├── http.js        # Axios-based HTTP helper (legacy; new code uses client.ts)
│   └── features/
│       ├── auth/            # authSlice, signupSlice
│       ├── learningHub/     # learningHubSlice
│       ├── learningHubAdmin/
│       ├── learningProgress/
│       ├── membership/      # membershipSlice
│       ├── personalization/
│       ├── profileContext/
│       ├── snackbarSlice/
│       ├── teacherIdentity/
│       └── templates/
├── routes/            # React Router route definitions
├── hooks/             # Custom React hooks
├── contexts/          # React context providers
├── types/             # Additional TypeScript type declarations
├── constants/         # App-wide constants
├── utils/             # Pure utility functions
└── lib/               # Third-party library wrappers
```

---

## API Client

All fetch calls go through `src/api/client.ts → apiRequest<T>()`.

Key behaviours:
- Auto-attaches `Authorization: Bearer <token>` from Redux store / `localStorage`.
- Proactively checks JWT `exp` claim 60 s before expiry and calls `POST /api/v1/auth/refresh`.
- On 401 response: attempts one token refresh then retries the original request.
- On second 401: clears auth state from localStorage and throws `ApiError`.
- Default timeout: **30 s** (matches backend). Pass `timeout` option to override.
- Parses JSON when `Content-Type: application/json`, otherwise returns raw text.

```ts
import { apiRequest } from '../api/client'

const data = await apiRequest<MyType>('/api/v1/some-endpoint', {
  method: 'POST',
  body: { key: 'value' },
})
```

---

## State Management

Redux Toolkit + redux-persist. Only the `auth` slice is persisted (localStorage key `persist:root`).

| Slice | Purpose |
|---|---|
| `auth` | Logged-in user, tokens, auth status |
| `signup` | Multi-step signup flow state |
| `membership` | Active tenant / membership |
| `templates` | Template list & execution state |
| `learningHub` | Personalised home feed |
| `learningHubAdmin` | Admin learning hub controls |
| `learningProgress` | Session / event tracking |
| `teacherIdentity` | Professional profile data |
| `personalization` | Personalization state & jobs |
| `profileContext` | Teacher profile context |
| `snackbar` | Global toast notifications |

---

## Routing

React Router v6 (`src/routes/`). Protected routes check `auth.isAuthenticated` from Redux. Role-based access is enforced by checking `auth.user.roles`.

---

## Styling

Tailwind CSS v3 + MUI v7. Tailwind handles layout and utility classes; MUI handles complex components (DatePicker, DataGrid, etc.).

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@reduxjs/toolkit` + `react-redux` | State management |
| `redux-persist` | Persist auth to localStorage |
| `react-router-dom` v6 | Routing |
| `axios` (legacy) / `fetch` (new) | HTTP |
| `@mui/material` v7 | Component library |
| `tailwindcss` v3 | Utility-first CSS |
| `@fullcalendar/*` | Calendar UI |
| `apexcharts` | Charts |
| `docx` + `file-saver` | Export to .docx |
| `react-markdown` + `remark-gfm` | Markdown rendering |
| `dayjs` | Date utilities |

---

## Adding a New Feature

1. Create a Redux slice under `src/redux/features/<feature>/`.
2. Wire API calls through `src/api/` (new file if it's a distinct domain).
3. Add routes in `src/routes/`.
4. Keep page components in `src/pages/`, sub-components in `src/features/<feature>/`.

---

## Deployment

Hosted on **Vercel**. Production URL: `https://1ne-frontend.vercel.app`.  
Set `VITE_API_BASE_URL` in Vercel environment variables to point at the Railway backend.
