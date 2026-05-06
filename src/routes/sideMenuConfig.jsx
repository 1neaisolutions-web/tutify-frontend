// Library imports
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Youtube,
  Image,
  BookOpen,
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
  { path: '/student', text: 'Student', icon: GraduationCap },
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
