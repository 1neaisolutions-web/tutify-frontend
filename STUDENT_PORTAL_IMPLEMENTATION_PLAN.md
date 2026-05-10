# Student Portal — Implementation Plan

> **Document:** `STUDENT_PORTAL_IMPLEMENTATION_PLAN.md`  
> **Repo:** `tutify-frontend`  
> **Version:** 1.0  
> **Source PDF:** `student_portal_document_V1.0.pdf`  
> **Guide:** `REACT_PROJECT_IMPLEMENTATION_GUIDE.md`  
> **Status:** Frontend plan — no backend scope  

---

## Table of Contents

1. [Scope & Principles](#1-scope--principles)
2. [Folder & File Structure](#2-folder--file-structure)
3. [Routing Plan (Student-Only)](#3-routing-plan-student-only)
4. [Side Menu Plan (Student-Only)](#4-side-menu-plan-student-only)
5. [Page-by-Page Build Spec](#5-page-by-page-build-spec)
6. [Dummy Data + Fake API Layer](#6-dummy-data--fake-api-layer)
7. [State Management Approach](#7-state-management-approach)
8. [UI/UX System](#8-uiux-system)
9. [Acceptance Checklist](#9-acceptance-checklist)
10. [Implementation Sequence](#10-implementation-sequence)

---

## 1. Scope & Principles

### Phase 1 — MVP (Build Now)

Aligned to what the teacher module currently supports. All 12 modules below are buildable today against existing teacher-side APIs. Backend is not ready, so every screen runs on rich dummy data with realistic async simulation.

| # | Module | Route Entry | Priority |
|---|--------|-------------|----------|
| 01 | Student Onboarding | `/student/onboarding` | P0 |
| 02 | Student Dashboard | `/student/dashboard` | P0 |
| 03 | Course & Content Viewer | `/student/content` | P1 |
| 04 | Assignment Hub | `/student/assignments` | P0 |
| 05 | Quiz & Assessment Center | `/student/quizzes` + `/student/exams` | P0 |
| 06 | Personal Homework Manager | `/student/homework` | P1 |
| 07 | Class Timetable | `/student/timetable` | P1 |
| 11 | Grade Impact Calculator | `/student/grade-calculator` | P1 |
| 12 | Exam Day Toolkit | `/student/exams/:id/prepare` | P1 |
| 13 | Teacher Interaction Hub | `/student/teachers` + `/student/doubts` | P1 |
| 14 | Student Progress View | `/student/progress` | P1 |
| — | Notification Center | Global (bell + toasts) | P0 |

### Phase 2 — Submission & Feedback Parity _(Future — do not design in detail)_

Unlocked when teacher-side submissions review and deeper analytics reach production.

- Assignment feedback receipt UI (teacher comments + rubric scores)
- Revision request / resubmission flow
- Detailed quiz/exam result breakdown + answer review
- Worksheet interactive submission
- Subject Study Room (`/student/subjects/:id/room`) — Module 08
- Study Time Tracker (`/student/study-time`) — Module 10
- Notes system per subject (`/student/notes`) — Module 09 partial
- Office hours booking in Teacher Interaction Hub
- Progress View — detailed per-subject breakdown
- Grade auto-pull from teacher-released results

### Phase 3 — Engagement & Collaboration Layer _(Future — list only)_

- Smart Capture / Camera OCR / Math scanner — Module 09 full
- Gamification: streaks, XP, badges
- AI study suggestions and Night Before Pack
- Social learning feed (class-scoped)
- Real-time collaborative notes
- Student progress sharing with parents

### Hard Constraints

- **Do not modify any teacher feature, teacher route, or teacher component.**
- **Do not change** `src/routes/index.jsx`, `PrivateRoutes.jsx`, `PublicRoutes.jsx`, or app bootstrap files.
- Only add entries to the `studentRoutes` array in `src/routes/config.jsx` and the `studentMenu` array in `src/routes/sideMenuConfig.jsx`.
- JavaScript + JSX only (no TypeScript). Arrow functions only.
- All new student screens live under `src/panels/student/`.
- Page-specific components live under `src/components/pages/student/`.

---

## 2. Folder & File Structure

Follows the `REACT_PROJECT_IMPLEMENTATION_GUIDE.md` architecture exactly. Every folder has an `index.js` barrel export.

```
src/
│
├── panels/
│   └── student/                          ← route-level screens (guide §5.1)
│       ├── StudentOnboarding/
│       │   ├── StudentOnboarding.jsx
│       │   ├── OnboardingStep1Profile.jsx
│       │   ├── OnboardingStep2Classes.jsx
│       │   ├── OnboardingStep3Goals.jsx
│       │   └── index.js
│       ├── StudentDashboard/
│       │   ├── StudentDashboard.jsx
│       │   ├── DueSoonWidget.jsx
│       │   ├── UpcomingQuizzesWidget.jsx
│       │   ├── AnnouncementsWidget.jsx
│       │   ├── RecentGradesWidget.jsx
│       │   └── index.js
│       ├── AssignmentHub/
│       │   ├── AssignmentHub.jsx
│       │   ├── AssignmentDetail.jsx
│       │   ├── AssignmentSubmit.jsx
│       │   ├── AssignmentFeedback.jsx     ← Phase 2 surface (shows "pending" state in P1)
│       │   └── index.js
│       ├── QuizCenter/
│       │   ├── QuizCenter.jsx
│       │   ├── QuizTake.jsx
│       │   ├── QuizResults.jsx
│       │   └── index.js
│       ├── ExamCenter/
│       │   ├── ExamCenter.jsx
│       │   ├── ExamTake.jsx
│       │   ├── ExamPrepare.jsx
│       │   ├── ExamReflect.jsx
│       │   └── index.js
│       ├── ContentViewer/
│       │   ├── ContentViewer.jsx
│       │   ├── ContentSubjectView.jsx
│       │   ├── ContentWorksheetViewer.jsx
│       │   └── index.js
│       ├── HomeworkManager/
│       │   ├── HomeworkManager.jsx
│       │   └── index.js
│       ├── Timetable/
│       │   ├── Timetable.jsx
│       │   └── index.js
│       ├── GradeCalculator/
│       │   ├── GradeCalculator.jsx
│       │   └── index.js
│       ├── TeacherHub/
│       │   ├── TeacherHub.jsx
│       │   ├── TeacherDetail.jsx
│       │   ├── DoubtList.jsx
│       │   ├── DoubtDetail.jsx
│       │   └── index.js
│       ├── ProgressView/
│       │   ├── ProgressView.jsx
│       │   ├── SubjectProgress.jsx
│       │   └── index.js
│       │
│       ├── data/                         ← in-memory dummy datasets
│       │   ├── assignments.js
│       │   ├── quizzes.js
│       │   ├── exams.js
│       │   ├── content.js
│       │   ├── homework.js
│       │   ├── timetable.js
│       │   ├── teachers.js
│       │   ├── progress.js
│       │   ├── announcements.js
│       │   └── index.js
│       │
│       ├── api/                          ← fake API layer (async, simulates latency)
│       │   ├── assignmentApi.js
│       │   ├── quizApi.js
│       │   ├── examApi.js
│       │   ├── contentApi.js
│       │   ├── homeworkApi.js
│       │   ├── timetableApi.js
│       │   ├── teacherApi.js
│       │   ├── progressApi.js
│       │   ├── notificationApi.js
│       │   └── index.js
│       │
│       ├── hooks/                        ← data-fetching hooks per domain
│       │   ├── useStudentAssignments.js
│       │   ├── useStudentQuizzes.js
│       │   ├── useStudentExams.js
│       │   ├── useStudentContent.js
│       │   ├── useStudentHomework.js
│       │   ├── useStudentTimetable.js
│       │   ├── useStudentProgress.js
│       │   ├── useStudentNotifications.js
│       │   └── index.js
│       │
│       ├── utils/
│       │   ├── gradeCalculator.js        ← pure calculation logic for Module 11
│       │   ├── dateHelpers.js            ← countdown, due-date formatting
│       │   ├── statusHelpers.js          ← status label + color mappings
│       │   └── index.js
│       │
│       ├── constants/
│       │   ├── studentPaths.js           ← STUDENT_PATHS constant object
│       │   ├── statusTypes.js            ← ASSIGNMENT_STATUS, QUIZ_STATUS enums
│       │   └── index.js
│       │
│       └── index.js
│
├── components/
│   ├── pages/
│   │   └── student/                     ← page-specific components (guide §7)
│   │       ├── StudentDashboard/
│   │       │   ├── DueSoonCard.jsx
│   │       │   ├── QuizCountdownCard.jsx
│   │       │   ├── AnnouncementItem.jsx
│   │       │   ├── RecentGradeItem.jsx
│   │       │   └── index.js
│   │       ├── AssignmentHub/
│   │       │   ├── AssignmentCard.jsx
│   │       │   ├── AssignmentStatusBadge.jsx
│   │       │   ├── AssignmentFilters.jsx
│   │       │   ├── SubmissionUploader.jsx
│   │       │   ├── SubmissionConfirmation.jsx
│   │       │   └── index.js
│   │       ├── QuizCenter/
│   │       │   ├── QuizCard.jsx
│   │       │   ├── QuizTimerBar.jsx
│   │       │   ├── QuizNavigator.jsx
│   │       │   ├── QuizQuestionRenderer.jsx
│   │       │   ├── QuizResultCard.jsx
│   │       │   └── index.js
│   │       ├── ExamCenter/
│   │       │   ├── ExamCard.jsx
│   │       │   ├── ExamCountdownBanner.jsx
│   │       │   ├── ExamChecklistItem.jsx
│   │       │   └── index.js
│   │       ├── ContentViewer/
│   │       │   ├── ContentCard.jsx
│   │       │   ├── SubjectFilterBar.jsx
│   │       │   ├── ContentTypeBadge.jsx
│   │       │   └── index.js
│   │       ├── HomeworkManager/
│   │       │   ├── HomeworkTaskItem.jsx
│   │       │   ├── QuickAddPanel.jsx
│   │       │   ├── SubjectSummaryBar.jsx
│   │       │   └── index.js
│   │       ├── Timetable/
│   │       │   ├── PeriodCell.jsx
│   │       │   ├── NextClassBanner.jsx
│   │       │   ├── DayColumn.jsx
│   │       │   └── index.js
│   │       ├── GradeCalculator/
│   │       │   ├── GradeScenarioForm.jsx
│   │       │   ├── GradeResultDisplay.jsx
│   │       │   └── index.js
│   │       ├── TeacherHub/
│   │       │   ├── TeacherCard.jsx
│   │       │   ├── DoubtCard.jsx
│   │       │   ├── DoubtSubmitForm.jsx
│   │       │   ├── DoubtStatusBadge.jsx
│   │       │   └── index.js
│   │       ├── ProgressView/
│   │       │   ├── ScoreHistoryChart.jsx
│   │       │   ├── CompletionRateCard.jsx
│   │       │   ├── SubjectProgressBar.jsx
│   │       │   └── index.js
│   │       ├── shared/                  ← student-scoped shared UI (promote to components/shared if reused cross-role)
│   │       │   ├── StudentPageHeader.jsx
│   │       │   ├── StatusBadge.jsx      ← universal status badge for all student content types
│   │       │   ├── DeadlineChip.jsx     ← due date display with urgency color
│   │       │   ├── SkeletonCard.jsx     ← loading placeholder
│   │       │   ├── StudentEmptyState.jsx
│   │       │   ├── StudentErrorState.jsx
│   │       │   ├── NotificationBell.jsx
│   │       │   └── index.js
│   │       └── index.js
│   │
│   └── shared/                          ← (existing — reuse Button, Table, Tabs, etc.; add new only if truly generic)
│
└── routes/
    ├── config.jsx                       ← ADD studentRoutes entries here ONLY
    └── sideMenuConfig.jsx               ← ADD studentMenu entries here ONLY
    (all other route files: DO NOT TOUCH)
```

### Naming quick-reference (guide §3)

| Type | Convention | Example |
|------|-----------|---------|
| Panel folder | PascalCase | `AssignmentHub/` |
| Page file | PascalCase.jsx | `AssignmentHub.jsx` |
| Component file | PascalCase.jsx | `AssignmentCard.jsx` |
| Hook file | camelCase.js | `useStudentAssignments.js` |
| Utility file | camelCase.js | `gradeCalculator.js` |
| Constant file | camelCase.js | `studentPaths.js` |
| Constant value | UPPER_SNAKE_CASE | `ASSIGNMENT_STATUS.SUBMITTED` |
| Barrel export | index.js | always |

---

## 3. Routing Plan (Student-Only)

### Files to touch

| File | Change |
|------|--------|
| `src/routes/config.jsx` | Replace the single placeholder `studentRoutes` entry with the full route list below. Import new panel components at top of file. |
| `src/routes/sideMenuConfig.jsx` | Replace the single placeholder `studentMenu` entry with the full menu below. |
| **All other route files** | **Do not touch.** |

### Student route definitions

Add the following imports to the top of `src/routes/config.jsx`:

```js
// Student portal panels — Phase 1
import StudentOnboarding from '../panels/student/StudentOnboarding';
import StudentDashboard from '../panels/student/StudentDashboard';
import AssignmentHub from '../panels/student/AssignmentHub';
import AssignmentDetail from '../panels/student/AssignmentHub/AssignmentDetail';
import AssignmentSubmit from '../panels/student/AssignmentHub/AssignmentSubmit';
import AssignmentFeedback from '../panels/student/AssignmentHub/AssignmentFeedback';
import QuizCenter from '../panels/student/QuizCenter';
import QuizTake from '../panels/student/QuizCenter/QuizTake';
import QuizResults from '../panels/student/QuizCenter/QuizResults';
import ExamCenter from '../panels/student/ExamCenter';
import ExamTake from '../panels/student/ExamCenter/ExamTake';
import ExamPrepare from '../panels/student/ExamCenter/ExamPrepare';
import ExamReflect from '../panels/student/ExamCenter/ExamReflect';
import ContentViewer from '../panels/student/ContentViewer';
import ContentSubjectView from '../panels/student/ContentViewer/ContentSubjectView';
import ContentWorksheetViewer from '../panels/student/ContentViewer/ContentWorksheetViewer';
import HomeworkManager from '../panels/student/HomeworkManager';
import Timetable from '../panels/student/Timetable';
import GradeCalculator from '../panels/student/GradeCalculator';
import TeacherHub from '../panels/student/TeacherHub';
import TeacherDetail from '../panels/student/TeacherHub/TeacherDetail';
import DoubtList from '../panels/student/TeacherHub/DoubtList';
import DoubtDetail from '../panels/student/TeacherHub/DoubtDetail';
import ProgressView from '../panels/student/ProgressView';
import SubjectProgress from '../panels/student/ProgressView/SubjectProgress';
```

Replace the `studentRoutes` export with:

```js
export const studentRoutes = [
  // Redirect /student → /student/dashboard
  {
    path: '/student',
    moduleName: 'Student Root',
    element: <Navigate to="/student/dashboard" replace />,
  },

  // Onboarding (first-run wizard)
  {
    path: '/student/onboarding',
    moduleName: 'Student Onboarding',
    element: withDashboardLayout(<StudentOnboarding />),
  },

  // Dashboard
  {
    path: '/student/dashboard',
    moduleName: 'Student Dashboard',
    element: withDashboardLayout(<StudentDashboard />),
  },

  // Assignment Hub
  {
    path: '/student/assignments',
    moduleName: 'Assignment Hub',
    element: withDashboardLayout(<AssignmentHub />),
    child: [
      { path: '/student/assignments/:id',         moduleName: 'Assignment Detail', element: withDashboardLayout(<AssignmentDetail />) },
      { path: '/student/assignments/:id/submit',  moduleName: 'Assignment Submit', element: withDashboardLayout(<AssignmentSubmit />) },
      { path: '/student/assignments/:id/feedback',moduleName: 'Assignment Feedback', element: withDashboardLayout(<AssignmentFeedback />) },
    ],
  },

  // Quiz Center
  {
    path: '/student/quizzes',
    moduleName: 'Quiz Center',
    element: withDashboardLayout(<QuizCenter />),
    child: [
      { path: '/student/quiz/:id/take',    moduleName: 'Take Quiz',    element: withDashboardLayout(<QuizTake />) },
      { path: '/student/quiz/:id/results', moduleName: 'Quiz Results', element: withDashboardLayout(<QuizResults />) },
    ],
  },

  // Exam Center + Exam Day Toolkit
  {
    path: '/student/exams',
    moduleName: 'Exam Center',
    element: withDashboardLayout(<ExamCenter />),
    child: [
      { path: '/student/exam/:id/take',       moduleName: 'Take Exam',        element: withDashboardLayout(<ExamTake />) },
      { path: '/student/exams/:id/prepare',   moduleName: 'Exam Prepare',     element: withDashboardLayout(<ExamPrepare />) },
      { path: '/student/exams/:id/reflect',   moduleName: 'Exam Reflect',     element: withDashboardLayout(<ExamReflect />) },
    ],
  },

  // Content Viewer
  {
    path: '/student/content',
    moduleName: 'Content Viewer',
    element: withDashboardLayout(<ContentViewer />),
    child: [
      { path: '/student/content/:subjectId',              moduleName: 'Subject Content',    element: withDashboardLayout(<ContentSubjectView />) },
      { path: '/student/content/worksheet/:id',           moduleName: 'Worksheet Viewer',   element: withDashboardLayout(<ContentWorksheetViewer />) },
    ],
  },

  // Homework Manager
  {
    path: '/student/homework',
    moduleName: 'Homework Manager',
    element: withDashboardLayout(<HomeworkManager />),
  },

  // Timetable
  {
    path: '/student/timetable',
    moduleName: 'Class Timetable',
    element: withDashboardLayout(<Timetable />),
  },

  // Grade Calculator
  {
    path: '/student/grade-calculator',
    moduleName: 'Grade Calculator',
    element: withDashboardLayout(<GradeCalculator />),
  },

  // Teacher Interaction Hub
  {
    path: '/student/teachers',
    moduleName: 'Teacher Hub',
    element: withDashboardLayout(<TeacherHub />),
    child: [
      { path: '/student/teachers/:id', moduleName: 'Teacher Detail', element: withDashboardLayout(<TeacherDetail />) },
    ],
  },
  {
    path: '/student/doubts',
    moduleName: 'Doubts',
    element: withDashboardLayout(<DoubtList />),
    child: [
      { path: '/student/doubts/:id', moduleName: 'Doubt Detail', element: withDashboardLayout(<DoubtDetail />) },
    ],
  },

  // Progress View
  {
    path: '/student/progress',
    moduleName: 'Student Progress',
    element: withDashboardLayout(<ProgressView />),
    child: [
      { path: '/student/progress/:subjectId', moduleName: 'Subject Progress', element: withDashboardLayout(<SubjectProgress />) },
    ],
  },
];
```

### Route config contract (guide §9)

All path strings must be extracted to `src/panels/student/constants/studentPaths.js`:

```js
export const STUDENT_PATHS = {
  ROOT:            '/student',
  DASHBOARD:       '/student/dashboard',
  ONBOARDING:      '/student/onboarding',
  ASSIGNMENTS:     '/student/assignments',
  ASSIGNMENT:      (id) => `/student/assignments/${id}`,
  ASSIGNMENT_SUBMIT:   (id) => `/student/assignments/${id}/submit`,
  ASSIGNMENT_FEEDBACK: (id) => `/student/assignments/${id}/feedback`,
  QUIZZES:         '/student/quizzes',
  QUIZ_TAKE:       (id) => `/student/quiz/${id}/take`,
  QUIZ_RESULTS:    (id) => `/student/quiz/${id}/results`,
  EXAMS:           '/student/exams',
  EXAM_TAKE:       (id) => `/student/exam/${id}/take`,
  EXAM_PREPARE:    (id) => `/student/exams/${id}/prepare`,
  EXAM_REFLECT:    (id) => `/student/exams/${id}/reflect`,
  CONTENT:         '/student/content',
  CONTENT_SUBJECT: (subjectId) => `/student/content/${subjectId}`,
  CONTENT_WORKSHEET: (id) => `/student/content/worksheet/${id}`,
  HOMEWORK:        '/student/homework',
  TIMETABLE:       '/student/timetable',
  GRADE_CALCULATOR:'/student/grade-calculator',
  TEACHERS:        '/student/teachers',
  TEACHER:         (id) => `/student/teachers/${id}`,
  DOUBTS:          '/student/doubts',
  DOUBT:           (id) => `/student/doubts/${id}`,
  PROGRESS:        '/student/progress',
  PROGRESS_SUBJECT:(subjectId) => `/student/progress/${subjectId}`,
};
```

### Lazy loading note

The existing codebase does **not** use `React.lazy` / `Suspense` for route splitting. Follow the same pattern (direct static imports). If the team decides to add lazy loading in a future refactor, all student panels are isolated enough to convert easily — each panel's `index.js` barrel makes it a single import boundary.

---

## 4. Side Menu Plan (Student-Only)

Replace the `studentMenu` constant in `src/routes/sideMenuConfig.jsx`.  
Add the required icons from `lucide-react` at the top of the file (most are already imported for other menus; add only what's missing).

Additional icons to import (if not already present):
```js
import {
  // already imported: LayoutDashboard, BookOpen, BarChart3, MessageSquare, User, Settings, GraduationCap
  CalendarDays,    // Timetable
  ClipboardList,   // Assignments (already present)
  ListChecks,      // Quizzes (already present)
  Award,           // Exams (already present)
  CheckSquare,     // Homework
  Calculator,      // Grade Calculator
  TrendingUp,      // Progress
} from 'lucide-react';
```

```js
const studentMenu = [
  // ── Core ─────────────────────────────────────────────────
  {
    path: '/student/dashboard',
    text: 'Dashboard',
    i18nKey: 'nav.student.dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/student/timetable',
    text: 'Timetable',
    i18nKey: 'nav.student.timetable',
    icon: CalendarDays,
  },

  // ── Academics ────────────────────────────────────────────
  {
    path: '/student/assignments',
    text: 'Assignments',
    i18nKey: 'nav.student.assignments',
    icon: ClipboardList,
  },
  {
    path: '/student/quizzes',
    text: 'Quizzes',
    i18nKey: 'nav.student.quizzes',
    icon: ListChecks,
  },
  {
    path: '/student/exams',
    text: 'Exams',
    i18nKey: 'nav.student.exams',
    icon: Award,
  },
  {
    path: '/student/content',
    text: 'Study Materials',
    i18nKey: 'nav.student.content',
    icon: BookOpen,
  },

  // ── Study Tools ──────────────────────────────────────────
  {
    path: '/student/homework',
    text: 'Homework',
    i18nKey: 'nav.student.homework',
    icon: CheckSquare,
  },
  {
    path: '/student/grade-calculator',
    text: 'Grade Calculator',
    i18nKey: 'nav.student.gradeCalculator',
    icon: Calculator,
  },

  // ── Communication ─────────────────────────────────────────
  {
    path: '/student/teachers',
    text: 'Teachers',
    i18nKey: 'nav.student.teachers',
    icon: MessageSquare,
    child: [
      { path: '/student/teachers', text: 'My Teachers', i18nKey: 'nav.student.myTeachers', icon: GraduationCap, childIcon: GraduationCap },
      { path: '/student/doubts',   text: 'My Doubts',   i18nKey: 'nav.student.doubts',     icon: MessageSquare, childIcon: MessageSquare },
    ],
  },

  // ── Insights ──────────────────────────────────────────────
  {
    path: '/student/progress',
    text: 'My Progress',
    i18nKey: 'nav.student.progress',
    icon: TrendingUp,
  },

  // ── Account (matches other role menus) ───────────────────
  { path: '/profile',  text: 'Profile',  i18nKey: 'nav.profile',  icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];
```

**Role guard:** The `sideMenuRoutes(role)` switch already returns `studentMenu` for `role === 'student'`. No change to the switch function needed.

---

## 5. Page-by-Page Build Spec

### Status badge system (used across all modules)

Define in `src/panels/student/constants/statusTypes.js`:

```js
export const ASSIGNMENT_STATUS = {
  NOT_STARTED:        'not_started',
  IN_PROGRESS:        'in_progress',
  SUBMITTED:          'submitted',
  PENDING_REVIEW:     'pending_review',
  GRADED:             'graded',
  REVISION_REQUESTED: 'revision_requested',
};

export const QUIZ_STATUS = {
  UPCOMING:    'upcoming',
  OPEN:        'open',
  IN_PROGRESS: 'in_progress',
  SUBMITTED:   'submitted',
  GRADED:      'graded',
  CLOSED:      'closed',
};

export const EXAM_STATUS = {
  SCHEDULED:   'scheduled',
  OPEN:        'open',
  IN_PROGRESS: 'in_progress',
  SUBMITTED:   'submitted',
  GRADED:      'graded',  // Phase 2
};

export const DOUBT_STATUS = {
  OPEN:     'open',
  ANSWERED: 'answered',
  RESOLVED: 'resolved',
};
```

---

### Module 01 — Student Onboarding

**File:** `src/panels/student/StudentOnboarding/StudentOnboarding.jsx`

**Purpose:** First-run 3-step wizard shown once when a student logs in without a completed profile. On completion, marks `onboardingComplete: true` in Redux `auth.user` preferences (or localStorage flag).

**Key UI sections:**
- Progress stepper (MUI `Stepper`, linear, 3 steps)
- Step 1 — Profile: avatar upload, preferred name, timezone
- Step 2 — Enrolled Classes: read-only list of classes auto-populated from dummy data, with subject chips
- Step 3 — Goals: target grade input per subject + weekly study hours target
- Skip button on every step; Back/Next navigation; animated transitions between steps

**Components to create/reuse:**
- `OnboardingStep1Profile.jsx` — MUI `TextField`, `Avatar`, `IconButton` for upload
- `OnboardingStep2Classes.jsx` — `Chip` grid of enrolled subjects, checkmark indicators
- `OnboardingStep3Goals.jsx` — per-subject `Slider` (target grade) + total hours `TextField`
- Reuse `src/components/shared/CustomButton`

**Dummy data shape:**
```js
// src/panels/student/data/timetable.js (classes re-used here)
const enrolledClasses = [
  { id: 'c1', name: 'Mathematics 10A', teacher: 'Mr. Thompson', subject: 'Mathematics', color: '#3B82F6' },
  { id: 'c2', name: 'English Literature', teacher: 'Ms. Rivera', subject: 'English', color: '#10B981' },
  { id: 'c3', name: 'Physics', teacher: 'Dr. Patel', subject: 'Physics', color: '#F59E0B' },
  { id: 'c4', name: 'History', teacher: 'Mr. O'Brien', subject: 'History', color: '#8B5CF6' },
  { id: 'c5', name: 'Computer Science', teacher: 'Ms. Chen', subject: 'CS', color: '#EF4444' },
];
```

**UX states:**
- Loading: thin top progress bar while "fetching" enrolled classes
- Success: Confetti animation + "You're all set!" card after step 3 completion → auto-navigate to `/student/dashboard` after 2 s

**Navigation:** `/student/onboarding` → completion → `/student/dashboard`

---

### Module 02 — Student Dashboard

**File:** `src/panels/student/StudentDashboard/StudentDashboard.jsx`

**Purpose:** Daily command center. Responsive widget grid. Each widget loads independently.

**Key UI sections:**

| Widget | Component | Description |
|--------|-----------|-------------|
| Due Soon | `DueSoonWidget` | Next 3 assignments due — card per item with status badge + countdown |
| Upcoming Quizzes | `UpcomingQuizzesWidget` | Next 2 quizzes with open/scheduled status + time to open |
| Announcements | `AnnouncementsWidget` | Latest 3 class announcements from teachers |
| Recently Graded | `RecentGradesWidget` | Last 2 graded items (quiz/assignment) with score chip |
| Quick Links | Static row | Icon buttons → Assignments, Quizzes, Homework, Progress |

**Page-specific components:**
- `DueSoonCard.jsx` — shows subject chip, title, due date, `StatusBadge`, "Start →" link
- `QuizCountdownCard.jsx` — quiz title, open window, "Take Quiz" CTA when open
- `AnnouncementItem.jsx` — teacher name, class name, timestamp, text excerpt
- `RecentGradeItem.jsx` — title, score badge (green/amber/red by threshold), date

**Dummy data shapes:**
```js
// src/panels/student/data/assignments.js (excerpt)
export const dummyAssignments = [
  {
    id: 'a1',
    title: 'Quadratic Equations — Problem Set 3',
    subject: 'Mathematics',
    classId: 'c1',
    dueDate: '2026-05-12T23:59:00',
    status: 'not_started',
    instructions: 'Complete exercises 1–15 from Chapter 4. Show all working.',
    attachments: [],
    submittedAt: null,
    grade: null,
  },
  // ... 6 more entries covering all statuses
];
```

**UX states:**
- Loading: `SkeletonCard` (2 rows) per widget with `animate-pulse` Tailwind class
- Error: `StudentErrorState` component with retry button per widget (isolated — one widget failing doesn't break page)
- Empty widget: `StudentEmptyState` with contextual message ("No upcoming quizzes — enjoy the break!")

**Navigation:** Widget cards link to respective detail pages. "View all" links on each widget.

---

### Module 03 — Course & Content Viewer

**Files:** `ContentViewer.jsx`, `ContentSubjectView.jsx`, `ContentWorksheetViewer.jsx`

**Purpose:** Browse and read teacher-published lessons, worksheets, and resource links, scoped to enrolled classes.

**Key UI sections:**
- `/student/content`: Subject filter bar (chips) + content card grid (type-tagged: Lesson / Worksheet / PDF / Link)
- `/student/content/:subjectId`: Filtered view for one subject — section headers by type
- `/student/content/worksheet/:id`: Full worksheet reader — questions rendered read-only in Phase 1 (submit is a Phase 2 feature; show "Submission not yet available" banner)

**Components:**
- `ContentCard.jsx` — thumbnail, type badge, subject chip, title, teacher name, date published, "View" button
- `SubjectFilterBar.jsx` — horizontal chip list, "All" selected by default
- `ContentTypeBadge.jsx` — colored label: Lesson | Worksheet | PDF | Resource Link
- Reuse existing `src/components/shared/Tabs` for worksheet viewer sections

**Dummy data shape:**
```js
// src/panels/student/data/content.js
export const dummyContent = [
  {
    id: 'cnt1',
    type: 'worksheet',           // 'lesson' | 'worksheet' | 'pdf' | 'link'
    title: 'Algebra Basics — Practice Sheet',
    subject: 'Mathematics',
    classId: 'c1',
    teacher: 'Mr. Thompson',
    publishedAt: '2026-05-06T09:00:00',
    description: 'Review problems covering linear equations and inequalities.',
    questions: [                 // only for type === 'worksheet'
      { id: 'q1', text: 'Solve: 3x + 7 = 22', type: 'short_answer' },
      { id: 'q2', text: 'Which of the following is a linear equation?', type: 'mcq',
        options: ['x² + 1 = 0', '3x = 9', 'x³ = 27', 'None'], correct: 1 },
    ],
    bookmarked: false,
  },
  // ... more entries
];
```

**UX states:**
- Loading: skeleton grid (6 cards)
- Empty (subject with no content): illustration + "Your teacher hasn't published anything here yet"
- Worksheet read-only: Phase 2 banner at top; questions are visible but inputs are disabled with tooltip "Submission coming soon"

---

### Module 04 — Assignment Hub

**Files:** `AssignmentHub.jsx`, `AssignmentDetail.jsx`, `AssignmentSubmit.jsx`, `AssignmentFeedback.jsx`

**Purpose:** Central place to track all assigned work through its full lifecycle. Highest-frequency student interaction.

#### `/student/assignments` — List

**UI:** Page header + filter tabs (All / Pending / Submitted / Graded) + assignment card grid sorted by due date.

**Components:**
- `AssignmentFilters.jsx` — tab bar + subject dropdown filter + search input
- `AssignmentCard.jsx` — subject chip, title, due date with urgency color (red <24h, amber <72h, gray), `StatusBadge`, "View" button

#### `/student/assignments/:id` — Detail

**UI:** Two-column on desktop (instructions + attachments left, status panel + action right).

- Left: assignment title, teacher name, class, instructions text block, attached files list (download links in dummy data)
- Right: `StatusBadge`, deadline countdown chip, "Submit Assignment" CTA button (disabled if already submitted)
- Bottom: Phase 2 placeholder section "Teacher Feedback" with "Not available yet" state

**Actions:** "Submit" → navigates to `/student/assignments/:id/submit`

#### `/student/assignments/:id/submit` — Submit

**UI:** Full-page submission form.
- File upload area (`SubmissionUploader.jsx`) — drag-drop + click, accepts PDF/DOCX/ZIP/image
- Optional notes textarea
- "Submit Assignment" button — confirmation dialog before submit
- Success state: `SubmissionConfirmation.jsx` — large checkmark, "Submitted on [datetime]", "Back to Assignments" button

**UX states:**
- Loading (submitting): button shows spinner, inputs disabled
- Success: confirmation screen replaces form
- Error: inline error message + retry

**Navigation flow:** List → Detail → Submit → Confirmation → back to List

#### `/student/assignments/:id/feedback` — Feedback (Phase 2 surface)

**UI in Phase 1:** Full-page "pending" state — envelope illustration + "Your teacher hasn't reviewed this yet. You'll get a notification when feedback is available." — no interactive elements. Route exists so notification links can resolve.

**Dummy data addition:**
```js
// status examples covering all states
{ id: 'a2', title: 'Shakespearean Sonnet Analysis', subject: 'English', status: 'submitted', submittedAt: '2026-05-07T14:23:00', grade: null },
{ id: 'a3', title: 'Newton's Laws Lab Report',      subject: 'Physics',  status: 'graded',    submittedAt: '2026-05-01T10:00:00', grade: 82 },
{ id: 'a4', title: 'WWI Causes Essay',              subject: 'History',  status: 'revision_requested', teacherNote: 'Please expand section 3.' },
```

---

### Module 05 — Quiz & Assessment Center

**Files:** `QuizCenter.jsx`, `QuizTake.jsx`, `QuizResults.jsx` + `ExamCenter.jsx`, `ExamTake.jsx`

**Purpose:** Take teacher-built quizzes and exams. See results immediately (where teacher permits).

#### `/student/quizzes` — Quiz List

**UI:** Tabbed list — Upcoming / Open Now / Completed.  
- `QuizCard.jsx` — subject, class, duration, question count, status (countdown to open, "Take Now" if open, score chip if graded)

#### `/student/quiz/:id/take` — Quiz Taking Interface

**UI:** Focused full-screen mode (hide sidebar for immersion, keep top bar).
- `QuizTimerBar.jsx` — countdown bar fixed at top, color transitions yellow → red under 20%
- `QuizNavigator.jsx` — question number pills (unanswered = outlined, answered = filled, flagged = amber)
- `QuizQuestionRenderer.jsx` — renders MCQ (radio), True/False, Short Answer question types
- Navigation: Previous / Next buttons + "Submit Quiz" button
- Submit → confirmation dialog "You have X unanswered questions. Submit anyway?"

**Post-submit:** If auto-graded → immediately show score. If teacher-graded → "Results pending" card.

#### `/student/quiz/:id/results` — Results

**UI:**
- Score card (large percentage + pass/fail badge)
- Time taken chip
- Answer review list (Phase 2 gated — show "Answer review will be available when your teacher releases results" in Phase 1)
- "Back to Quizzes" button

**Dummy data shape:**
```js
// src/panels/student/data/quizzes.js
export const dummyQuizzes = [
  {
    id: 'q1',
    title: 'Algebra Mid-Term Quiz',
    subject: 'Mathematics',
    classId: 'c1',
    status: 'open',
    openAt: '2026-05-08T08:00:00',
    closeAt: '2026-05-08T23:59:00',
    duration: 30,               // minutes
    questionCount: 15,
    questions: [
      { id: 'qq1', text: 'What is the value of x in 2x + 4 = 12?', type: 'mcq',
        options: ['2', '3', '4', '5'], correct: 2 },
      { id: 'qq2', text: 'A linear equation has exactly one solution. True or False?',
        type: 'true_false' },
      // ...
    ],
    result: null,               // populated after submission
  },
  { id: 'q2', title: 'English Grammar Check', status: 'upcoming', openAt: '2026-05-10T09:00:00', result: null },
  { id: 'q3', title: 'Physics: Forces Quiz', status: 'graded', result: { score: 78, maxScore: 100, timeTaken: 22 } },
];
```

#### Exam Center

`ExamCenter.jsx` at `/student/exams` lists teacher-created exams with metadata (date, time, duration, allowed materials). Cards show countdown to exam time.

`ExamTake.jsx` — same engine as `QuizTake.jsx` but with heavier header (exam name, invigilator instructions, full-screen prompt). Reuse `QuizTimerBar`, `QuizNavigator`, `QuizQuestionRenderer`.

`ExamPrepare.jsx` and `ExamReflect.jsx` are covered in Module 12 below.

---

### Module 06 — Personal Homework Manager

**File:** `HomeworkManager.jsx`

**Purpose:** Student self-logs personal study tasks separate from teacher-assigned work.

**Key UI sections:**
- Split layout: left panel = Today's task checklist; right panel = Subject breakdown (tasks grouped by subject)
- Sticky "Quick Add" FAB → slide-up panel: subject dropdown + task title + due date + estimated minutes
- Subject summary bar at top: "Today: 4 tasks · ~2h 30m estimated"
- Filter: Today / This Week / All / by Subject

**Components:**
- `HomeworkTaskItem.jsx` — checkbox, subject chip, title, estimated time, due time, edit/delete icons
- `QuickAddPanel.jsx` — slide-up drawer (MUI `Drawer` anchor="bottom"), form with `TextField`, `Select`, `DateTimePicker`
- `SubjectSummaryBar.jsx` — horizontal summary chips

**Dummy data shape:**
```js
// src/panels/student/data/homework.js
export const dummyHomeworkTasks = [
  { id: 'hw1', subject: 'Mathematics', title: 'Textbook exercises p.142–145', dueDate: '2026-05-08T20:00:00', estimatedMinutes: 45, completed: false, createdBy: 'student' },
  { id: 'hw2', subject: 'English',     title: 'Read Chapter 7 of Macbeth',    dueDate: '2026-05-08T21:00:00', estimatedMinutes: 30, completed: true,  createdBy: 'student' },
  { id: 'hw3', subject: 'Physics',     title: 'Revision: Newton\'s 3rd Law',  dueDate: '2026-05-09T18:00:00', estimatedMinutes: 60, completed: false, createdBy: 'student' },
];
```

**UX states:**
- Empty (no tasks today): friendly illustration + "Nothing on your list — add something below"
- Add success: task slides into list with green flash animation
- Complete action: strikethrough + opacity reduce + toast "Task completed"

---

### Module 07 — Class Timetable

**File:** `Timetable.jsx`

**Purpose:** Weekly period grid. "Next class in X" live countdown. Join button for online classes.

**Key UI sections:**
- Weekly grid: rows = time slots (08:00–16:00 in 1h increments), columns = Mon–Sat
- Each filled cell = `PeriodCell.jsx`: subject name, teacher, room, subject color dot
- Sticky `NextClassBanner.jsx` at top: "Next: Physics | Room 14 | Starts in 47 min" — updates every minute via `useEffect` + `setInterval`
- Empty cells styled with light gray
- Today's column highlighted with accent border
- "Join Online Class" button per cell (if `onlineLink` is set)

**Components:**
- `PeriodCell.jsx` — colored left border (subject color), subject name bold, teacher name small, room small, optional join button
- `NextClassBanner.jsx` — pill banner, countdown string from `dateHelpers.js`
- `DayColumn.jsx` — column header (Mon/Tue/...) with "Today" badge

**Dummy data shape:**
```js
// src/panels/student/data/timetable.js
export const dummyTimetable = [
  { id: 'p1', day: 1, startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mr. Thompson', room: 'Room 12', color: '#3B82F6', onlineLink: null },
  { id: 'p2', day: 1, startTime: '09:00', endTime: '10:00', subject: 'English',     teacher: 'Ms. Rivera',  room: 'Room 5',  color: '#10B981', onlineLink: null },
  { id: 'p3', day: 1, startTime: '11:00', endTime: '12:00', subject: 'Physics',     teacher: 'Dr. Patel',   room: 'Lab 2',   color: '#F59E0B', onlineLink: 'https://meet.example.com/physics-10a' },
  // ... full week
];
```

**UX states:**
- Loading: skeleton grid (full week)
- No classes today (weekend): "No classes today — enjoy your weekend!" banner
- Class cancelled: cell shows "Cancelled" badge in red

---

### Module 11 — Grade Impact Calculator

**File:** `GradeCalculator.jsx`

**Purpose:** Answer "What score do I need on the final to get a B?" Pure frontend calculation — no API call for Phase 1.

**Key UI sections:**
- Subject selector (dropdown from enrolled classes)
- Current grade input (0–100 slider + number field)
- Upcoming assessment weight input (0–100% slider)
- Target grade selector (A / B / C / Pass)
- Result panel: required score to hit target + best/worst case range
- "How is this calculated?" expandable explanation block

**Components:**
- `GradeScenarioForm.jsx` — MUI `Select`, `Slider`, `TextField`
- `GradeResultDisplay.jsx` — big score number + pass/fail indicator + bar chart (best/worst/required)

**Utility (pure functions):**
```js
// src/panels/student/utils/gradeCalculator.js
export const calculateRequiredScore = ({ currentGrade, currentWeight, upcomingWeight, targetGrade }) => {
  // currentGrade: weighted average of already-graded work (0–100)
  // currentWeight: total weight already counted (0–100%)
  // upcomingWeight: weight of the upcoming assessment (0–100%)
  // targetGrade: desired final grade (0–100)
  const remainingWeight = 100 - currentWeight - upcomingWeight;
  const required = (targetGrade - (currentGrade * currentWeight / 100) - (50 * remainingWeight / 100)) / (upcomingWeight / 100);
  return { required: Math.ceil(required), bestCase: 100, worstCase: Math.ceil(required - 10) };
};
```

**UX states:**
- Initial: form with empty/default values, result panel shows "—"
- Calculated: animated number count-up on result display
- Impossible (required > 100): result shows "Not achievable — you would need > 100%" with amber warning

**Accessible from:** Dashboard quick links, Assignment Hub sidebar, Exam Toolkit

---

### Module 12 — Exam Day Toolkit

**Files:** `ExamCenter.jsx` (list) + `ExamPrepare.jsx` + `ExamReflect.jsx`

**Purpose:** Support the student through the full exam lifecycle: countdown → preparation → post-exam reflection.

#### `ExamPrepare.jsx` — `/student/exams/:id/prepare`

**UI:**
- Exam metadata card: date, time, duration, location, allowed materials (from teacher exam builder config)
- Countdown timer (days + hours + minutes) with visual urgency scale
- Pre-exam checklist (`ExamChecklistItem.jsx`) — editable by student: "Charged laptop", "Bring calculator", "Read chapter 5", etc. Default items auto-populated from allowed materials list
- "Add custom item" inline input
- Night Before Pack section: Phase 2 placeholder — "AI-generated revision pack coming in Phase 2" banner

#### `ExamReflect.jsx` — `/student/exams/:id/reflect`

**UI:**
- Post-exam mood check-in: emoji selector (Terrible / OK / Good / Great)
- Expected score self-log (slider 0–100)
- Free-text reflection: "What went well?" + "What would you do differently?"
- Submit → save locally (localStorage) + toast "Reflection saved"
- Results section: Phase 2 placeholder — "Your official results will appear here when your teacher releases them"

**Dummy data shape:**
```js
// src/panels/student/data/exams.js
export const dummyExams = [
  {
    id: 'ex1',
    title: 'Mathematics End-of-Term Exam',
    subject: 'Mathematics',
    classId: 'c1',
    date: '2026-05-15',
    startTime: '09:00',
    duration: 120,              // minutes
    location: 'Hall A',
    allowedMaterials: ['Scientific calculator', 'Ruler', 'Pencils'],
    status: 'scheduled',
    result: null,
  },
  { id: 'ex2', title: 'English Literature Final', subject: 'English', date: '2026-05-20', duration: 90, status: 'scheduled', result: null },
  { id: 'ex3', title: 'Physics Midterm', subject: 'Physics', date: '2026-04-30', duration: 60, status: 'submitted', result: null },
];
```

---

### Module 13 — Teacher Interaction Hub

**Files:** `TeacherHub.jsx`, `TeacherDetail.jsx`, `DoubtList.jsx`, `DoubtDetail.jsx`

**Purpose:** Consolidated place to message teachers, raise doubts, and track feedback.

#### `/student/teachers` — Teacher Hub list

**UI:** Grid of `TeacherCard.jsx` — teacher avatar, name, subjects taught, "Message" + "Raise Doubt" buttons.

#### `/student/teachers/:id` — Teacher Detail

**UI:**
- Teacher profile header (name, subjects, avatar)
- Message thread (simple bubble chat UI — MUI `Paper` list)
- Compose message input + send button
- Link to raise a doubt for this teacher

#### `/student/doubts` — Doubt List

**UI:** List of submitted doubts with `DoubtStatusBadge` (Open / Answered / Resolved). Filter by subject.

#### `/student/doubts/:id` — Doubt Detail

**UI:**
- Original doubt: subject chip, chapter/topic, description, optional image attachment
- Status timeline: Submitted → Under Review → Answered
- Teacher response area (Phase 1: shows "Awaiting teacher response" placeholder if no reply yet)
- "Mark as Resolved" button
- "Ask a follow-up" input (adds to thread)

**Doubt submission form** (`DoubtSubmitForm.jsx`) — accessible via FAB on Doubt List and on Teacher Detail:
- Subject dropdown
- Chapter / Topic text field
- Description textarea
- Optional image attach (preview + remove)
- Submit button

**Dummy data shape:**
```js
// src/panels/student/data/teachers.js
export const dummyTeachers = [
  { id: 't1', name: 'Mr. Thompson', subjects: ['Mathematics'], avatar: null, lastActive: '2026-05-08T07:30:00' },
  { id: 't2', name: 'Ms. Rivera',   subjects: ['English Literature'], avatar: null, lastActive: '2026-05-07T15:00:00' },
  { id: 't3', name: 'Dr. Patel',    subjects: ['Physics'], avatar: null, lastActive: '2026-05-08T08:15:00' },
];

export const dummyDoubts = [
  { id: 'd1', teacherId: 't1', subject: 'Mathematics', topic: 'Quadratic Formula', description: 'I don\'t understand when to use the discriminant vs factoring.', status: 'answered', submittedAt: '2026-05-06T18:00:00', response: 'Great question! Use the discriminant when the quadratic cannot be easily factored...', respondedAt: '2026-05-07T09:00:00' },
  { id: 'd2', teacherId: 't3', subject: 'Physics', topic: 'Newton\'s 3rd Law', description: 'If every action has an equal and opposite reaction, why do things move at all?', status: 'open', submittedAt: '2026-05-08T11:30:00', response: null },
];
```

**UX states:**
- Doubt submitted: toast "Doubt raised — your teacher will respond soon" + status changes to "Open"
- Doubt answered: notification bell updates + `DoubtStatusBadge` turns green
- Message sent: message appears in thread immediately (optimistic update)

---

### Module 14 — Student Progress View

**Files:** `ProgressView.jsx`, `SubjectProgress.jsx`

**Purpose:** Student-facing read-only analytics — quiz score history, assignment completion, released grades.

#### `/student/progress` — Overview

**UI:**
- Summary cards row: Overall completion %, Average quiz score, Assignments on time %
- `ScoreHistoryChart.jsx` — line chart (ApexCharts — already in repo) showing last 8 quiz scores over time
- Subject breakdown: `SubjectProgressBar.jsx` per enrolled subject — completion bar + average score chip
- "View detail →" link per subject

#### `/student/progress/:subjectId` — Subject Detail

**UI:**
- Subject header with color
- Assessment list: all quizzes/assignments/exams for this subject with scores (or "Not yet released" badge)
- `ScoreHistoryChart` scoped to subject
- Phase 2 placeholder: "Topic-wise breakdown coming soon"

**Dummy data shape:**
```js
// src/panels/student/data/progress.js
export const dummyProgress = {
  overall: { completionRate: 78, avgQuizScore: 74, onTimeRate: 85 },
  subjects: [
    {
      id: 'Mathematics',
      color: '#3B82F6',
      completionRate: 90,
      avgScore: 81,
      assessments: [
        { id: 'a1', type: 'quiz', title: 'Algebra Quiz 1', score: 85, maxScore: 100, date: '2026-04-20', released: true },
        { id: 'a2', type: 'assignment', title: 'Problem Set 3', score: null, maxScore: 100, date: '2026-05-08', released: false },
      ],
      scoreHistory: [72, 78, 85, 81, 88, 85, 90, 81],  // last 8 assessments
    },
    // ... other subjects
  ],
};
```

**UX states:**
- Loading: skeleton cards + skeleton chart
- No released grades yet: "Your teacher hasn't released any grades yet — check back soon"
- Score not released: lock icon + "Pending release" badge instead of score

---

### Notification Center (Global — Optional but Recommended)

**Components:** `NotificationBell.jsx` (in top bar), notification dropdown, toast system.

**`NotificationBell.jsx`** — badge count, click to open MUI `Popover` with notification list.

**Notification types:**
```js
export const NOTIFICATION_TYPES = {
  ASSIGNMENT_DUE:    'assignment_due',     // due in < 24h
  QUIZ_OPEN:         'quiz_open',          // quiz window opened
  GRADE_RELEASED:    'grade_released',     // teacher releases grade
  DOUBT_ANSWERED:    'doubt_answered',     // teacher responds
  ANNOUNCEMENT:      'announcement',       // new class announcement
  EXAM_TOMORROW:     'exam_tomorrow',      // T-24h reminder
};
```

**Dummy data:**
```js
export const dummyNotifications = [
  { id: 'n1', type: 'assignment_due', message: 'Quadratic Equations due in 6 hours', link: '/student/assignments/a1', read: false, createdAt: '2026-05-08T17:00:00' },
  { id: 'n2', type: 'quiz_open', message: 'Algebra Mid-Term Quiz is now open', link: '/student/quiz/q1/take', read: false, createdAt: '2026-05-08T08:00:00' },
  { id: 'n3', type: 'doubt_answered', message: 'Mr. Thompson answered your doubt about Quadratic Formula', link: '/student/doubts/d1', read: true, createdAt: '2026-05-07T09:00:00' },
];
```

**Toast integration:** Use existing `src/redux/features/snackbar` slice for all success/error toasts (already used throughout the app).

---

## 6. Dummy Data + Fake API Layer

### Structure

```
src/panels/student/
  data/          ← raw in-memory arrays (pure JS, no async)
  api/           ← async wrapper functions (simulate latency, optional errors)
  hooks/         ← React hooks that call api/ functions and manage loading/error state
```

### Fake API pattern

Every function in `src/panels/student/api/*.js` follows this contract:

```js
// src/panels/student/api/assignmentApi.js
import { dummyAssignments } from '../data/assignments';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const LATENCY = () => 300 + Math.random() * 400;  // 300–700ms
const ERROR_RATE = 0;  // set to 0.1 (10%) to simulate random errors in dev

const maybeThrow = () => {
  if (Math.random() < ERROR_RATE) throw new Error('Network error — please try again.');
};

export const fetchAssignments = async ({ subjectId, status } = {}) => {
  await delay(LATENCY());
  maybeThrow();
  let items = [...dummyAssignments];
  if (subjectId) items = items.filter((a) => a.subject === subjectId);
  if (status)    items = items.filter((a) => a.status === status);
  return { data: items, total: items.length };
};

export const fetchAssignmentById = async (id) => {
  await delay(LATENCY());
  maybeThrow();
  const item = dummyAssignments.find((a) => a.id === id);
  if (!item) throw new Error(`Assignment ${id} not found`);
  return { data: item };
};

export const submitAssignment = async (id, { files, notes }) => {
  await delay(LATENCY() + 500);  // extra delay for "upload"
  maybeThrow();
  return {
    data: { ...dummyAssignments.find((a) => a.id === id), status: 'submitted', submittedAt: new Date().toISOString() },
  };
};
```

### Standard response envelope

All fake API functions return `{ data, total?, page?, pageSize? }` on success and throw an `Error` on failure. This matches the shape you'll use for real API integration.

### Pagination stubs

```js
export const fetchAssignments = async ({ page = 1, pageSize = 10, ...filters } = {}) => {
  await delay(LATENCY());
  let items = applyFilters(dummyAssignments, filters);
  const total = items.length;
  items = items.slice((page - 1) * pageSize, page * pageSize);
  return { data: items, total, page, pageSize };
};
```

### Hook pattern

```js
// src/panels/student/hooks/useStudentAssignments.js
import { useState, useEffect, useCallback } from 'react';
import { fetchAssignments } from '../api/assignmentApi';

export const useStudentAssignments = (filters = {}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchAssignments(filters);
      setAssignments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  return { assignments, loading, error, refetch: load };
};
```

### Swapping to real backend

1. Replace the body of each function in `src/panels/student/api/*.js` with an `apiRequest<T>()` call (the existing `src/api/client.ts` client).
2. The hook signatures stay identical — no component changes required.
3. Remove the `data/` folder entries as they become unused (or keep them for Storybook/tests).

---

## 7. State Management Approach

### Decision framework

| Data type | Storage |
|-----------|---------|
| List/detail data (assignments, quizzes, etc.) | Local component state via custom hooks |
| Active quiz/exam session (timer, answers in flight) | Local component state — `useReducer` in `QuizTake.jsx` |
| Completed onboarding flag | Redux `auth` slice (persisted) OR `localStorage` key `student_onboarding_complete` |
| Self-added homework tasks | `localStorage` via a simple helper (no Redux needed in Phase 1) |
| Exam reflection data | `localStorage` per exam ID |
| Notifications (unread count, list) | Local component state in `NotificationBell.jsx`; refetch on mount |
| Global toasts | Existing `snackbar` Redux slice — dispatch `showSnackbar()` for all success/error feedback |

### When to add a student Redux slice

Add `studentSlice` only if:
1. The onboarding completion state is needed in more than 2 unrelated components, **or**
2. Notification unread count needs to appear in the sidebar + top bar simultaneously (shared state need).

For Phase 1, a `localStorage` flag + `useStudentOnboarding` hook is sufficient. If RTK Query is used for real API integration in Phase 2, a mock `baseQuery` adapter can be dropped in — but for dummy data, the custom hook pattern is simpler and avoids boilerplate.

### RTK Query

Do **not** add RTK Query slices for student data in Phase 1. The custom hook + fake API pattern is faster to build, easier to read, and trivial to swap. Reserve RTK Query migration for Phase 2 when real caching semantics matter.

---

## 8. UI/UX System

### Student Shell layout

All student pages use the existing `DashboardLayout` (same as teacher). No new shell needed.

Student-specific additions:
- `StudentPageHeader.jsx` — reusable page header component: `{ title, subtitle, breadcrumbs?, actions? }`. Used on every student page for consistent top-of-content hierarchy.
- `NextClassBanner.jsx` — sticky narrow banner below page header on every page (not just Timetable) showing next class. Shown only if there is a class in the next 3 hours.

### Breadcrumbs

Render breadcrumbs in `StudentPageHeader.jsx` for any page deeper than list level:

```
My Assignments > Quadratic Equations — Problem Set 3
My Quizzes > Algebra Mid-Term Quiz > Results
Teachers > Mr. Thompson
```

Use MUI `Breadcrumbs` + React Router `Link`.

### Status badge system

`StatusBadge.jsx` is the single source of truth for all status labels:

| Status | Color | Label |
|--------|-------|-------|
| `not_started` | Gray | Not Started |
| `in_progress` | Blue | In Progress |
| `submitted` | Teal | Submitted |
| `pending_review` | Amber | Pending Review |
| `graded` | Green | Graded |
| `revision_requested` | Orange | Revision Requested |
| `upcoming` | Purple | Upcoming |
| `open` | Green | Open Now |
| `closed` | Gray | Closed |
| `scheduled` | Blue | Scheduled |
| `open` (doubt) | Amber | Open |
| `answered` | Teal | Answered |
| `resolved` | Green | Resolved |

Implementation: MUI `Chip` with `size="small"` and `variant="filled"`. Colors mapped from Tailwind palette to MUI `sx` overrides.

### Skeleton loaders

Use `SkeletonCard.jsx` (wraps MUI `Skeleton`) for all loading states. Rules:
- Show skeletons for the expected number of items (e.g., 3 assignment cards, 2 quiz cards)
- Never show a blank page during loading
- Use `variant="rounded"` for cards, `variant="text"` for inline text

### Deadline chip

`DeadlineChip.jsx` — shows due date with urgency styling:
- `< 6 hours`: red background, "Due in Xh" label
- `< 24 hours`: amber background, "Due in Xh Ym" label
- `< 72 hours`: orange background, "Due Thu 6 PM" label
- `> 72 hours`: gray, standard date format

### Notification patterns

Three surfaces:
1. **Toast**: via `snackbar` Redux slice (`dispatch(showSnackbar({ message, severity }))`)
2. **Bell**: `NotificationBell.jsx` in the top bar — unread count badge, popover list on click, mark-all-read action
3. **In-page banners**: for persistent status info (e.g., Phase 2 features not yet available) — use `Alert` MUI component with `severity="info"`

### Accessibility & responsiveness

- All interactive elements have `aria-label` where icon-only
- Color is never the only status indicator — always paired with text label
- Quiz taking interface: keyboard navigation between questions (arrow keys), focus management on question change
- Responsive grid breakpoints: `xs=1 col`, `sm=2 cols`, `md=3 cols` for card grids
- Timetable: on mobile, show one day at a time with day-tab navigation instead of full week grid
- Minimum touch target: 44×44px (follow MUI defaults)
- Tab order: logical left-to-right, top-to-bottom throughout

### Phase 2 / Coming Soon surfaces

For features blocked on teacher-side Phase 2 readiness, use a consistent in-page pattern:

```jsx
<Alert severity="info" icon={<LockClock />} sx={{ mb: 2 }}>
  <strong>Coming in Phase 2</strong> — Teacher feedback and rubric scores will appear here
  once your teacher's review tools are live.
</Alert>
```

Never hide the section — always show the "pending" state so students understand what's coming.

---

## 9. Acceptance Checklist

### Demo-ready criteria

**Routing & Navigation**
- [ ] All 25 student routes resolve without 404 or console errors
- [ ] `/student` redirects to `/student/dashboard`
- [ ] Browser back/forward navigation works on all pages
- [ ] Breadcrumbs update correctly on detail pages
- [ ] Deep links (direct URL entry) work while authenticated as student

**Loading states**
- [ ] Every page shows skeleton loaders — no blank/white flash
- [ ] Skeletons match the expected content layout
- [ ] Fast network does not flash skeletons (minimum 300ms artificial delay)

**Error states**
- [ ] Every data-fetching hook renders `StudentErrorState` on API failure
- [ ] Error state has a visible "Retry" button that re-fetches
- [ ] Setting `ERROR_RATE = 0.5` in fake API surfaces errors reliably

**Empty states**
- [ ] Every list page has a designed empty state (not a blank list)
- [ ] Empty states are contextual (different messages per module)

**Success states**
- [ ] Assignment submit → confirmation screen shown, toast fired
- [ ] Homework task added → list updates, toast fired
- [ ] Quiz submitted → score shown (auto-graded) or "Results pending" shown
- [ ] Doubt submitted → status "Open" in list, toast fired
- [ ] Exam reflection saved → toast fired, data persists on page refresh

**Status system**
- [ ] All assignment status variants render correctly in cards and detail pages
- [ ] `DeadlineChip` shows correct urgency colors based on due date
- [ ] `StatusBadge` is consistent across Assignment Hub, Dashboard, and Progress View

**No dead ends**
- [ ] Every page has a clear "back" path (breadcrumb or back button)
- [ ] Phase 2 surfaces show explicit "coming soon" states — not broken/empty UI
- [ ] 404 and 403 fallbacks remain functional (from existing setup)

**Styling**
- [ ] All student pages use `DashboardLayout` — no layout regressions on teacher routes
- [ ] Tailwind + MUI usage consistent with existing teacher pages
- [ ] Dark mode works on all new student components (dark: class variants applied)
- [ ] Mobile layout tested at 375px width — timetable collapses to day view

**Performance**
- [ ] No excessive re-renders (React DevTools check on quiz taking page)
- [ ] Quiz timer does not cause full-page re-renders — state isolated in `QuizTake.jsx`

**Console hygiene**
- [ ] Zero console errors in production build
- [ ] Zero `key` prop warnings on lists
- [ ] No React strict mode double-render issues

**Side menu**
- [ ] Student menu items all link to correct routes
- [ ] Active route highlighted in sidebar
- [ ] Teacher menu is completely unchanged and still functional

---

## 10. Implementation Sequence

### Milestone 0 — Scaffold (Day 1–2)

> Goal: Routing works, shell renders, no broken builds.

1. Create `src/panels/student/constants/studentPaths.js` and `statusTypes.js`
2. Create stub `index.jsx` for each of the 12 panel folders (one-liner `<ComingSoon />` wrapper)
3. Update `studentRoutes` in `config.jsx` with all routes pointing to stubs
4. Update `studentMenu` in `sideMenuConfig.jsx`
5. Verify: logging in as `student` role shows sidebar + all routes resolve to "Coming Soon"
6. Create `src/panels/student/data/*.js` with full dummy datasets
7. Create `src/panels/student/api/*.js` with fake API functions
8. Create `src/panels/student/hooks/*.js` with all hooks

**Dependency:** All subsequent milestones depend on this scaffold.

---

### Milestone 1 — Onboarding + Dashboard (Week 1)

**Build order within milestone:**

1. `StudentPageHeader.jsx`, `StatusBadge.jsx`, `DeadlineChip.jsx`, `SkeletonCard.jsx`, `StudentEmptyState.jsx`, `StudentErrorState.jsx` — shared student UI primitives
2. `StudentOnboarding.jsx` — wizard (3 steps, skip, completion flag)
3. `StudentDashboard.jsx` — widget grid shell + individual widget components
4. `NotificationBell.jsx` — bell + dummy notification list (integrate into existing TopBar)

**Done when:** Student can log in → see onboarding wizard → complete it → see dashboard with populated widgets, loading skeletons, and empty states.

---

### Milestone 2 — Assignment Hub (Week 2)

1. `AssignmentHub.jsx` — list with filters
2. `AssignmentCard.jsx`, `AssignmentFilters.jsx`, `AssignmentStatusBadge.jsx`
3. `AssignmentDetail.jsx` — instructions + status panel
4. `AssignmentSubmit.jsx` — uploader + confirmation
5. `AssignmentFeedback.jsx` — Phase 2 pending state only

**Done when:** Full assignment list → detail → submit → confirmation flow works. All status variants visible in list. No dead ends.

---

### Milestone 3 — Quiz & Exam Engine (Week 3)

1. `QuizCenter.jsx` + `QuizCard.jsx`
2. `QuizTake.jsx` — full taking interface (timer, navigator, questions, submit)
3. `QuizResults.jsx` — score card + Phase 2 answer review placeholder
4. `ExamCenter.jsx` + `ExamCard.jsx` + `ExamCountdownBanner.jsx`
5. `ExamTake.jsx` — reuses quiz engine components
6. `ExamPrepare.jsx` — metadata + checklist
7. `ExamReflect.jsx` — mood check + self-log

**Done when:** Student can browse quizzes, take a full quiz with timer, see results. Exam list shows countdowns. Prepare + Reflect pages are navigable.

**Dependency on Milestone 2:** None — can be built in parallel after Milestone 0.

---

### Milestone 4 — Content + Timetable (Week 4)

1. `ContentViewer.jsx` + `ContentSubjectView.jsx` + `ContentCard.jsx` + `SubjectFilterBar.jsx`
2. `ContentWorksheetViewer.jsx` — read-only + Phase 2 submit banner
3. `Timetable.jsx` + `PeriodCell.jsx` + `NextClassBanner.jsx` + `DayColumn.jsx`
4. Wire `NextClassBanner` to appear on all student pages (sticky below page header)

**Done when:** Content is browsable by subject, worksheets render read-only, timetable shows full week with live countdown banner.

---

### Milestone 5 — Study Tools (Week 5)

1. `HomeworkManager.jsx` + `HomeworkTaskItem.jsx` + `QuickAddPanel.jsx`
2. `GradeCalculator.jsx` + `gradeCalculator.js` utility
3. `ExamPrepare.jsx` checklist edits + localStorage persistence (if not done in M3)

**Done when:** Students can add/complete homework tasks, use grade calculator for scenario modeling.

---

### Milestone 6 — Teacher Hub + Progress (Week 6)

1. `TeacherHub.jsx` + `TeacherCard.jsx`
2. `TeacherDetail.jsx` — message thread
3. `DoubtList.jsx` + `DoubtCard.jsx` + `DoubtStatusBadge.jsx`
4. `DoubtDetail.jsx` + `DoubtSubmitForm.jsx`
5. `ProgressView.jsx` + `ScoreHistoryChart.jsx` + `SubjectProgressBar.jsx`
6. `SubjectProgress.jsx`

**Done when:** Student can see all teachers, send messages, raise and track doubts. Progress view shows charts and per-subject breakdown.

---

### Milestone 7 — Polish & Acceptance (Week 7)

1. Dark mode audit across all new components
2. Mobile responsiveness pass (375px + 768px breakpoints)
3. Accessibility audit: `aria-label`, keyboard nav on quiz taking, focus management
4. Notification integration: wire `snackbar` dispatch to all user actions
5. Console error cleanup: zero errors in production build
6. End-to-end clickthrough: walk all flows from Acceptance Checklist
7. `ERROR_RATE = 0.3` smoke test: verify all error states display correctly

---

### Module dependency graph

```
Milestone 0 (scaffold)
    ├─→ Milestone 1 (dashboard)
    │       └─→ Milestone 2 (assignments)  ──────────┐
    ├─→ Milestone 3 (quiz/exam) ─────────────────────┤
    ├─→ Milestone 4 (content/timetable) ─────────────┤
    ├─→ Milestone 5 (study tools) ───────────────────┤
    └─→ Milestone 6 (teachers/progress) ─────────────┘
                                                      ↓
                                          Milestone 7 (polish)
```

Milestones 2–6 can be developed in parallel by different engineers after Milestone 0 completes. Milestone 1 should land first as it establishes shared UI primitives used by all others.

---

## Appendix — Phase 2 Build Prep Notes

When teacher-side Phase 2 features go live, the following student surfaces need to be upgraded from "pending" state to full implementation. Routes and component shells already exist; only the internals need replacing.

| Surface | Phase 2 trigger | What changes |
|---------|----------------|--------------|
| `AssignmentFeedback.jsx` | Teacher review panel live | Replace pending state with real feedback display (grade + rubric + comment thread) |
| `QuizResults.jsx` answer review | Teacher enables answer visibility | Remove placeholder; render per-question breakdown |
| `ContentWorksheetViewer.jsx` submit | Worksheet submission API ready | Enable submit flow (similar to AssignmentSubmit) |
| `ProgressView` detailed breakdown | Teacher analytics Phase 2 | Replace "coming soon" with topic-wise charts |
| `TeacherDetail.jsx` office hours | Teacher publishes office hours | Add booking calendar below message thread |
| `SubjectProgress.jsx` | Same as above | Add per-topic performance bars |

> **Note for Phase 2 engineers:** Do not change fake API function signatures. Swap the function body only. Hook and component code stays the same.
