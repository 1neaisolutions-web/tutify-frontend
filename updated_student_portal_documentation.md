Product Requirement Document (PRD) – International Edition (US Market Standard) – UPDATED v2.1
Change from v2.0: Added Module 15 – Personal Task Manager to explicitly support student‑created self‑assigned tasks (individual login). Also clarified standalone vs. teacher‑linked capabilities across all modules.

Table of Contents
Executive Summary & Core Principles

Architecture & Role Alignment (Teacher ⇔ Student)

The 15 AI‑First Modules (Detailed)

Modules 01–14 as previously defined, plus

Module 15: Personal Task Manager

Cross‑Module Feature Matrix (Must‑Have vs. Phase 2)

Integrity & Anti‑Cheating Layer (Cross‑Module)

Individual Login & Teacher Linking Flow

International Standards & Compliance

Non‑Functional Requirements

Phase 1 MVP vs. Roadmap

Acceptance Checklist

1. Executive Summary & Core Principles (unchanged)
The Tutify Student Portal is an AI‑first learning copilot that places AI at the center, integrates teacher‑created content, supports standalone learning, and meets US K‑12/Higher Ed standards.

Core Principles: AI‑First, Teacher‑Connected, Integrity by Design, Privacy & Safety, Accessible & Inclusive, Offline‑First Progressive.

2. Architecture & Role Alignment (unchanged)
Teacher actions → student consumption + AI augmentation. Standalone student (no teacher) gets all AI tools + personal task manager, but not teacher‑created assignments.

3. The 15 AI‑First Modules – Deep Feature Specification
Modules 01 through 14 are as defined in v2.0 (see previous long document). Below is Module 15 – the new addition. For completeness, a one‑line reminder of each existing module is included, but the full detailed features remain from v2.0.

Existing modules (brief reminder):

01 AI Learning Copilot – chat interface

02 Personalized Study Plan – AI daily roadmap

03 Smart Assignment Hub – teacher assignments + AI help

04 AI Quiz & Exam Center – teacher quizzes + self‑practice

05 Student PixGen – AI image generation

06 Student YouTube Quiz Generator – self‑quiz from video

07 Student Templates Library – study templates

08 Specialized AI Tutors – domain‑specific chatbots

09 AI Doubt Solver – step‑by‑step + practice

10 Smart Capture & Notes – OCR, math solver, voice notes

11 Subject Study Room – per‑subject workspace

12 Study Time Tracker with AI Insights – time logging, insights

13 Grade Impact & Scenario Planner – what‑if grade calculator

14 Teacher Interaction Hub – doubt tickets, office hours, feedback

Module 15 – Personal Task Manager (NEW)
Goal: Allow students (especially those with individual login, but also teacher‑linked) to create, manage, and track self‑assigned learning tasks that are not teacher‑created – turning the portal into a complete personal productivity system.

Features (must‑have for Phase 1):

Task creation:

Student can create a task with:

Title (required)

Description (optional, rich text)

Subject (from enrolled classes or free‑form if no teacher)

Due date & time (optional)

Estimated duration (in minutes)

Priority level: Low / Medium / High

Recurrence: none, daily, weekly, custom (e.g., every Mon/Wed)

Attachments: file, image, or link

Reminder: push/email notification X minutes before due

Quick‑add from dashboard: “Add a task” button with minimal fields (title + due date).

Task list views:

Today’s tasks (grouped by priority)

Upcoming (future due dates)

Overdue (red alert)

Completed (archive, with completion timestamp)

Filter by subject, priority, status (Not Started, In Progress, Completed, Overdue)

Search tasks by title or description.

Task management:

Edit, delete, duplicate.

Mark as In Progress / Completed.

Add sub‑tasks (checklist inside a task).

Add notes or reflections after completion (“What I learned”).

Attach AI‑generated practice set or notes from other modules (e.g., from Doubt Solver).

AI integration within Personal Task Manager:

AI suggestions: Based on study plan, time tracker, and upcoming teacher deadlines, AI suggests tasks:

“You haven’t reviewed fractions – add a 15‑min practice session.”

“Your exam is in 3 days – AI recommends you add ‘Review chapter 7’ today.”

Auto‑scheduling: AI can propose a time slot for each task based on student’s study time patterns.

Task estimation: AI predicts how long a task will take based on similar past tasks and student’s speed.

Priority scoring: AI assigns a priority score (0–100) based on due date, subject weakness, and upcoming exams.

Visual distinction from teacher assignments:

In the Assignment Hub (Module 03), personal tasks appear in a separate “My Tasks” tab or with a distinct icon/color (e.g., green vs. blue for teacher assignments).

Student can choose to hide or show personal tasks in the main dashboard feed.

