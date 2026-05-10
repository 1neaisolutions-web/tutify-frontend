# Tutify Student Portal — Implementation Plan V2

> **Supersedes:** `STUDENT_PORTAL_IMPLEMENTATION_PLAN.md`  
> **Primary source:** `updated_student_portal_documentation.md` (PRD v2.1)  
> **Engineering standard:** `REACT_PROJECT_IMPLEMENTATION_GUIDE.md`  
> **Repo:** `tutify-frontend` · React 18 + Vite + Tailwind + MUI + Redux Toolkit  
> **Target market:** US K-12 / International schools — premium, Silicon-level product  
> **Principle:** AI-first experience · Teacher-rails enhanced by AI · Demo-complete with dummy data  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Changed from V1 — and Why](#2-what-changed-from-v1--and-why)
3. [Scope & Phased Roadmap](#3-scope--phased-roadmap)
4. [Architecture & Folder Structure](#4-architecture--folder-structure)
5. [Routing + Side Menu Plan](#5-routing--side-menu-plan)
6. [AI-First Feature Set — Deep Spec](#6-ai-first-feature-set--deep-spec)
7. [Teacher-Rails Modules — AI-Enhanced](#7-teacher-rails-modules--ai-enhanced)
8. [Supporting Modules](#8-supporting-modules)
9. [UX System & Quality Bar](#9-ux-system--quality-bar)
10. [Dummy Data + Mock API Strategy](#10-dummy-data--mock-api-strategy)
11. [State Management Strategy](#11-state-management-strategy)
12. [Reusing Existing Shared Components](#12-reusing-existing-shared-components)
13. [Implementation Sequence & Dependencies](#13-implementation-sequence--dependencies)
14. [Acceptance Checklist](#14-acceptance-checklist)

---

## 1. Executive Summary

### What the Student Portal Is

The Tutify Student Portal is an **AI-first learning copilot** — not a student-facing version of the teacher dashboard. AI is the default landing experience and the primary reason a student opens the app. Teacher-created academic content (assignments, quizzes, exams) is consumed and *enhanced* by AI, not the other way around.

**The one-sentence pitch:** *"Your personal AI tutor that knows your schedule, your gaps, and your deadlines — and helps you fix all three."*

### Who It's For

- Students aged 12–22 in US and international schools
- Both **teacher-linked** (enrolled in classes, receives assignments/quizzes) and **standalone** (individual login, self-directed learner)
- Competitive target: Khanmigo, Photomath, Quizlet AI, Brainly — but integrated with school workflow

### Why It Wins

| What competitors do | What Tutify Student Portal does differently |
|---|---|
| AI tutor isolated from schoolwork | AI is aware of your actual assignments, exams, and grades |
| Workflow-only (LMS portals) | AI-first with academic rails — best of both |
| Generic chatbot | Subject-specialized tutors + mistake-pattern analysis |
| Desktop-first | Mobile-first, progressive, offline-capable roadmap |
| Separate tools | Unified: chat → practice → note → submit — in one flow |

### AI-First + Teacher-Rails Coexistence

```
AI Suite (PRIMARY)            Teacher Rails (ENHANCED BY AI)
────────────────────          ────────────────────────────────
AI Copilot / Chat   ←──────── "Explain this assignment"
Study Plan          ←──────── Due dates auto-populate plan
AI Tutors           ←──────── Tutor mode for quiz topics
Practice Generator  ←──────── Generate drills from failed quiz Q
Doubt Solver        ←──────── Escalate to teacher if unresolved
Notes & Capture     ←──────── Attach notes to submission
PixGen              ←──────── Create visual aids for essays
YouTube Quiz        ←──────── Self-quiz on lecture videos
Templates           ←──────── Essay outlines, study plans
Personal Task Mgr   ←──────── Merge personal + teacher deadlines
```

### MVP vs. Premium Roadmap Summary

- **Phase 1 (Now — 4–5 months):** All 15 modules at MVP level + 4 supporting modules. Fully demo-complete on dummy data. Monetizable.
- **Phase 2 (3–6 months post-MVP):** Deeper feedback loops, real backend integration, voice input, AI auto-scheduling, office hours booking.
- **Phase 3 (6–12 months):** Multimodal capture, gamification, collaboration, parent-sharing, proctoring-lite.

---

## 2. What Changed from V1 — and Why

| Dimension | V1 Plan (Workflow-First) | V2 Plan (AI-First) |
|---|---|---|
| Default landing | Dashboard with due-soon widgets | AI Copilot chat interface |
| Primary navigation | Assignments → Quizzes → Timetable | AI Suite first, Academics second |
| Number of modules | 14 (PDF-based) | 15 + 4 supporting (PRD v2.1) |
| AI presence | Phase 3 only | Phase 1 core throughout |
| Student PixGen | Not planned | Module 05 — Phase 1 MVP |
| YouTube Quiz for student | Not planned | Module 06 — Phase 1 MVP |
| AI Tutors | Not planned | Module 08 — Phase 1 MVP |
| AI Doubt Solver | Phase 2 | Module 09 — Phase 1 MVP |
| Personal Task Manager | Basic homework list | Module 15 — full task system + AI |
| Subject Study Room | Phase 2 | Module 11 — Phase 1 MVP (scoped) |
| Smart Notes/Capture | Phase 2/3 | Module 10 — Phase 1 (text/manual); Phase 2 OCR |
| Mock AI strategy | No detail | Simulated streaming, scripted domain responses |
| Standalone student | Not addressed | Explicit standalone vs. teacher-linked flow |
| Market bar | Basic | Silicon-level, US K-12 standard |

---

## 3. Scope & Phased Roadmap

### Phase 1 — AI-First MVP (Build Now)

**Goal:** Every student can open the app, be greeted by an AI copilot, get help on any subject, manage their schoolwork, and feel the product is a premium AI-first tool — all on dummy data, no real backend required.

| # | Module | Default Route | Phase 1 Scope |
|---|--------|---------------|---------------|
| 01 | AI Learning Copilot | `/student/dashboard` | Text Q&A, summarise, explain, read-aloud mode, mode selector |
| 02 | Personalized Study Plan | `/student/study-plan` | Manual goal entry, AI-generated daily plan, drag to reorder |
| 03 | Smart Assignment Hub | `/student/assignments` | List/detail/submit/status + AI Explain + AI Draft Start |
| 04 | AI Quiz & Exam Center | `/student/quizzes` + `/student/exams` | Take teacher quizzes, auto-grade MCQ, AI hint per Q, basic results |
| 05 | Student PixGen | `/student/pixgen` | Text-to-image, school-safe, download, gallery history |
| 06 | Student YouTube Quiz | `/student/youtube-quiz` | Generate quiz from YT URL, take quiz, see score |
| 07 | Student Templates | `/student/templates` | 5 core templates (essay outline, study schedule, lab report, book review, flashcard set) |
| 08 | Specialized AI Tutors | `/student/tutors` | Math, Science, Essay Coach — domain Q&A, follow-up, worked examples |
| 09 | AI Doubt Solver | `/student/doubt-solver` | Step-by-step solution, 3 practice problems, "Ask teacher" escalation |
| 10 | Smart Capture & Notes | `/student/notes` | Rich-text note editor, subject tagging, attach files, AI summarise note |
| 11 | Subject Study Room | `/student/subjects` | Resource list, personal notes tab, formula board, Q&A thread (static in P1) |
| 12 | Study Time Tracker | `/student/study-time` | Timer per subject, manual entry, week chart, pie chart |
| 13 | Grade Impact Calculator | `/student/grade-calculator` | Required score calculator, best/worst case, single-subject |
| 14 | Teacher Interaction Hub | `/student/teachers` + `/student/doubts` | Message threads, doubt tickets, feedback history |
| 15 | Personal Task Manager | `/student/tasks` | Create/edit/delete tasks, due dates, priority, basic AI suggestions |
| — | Student Onboarding | `/student/onboarding` | 4-step wizard: profile → classes → goals → AI tour |
| — | Class Timetable | `/student/timetable` | Weekly grid, next-class countdown, join link |
| — | Content Viewer | `/student/content` | Teacher resources, worksheet read-only + AI summarise |
| — | Student Progress | `/student/progress` | Quiz score history, assignment completion, released grades |

### Phase 2 — Parity & Depth _(Future — list only)_

- Assignment feedback receipt UI (teacher rubric + comments)
- Revision request / resubmission flow
- Voice input for AI Copilot and Doubt Solver
- AI auto-scheduling in Study Plan and Task Manager
- Recurring tasks + sub-tasks in Personal Task Manager
- Subject Study Room: mastery meter, peer Q&A, AI topic suggestions
- Study Time Tracker: AI insights, budget vs actual analysis
- Grade Calculator: multi-subject GPA, trend projection
- Teacher Interaction Hub: office hours booking, video call
- Student PixGen: annotation editor, share with teacher
- Detailed quiz/exam answer review (teacher-permission gated)
- Real backend swap (keep all mock API function signatures)

### Phase 3 — Engagement & Collaboration Layer _(Future — list only)_

- Smart Capture: Camera OCR, math photo solver, handwriting digitizer
- Gamification: streaks, XP, badges, class leaderboard (opt-in)
- AI Night Before Pack (auto-generated exam revision)
- Real-time collaborative notes
- Social learning feed (class-scoped)
- Parent progress sharing portal
- Proctoring-lite for exams
- Offline-first PWA capabilities
- Accessibility: screen reader full compliance, dyslexia font mode

### Standalone vs. Teacher-Linked Access

| Module | Standalone (no teacher) | Teacher-Linked |
|---|---|---|
| 01 AI Copilot | Full access | Full access + teacher context awareness |
| 02 Study Plan | Manual goals only | Auto-pulls teacher deadlines |
| 03 Assignment Hub | Empty state with "No teacher linked" | Full functionality |
| 04 Quiz/Exam Center | AI self-practice mode only | Teacher quizzes + AI practice |
| 05–10 AI tools | Full access | Full access |
| 11 Subject Study Room | Free-form subjects | Teacher-scoped subjects |
| 14 Teacher Interaction | Hidden | Full functionality |
| 15 Personal Task Manager | Full access | Full access (tasks stay private) |

---

## 4. Architecture & Folder Structure

### Core Principle

Every student screen lives under `src/panels/student/`. Page-specific components live under `src/components/pages/student/`. Shared UI stays in `src/components/shared/` and is **imported, never modified**. No teacher files are touched.

```
src/
│
├── panels/
│   └── student/                              ← ALL route-level student screens
│       │
│       ├── Onboarding/
│       │   ├── StudentOnboarding.jsx          ← 4-step wizard
│       │   ├── OnboardingStepProfile.jsx
│       │   ├── OnboardingStepClasses.jsx
│       │   ├── OnboardingStepGoals.jsx
│       │   ├── OnboardingStepAITour.jsx       ← interactive AI feature tour
│       │   └── index.js
│       │
│       ├── AICopilot/                         ← Module 01 — default landing
│       │   ├── AICopilot.jsx                  ← main chat interface
│       │   ├── AICopilotLanding.jsx           ← greeting + mode selector hero
│       │   ├── ChatThread.jsx                 ← message bubble list
│       │   ├── ChatInput.jsx                  ← input bar + mode toggle
│       │   └── index.js
│       │
│       ├── StudyPlan/                         ← Module 02
│       │   ├── StudyPlan.jsx
│       │   ├── StudyPlanWeekView.jsx
│       │   ├── StudyPlanDayDetail.jsx
│       │   └── index.js
│       │
│       ├── AssignmentHub/                     ← Module 03
│       │   ├── AssignmentHub.jsx
│       │   ├── AssignmentDetail.jsx
│       │   ├── AssignmentSubmit.jsx
│       │   ├── AssignmentFeedback.jsx         ← Phase 2 pending surface
│       │   └── index.js
│       │
│       ├── QuizCenter/                        ← Module 04 (quizzes)
│       │   ├── QuizCenter.jsx
│       │   ├── QuizTake.jsx
│       │   ├── QuizResults.jsx
│       │   └── index.js
│       │
│       ├── ExamCenter/                        ← Module 04 (exams)
│       │   ├── ExamCenter.jsx
│       │   ├── ExamTake.jsx
│       │   ├── ExamPrepare.jsx
│       │   ├── ExamReflect.jsx
│       │   └── index.js
│       │
│       ├── StudentPixGen/                     ← Module 05
│       │   ├── StudentPixGen.jsx
│       │   ├── PixGenGallery.jsx
│       │   └── index.js
│       │
│       ├── StudentYouTubeQuiz/                ← Module 06
│       │   ├── StudentYouTubeQuiz.jsx
│       │   ├── YouTubeQuizTake.jsx
│       │   ├── YouTubeQuizResults.jsx
│       │   └── index.js
│       │
│       ├── StudentTemplates/                  ← Module 07
│       │   ├── StudentTemplates.jsx
│       │   ├── TemplateRunner.jsx
│       │   └── index.js
│       │
│       ├── AITutors/                          ← Module 08
│       │   ├── AITutors.jsx                   ← tutor selection grid
│       │   ├── AITutorChat.jsx                ← domain-specific chat
│       │   └── index.js
│       │
│       ├── DoubtSolver/                       ← Module 09
│       │   ├── DoubtSolver.jsx
│       │   ├── DoubtSolverSession.jsx
│       │   └── index.js
│       │
│       ├── SmartNotes/                        ← Module 10
│       │   ├── SmartNotes.jsx
│       │   ├── NoteEditor.jsx
│       │   ├── NoteDetail.jsx
│       │   └── index.js
│       │
│       ├── SubjectStudyRoom/                  ← Module 11
│       │   ├── SubjectStudyRoom.jsx           ← subject selection grid
│       │   ├── StudyRoomDetail.jsx            ← per-subject room (tabbed)
│       │   └── index.js
│       │
│       ├── StudyTimeTracker/                  ← Module 12
│       │   ├── StudyTimeTracker.jsx
│       │   └── index.js
│       │
│       ├── GradeCalculator/                   ← Module 13
│       │   ├── GradeCalculator.jsx
│       │   └── index.js
│       │
│       ├── TeacherHub/                        ← Module 14
│       │   ├── TeacherHub.jsx
│       │   ├── TeacherDetail.jsx
│       │   ├── DoubtList.jsx
│       │   ├── DoubtDetail.jsx
│       │   └── index.js
│       │
│       ├── PersonalTaskManager/               ← Module 15
│       │   ├── PersonalTaskManager.jsx
│       │   ├── TaskCreate.jsx
│       │   ├── TaskDetail.jsx
│       │   ├── TaskEdit.jsx
│       │   └── index.js
│       │
│       ├── Timetable/                         ← Supporting
│       │   ├── Timetable.jsx
│       │   └── index.js
│       │
│       ├── ContentViewer/                     ← Supporting
│       │   ├── ContentViewer.jsx
│       │   ├── ContentSubjectView.jsx
│       │   ├── ContentWorksheetViewer.jsx
│       │   └── index.js
│       │
│       ├── ProgressView/                      ← Supporting
│       │   ├── ProgressView.jsx
│       │   ├── SubjectProgress.jsx
│       │   └── index.js
│       │
│       ├── data/                              ← in-memory seed datasets
│       │   ├── aiResponses.js                 ← scripted AI reply library
│       │   ├── assignments.js
│       │   ├── quizzes.js
│       │   ├── exams.js
│       │   ├── content.js
│       │   ├── notes.js
│       │   ├── tasks.js
│       │   ├── timetable.js
│       │   ├── teachers.js
│       │   ├── doubts.js
│       │   ├── progress.js
│       │   ├── studyTime.js
│       │   ├── subjects.js
│       │   ├── tutors.js
│       │   ├── templates.js
│       │   ├── pixgenGallery.js
│       │   ├── announcements.js
│       │   └── index.js
│       │
│       ├── api/                               ← fake async API layer
│       │   ├── aiApi.js                       ← copilot, tutors, doubt solver
│       │   ├── assignmentApi.js
│       │   ├── quizApi.js
│       │   ├── examApi.js
│       │   ├── contentApi.js
│       │   ├── notesApi.js
│       │   ├── tasksApi.js
│       │   ├── timetableApi.js
│       │   ├── teacherApi.js
│       │   ├── progressApi.js
│       │   ├── studyTimeApi.js
│       │   ├── pixgenApi.js
│       │   ├── youtubeQuizApi.js
│       │   ├── templatesApi.js
│       │   └── index.js
│       │
│       ├── hooks/                             ← per-domain data-fetching hooks
│       │   ├── useAICopilot.js
│       │   ├── useStudyPlan.js
│       │   ├── useAssignments.js
│       │   ├── useQuizzes.js
│       │   ├── useExams.js
│       │   ├── useNotes.js
│       │   ├── useTasks.js
│       │   ├── useTimetable.js
│       │   ├── useProgress.js
│       │   ├── useStudyTime.js
│       │   ├── useSubjects.js
│       │   └── index.js
│       │
│       ├── utils/
│       │   ├── gradeCalculator.js             ← pure calculation logic
│       │   ├── dateHelpers.js                 ← countdown, formatting, urgency
│       │   ├── statusHelpers.js               ← label + color mappings
│       │   ├── aiStreamSimulator.js           ← simulates token-by-token streaming
│       │   └── index.js
│       │
│       ├── constants/
│       │   ├── studentPaths.js                ← STUDENT_PATHS constant object
│       │   ├── statusTypes.js                 ← all status enums
│       │   ├── aiModes.js                     ← AI copilot mode definitions
│       │   └── index.js
│       │
│       └── index.js
│
├── components/
│   └── pages/
│       └── student/                           ← page-specific components
│           ├── AICopilot/
│           │   ├── MessageBubble.jsx          ← AI vs user bubble styles
│           │   ├── AITypingIndicator.jsx      ← animated "..." while streaming
│           │   ├── ModeSelectorChip.jsx       ← Q&A / Summarise / Explain / Practice
│           │   ├── SuggestedPromptChip.jsx    ← clickable starter prompts
│           │   └── index.js
│           ├── StudyPlan/
│           │   ├── StudyBlockCard.jsx         ← single time block card
│           │   ├── PlanDayStrip.jsx           ← day column in week view
│           │   └── index.js
│           ├── AssignmentHub/
│           │   ├── AssignmentCard.jsx
│           │   ├── AssignmentStatusBadge.jsx
│           │   ├── AssignmentFilters.jsx
│           │   ├── SubmissionUploader.jsx
│           │   ├── SubmissionConfirmation.jsx
│           │   ├── AIAssistPanel.jsx          ← slide-in AI help drawer
│           │   └── index.js
│           ├── QuizCenter/
│           │   ├── QuizCard.jsx
│           │   ├── QuizTimerBar.jsx
│           │   ├── QuizNavigator.jsx
│           │   ├── QuizQuestionRenderer.jsx   ← MCQ, T/F, Short Answer
│           │   ├── AIHintButton.jsx           ← "Get a Hint" per question
│           │   ├── QuizResultCard.jsx
│           │   └── index.js
│           ├── ExamCenter/
│           │   ├── ExamCard.jsx
│           │   ├── ExamCountdownBanner.jsx
│           │   ├── ExamChecklistItem.jsx
│           │   └── index.js
│           ├── AITutors/
│           │   ├── TutorCard.jsx
│           │   ├── TutorChatBubble.jsx
│           │   ├── TutorWorkedExample.jsx     ← step-by-step solution renderer
│           │   └── index.js
│           ├── DoubtSolver/
│           │   ├── DoubtInputForm.jsx
│           │   ├── SolutionStepCard.jsx
│           │   ├── PracticeProblems.jsx
│           │   └── index.js
│           ├── SmartNotes/
│           │   ├── NoteCard.jsx
│           │   ├── NoteFilters.jsx
│           │   ├── AISummaryPanel.jsx
│           │   └── index.js
│           ├── PersonalTaskManager/
│           │   ├── TaskCard.jsx
│           │   ├── TaskPriorityBadge.jsx
│           │   ├── TaskFilters.jsx
│           │   ├── AISuggestionCard.jsx
│           │   ├── QuickAddTaskBar.jsx        ← minimal add from dashboard
│           │   └── index.js
│           ├── StudyTimeTracker/
│           │   ├── SubjectTimerCard.jsx
│           │   ├── WeeklyBarChart.jsx
│           │   ├── SubjectPieChart.jsx
│           │   └── index.js
│           ├── ProgressView/
│           │   ├── ScoreHistoryChart.jsx
│           │   ├── CompletionRateCard.jsx
│           │   ├── SubjectProgressBar.jsx
│           │   └── index.js
│           ├── Timetable/
│           │   ├── PeriodCell.jsx
│           │   ├── NextClassBanner.jsx
│           │   ├── DayColumn.jsx
│           │   └── index.js
│           ├── shared/                        ← student-scoped UI primitives
│           │   ├── StudentPageHeader.jsx      ← title + subtitle + breadcrumbs + actions
│           │   ├── StatusBadge.jsx            ← universal status chip
│           │   ├── DeadlineChip.jsx           ← urgency-colored due date
│           │   ├── SkeletonCard.jsx           ← loading placeholder
│           │   ├── StudentEmptyState.jsx      ← contextual empty states
│           │   ├── StudentErrorState.jsx      ← error + retry
│           │   ├── AIBadge.jsx                ← "AI" label chip on AI-powered sections
│           │   ├── PhaseGateBanner.jsx        ← "Coming in Phase 2" info banner
│           │   ├── NotificationBell.jsx       ← unread badge + popover
│           │   └── index.js
│           └── index.js
│
└── routes/
    ├── config.jsx          ← ADD studentRoutes entries (student section only)
    └── sideMenuConfig.jsx  ← REPLACE studentMenu (student section only)
    ─── (all other files: DO NOT TOUCH) ───
```

---

## 5. Routing + Side Menu Plan

### Files to Touch — Only These Two

| File | Change |
|------|--------|
| `src/routes/config.jsx` | Add panel imports + replace `studentRoutes` array |
| `src/routes/sideMenuConfig.jsx` | Replace `studentMenu` array + add icon imports |

### Path Constants

Create `src/panels/student/constants/studentPaths.js`:

```js
export const STUDENT_PATHS = {
  ROOT:                '/student',
  ONBOARDING:          '/student/onboarding',
  DASHBOARD:           '/student/dashboard',            // AI Copilot home
  STUDY_PLAN:          '/student/study-plan',
  ASSIGNMENTS:         '/student/assignments',
  ASSIGNMENT:          (id) => `/student/assignments/${id}`,
  ASSIGNMENT_SUBMIT:   (id) => `/student/assignments/${id}/submit`,
  ASSIGNMENT_FEEDBACK: (id) => `/student/assignments/${id}/feedback`,
  QUIZZES:             '/student/quizzes',
  QUIZ_TAKE:           (id) => `/student/quiz/${id}/take`,
  QUIZ_RESULTS:        (id) => `/student/quiz/${id}/results`,
  EXAMS:               '/student/exams',
  EXAM_TAKE:           (id) => `/student/exam/${id}/take`,
  EXAM_PREPARE:        (id) => `/student/exams/${id}/prepare`,
  EXAM_REFLECT:        (id) => `/student/exams/${id}/reflect`,
  PIXGEN:              '/student/pixgen',
  YOUTUBE_QUIZ:        '/student/youtube-quiz',
  YOUTUBE_QUIZ_TAKE:   (id) => `/student/youtube-quiz/${id}/take`,
  YOUTUBE_QUIZ_RESULTS:(id) => `/student/youtube-quiz/${id}/results`,
  TEMPLATES:           '/student/templates',
  TEMPLATE:            (id) => `/student/templates/${id}`,
  TUTORS:              '/student/tutors',
  TUTOR_CHAT:          (id) => `/student/tutors/${id}`,
  DOUBT_SOLVER:        '/student/doubt-solver',
  DOUBT_SESSION:       (id) => `/student/doubt-solver/${id}`,
  NOTES:               '/student/notes',
  NOTE_NEW:            '/student/notes/new',
  NOTE:                (id) => `/student/notes/${id}`,
  SUBJECTS:            '/student/subjects',
  SUBJECT_ROOM:        (id) => `/student/subjects/${id}/room`,
  STUDY_TIME:          '/student/study-time',
  GRADE_CALCULATOR:    '/student/grade-calculator',
  TEACHERS:            '/student/teachers',
  TEACHER:             (id) => `/student/teachers/${id}`,
  DOUBTS:              '/student/doubts',
  DOUBT:               (id) => `/student/doubts/${id}`,
  TASKS:               '/student/tasks',
  TASK_CREATE:         '/student/tasks/create',
  TASK:                (id) => `/student/tasks/${id}`,
  TASK_EDIT:           (id) => `/student/tasks/${id}/edit`,
  CONTENT:             '/student/content',
  CONTENT_SUBJECT:     (id) => `/student/content/${id}`,
  CONTENT_WORKSHEET:   (id) => `/student/content/worksheet/${id}`,
  TIMETABLE:           '/student/timetable',
  PROGRESS:            '/student/progress',
  PROGRESS_SUBJECT:    (id) => `/student/progress/${id}`,
};
```

### Student Routes (replace `studentRoutes` in `config.jsx`)

Add these imports at the top of `config.jsx` (student section only):

```js
// ─── Student Portal — Phase 1 ───────────────────────────────────────────────
import StudentOnboarding    from '../panels/student/Onboarding';
import AICopilot            from '../panels/student/AICopilot';
import StudyPlan            from '../panels/student/StudyPlan';
import AssignmentHub        from '../panels/student/AssignmentHub';
import AssignmentDetail     from '../panels/student/AssignmentHub/AssignmentDetail';
import AssignmentSubmit     from '../panels/student/AssignmentHub/AssignmentSubmit';
import AssignmentFeedback   from '../panels/student/AssignmentHub/AssignmentFeedback';
import QuizCenter           from '../panels/student/QuizCenter';
import QuizTake             from '../panels/student/QuizCenter/QuizTake';
import QuizResults          from '../panels/student/QuizCenter/QuizResults';
import ExamCenter           from '../panels/student/ExamCenter';
import ExamTake             from '../panels/student/ExamCenter/ExamTake';
import ExamPrepare          from '../panels/student/ExamCenter/ExamPrepare';
import ExamReflect          from '../panels/student/ExamCenter/ExamReflect';
import StudentPixGen        from '../panels/student/StudentPixGen';
import StudentYouTubeQuiz   from '../panels/student/StudentYouTubeQuiz';
import YouTubeQuizTake      from '../panels/student/StudentYouTubeQuiz/YouTubeQuizTake';
import YouTubeQuizResults   from '../panels/student/StudentYouTubeQuiz/YouTubeQuizResults';
import StudentTemplates     from '../panels/student/StudentTemplates';
import StudentTemplateRunner from '../panels/student/StudentTemplates/TemplateRunner';
import AITutors             from '../panels/student/AITutors';
import AITutorChat          from '../panels/student/AITutors/AITutorChat';
import DoubtSolver          from '../panels/student/DoubtSolver';
import DoubtSolverSession   from '../panels/student/DoubtSolver/DoubtSolverSession';
import SmartNotes           from '../panels/student/SmartNotes';
import NoteEditor           from '../panels/student/SmartNotes/NoteEditor';
import NoteDetail           from '../panels/student/SmartNotes/NoteDetail';
import SubjectStudyRoom     from '../panels/student/SubjectStudyRoom';
import StudyRoomDetail      from '../panels/student/SubjectStudyRoom/StudyRoomDetail';
import StudyTimeTracker     from '../panels/student/StudyTimeTracker';
import GradeCalculator      from '../panels/student/GradeCalculator';
import TeacherHub           from '../panels/student/TeacherHub';
import TeacherDetail        from '../panels/student/TeacherHub/TeacherDetail';
import DoubtList            from '../panels/student/TeacherHub/DoubtList';
import DoubtDetail          from '../panels/student/TeacherHub/DoubtDetail';
import PersonalTaskManager  from '../panels/student/PersonalTaskManager';
import TaskCreate           from '../panels/student/PersonalTaskManager/TaskCreate';
import TaskDetailPage       from '../panels/student/PersonalTaskManager/TaskDetail';
import TaskEdit             from '../panels/student/PersonalTaskManager/TaskEdit';
import StudentTimetable     from '../panels/student/Timetable';
import ContentViewer        from '../panels/student/ContentViewer';
import ContentSubjectView   from '../panels/student/ContentViewer/ContentSubjectView';
import ContentWorksheetViewer from '../panels/student/ContentViewer/ContentWorksheetViewer';
import ProgressView         from '../panels/student/ProgressView';
import SubjectProgress      from '../panels/student/ProgressView/SubjectProgress';
```

Replace the `studentRoutes` export:

```js
export const studentRoutes = [
  { path: '/student', moduleName: 'Student Root', element: <Navigate to="/student/dashboard" replace /> },
  { path: '/student/onboarding',         moduleName: 'Onboarding',          element: withDashboardLayout(<StudentOnboarding />) },
  { path: '/student/dashboard',          moduleName: 'AI Copilot',           element: withDashboardLayout(<AICopilot />) },
  { path: '/student/study-plan',         moduleName: 'Study Plan',           element: withDashboardLayout(<StudyPlan />) },
  // Assignment Hub
  { path: '/student/assignments',        moduleName: 'Assignments',          element: withDashboardLayout(<AssignmentHub />),
    child: [
      { path: '/student/assignments/:id',           moduleName: 'Assignment Detail',   element: withDashboardLayout(<AssignmentDetail />) },
      { path: '/student/assignments/:id/submit',    moduleName: 'Assignment Submit',   element: withDashboardLayout(<AssignmentSubmit />) },
      { path: '/student/assignments/:id/feedback',  moduleName: 'Assignment Feedback', element: withDashboardLayout(<AssignmentFeedback />) },
    ],
  },
  // Quiz Center
  { path: '/student/quizzes',            moduleName: 'Quizzes',              element: withDashboardLayout(<QuizCenter />),
    child: [
      { path: '/student/quiz/:id/take',    moduleName: 'Take Quiz',    element: withDashboardLayout(<QuizTake />) },
      { path: '/student/quiz/:id/results', moduleName: 'Quiz Results', element: withDashboardLayout(<QuizResults />) },
    ],
  },
  // Exam Center
  { path: '/student/exams',             moduleName: 'Exams',                 element: withDashboardLayout(<ExamCenter />),
    child: [
      { path: '/student/exam/:id/take',      moduleName: 'Take Exam',    element: withDashboardLayout(<ExamTake />) },
      { path: '/student/exams/:id/prepare',  moduleName: 'Exam Prepare', element: withDashboardLayout(<ExamPrepare />) },
      { path: '/student/exams/:id/reflect',  moduleName: 'Exam Reflect', element: withDashboardLayout(<ExamReflect />) },
    ],
  },
  // AI Tools
  { path: '/student/pixgen',             moduleName: 'Student PixGen',       element: withDashboardLayout(<StudentPixGen />) },
  { path: '/student/youtube-quiz',       moduleName: 'YouTube Quiz',         element: withDashboardLayout(<StudentYouTubeQuiz />),
    child: [
      { path: '/student/youtube-quiz/:id/take',    element: withDashboardLayout(<YouTubeQuizTake />) },
      { path: '/student/youtube-quiz/:id/results', element: withDashboardLayout(<YouTubeQuizResults />) },
    ],
  },
  { path: '/student/templates',          moduleName: 'Student Templates',    element: withDashboardLayout(<StudentTemplates />),
    child: [{ path: '/student/templates/:templateId', element: withDashboardLayout(<StudentTemplateRunner />) }],
  },
  { path: '/student/tutors',             moduleName: 'AI Tutors',            element: withDashboardLayout(<AITutors />),
    child: [{ path: '/student/tutors/:tutorId', element: withDashboardLayout(<AITutorChat />) }],
  },
  { path: '/student/doubt-solver',       moduleName: 'Doubt Solver',         element: withDashboardLayout(<DoubtSolver />),
    child: [{ path: '/student/doubt-solver/:sessionId', element: withDashboardLayout(<DoubtSolverSession />) }],
  },
  // Notes + Subjects + Tracker + Calculator
  { path: '/student/notes',              moduleName: 'Notes',                element: withDashboardLayout(<SmartNotes />),
    child: [
      { path: '/student/notes/new',   element: withDashboardLayout(<NoteEditor />) },
      { path: '/student/notes/:id',   element: withDashboardLayout(<NoteDetail />) },
    ],
  },
  { path: '/student/subjects',           moduleName: 'Subjects',             element: withDashboardLayout(<SubjectStudyRoom />),
    child: [{ path: '/student/subjects/:id/room', element: withDashboardLayout(<StudyRoomDetail />) }],
  },
  { path: '/student/study-time',         moduleName: 'Study Time',           element: withDashboardLayout(<StudyTimeTracker />) },
  { path: '/student/grade-calculator',   moduleName: 'Grade Calculator',     element: withDashboardLayout(<GradeCalculator />) },
  // Teachers + Doubts
  { path: '/student/teachers',           moduleName: 'Teacher Hub',          element: withDashboardLayout(<TeacherHub />),
    child: [{ path: '/student/teachers/:id', element: withDashboardLayout(<TeacherDetail />) }],
  },
  { path: '/student/doubts',             moduleName: 'Doubts',               element: withDashboardLayout(<DoubtList />),
    child: [{ path: '/student/doubts/:id', element: withDashboardLayout(<DoubtDetail />) }],
  },
  // Personal Task Manager
  { path: '/student/tasks',              moduleName: 'Tasks',                element: withDashboardLayout(<PersonalTaskManager />),
    child: [
      { path: '/student/tasks/create',     element: withDashboardLayout(<TaskCreate />) },
      { path: '/student/tasks/:taskId',    element: withDashboardLayout(<TaskDetailPage />) },
      { path: '/student/tasks/:taskId/edit', element: withDashboardLayout(<TaskEdit />) },
    ],
  },
  // Supporting
  { path: '/student/content',            moduleName: 'Content',              element: withDashboardLayout(<ContentViewer />),
    child: [
      { path: '/student/content/:subjectId',       element: withDashboardLayout(<ContentSubjectView />) },
      { path: '/student/content/worksheet/:id',    element: withDashboardLayout(<ContentWorksheetViewer />) },
    ],
  },
  { path: '/student/timetable',          moduleName: 'Timetable',            element: withDashboardLayout(<StudentTimetable />) },
  { path: '/student/progress',           moduleName: 'Progress',             element: withDashboardLayout(<ProgressView />),
    child: [{ path: '/student/progress/:subjectId', element: withDashboardLayout(<SubjectProgress />) }],
  },
];
```

### Student Side Menu (replace `studentMenu` in `sideMenuConfig.jsx`)

Additional icons needed (add to existing import if not present):
```js
import { Bot, CalendarDays, CheckSquare, Calculator, TrendingUp,
         Palette, Youtube, FileText, GraduationCap, Lightbulb,
         BookMarked, Timer, FlaskConical, PenLine } from 'lucide-react';
```

```js
const studentMenu = [
  // ── AI Suite (primary section) ──────────────────────────────────────
  { path: '/student/dashboard',       text: 'AI Copilot',        i18nKey: 'nav.student.copilot',    icon: Bot },
  { path: '/student/study-plan',      text: 'Study Plan',        i18nKey: 'nav.student.studyPlan',  icon: CalendarDays },
  {
    path: '/student/tutors',
    text: 'AI Tutors',
    i18nKey: 'nav.student.tutors',
    icon: GraduationCap,
    child: [
      { path: '/student/tutors',        text: 'All Tutors',    i18nKey: 'nav.student.allTutors',   icon: GraduationCap, childIcon: GraduationCap },
      { path: '/student/doubt-solver',  text: 'Doubt Solver',  i18nKey: 'nav.student.doubtSolver', icon: Lightbulb,     childIcon: Lightbulb },
    ],
  },
  { path: '/student/pixgen',          text: 'AI Image Studio',   i18nKey: 'nav.student.pixgen',     icon: Palette },
  { path: '/student/youtube-quiz',    text: 'YouTube Quiz',      i18nKey: 'nav.student.ytQuiz',     icon: Youtube },
  { path: '/student/templates',       text: 'Templates',         i18nKey: 'nav.student.templates',  icon: FileText },

  // ── Academics ───────────────────────────────────────────────────────
  { path: '/student/assignments',     text: 'Assignments',       i18nKey: 'nav.student.assignments', icon: ClipboardList },
  { path: '/student/quizzes',         text: 'Quizzes',           i18nKey: 'nav.student.quizzes',     icon: ListChecks },
  { path: '/student/exams',           text: 'Exams',             i18nKey: 'nav.student.exams',       icon: Award },
  { path: '/student/content',         text: 'Study Materials',   i18nKey: 'nav.student.content',     icon: BookOpen },
  { path: '/student/timetable',       text: 'Timetable',         i18nKey: 'nav.student.timetable',   icon: CalendarDays },

  // ── Study Tools ─────────────────────────────────────────────────────
  { path: '/student/notes',           text: 'Notes',             i18nKey: 'nav.student.notes',       icon: PenLine },
  { path: '/student/tasks',           text: 'My Tasks',          i18nKey: 'nav.student.tasks',       icon: CheckSquare },
  { path: '/student/subjects',        text: 'Study Rooms',       i18nKey: 'nav.student.subjects',    icon: FlaskConical },
  { path: '/student/study-time',      text: 'Study Tracker',     i18nKey: 'nav.student.studyTime',   icon: Timer },
  { path: '/student/grade-calculator',text: 'Grade Calculator',  i18nKey: 'nav.student.gradeCalc',   icon: Calculator },

  // ── Teacher & Progress ───────────────────────────────────────────────
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
  { path: '/student/progress',        text: 'My Progress',       i18nKey: 'nav.student.progress',    icon: TrendingUp },

  // ── Account ─────────────────────────────────────────────────────────
  { path: '/profile',  text: 'Profile',  i18nKey: 'nav.profile',  icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];
```

---

## 6. AI-First Feature Set — Deep Spec

### Module 01 — AI Learning Copilot `/student/dashboard`

**This is the default landing page** when a student logs in. It replaces the old widget dashboard as the first screen.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ Good morning, Alex! You have 2 assignments due soon. │  ← contextual greeting
├───────────────────────────────────────────────────────┤
│ [Q&A] [Explain] [Summarise] [Practice] [Translate]   │  ← mode selector chips
├───────────────────────────────────────────────────────┤
│  Chat thread (empty on first visit → starter prompts)│
│                                                       │
│  "Help me understand Newton's 3rd Law"               │
│  "Summarise my biology notes"                         │
│  "What do I need to study for tomorrow?"              │
├───────────────────────────────────────────────────────┤
│  [📎 Attach] [Type a message...        ] [Send ▶]     │
└──────────────────────────────────────────────────────┘
```

**AI Modes (defined in `constants/aiModes.js`):**

| Mode | What it does | Dummy behavior |
|------|-------------|----------------|
| Q&A | General question answering | Returns scripted answers from `aiResponses.js` matched by keywords |
| Explain | Step-by-step explanation of a topic | Returns structured explanation with numbered steps |
| Summarise | Condense pasted text or notes | Returns shorter version with bullet points |
| Practice | Generate 3 drill questions on topic | Returns 3 MCQ questions with answer |
| Translate _(optional)_ | Translate text (ESL students) | Returns pre-scripted translation demo |

**Simulated streaming (key UX requirement):**  
When the AI "responds," characters appear word-by-word using `setInterval` at ~40ms/word to simulate LLM token streaming. This is implemented in `utils/aiStreamSimulator.js`:

```js
// src/panels/student/utils/aiStreamSimulator.js
export const streamText = (fullText, onChunk, onDone, delay = 35) => {
  const words = fullText.split(' ');
  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) { clearInterval(interval); onDone(); return; }
    onChunk(words[i] + ' ');
    i++;
  }, delay);
  return () => clearInterval(interval); // cleanup fn
};
```

**Scripted AI response library (`data/aiResponses.js`):**
```js
export const AI_RESPONSES = {
  'newton': {
    explain: "Newton's 3rd Law states that for every action, there is an equal and opposite reaction...\n\nStep 1: Identify the action force...\nStep 2: Identify the reaction force...\nStep 3: Note they are equal in magnitude but opposite in direction.",
    practice: [
      { q: "A rocket pushes exhaust gas downward. What happens to the rocket?", type: "mcq", options: ["Moves down","Moves up","Stays still","Spins"], correct: 1 },
      // ...
    ],
  },
  'photosynthesis': { explain: "...", summarise: "..." },
  // ... 15+ topic scripts covering math, science, english, history
};

export const DEFAULT_RESPONSE = "That's a great question! Let me break it down for you...";
```

**UX States:**
- First visit: greeting card + 5 `SuggestedPromptChip` starters, empty thread
- Loading response: `AITypingIndicator` (animated dots), input disabled
- Streaming: characters appear progressively, "Stop generating" button visible
- Error: "I couldn't process that — please try again" with retry
- Thread history: persisted in `localStorage` per session, cleared on logout

**AI-awareness of academic context:**  
The copilot greeting dynamically mentions upcoming deadlines from dummy data: *"You have the Algebra quiz opening today and 2 assignments due this week."*  
In Phase 1 this is a static string built from `dummyAssignments` and `dummyQuizzes`. In Phase 2, it pulls from real API.

---

### Module 02 — Personalized Study Plan `/student/study-plan`

**Purpose:** AI generates a personalized daily/weekly study schedule based on enrolled subjects, upcoming deadlines, and declared goals.

**Layout:** Week strip (Mon–Sun tabs) + day detail view with draggable time blocks.

**Phase 1 approach:** The plan is pre-generated from dummy data when the student first visits. A "Regenerate Plan" button triggers a new dummy plan with 400ms loading state.

**Dummy plan data shape:**
```js
// src/panels/student/data/studyPlan.js
export const dummyStudyPlan = {
  weekOf: '2026-05-08',
  aiNote: "Based on your Algebra quiz on Thursday, I've prioritized Math this week. English essay is due Friday — I've added 2 writing blocks.",
  days: [
    {
      date: '2026-05-08',
      blocks: [
        { id: 'b1', subject: 'Mathematics', topic: 'Quadratic equations review', duration: 45, priority: 'high', type: 'study', linkedAssignmentId: 'a1' },
        { id: 'b2', subject: 'English', topic: 'Essay outline draft', duration: 30, priority: 'medium', type: 'assignment', linkedAssignmentId: 'a2' },
        { id: 'b3', subject: 'Physics', topic: 'Newton\'s Laws flashcards', duration: 20, priority: 'low', type: 'review' },
      ],
    },
    // ... 6 more days
  ],
};
```

**UX States:**
- Loading (generating): skeleton week strip + `AIBadge` pulsing animation + "Generating your plan…" text
- Success: plan renders with AI note card at top
- Manual edit: drag-drop blocks to reorder (Phase 1: move within day; Phase 2: cross-day)
- Empty (no goals set): "Set your goals first" CTA → redirects to `/student/study-plan?setup=true` inline wizard

---

### Module 05 — Student PixGen `/student/pixgen`

A **student-scoped** version of the teacher's PixGen. Same AI concept, completely different component — never touches teacher code.

**Phase 1 scope:** Text prompt → generated image (demo: returns from a pool of 12 pre-selected school-safe images from public domain/placeholder service). Download. Gallery history (saved to `localStorage`).

**UI:**
- Prompt textarea + style selector (Realistic / Cartoon / Diagram / Abstract)
- "Generate" button → 1.5s loading animation → image appears
- Gallery row below (last 6 generated)
- Content guidelines notice (school-safe AI badge)

**Dummy generation:** `pixgenApi.js` returns a random item from `data/pixgenGallery.js` (12 hardcoded image URLs from placeholder services + realistic captions).

---

### Module 06 — Student YouTube Quiz `/student/youtube-quiz`

A **student-scoped** version of the teacher's YouTube Quiz Generator — different UI, same idea.

**Phase 1 scope:** Paste YouTube URL → quiz generates → take quiz → see score.

**Demo behavior:**
- If URL contains recognized demo ID → return pre-scripted quiz from `data/youtubeQuizzes.js`
- For any other URL → return generic 5-question demo quiz with 2s loading state

**Dummy quiz data:**
```js
export const dummyYTQuizzes = {
  'demo': {
    videoTitle: 'Khan Academy: Introduction to Algebra',
    questions: [
      { id: 'y1', text: 'What does a variable represent in algebra?', type: 'mcq', options: ['A fixed number','An unknown value','A symbol for multiplication','None'], correct: 1 },
      // 4 more...
    ],
  },
};
```

---

### Module 07 — Student Templates Library `/student/templates`

**5 core Phase 1 templates:**

| Template ID | Name | Purpose |
|---|---|---|
| essay-outline | Essay Outline Builder | Title + thesis + 3 body paragraphs + conclusion |
| study-schedule | Weekly Study Schedule | Subject + hours + goals grid |
| lab-report | Lab Report Template | Aim / Method / Results / Discussion / Conclusion |
| book-review | Book Review | Summary + themes + personal response |
| flashcard-set | Flashcard Creator | Term + definition pairs, exportable |

Each template has:
- Description card in the library grid
- `TemplateRunner.jsx`: step-by-step form with AI suggestions per field ("Need help with your thesis? Ask AI →")
- Preview panel (right side on desktop)
- Export as PDF / Copy to clipboard

**Dummy template data shape:**
```js
export const dummyTemplates = [
  {
    id: 'essay-outline',
    name: 'Essay Outline Builder',
    description: 'Structure any essay in minutes with AI-guided prompts.',
    icon: 'FileText',
    estimatedTime: '10 min',
    fields: [
      { id: 'title', label: 'Essay Title', type: 'text', aiPrompt: 'Suggest a compelling title for an essay about [topic]' },
      { id: 'thesis', label: 'Thesis Statement', type: 'textarea', aiPrompt: 'Write a strong thesis statement about [topic]' },
      // ...
    ],
  },
  // 4 more templates
];
```

---

### Module 08 — Specialized AI Tutors `/student/tutors`

**Phase 1 tutors (3):**

| Tutor ID | Name | Subjects | Personality |
|---|---|---|---|
| math-tutor | Math Mentor | Algebra, Geometry, Calculus | Methodical, step-by-step |
| science-tutor | Science Guide | Physics, Chemistry, Biology | Curious, analogy-driven |
| essay-coach | Essay Coach | English, History, Social Studies | Encouraging, structure-focused |

**Tutor selection grid** (`AITutors.jsx`): 3 cards with tutor avatar, name, subject chips, "Start Session" button.

**Tutor chat** (`AITutorChat.jsx`): Same streaming chat UI as AI Copilot but with:
- Tutor avatar in header (vs. generic Tutify bot)
- Domain-aware scripted responses (math tutor gives worked examples with LaTeX-style formatting; essay coach gives feedback on paragraphs)
- "Worked Example" button in math tutor → `TutorWorkedExample.jsx` renders numbered solution steps
- Session history persisted per tutor in `localStorage`

---

### Module 09 — AI Doubt Solver `/student/doubt-solver`

**Purpose:** Student types a problem, gets a step-by-step solution + 3 practice problems. The killer AI-first feature.

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ What do you need help with?                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Solve: 2x + 5 = 17. Show all steps.            │ │
│ └─────────────────────────────────────────────────┘ │
│ [Subject: Math ▼]  [Attach image 📎]  [Solve →]    │
└─────────────────────────────────────────────────────┘
              ↓ (1.2s simulated solve)
┌─────────────────────────────────────────────────────┐
│ Step 1: Subtract 5 from both sides → 2x = 12       │
│ Step 2: Divide both sides by 2 → x = 6             │
│ ✓ Answer: x = 6                                    │
├─────────────────────────────────────────────────────┤
│ Practice Problems (3)                               │
│ • Solve: 3x - 4 = 14  [Try it →]                   │
│ • Solve: 5x + 2 = 27  [Try it →]                   │
│ • Solve: x/3 + 1 = 5  [Try it →]                   │
├─────────────────────────────────────────────────────┤
│ [Save Solution to Notes]  [Ask Teacher Instead →]   │
└─────────────────────────────────────────────────────┘
```

**Scripted solution library:** `data/aiResponses.js` contains 20+ problem/solution pairs across math, science, grammar. Matched by keyword extraction.

**"Ask Teacher Instead"** button creates a doubt ticket pre-filled with the problem → routes to Teacher Hub.

**Save to Notes:** Creates a new note in Smart Notes with the problem + solution. Immediate optimistic UI update + toast.

---

### Module 15 — Personal Task Manager `/student/tasks`

**Purpose:** Complete personal productivity system for self-directed study tasks, separate from teacher assignments.

**List view** (`PersonalTaskManager.jsx`) — 4 tabs: Today | Upcoming | Overdue | Completed

Each `TaskCard.jsx` shows:
- `TaskPriorityBadge.jsx` (Low: gray / Medium: blue / High: red)
- Subject chip (green background — distinct from teacher assignment blue)
- Title, due date with `DeadlineChip`, estimated duration
- Completion checkbox (optimistic update — crosses out immediately)
- Edit / Delete icon buttons

**Quick-add bar** (`QuickAddTaskBar.jsx`) — sticky at bottom of list, minimal: title field + due date picker + "Add" button. Expands to full form on "More options →".

**Full task form** (`TaskCreate.jsx` / `TaskEdit.jsx`):
- Title (required), Description (rich text via MUI), Subject (dropdown), Due date & time, Estimated duration (slider 5–120min), Priority (Low/Medium/High radio), Attachments

**AI suggestions panel:**  
A collapsible section at the top of the task list showing 2–3 AI-generated task suggestions:
```
AI suggests:
  + "Review Chapter 5 — Physics exam is in 4 days"           [Add Task]
  + "Practice quadratic equations — quiz tomorrow"            [Add Task]
  + "Write English essay outline — due Friday"                [Add Task]
```
These are generated from dummy data by cross-referencing upcoming exam/quiz dates with subject weaknesses. In Phase 1, the logic is: find assignments/exams within 5 days from `dummyExams` + `dummyQuizzes`, generate a suggestion string.

**Visual distinction from teacher assignments:**  
- Tasks tab in Assignment Hub shows personal tasks with a `🟢 My Task` indicator vs `🔵 Assigned` for teacher tasks
- Task cards use a green left-border accent; teacher assignment cards use blue

**Dummy data shape:**
```js
// src/panels/student/data/tasks.js
export const dummyTasks = [
  {
    id: 'tk1', title: 'Review Chapter 5 — Newton\'s Laws',
    description: 'Focus on action-reaction pairs and momentum.',
    subject: 'Physics', dueDate: '2026-05-09T18:00:00',
    estimatedMinutes: 45, priority: 'high',
    status: 'not_started', completed: false,
    createdAt: '2026-05-08T10:00:00', attachments: [],
  },
  { id: 'tk2', title: 'Read Macbeth Act III', subject: 'English', dueDate: '2026-05-10T20:00:00', estimatedMinutes: 30, priority: 'medium', status: 'in_progress', completed: false },
  { id: 'tk3', title: 'Algebra flashcards (15 cards)', subject: 'Mathematics', dueDate: '2026-05-08T22:00:00', estimatedMinutes: 20, priority: 'high', status: 'completed', completed: true },
];
```

---

## 7. Teacher-Rails Modules — AI-Enhanced

### Module 03 — Smart Assignment Hub `/student/assignments`

Teacher-created assignments, enhanced with AI actions.

**AI enhancements per assignment:**
- `AIAssistPanel.jsx` — slide-in right drawer (MUI `Drawer`) accessible from detail page via "AI Help" button:
  - "Explain this assignment" → AI Copilot pre-filled with assignment title + instructions
  - "Help me start" → AI generates an opening paragraph or outline
  - "Simplify instructions" → rewords instructions in plainer language
  - "Ask AI Tutor about this topic" → routes to AI Tutors pre-filtered to subject

**Assignment status states:**

```
NOT_STARTED → [Start + AI Help] → IN_PROGRESS (Draft)
IN_PROGRESS → [Submit] → SUBMITTED
SUBMITTED → PENDING_REVIEW (Phase 2: teacher reviews)
PENDING_REVIEW → GRADED (Phase 2: teacher grades)
GRADED → REVISION_REQUESTED (Phase 2: teacher requests revision)
REVISION_REQUESTED → resubmit flow
```

**"My Tasks" tab in Assignment Hub:**  
The assignment list has a secondary tab "My Tasks" (Module 15 integration). Switching shows personal tasks alongside teacher assignments with visual color distinction.

---

### Module 04 — AI Quiz & Exam Center

**AI enhancement: Hint System**

`AIHintButton.jsx` on each quiz question — shows a subtle "💡 Get a Hint" link. Clicking:
- Disables the question's answer options momentarily
- Shows a scripted hint in an `Alert` box below the question (from `aiResponses.js` keyed by question topic)
- Hint is tracked (shown as "Hint used" icon on navigator pill)
- In results: "You used 3 hints" summary

**AI enhancement: Post-quiz explanation**

On the Results page, an "Explain My Mistakes" button (Phase 1 only shows if score < 70%):
- Loops through wrong answers
- For each: shows the correct answer + a 1-2 sentence AI explanation
- Suggests linking to AI Tutor for the relevant subject

---

### Content Viewer — AI Actions

Each content card has an AI actions overflow menu:
- "Summarise with AI" → streams a 3-bullet summary
- "Quiz me on this" → routes to Doubt Solver pre-filled with content title
- "Add to Notes" → creates a note linked to this content item

---

## 8. Supporting Modules

### Student Onboarding `/student/onboarding`

4-step wizard (one more step than V1 — adds AI Tour):

| Step | Content |
|------|---------|
| 1 — Profile | Avatar, preferred name, grade level |
| 2 — Classes | Read-only enrolled class list from dummy data |
| 3 — Goals | Target grade per subject + weekly study hours |
| 4 — AI Tour | 3-screen interactive tour: shows AI Copilot → AI Tutors → Doubt Solver with "Try it" micro-interactions |

Completion flag: `localStorage.setItem('student_onboarding_v2_complete', 'true')`. Checked on app load in `AICopilot.jsx`.

**Skip is always visible.** Skipping jumps to dashboard immediately.

### Class Timetable `/student/timetable`

Same spec as V1, with additions:
- "AI: What should I study before next class?" link on each period cell → routes to AI Copilot pre-filled with the class subject
- Mobile: swipe between days (instead of full-week grid)

### Student Progress `/student/progress`

Enhanced with AI:
- "AI Analysis" card: "You're strongest in Biology (avg 88%) and need the most work in Chemistry (avg 61%). I recommend 3 more practice sessions this week."
- This string is built from `dummyProgress` data with simple min/max logic — no real ML.

---

## 9. UX System & Quality Bar

### Design Tokens Usage

Follow existing Tailwind config (sky-blue primary palette). Student portal adds:
- AI surfaces use a distinct `violet-50 → violet-100` gradient background to signal "AI content"
- Teacher-assigned content: blue left-border accent
- Personal tasks (Module 15): green left-border accent
- AI-generated content: `AIBadge` chip (violet, sparkle icon, "AI")

### Page Header Standard

`StudentPageHeader.jsx` renders on every student page:
```
[Breadcrumb navigation]
[Page Title]  [Page Subtitle]  [Action buttons right-aligned]
[Optional: AI action chip]
────────────────────────────────
[Page content]
```

### Loading States

- **Card grids**: `SkeletonCard` (pulse animation, matches card dimensions)
- **Chat AI response**: `AITypingIndicator` (3 animated dots) then streaming text
- **Full page**: skeleton of the expected layout (not a spinner-only screen)
- **Inline actions** (submit, AI generate): Button shows MUI `CircularProgress` inside, disabled state

### Error Handling

- `StudentErrorState` renders for every failed hook with: icon + message + "Try again" button
- Network errors in AI features: "Couldn't reach AI — check your connection" with retry
- Form validation: inline MUI `helperText` errors, never modal

### Toast / Snackbar

Use existing `dispatch(showSnackbar({ message, severity }))` from `snackbarSlice` for all feedback:
- Task added: "Task created" (success)
- Assignment submitted: "Assignment submitted successfully" (success)
- Note saved: "Note saved" (success)
- AI error: "AI is unavailable — try again" (error)
- Doubt raised: "Doubt sent to Mr. Thompson" (success)

### Responsiveness

| Breakpoint | Layout changes |
|---|---|
| xs (< 640px) | Single column, sidebar collapsed, timetable → day view, chat full-screen |
| sm (640–768px) | 2-column grids, collapsible sidebar |
| md (768–1024px) | Standard desktop layout |
| lg (> 1024px) | AI Copilot: 2-pane (chat left, context panel right) |

### Accessibility

- All interactive elements: `aria-label` where icon-only
- Status badges: text label always present (not color-only)
- AI streaming text: `aria-live="polite"` on chat output region
- Quiz taking: full keyboard navigation, focus management between questions
- Minimum touch target: 44×44px
- Color contrast: WCAG AA minimum throughout

### Performance

- AI chat history: cap at 50 messages in `localStorage` (rotate oldest)
- Note list: virtualize with `react-window` if > 100 items (add to package if needed)
- Quiz taking: no unnecessary re-renders — timer is isolated in its own `useEffect`, answer state in `useReducer`
- Code splitting: no lazy loading currently in repo — follow same pattern (static imports). Structure is ready for lazy splitting in Phase 2.

---

## 10. Dummy Data + Mock API Strategy

### Three-layer architecture

```
Component → Hook → API function → Data file
         useState         async           static array
```

### API factory pattern

Every file in `src/panels/student/api/` follows this contract:

```js
// src/panels/student/api/_factory.js
export const makeApi = (dataGetter) => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const LATENCY = () => 300 + Math.random() * 400;
  // Set to 0.1 in development to stress-test error states
  const ERROR_RATE = import.meta.env.DEV ? 0 : 0;

  return {
    async fetchAll(filters = {}) {
      await delay(LATENCY());
      if (Math.random() < ERROR_RATE) throw new Error('Simulated network error');
      let items = dataGetter(filters);
      return { data: items, total: items.length };
    },
    async fetchById(id) {
      await delay(LATENCY());
      if (Math.random() < ERROR_RATE) throw new Error('Simulated network error');
      const item = dataGetter().find((i) => i.id === id);
      if (!item) throw new Error(`Not found: ${id}`);
      return { data: item };
    },
    async create(payload) {
      await delay(LATENCY() + 200);
      const item = { id: `gen_${Date.now()}`, createdAt: new Date().toISOString(), ...payload };
      return { data: item };
    },
    async update(id, payload) {
      await delay(LATENCY());
      return { data: { id, ...payload, updatedAt: new Date().toISOString() } };
    },
    async delete(id) {
      await delay(LATENCY());
      return { data: { id, deleted: true } };
    },
  };
};
```

### AI API simulation

```js
// src/panels/student/api/aiApi.js
import { AI_RESPONSES, DEFAULT_RESPONSE } from '../data/aiResponses';
import { streamText } from '../utils/aiStreamSimulator';

export const sendCopilotMessage = async (message, mode, onChunk, onDone) => {
  await new Promise((r) => setTimeout(r, 600));  // "thinking" delay
  const key = Object.keys(AI_RESPONSES).find((k) => message.toLowerCase().includes(k));
  const responseObj = key ? AI_RESPONSES[key] : null;
  const fullText = responseObj?.[mode] || DEFAULT_RESPONSE;
  const cleanup = streamText(fullText, onChunk, onDone);
  return cleanup;
};

export const solveProblem = async (problem, subject) => {
  await new Promise((r) => setTimeout(r, 1200));
  const key = Object.keys(AI_RESPONSES).find((k) => problem.toLowerCase().includes(k));
  return {
    data: {
      steps: AI_RESPONSES[key]?.steps || ['Identify what you know', 'Apply the formula', 'Solve step by step', 'Verify your answer'],
      answer: AI_RESPONSES[key]?.answer || 'See steps above',
      practiceProblems: AI_RESPONSES[key]?.practice || [],
    },
  };
};
```

### Hook standard pattern

```js
// src/panels/student/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { makeApi } from '../api/_factory';
import { dummyTasks } from '../data/tasks';

const tasksApi = makeApi(() => [...dummyTasks]);

export const useTasks = (filters = {}) => {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await tasksApi.fetchAll(filters);
      setTasks(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  const addTask = async (payload) => {
    const { data } = await tasksApi.create(payload);
    setTasks((prev) => [data, ...prev]);  // optimistic
    return data;
  };

  const updateTask = async (id, payload) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...payload } : t));  // optimistic
    await tasksApi.update(id, payload);
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));  // optimistic
    await tasksApi.delete(id);
  };

  return { tasks, loading, error, refetch: load, addTask, updateTask, deleteTask };
};
```

### Stable interface for backend swap

When real backend is ready:
1. Replace `makeApi(() => dummyData)` call with `apiRequest<T>()` calls in the API files
2. Hook signatures stay **identical** — zero component changes
3. Remove `data/*.js` files
4. Point `aiApi.js` to real AI endpoint

### Pagination / Filter / Sort conventions

All `fetchAll` functions accept:
```js
{ page = 1, pageSize = 10, subjectId, status, sortBy = 'dueDate', sortDir = 'asc', search = '' }
```
Returns: `{ data: [...], total, page, pageSize }`

---

## 11. State Management Strategy

| Data | Storage | Reason |
|------|---------|--------|
| All list/detail data | Local state via custom hooks | Isolated, easy to swap to RTK Query |
| AI chat history | `localStorage` keyed by mode | Persist across nav, no server needed |
| Active quiz answers + timer | `useReducer` inside `QuizTake.jsx` | Complex local state, no Redux overhead |
| Homework tasks (optimistic) | Local hook state with optimistic updates | Immediate UX, backed by localStorage in P1 |
| Onboarding completion flag | `localStorage` | Simple boolean, no Redux needed |
| Exam reflection data | `localStorage` per exam ID | Private, client-only |
| Study time session | Local state in `StudyTimeTracker.jsx` | Timer loop, no Redux overhead |
| Global toasts | Existing Redux `snackbarSlice` | Already wired in the app — use it |
| Auth / user info | Existing Redux `authSlice` | Never change this slice |
| Notification unread count | Local state in `NotificationBell.jsx` | Shared via prop if sidebar needs it |

### When to add a student Redux slice

**Add `studentPreferencesSlice` (persisted) if:**
- Onboarding completion and AI mode preference need to sync across devices (not just this browser)
- Study plan goals need to persist across sessions

**Do not add a slice** for: task lists, quiz sessions, copilot history, study time data. Local hooks + localStorage is sufficient for Phase 1.

**RTK Query:** Reserve for Phase 2 real backend integration. Do not introduce RTK Query for dummy data — the overhead is not justified.

---

## 12. Reusing Existing Shared Components

Import these from `src/components/shared/` — never copy or modify:

| Shared component | Used in student module |
|---|---|
| `CustomButton` | All forms, all action buttons |
| `CustomTable` | Progress view tables, Doubt list |
| `CustomFilter` | Assignment, Quiz, Note filters |
| `CustomModal` | Submission confirm dialog, Delete confirm |
| `CustomAvatar` | Teacher cards, Tutor cards |
| `CustomInput` | All search inputs, form inputs |
| `SelectDropdown` | Subject selectors, priority dropdowns |
| `FilePicker` | Assignment submission uploader |
| `ImagePicker` | Note attachment, Doubt image attach |
| `StatsCard` | Progress overview stat cards |
| `LineBarChat` | Study time weekly bar chart |
| `Search` | All list search bars |
| `Tabs` + `CustomTabPanel` | Assignment Hub tabs, Study Room tabs |
| `CustomAccordion` | Grade calculator explanation section |
| `DatePicker` + `TimePicker` | Task due date, Exam reflect time |
| `ComingSoon` | Phase 2 placeholder sections |
| `NotificationEmptyState` | Empty notification popover |
| `CreateLoader` | AI generation loading state (heavy) |
| `snackbarSlice` | All success/error toasts (dispatch only) |

**Rule:** If a shared component needs a style change for student context, do it via `sx` prop (MUI) or `className` prop (Tailwind) at the usage site. Never edit the shared component file.

---

## 13. Implementation Sequence & Dependencies

### Milestone 0 — Foundation Scaffold (Days 1–3)

> **Goal:** App compiles, all student routes resolve to `<ComingSoon />`, no teacher regression.

1. Create `src/panels/student/constants/` — `studentPaths.js`, `statusTypes.js`, `aiModes.js`
2. Create stub `index.js` for every panel folder pointing to `<ComingSoon />`
3. Create ALL data files in `src/panels/student/data/` with full dummy datasets
4. Create ALL api files in `src/panels/student/api/` with factory-based async functions
5. Create ALL hook files in `src/panels/student/hooks/`
6. Update `studentRoutes` in `config.jsx` (pointing to stubs)
7. Update `studentMenu` in `sideMenuConfig.jsx`
8. Create `src/components/pages/student/shared/` — `StudentPageHeader`, `StatusBadge`, `DeadlineChip`, `SkeletonCard`, `StudentEmptyState`, `StudentErrorState`, `AIBadge`, `PhaseGateBanner`, `NotificationBell`
9. Create `src/panels/student/utils/` — `aiStreamSimulator.js`, `gradeCalculator.js`, `dateHelpers.js`, `statusHelpers.js`

**Done when:** `npm run build` passes. Logging in as student shows sidebar + all routes = "Coming Soon" with no console errors.

---

### Milestone 1 — AI Core Shell (Week 1)

> **Goal:** The AI-first experience is live. Student lands on AI Copilot and can chat.

**Build order:**
1. `StudentOnboarding.jsx` — 4-step wizard, completion flag
2. `AICopilot.jsx` + `ChatThread.jsx` + `ChatInput.jsx` + `AICopilotLanding.jsx`
3. `MessageBubble.jsx`, `AITypingIndicator.jsx`, `ModeSelectorChip.jsx`, `SuggestedPromptChip.jsx`
4. `aiStreamSimulator.js` — word-by-word streaming implementation
5. `data/aiResponses.js` — minimum 12 topic scripts (math, science, english, history)
6. Wire `NotificationBell` into existing TopBar (import only — no TopBar changes)

**Done when:** Student opens app → sees onboarding (first time) → lands on AI Copilot → types a message → sees streaming AI response. Modes switch correctly. Thread persists on refresh.

---

### Milestone 2 — AI Tools Suite (Week 2)

> **Goal:** The full AI product is playable. This is the demo money shot.

**Build order (can be parallelized by 2–3 engineers):**

Branch A:
1. `AITutors.jsx` + `AITutorChat.jsx` + `TutorCard.jsx` + `TutorWorkedExample.jsx`
2. `DoubtSolver.jsx` + `DoubtSolverSession.jsx` + `DoubtInputForm.jsx` + `SolutionStepCard.jsx` + `PracticeProblems.jsx`

Branch B:
3. `StudyPlan.jsx` + `StudyPlanWeekView.jsx` + `StudyPlanDayDetail.jsx` + `StudyBlockCard.jsx`
4. `StudentPixGen.jsx` + `PixGenGallery.jsx`
5. `StudentYouTubeQuiz.jsx` + `YouTubeQuizTake.jsx` + `YouTubeQuizResults.jsx`

Branch C:
6. `StudentTemplates.jsx` + `TemplateRunner.jsx`

**Done when:** All AI tools have working dummy flows. Doubt Solver solves problems with streaming steps. AI Tutors chat in domain-aware style. Study Plan renders weekly view. PixGen generates from pool. YouTube Quiz runs full flow.

---

### Milestone 3 — Academic Rails (Week 3)

> **Goal:** Teacher-connected features are complete and AI-enhanced.

**Build order:**
1. `AssignmentHub.jsx` + `AssignmentDetail.jsx` + `AssignmentSubmit.jsx` + `AssignmentFeedback.jsx` (Phase 2 surface)
2. `AssignmentCard.jsx`, `AssignmentFilters.jsx`, `SubmissionUploader.jsx`, `SubmissionConfirmation.jsx`, `AIAssistPanel.jsx`
3. `QuizCenter.jsx` + `QuizTake.jsx` (with `QuizTimerBar`, `QuizNavigator`, `QuizQuestionRenderer`, `AIHintButton`) + `QuizResults.jsx`
4. `ExamCenter.jsx` + `ExamTake.jsx` + `ExamPrepare.jsx` + `ExamReflect.jsx`

**Done when:** Full assignment flow (list → detail → AI assist → submit → confirmation). Full quiz flow (list → take with timer + hints → results with AI explanation). Exam prepare + reflect complete.

**Dependency:** Milestone 0 (data + hooks). Can start in parallel with Milestone 2.

---

### Milestone 4 — Study Tools + Productivity (Week 4)

**Build order (can be parallelized):**

Branch A:
1. `SmartNotes.jsx` + `NoteEditor.jsx` + `NoteDetail.jsx` + `NoteCard.jsx` + `AISummaryPanel.jsx`
2. `SubjectStudyRoom.jsx` + `StudyRoomDetail.jsx`

Branch B:
3. `PersonalTaskManager.jsx` + `TaskCreate.jsx` + `TaskDetail.jsx` + `TaskEdit.jsx`
4. `TaskCard.jsx`, `TaskPriorityBadge.jsx`, `TaskFilters.jsx`, `AISuggestionCard.jsx`, `QuickAddTaskBar.jsx`

Branch C:
5. `StudyTimeTracker.jsx` + `SubjectTimerCard.jsx` + `WeeklyBarChart.jsx` + `SubjectPieChart.jsx`
6. `GradeCalculator.jsx` + `gradeCalculator.js` utility

**Done when:** Notes create/edit/AI-summarise works. Personal tasks have full CRUD + AI suggestions panel. Study time timer runs and charts render. Grade calculator produces results.

---

### Milestone 5 — Supporting Modules (Week 5)

1. `StudentTimetable.jsx` + `PeriodCell.jsx` + `NextClassBanner.jsx` + `DayColumn.jsx` — with live countdown
2. `ContentViewer.jsx` + `ContentSubjectView.jsx` + `ContentWorksheetViewer.jsx` — with AI summarise action
3. `ProgressView.jsx` + `SubjectProgress.jsx` + `ScoreHistoryChart.jsx` — with AI analysis card
4. `TeacherHub.jsx` + `TeacherDetail.jsx` + `DoubtList.jsx` + `DoubtDetail.jsx` — doubt lifecycle

---

### Milestone 6 — Polish, Integration & Acceptance (Week 6)

1. End-to-end clickthrough of every flow from Acceptance Checklist
2. AI → Academic module integrations (AI Copilot pre-fill from assignment detail; Doubt Solver "Ask Teacher" flow; Save to Notes from Doubt Solver)
3. Dark mode audit across all new components
4. Mobile (375px) layout pass — timetable day view, chat full-screen, side-drawer menus
5. Accessibility pass: `aria-label`, `aria-live`, keyboard nav in quiz
6. Set `ERROR_RATE = 0.3` → confirm every module shows `StudentErrorState` correctly
7. `console.log` cleanup — zero in production build
8. Performance: quiz timer isolation check, AI chat scroll-to-bottom behavior

---

### Dependency Graph

```
Milestone 0 (scaffold + data + hooks)
    │
    ├──→ Milestone 1 (AI Copilot shell)           ← P0 Demo blocker
    │         └──→ Milestone 2 (AI Tools Suite)   ← P0 Demo blocker
    │
    ├──→ Milestone 3 (Academic Rails)             ← P0 Demo blocker
    │
    ├──→ Milestone 4 (Study Tools + Tasks)        ← P1
    │
    ├──→ Milestone 5 (Supporting Modules)         ← P1
    │
    └──→ Milestone 6 (Polish) ← depends on all above
```

**Critical path for "demo-ready" checkpoint:**  
Milestone 0 → Milestone 1 → Milestone 2 → Milestone 3 (parallel with 2) → Milestone 6 subset

A live demo can be shown after Milestone 3, with Milestones 4–5 as "explore more" areas.

---

## 14. Acceptance Checklist

### P0 — Must Pass Before Any Demo

- [ ] Logging in as `student` role shows correct sidebar with AI Suite at top
- [ ] Default route `/student` redirects to `/student/dashboard` (AI Copilot)
- [ ] AI Copilot accepts a message and returns a streaming response (not a blank or instant block)
- [ ] AI mode selector (Q&A / Explain / Summarise / Practice) changes response behavior
- [ ] No teacher feature, route, or component is broken or modified
- [ ] Zero console errors in the browser on any student page
- [ ] Browser back/forward navigation works on all 40+ routes

### Routing & Navigation

- [ ] All student routes resolve — no 404s
- [ ] Deep links work when entered directly in browser (while authenticated as student)
- [ ] Breadcrumbs update correctly on all detail and sub-pages
- [ ] Sidebar active state highlights the correct item on every route

### AI Features

- [ ] AI Copilot streaming text renders word-by-word (not all at once)
- [ ] "Stop generating" clears the stream
- [ ] AI Tutor chat domain-aware (Math Mentor responds differently to essay question)
- [ ] Doubt Solver shows step-by-step solution + 3 practice problems
- [ ] "Save Solution to Notes" creates a note and shows toast
- [ ] "Ask Teacher Instead" pre-fills doubt form and navigates to Teacher Hub
- [ ] Study Plan AI note shown, "Regenerate" triggers loading state then new plan
- [ ] Student PixGen generates an image in < 2.5s with loading state
- [ ] YouTube Quiz: entering a URL generates a quiz that can be taken and scored

### Academic Rails

- [ ] Assignment list shows all status variants (not_started, in_progress, submitted, graded, revision_requested)
- [ ] `DeadlineChip` shows correct urgency color (<6h = red, <24h = amber, <72h = orange)
- [ ] Assignment submit flow: form → confirm dialog → success screen → toast
- [ ] Quiz taking: timer counts down, navigator shows answered/unanswered, submit confirms
- [ ] Quiz AI hint works on at least one question
- [ ] Post-quiz "Explain My Mistakes" shows for score < 70%
- [ ] Exam prepare shows checklist + countdown; reflect saves to localStorage

### Study Tools

- [ ] Tasks: create, edit, delete, mark complete all work with optimistic UI
- [ ] Task AI suggestions visible and "Add Task" creates task immediately
- [ ] Task priority badge colors correct (Low gray, Medium blue, High red)
- [ ] Notes: create with rich text, AI summarise shows AIBadge, subject filter works
- [ ] Study time: timer starts/stops, manual entry saves, week chart renders
- [ ] Grade calculator: input values produce numeric output with pass/fail indicator

### UX Quality

- [ ] Every page shows skeleton loaders (not blank screen) during data fetch
- [ ] Every list page has a designed empty state
- [ ] Every data-fetching hook shows `StudentErrorState` when `ERROR_RATE = 0.3`
- [ ] Every error state has a "Retry" button that re-triggers the fetch
- [ ] All success actions dispatch a toast via existing `snackbarSlice`
- [ ] AI-generated content sections have the `AIBadge` (violet sparkle chip)
- [ ] Phase 2 features show `PhaseGateBanner` (info alert) — never blank or broken UI
- [ ] Dark mode renders correctly on all new components
- [ ] Mobile 375px: no horizontal overflow, timetable shows day view, chat is usable

### Integration

- [ ] "AI Help" on Assignment Detail opens `AIAssistPanel` with correct assignment context
- [ ] Personal tasks appear in Assignment Hub "My Tasks" tab with green indicator (distinct from blue teacher assignments)
- [ ] "Add to Notes" from Content Viewer creates a note and shows toast
- [ ] Onboarding completion flag prevents wizard re-showing on second login

---

*This plan supersedes `STUDENT_PORTAL_IMPLEMENTATION_PLAN.md`. All engineering and design work should reference this V2 document.*  
*Source PRD: `updated_student_portal_documentation.md` v2.1*  
*Engineering standard: `REACT_PROJECT_IMPLEMENTATION_GUIDE.md`*
