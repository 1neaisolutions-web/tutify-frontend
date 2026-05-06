# Teacher Assistant - Frontend

A modern, AI-powered teaching platform designed to help teachers create engaging learning experiences with the integration of AI tools.

## Features (MVP)

- **Authentication System**: Secure login, signup, and password recovery
- **Dashboard**: Clean, intuitive interface with sidebar navigation
- **Templates Library**: Access to teaching templates and resources
- **Specialized Chatbots**: AI chatbots for specific teaching scenarios
- **YouTube Quiz Generator**: Automatically generate quizzes from YouTube videos
- **PixGen (AI Media Studio)**: Generate and edit images with AI
- **Professional Learning Hub**: Access professional development resources
- **History & Personalization**: Track activity and customize experience

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment template and update the backend URL if needed:
```bash
cp .env.example .env
# VITE_API_URL defaults to http://localhost:8000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## End-to-end tests (Playwright)

### Prerequisites
- Start backend + frontend together from repo root:
```powershell
.\dev-local.ps1
```

### Run E2E
Playwright E2E uses **UI login** (real `/api/v1/auth/login`). Provide credentials via env vars:

```powershell
cd 1ne-frontend
$env:E2E_EMAIL="teacher@example.com"
$env:E2E_PASSWORD="your_password"
yarn test:e2e
```

Optional overrides:
- `PLAYWRIGHT_BASE_URL` (default `http://localhost:5173`)

### Notes (Windows file locks)
If `yarn add` / installs fail with `EPERM unlink ... .node`, stop any running Node/Vite processes and retry.

### Connecting to the FastAPI backend

1. From `/Backend`: `alembic upgrade head && python -m src.seed.minimal`
2. Run `uvicorn src.main:app --reload`
3. Ensure the URL matches `VITE_API_URL` (default `http://localhost:8000/api`)
4. Start the frontend (`npm run dev`) – template listings, frameworks, and the alignment agent will now use live data.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── ForgotPassword.tsx
│   ├── features/      # Feature pages
│   │   ├── TemplatesLibrary.tsx
│   │   ├── SpecializedChatbots.tsx
│   │   ├── YouTubeQuizGenerator.tsx
│   │   ├── PixGen.tsx
│   │   ├── ProfessionalLearningHub.tsx
│   │   └── HistoryPersonalization.tsx
│   ├── Dashboard.tsx
│   └── DashboardHome.tsx
├── App.tsx            # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Authentication

The app includes a mock authentication system for MVP purposes. In production, you'll need to:

1. Replace the mock authentication in `AuthContext.tsx` with actual API calls
2. Implement proper JWT token handling
3. Add refresh token logic
4. Implement secure password hashing on the backend

## Design Principles

- **Simple & Clean**: Easy-to-use interface for teachers of all ages
- **Modern UI/UX**: Professional look with smooth interactions
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: Follows accessibility best practices
- **Scalable**: Code structure designed for easy expansion

## Next Steps

1. Expand backend data beyond the seeded CCSS/UK examples
2. Persist template favourites/history against user accounts
3. Add optimistic UI + caching (React Query/SWR) for API calls
4. Implement analytics + monitoring
5. Harden auth flows (JWT/Clerk integration)

## License

This project is proprietary software.



# tutify-frontend