Teacher touchpoint (if linked):

Teacher cannot see or modify personal tasks unless the student explicitly shares a task report (privacy preserved).

Student can optionally “share task completion” with teacher as proof of self‑study (teacher sees only what student chooses).

Integrity & safety: Personal tasks are private; no cheating implications because no grade is attached. AI suggestions are opt‑in.

Standards alignment: Supports executive function skills (task initiation, planning, time management) – aligns with UDL and SEL frameworks.

UI routes (frontend):

/student/tasks – main task manager

/student/tasks/create

/student/tasks/:taskId

/student/tasks/:taskId/edit

MVP vs. Later:

Phase 1: Create, edit, delete, mark complete, due dates, priority, basic list views, AI suggestions (simple: based on due date & study plan).

Phase 2: Recurring tasks, sub‑tasks, AI auto‑scheduling, effort estimation, calendar sync, shared task reports.

4. Cross‑Module Feature Matrix (Must‑Have vs. Phase 2)
(Updated to include Module 15)

Module	Phase 1 (MVP)	Phase 2 (3‑6 months)
01 AI Learning Copilot	Text chat, Q&A, summarise, read aloud	Voice input, save responses, teacher context
02 Personalized Study Plan	Manual goal entry, basic daily plan	Auto‑pull from tracker, calendar export
03 Smart Assignment Hub	List, detail, submit, status, AI explain	Integrity checks, revision flow
04 Quiz & Exam Center	Take teacher quizzes, auto‑graded MC	Proctoring‑lite, self‑practice mode
05 Student PixGen	Basic text‑to‑image, download	Annotation editor, share with teacher
06 YouTube Quiz Gen	Generate quiz from link, take	Share results, transcript summariser
07 Templates Library	5 core templates	All templates, custom builder
08 Specialized AI Tutors	Math, Science, Essay Coach	Language, History, Coding
09 AI Doubt Solver	Step‑by‑step, 3 practice problems	“Ask teacher” integration
10 Smart Capture	OCR text capture, basic note save	Math solver, voice transcription
11 Subject Study Room	Resources, notes, Q&A board	Mastery meter, AI topic suggestions
12 Study Time Tracker	Manual + timer, pie chart	AI insights, budget vs actual
13 Grade Calculator	Required score calculator, single subject	Multi‑subject GPA, trend projection
14 Teacher Interaction	Doubt tickets, messages, feedback history	Office hours booking, video call
15 Personal Task Manager	Create/edit/delete tasks, due dates, priority, basic AI suggestions, separate tab in Assignment Hub	Recurring tasks, sub‑tasks, auto‑scheduling, effort estimation
5. Integrity & Anti‑Cheating Layer (unchanged)
System‑wide detection: copy/paste logging, AI text fingerprint, typing behaviour, tab/window blur (timed mode), optional screen protection, plagiarism comparison.

6. Individual Login & Teacher Linking Flow
Standalone student (no teacher):

Has access to: Modules 01, 02 (limited), 05, 06, 07, 08, 09, 10, 12, 13, 15.

Uses Personal Task Manager to create their own learning tasks.

No teacher‑created assignments/quizzes appear.

Study plan based on self‑declared goals and self‑logged time.

Once linked to a teacher:

Teacher assignments/quizzes appear in Modules 03 & 04.

AI can incorporate teacher materials.

Personal Task Manager continues to work (tasks remain private unless shared).

Teacher Interaction Hub (Module 14) becomes active.

7. International Standards & Compliance (unchanged)
FERPA, COPPA, WCAG 2.1 AA, Common Core/NGSS alignment, safeguarding.

8. Non‑Functional Requirements (unchanged)
Performance, security, scalability, reliability, mobile‑first responsive.

9. Phase 1 MVP vs. Roadmap
Phase 1 Buildable Now (4–5 months) – includes all 15 modules at MVP level:

Module 15 – Personal Task Manager (create, edit, delete, due dates, priority, basic AI suggestions)

All other modules as defined in v2.0 Phase 1.

Phase 2 (post‑MVP): Enhancements as per matrix above.

10. Acceptance Checklist (for this document)
Personal Task Manager (Module 15) explicitly defined – no missing feature for individual login.

All 15 modules have deep, professional feature sets.

Integrity and anti‑cheat layer included.

Individual login + teacher linking flow clarified.

International standards addressed.

Phase 1 vs. Phase 2 separated.

AI‑first principle maintained.

Ready for US/American market audience.

Prepared by: Tutify Product Team
Version: 2.1 – AI‑First Student Portal with Personal Task Manager
Date: [Current Date]

This document supersedes all previous student portal drafts. Engineering and design must reference this PRD.