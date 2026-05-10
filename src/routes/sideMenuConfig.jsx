// Library imports
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Bot,
  Youtube,
  Image,
  BookOpen,
  BookMarked,
  History,
  User,
  Settings,
  Shield,
  BarChart3,
  ClipboardCheck,
  Building2,
  School,
  GraduationCap,
  Users,
  Lightbulb,
  Wrench,
  Home,
  ListChecks,
  ClipboardList,
  FileSpreadsheet,
  Award,
  FolderOpen,
  Upload,
  Key,
  CalendarDays,
  CheckSquare,
  Calculator,
  TrendingUp,
  Palette,
  Timer,
  FlaskConical,
  PenLine,
} from 'lucide-react';

const teacherMenu = [
  { path: '/dashboard', text: 'Dashboard', i18nKey: 'nav.dashboard', icon: LayoutDashboard },
  {
    path: '/teacher-tools',
    text: 'Teacher Tools',
    i18nKey: 'nav.teacherTools',
    icon: Wrench,
    child: [
      { path: '/teacher-tools', text: 'Overview', i18nKey: 'nav.teacherToolsOverview', icon: Home },
      { path: '/teacher-tools/quiz', text: 'Quiz', i18nKey: 'nav.quiz', icon: ListChecks },
      { path: '/teacher-tools/assignment', text: 'Assignment', i18nKey: 'nav.assignment', icon: ClipboardList },
      { path: '/teacher-tools/worksheet', text: 'Worksheet', i18nKey: 'nav.worksheet', icon: FileSpreadsheet },
      { path: '/teacher-tools/exams', text: 'Exams', i18nKey: 'nav.exams', icon: Award },
      // Templates hidden from demo nav — route/code preserved, re-enable by uncommenting:
      // { path: '/teacher-tools/templates', text: 'Templates', icon: FileText },
      { path: '/teacher-tools/analytics', text: 'Analytics', i18nKey: 'nav.teacherToolsAnalytics', icon: BarChart3 },
    ],
  },
  // Templates hidden in demo navigation for now (route preserved for phase-2 re-enable).
  { path: '/templates', text: 'Templates Library', i18nKey: 'nav.templates', icon: FileText }, 
  { path: '/chatbots', text: 'Specialized Chatbots', i18nKey: 'nav.chatbots', icon: MessageSquare },
  { path: '/youtube-quiz', text: 'YouTube Quiz Generator', i18nKey: 'nav.youtubeQuiz', icon: Youtube },
  { path: '/pixgen', text: 'PixGen (AI Media Studio)', i18nKey: 'nav.pixgen', icon: Image },
  { path: '/learning-hub', text: 'Professional Learning Hub', i18nKey: 'nav.learningHub', icon: BookOpen },
  { path: '/personalization', text: 'Personalization', i18nKey: 'nav.personalization', icon: Settings },
  {
    path: '/administration',
    text: 'Administration',
    i18nKey: 'nav.administration',
    icon: Shield,
    child: [
      { path: '/administration/reporting', text: 'Reporting', i18nKey: 'nav.reporting', moduleName: 'Reporting', icon: BarChart3, childIcon: BarChart3 },
      { path: '/administration/assessment', text: 'Assessment', i18nKey: 'nav.assessment', moduleName: 'Assessment', icon: ClipboardCheck, childIcon: ClipboardCheck },
      { path: '/admin/content-packs', text: 'Content Management', i18nKey: 'nav.contentManagement', moduleName: 'Content Management', icon: BookOpen, childIcon: BookOpen },
    ],
  },
  { path: '/history', text: 'History', i18nKey: 'nav.history', icon: History },
  { path: '/analytics', text: 'Analytics', i18nKey: 'nav.analytics', icon: BarChart3 },
  { path: '/use-cases', text: 'Explore Use Cases', i18nKey: 'nav.useCases', icon: Lightbulb },
  { path: '/profile', text: 'Profile', i18nKey: 'nav.profile', icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];

const superAdminMenu = [
  {
    path: '/administration',
    text: 'Administration',
    i18nKey: 'nav.administration',
    icon: Shield,
    child: [
      { path: '/admin/content-packs', text: 'Content Management', i18nKey: 'nav.contentManagement', moduleName: 'Content Management', icon: BookOpen, childIcon: BookOpen },
      { path: '/administration/learning-hub-content', text: 'Learning Hub content', i18nKey: 'nav.learningHubContent', icon: BookOpen },
      { path: '/admin/access-codes', text: 'Access Codes', i18nKey: 'nav.accessCodes', moduleName: 'Access Codes', icon: Key, childIcon: Key },
    ],
  },
  { path: '/profile', text: 'Profile', i18nKey: 'nav.profile', icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];

const orgAdminMenu = [
  { path: '/organization', text: 'Organization', i18nKey: 'nav.organization', icon: Building2 },
  {
    path: '/admin/content-packs',
    text: 'Content Management',
    i18nKey: 'nav.contentManagement',
    icon: BookOpen,
    child: [
      { path: '/admin/content-packs', text: 'Content Packs', i18nKey: 'nav.contentPacks', moduleName: 'Content Packs', icon: FolderOpen, childIcon: FolderOpen },
      { path: '/admin/documents', text: 'Documents', i18nKey: 'nav.documents', moduleName: 'Documents', icon: FileText, childIcon: FileText },
      { path: '/admin/documents/upload', text: 'Upload Document', i18nKey: 'nav.uploadDocument', moduleName: 'Upload Document', icon: Upload, childIcon: Upload },
    ],
  },
  { path: '/administration/learning-hub-content', text: 'Learning Hub content', i18nKey: 'nav.learningHubContent', icon: BookOpen },
  { path: '/profile', text: 'Profile', i18nKey: 'nav.profile', icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];

const schoolAdminMenu = [
  { path: '/school', text: 'School', i18nKey: 'nav.school', icon: School },
  {
    path: '/admin/content-packs',
    text: 'Content Management',
    i18nKey: 'nav.contentManagement',
    icon: BookOpen,
    child: [
      { path: '/admin/content-packs', text: 'Content Packs', i18nKey: 'nav.contentPacks', moduleName: 'Content Packs', icon: FolderOpen, childIcon: FolderOpen },
      { path: '/admin/documents', text: 'Documents', i18nKey: 'nav.documents', moduleName: 'Documents', icon: FileText, childIcon: FileText },
      { path: '/admin/documents/upload', text: 'Upload Document', i18nKey: 'nav.uploadDocument', moduleName: 'Upload Document', icon: Upload, childIcon: Upload },
    ],
  },
  { path: '/profile', text: 'Profile', i18nKey: 'nav.profile', icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];

const studentMenu = [
  // ── AI Suite (primary section) ──────────────────────────────────────
  { path: '/student/dashboard', text: 'AI Copilot', i18nKey: 'nav.student.copilot', icon: Bot },
  { path: '/student/study-plan', text: 'Study Plan', i18nKey: 'nav.student.studyPlan', icon: CalendarDays },
  {
    path: '/student/tutors',
    text: 'AI Tutors',
    i18nKey: 'nav.student.tutors',
    icon: GraduationCap,
    child: [
      { path: '/student/tutors', text: 'All Tutors', i18nKey: 'nav.student.allTutors', icon: GraduationCap, childIcon: GraduationCap },
      { path: '/student/doubt-solver', text: 'Doubt Solver', i18nKey: 'nav.student.doubtSolver', icon: Lightbulb, childIcon: Lightbulb },
    ],
  },
  { path: '/student/pixgen', text: 'AI Image Studio', i18nKey: 'nav.student.pixgen', icon: Palette },
  { path: '/student/youtube-quiz', text: 'YouTube Quiz', i18nKey: 'nav.student.ytQuiz', icon: Youtube },
  { path: '/student/templates', text: 'Templates', i18nKey: 'nav.student.templates', icon: FileText },

  // ── Academics ───────────────────────────────────────────────────────
  { path: '/student/assignments', text: 'Assignments', i18nKey: 'nav.student.assignments', icon: ClipboardList },
  { path: '/student/quizzes', text: 'Quizzes', i18nKey: 'nav.student.quizzes', icon: ListChecks },
  { path: '/student/exams', text: 'Exams', i18nKey: 'nav.student.exams', icon: Award },
  { path: '/student/content', text: 'Study Materials', i18nKey: 'nav.student.content', icon: BookOpen },
  { path: '/student/timetable', text: 'Timetable', i18nKey: 'nav.student.timetable', icon: CalendarDays },

  // ── Study Tools ─────────────────────────────────────────────────────
  { path: '/student/notes', text: 'Notes', i18nKey: 'nav.student.notes', icon: PenLine },
  { path: '/student/tasks', text: 'My Tasks', i18nKey: 'nav.student.tasks', icon: CheckSquare },
  { path: '/student/subjects', text: 'Study Rooms', i18nKey: 'nav.student.subjects', icon: FlaskConical },
  { path: '/student/study-time', text: 'Study Tracker', i18nKey: 'nav.student.studyTime', icon: Timer },
  { path: '/student/grade-calculator', text: 'Grade Calculator', i18nKey: 'nav.student.gradeCalc', icon: Calculator },

  // ── Teacher & Progress ───────────────────────────────────────────────
  {
    path: '/student/teachers',
    text: 'Teachers',
    i18nKey: 'nav.student.teachers',
    icon: MessageSquare,
    child: [
      { path: '/student/teachers', text: 'My Teachers', i18nKey: 'nav.student.myTeachers', icon: GraduationCap, childIcon: GraduationCap },
      { path: '/student/doubts', text: 'My Doubts', i18nKey: 'nav.student.doubts', icon: MessageSquare, childIcon: MessageSquare },
    ],
  },
  { path: '/student/progress', text: 'My Progress', i18nKey: 'nav.student.progress', icon: TrendingUp },

  // ── Account ─────────────────────────────────────────────────────────
  { path: '/profile', text: 'Profile', i18nKey: 'nav.profile', icon: User },
  { path: '/settings', text: 'Settings', i18nKey: 'nav.settings', icon: Settings },
];

const parentMenu = [
  { path: '/parent', text: 'Parent', icon: Users },
];

export const sideMenuRoutes = (role) => {
  switch (role) {
    case 'super_admin':
      return superAdminMenu;
    case 'org_admin':
      return orgAdminMenu;
    case 'school_admin':
      return schoolAdminMenu;
    case 'teacher':
      return teacherMenu;
    case 'student':
      return studentMenu;
    case 'parent':
      return parentMenu;
    default:
      return [];
  }
};
