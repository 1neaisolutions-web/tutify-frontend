# React Project Implementation Guide

This guide defines the recommended engineering standard for building scalable React applications in this workspace.
It combines routing architecture, folder conventions, naming/casing rules, and implementation standards for multi-role apps.

---

## 1) Purpose

Use this document as the default standard when:

- Bootstrapping a new React project
- Refactoring an existing project
- Reviewing pull requests for architecture consistency
- Onboarding new developers

The goal is to keep code professional, maintainable, and easy to scale.

---

## 2) Core Engineering Rules

- Use **JavaScript only** (`.js` / `.jsx`), not TypeScript
- Use **functional components with arrow functions** only
- Keep components small and single-responsibility
- Prefer composition over deeply nested component logic
- Use **Tailwind CSS + MUI** together (utility + rich component model)
- Keep route definitions centralized and declarative
- Separate **route access control** from **menu navigation**

---

## 3) Folder Naming and File Naming Standards

Consistency here prevents long-term chaos.

### 3.1 Folder names

- Use **kebab-case** for route-level feature domains:
  - `teacher-tools`, `learning-hub`, `content-management`
- Use **PascalCase** for component/page folders when co-located by component:
  - `DashboardHome`, `TeacherToolsOverview`
- Pick one convention per layer and keep it consistent.

### 3.2 File names

- React components: `PascalCase.jsx` (or `.js`)
  - `RoleRoute.jsx`, `DashboardLayout.jsx`
- Utilities/helpers: `camelCase.js`
  - `resolveDefaultRouteByRole.js`
- Constants/config files: `camelCase.js`
  - `publicRoutes.js`, `paths.js`
- Barrel exports: always `index.js`

### 3.3 Case discipline (important)

- Component symbol names: `PascalCase`
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Route keys/ids: `dot.case` or `kebab-case` (choose one team-wide)

---

## 4) Recommended `src` Architecture

```bash
src/
  components/
    shared/
      Button/
        Button.jsx
        index.js
      Table/
        Table.jsx
        index.js
      index.js
    pages/
      teacher/
        Dashboard/
          DashboardHeader.jsx
          DashboardStatCard.jsx
          index.js
        TeacherTools/
          TeacherToolsSummaryCard.jsx
          TeacherToolsQuickFilters.jsx
          index.js
        index.js
      admin/
        ContentManagement/
          ContentPackCard.jsx
          ContentPackFilters.jsx
          index.js
        index.js
      student/
        LearningHub/
          LearningProgressCard.jsx
          index.js
        index.js
      parent/
        ChildProgress/
          ChildProgressSummary.jsx
          index.js
        index.js
      index.js

  panels/                    # multi-role app screen modules live here
    auth/
      Login/
        Login.jsx
        index.js
      SignUp/
        SignUp.jsx
        index.js
      index.js
    teacher/
      DashboardPanel/
        DashboardPanel.jsx
        index.js
      index.js
    admin/
      AdministrationPanel/
        AdministrationPanel.jsx
        index.js
      index.js
    student/
      StudentHomePanel/
        StudentHomePanel.jsx
        index.js
      index.js
    parent/
      ParentHomePanel/
        ParentHomePanel.jsx
        index.js
      index.js
    index.js

  routes/
    AppRouter.jsx
    index.js
    guards/
      ProtectedRoute.jsx
      PublicOnlyRoute.jsx
      RoleRoute.jsx
      index.js
    config/
      paths.js
      publicRoutes.js
      sharedRoutes.js
      teacherRoutes.js
      adminRoutes.js
      studentRoutes.js
      parentRoutes.js
      index.js
    fallback/
      ForbiddenPage.jsx
      NotFoundPage.jsx
      index.js
    utils/
      mapRoutesToElements.js
      resolveDefaultRouteByRole.js
      index.js

  layouts/
    DashboardLayout.jsx
    AuthLayout.jsx
    index.js

  hooks/
  services/
  utils/
  constants/
```

---

## 5) "panel" vs "panels" vs "pannel"

Use professional spelling:

- Correct word: `panel`
- Preferred folder: `panels` (plural, if it contains many panel modules)
- Avoid misspelling: `pannel`

If your current repo already uses `panels`, keep it for consistency and avoid risky renames unless done as a planned refactor.

---

## 5.1) App-Type Rule (Role-Based vs Simple Website)

### Role-based app (multi-user, authenticated)

- Keep auth and role screens inside `panels/`:
  - `panels/auth/...`
  - `panels/teacher/...`
  - `panels/admin/...`
  - `panels/student/...`
  - `panels/parent/...`
- Do not add a generic `pages/` folder for multi-role apps.

### Simple website (no role system, portfolio/landing/company site)

- Use `pages/` directly for all route-level screens:
  - `pages/Home/`, `pages/About/`, `pages/Contact/`, `pages/Auth/`
- For simple websites, use `pages/` in place of `panels/`.
- `panels/` is not required in this case.

---

## 6) Page Structure Pattern (Mandatory)

For each route-level screen in a multi-role app:

1. Create role bucket inside `panels/`, then feature folder:
   - `panels/teacher/TeacherTools/`
   - `panels/admin/Administration/`
2. Add main file:
   - `TeacherTools.jsx` (or page-equivalent name)
3. Add `index.js` export
4. If page grows, split sections:
   - `TeacherToolsHero.jsx`, `TeacherToolsStats.jsx`, `TeacherToolsFaq.jsx`
5. Compose sections in main page file
6. Keep page-specific components under:
   - `components/pages/teacher/TeacherTools/`

Example:

```bash
panels/
  teacher/
    TeacherTools/
      TeacherTools.jsx
      TeacherToolsHero.jsx
      TeacherToolsSections.jsx
      index.js
    index.js
components/
  pages/
    teacher/
      TeacherTools/
        TeacherToolsSummaryCard.jsx
        TeacherToolsCtaBlock.jsx
        index.js
      index.js
```

---

## 7) Shared vs Page-Specific Components

### Shared (`components/shared`)

Put reusable UI here:

- `Button`, `Input`, `Select`, `Modal`, `Table`, `Pagination`, `Tabs`

Rules:

- Must be generic
- Must not contain page-specific business logic
- Should be documented with expected props

### Page-specific (`components/pages/<role>/<PageName>`)

Put non-reusable pieces here:

- `TeacherToolsSummaryCard`
- `AssignmentQuickFilters`

Rules:

- Can depend on page context
- If reused in 2+ pages, promote to `shared/`

---

## 8) Routing and Multi-Role Standard

Route groups must be separated:

1. **Public routes**
   - `/login`, `/signup`, `/forgot-password`
2. **Role-specific protected routes**
   - `teacher`, `student`, `parent`, `admin` variants
3. **Optional common protected routes**
   - only if truly cross-role and identical behavior for all roles

### Required guards

- `ProtectedRoute`: authentication gate
- `PublicOnlyRoute`: prevents logged-in users from auth pages
- `RoleRoute`: role authorization gate (redirect to `/403`)

### Required fallback pages

- `/403` for unauthorized access
- `*` for unknown route (`404`)

Never rely on menu visibility alone for security.

---

## 9) Route Configuration Contract

Keep route files declarative with a standard object shape:

```js
{
  key: 'teacher.assignment.list',
  path: APP_PATHS.TEACHER_ASSIGNMENTS,
  component: AssignmentListPage,
  layout: 'dashboard',
  roles: ['teacher'],
  children: []
}
```

Rules:

- `key` must be globally unique
- `path` must come from `paths.js`
- `component` is page component only
- Layout wrapping should be centralized in router

---

## 10) Path Constants Standard

Define all route paths in one file (`paths.js`):

```js
export const APP_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  FORBIDDEN: '/403',
};
```

Benefits:

- easier refactor
- typo prevention
- cleaner imports
- consistent route ownership

---

## 11) Export and Import Standard

Use barrel exports:

- every major folder has `index.js`
- avoid deep import chains where possible

Preferred:

```js
import { teacherRoutes } from '@/routes/config';
import { ProtectedRoute } from '@/routes/guards';
```

Avoid:

```js
import { teacherRoutes } from '@/routes/config/teacherRoutes';
```

---

## 12) Code Style and Quality Rules

- Arrow functions everywhere
- Avoid giant files (> 300-400 lines) when possible
- Move complex logic into hooks/helpers
- Remove debug `console.log` before production release
- Keep side effects outside render paths when possible
- Keep PRs modular and review-friendly

---

## 13) Professional Casing and Naming Cheat Sheet

- Component file: `TeacherToolsOverview.jsx`
- Hook file: `useTeacherAssignments.js`
- Utility file: `formatDateRange.js`
- Constant file: `paths.js`
- Constant value: `DEFAULT_PAGE_SIZE`
- Route key: `teacher.tools.overview`

---

## 14) Suggested Team Workflow for New Features

1. Create screen folder in role scope: `panels/<role>/<FeatureName>/`
2. Add page and sections (`FeatureName.jsx`, `<FeatureName>Hero.jsx`, etc.)
3. Add page-specific components in `components/pages/<role>/<FeatureName>/`
4. Add shared UI only if truly reusable
5. Register paths in `routes/config/paths.js`
6. Register route in correct route group file
7. Add menu entry in side menu config (if needed)
8. Validate role access behavior (`403`, redirects, login flow)

---

## 15) Anti-Patterns to Avoid

- Single huge `config.jsx` with all app routes
- Repeating same layout wrapper in every route manually
- Mixed naming styles without convention
- Misspelled folder names (`pannel`)
- Page-specific code inside `shared/`
- Auth checks in many page components instead of route guards

---

## 16) Migration Guidance for Existing Codebase

When refactoring an existing project:

- Do not rename everything at once
- First standardize new files with this guide
- Then refactor in small phases:
  1. split route configs
  2. centralize paths
  3. add role guard
  4. introduce fallback pages
  5. clean exports

This reduces risk and keeps releases stable.

---

## 17) Final Team Policy (Short Version)

- JavaScript only, no TypeScript
- Arrow functions only
- Route groups: public + role-specific protected (common protected is optional)
- Guards required: `ProtectedRoute`, `PublicOnlyRoute`, `RoleRoute`
- Fallbacks required: `403` and `404`
- Centralized `paths.js`
- Consistent casing and barrel exports
- Prefer `panels` (correct spelling), never `pannel`

---

If any team member is unsure where a file belongs, follow this priority:

1. `panels/<role>/` for multi-role route-level screens
2. `components/pages/<role>/` for role-scoped page components
3. `components/shared/` for reusable UI
4. `routes/config/` for route declarations
5. `routes/guards/` for access logic

