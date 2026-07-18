#!/usr/bin/env node
/**
 * Add missing t() keys to en-US.json with English defaults.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const enPath = path.join(__dirname, '../src/locales/en-US.json')

const VALUES = {
  'analyticsPage.tooltipItems': '{{count}} items',
  'api.error.badGatewayDevHint': 'The API may be down or misconfigured. Check VITE_API_BASE_URL and that the backend is running.',
  'api.error.badGatewayProdHint': 'The service is temporarily unavailable. Please try again later.',
  'api.error.cancelled': 'Request was cancelled.',
  'api.error.connection': 'Connection error. Please check your network.',
  'api.error.historyLimitReached': 'History limit reached.',
  'api.error.insufficientCredits': 'Insufficient credits for this action.',
  'api.error.network': 'Network error. Please try again.',
  'api.error.notFound': 'Not found.',
  'api.error.notFoundDetail': 'The requested resource was not found.',
  'api.error.requestFailed': 'Request failed.',
  'api.error.requestFailedAfterRefresh': 'Request failed after refreshing your session.',
  'api.error.timeout': 'Request timed out. Please try again.',
  'api.snackbar.historyEvicted': 'Older history entries were removed to stay within limits.',
  'api.snackbar.historyLimitPinned': 'History limit reached. Pin important items to keep them.',
  'api.snackbar.historyWarning': 'You are approaching your history limit.',
  'common.all': 'All',
  'common.back': 'Back',
  'common.comingSoon': 'Coming soon',
  'common.comingSoonHint': 'This feature is not available yet.',
  'common.noDataFound': 'No data found',
  'common.noDataFoundHint': 'Try adjusting your filters or search.',
  'common.retry': 'Try again',
  'common.showLess': 'Show less',
  'common.showMore': 'Show more',
  'dashboard.activeContent': 'Active content',
  'dashboard.all': 'All',
  'dashboard.continueDraft': 'Continue draft',
  'dashboard.coreWorkflows': 'Core workflows',
  'dashboard.createFirstQuiz': 'Create your first quiz to get started.',
  'dashboard.createFirstQuizCta': 'Create quiz',
  'dashboard.dayStreak': '{{count}} day streak',
  'dashboard.defaultName': 'there',
  'dashboard.draftBacklog': 'Draft backlog',
  'dashboard.draftsToFinish': 'Drafts to finish',
  'dashboard.dueInDays': 'Due in {{days}} days',
  'dashboard.dueSoon': 'Due soon',
  'dashboard.dueToday': 'Due today',
  'dashboard.noActivity': 'No recent activity',
  'dashboard.noDeadlines': 'No upcoming deadlines',
  'dashboard.noDrafts': 'No drafts',
  'dashboard.published': 'Published',
  'dashboard.recentActivity': 'Recent activity',
  'dashboard.teacherToolsOverview': 'Teacher Tools overview',
  'dashboard.thisWeek': 'This week',
  'dashboard.tools.assignment': 'Assignment',
  'dashboard.tools.exam': 'Exam',
  'dashboard.tools.quiz': 'Quiz',
  'dashboard.tools.worksheet': 'Worksheet',
  'dashboard.totalContent': 'Total content',
  'dashboard.upcomingDeadlines': 'Upcoming deadlines',
  'dashboard.viewAll': 'View all',
  'dashboard.workspaceReady': 'Your workspace is ready.',
  'exploreUseCases.publishedCount': '{{count}} published',
  'filter.clear': 'Clear filters',
  'filter.label': 'Filter',
  'forgotPassword.backToLogin': 'Back to sign in',
  'forgotPassword.emailLabel': 'Email address',
  'forgotPassword.emailPlaceholder': 'you@example.com',
  'forgotPassword.submit': 'Send reset link',
  'forgotPassword.submitting': 'Sending…',
  'forgotPassword.subtitle': "Enter your email and we'll send you a reset link.",
  'forgotPassword.successMessage': 'We sent a reset link to {{email}}.',
  'forgotPassword.successTitle': 'Check your email',
  'forgotPassword.title': 'Reset your password',
  'history.delete': 'Delete',
  'history.duplicate': 'Duplicate',
  'history.title': 'History',
  'historyPage.detail.usedTimes': 'Used {{count}} times',
  'languageDropdown.count_one': '{{count}} language',
  'languageDropdown.count_other': '{{count}} languages',
  'layout.allCaughtUp': "You're all caught up",
  'layout.noNewNotifications': 'No new notifications',
  'layout.noNotificationsYet': 'No notifications yet',
  'layout.notificationsEmptyHint': 'When you have updates, they will appear here.',
  'login.emailLabel': 'Email address',
  'login.emailPlaceholder': 'you@example.com',
  'login.error': 'Failed to sign in. Please check your credentials.',
  'login.forgotPassword': 'Forgot password?',
  'login.noAccount': "Don't have an account?",
  'login.passwordLabel': 'Password',
  'login.rememberMe': 'Remember me',
  'login.signIn': 'Sign in',
  'login.signUpLink': 'Sign up',
  'login.signingIn': 'Signing in…',
  'login.subtitle': 'Sign in to your account',
  'modal.cancel': 'Cancel',
  'modal.close': 'Close',
  'modal.confirm': 'Confirm',
  'modal.delete': 'Delete',
  'nav.accessCodes': 'Access Codes',
  'nav.contentPacks': 'Content Packs',
  'nav.documents': 'Documents',
  'nav.learningHubContent': 'Learning Hub Content',
  'nav.organization': 'Organization',
  'nav.parent': 'Parent',
  'nav.school': 'School',
  'nav.uploadDocument': 'Upload Document',
  'password.requirements.minLength': 'At least 10 characters',
  'password.requirements.number': 'At least one number',
  'password.requirements.specialChar': 'At least one special character',
  'password.requirements.title': 'Password requirements',
  'password.requirements.uppercase': 'At least one uppercase letter',
  'profile.savedSuccess': 'Profile updated successfully.',
  'snackbar.documents.uploadFailed': 'Failed to upload document.',
  'snackbar.documents.uploadSuccess': 'Document uploaded successfully.',
  'snackbar.forgotPassword.error': 'Failed to send reset email. Please try again.',
  'snackbar.forgotPassword.success': 'Reset link sent. Check your email.',
  'snackbar.genericError': 'Something went wrong. Please try again.',
  'snackbar.resetPassword.error': 'Failed to reset password. Please try again.',
  'snackbar.resetPassword.invalidToken': 'Invalid or expired reset link.',
  'snackbar.resetPassword.success': 'Password reset successfully.',
  'snackbar.signup.emailExists': 'An account with this email already exists.',
  'snackbar.signup.success': 'Account created. Please sign in.',
  'snackbar.subscription.loadFailed': 'Failed to load subscription details.',
  'snackbar.verifyEmail.emailRequired': 'Email is required.',
  'snackbar.verifyEmail.resendError': 'Failed to resend verification email.',
  'snackbar.verifyEmail.resendSuccess': 'Verification email sent.',
  'snackbar.verifyEmail.success': 'Email verified successfully.',
  'student.badge.aiDefault': 'AI',
  'student.badge.statusDefault': 'Active',
  'table.columns': 'Columns',
  'table.of': 'of',
  'table.resetAll': 'Reset all',
  'table.rowsPerPage': 'Rows per page',
  'table.selected': '{{count}} selected',
  'tenantSelection.loginFailed': 'Sign in failed. Please try again.',
  'tenantSelection.scope.institution': 'Institution',
  'tenantSelection.scope.organization': 'Organization',
  'tenantSelection.scope.personalWorkspace': 'Personal Workspace',
  'tenantSelection.selectFailed': 'Could not select workspace. Please try again.',
  'tenantSelection.signingIn': 'Signing in…',
  'tenantSelection.subtitle': 'Choose a workspace to continue',
  'tenantSelection.title': 'Select workspace',
  'tenantSelection.workspace': 'Workspace',
  'workspace.scopeType.personal': 'Personal',
  'settings.notifications.title': 'Notifications',
  'settings.notifications.productUpdates': 'Product updates',
  'settings.notifications.lessonReminders': 'Lesson reminders',
  'settings.notifications.weeklyInsights': 'Weekly insights',
  'settings.notifications.channels.emailAndApp': 'Email and app',
  'settings.notifications.channels.emailOnly': 'Email only',
  'settings.notifications.channels.appOnly': 'App only',
  'status.draft': 'Draft',
  'status.published': 'Published',
  'status.active': 'Active',
  'status.closed': 'Closed',
  'status.graded': 'Graded',
  'status.submitted': 'Submitted',
  'status.pending': 'Pending',
  'status.archived': 'Archived',
  'errors.network': 'Network error. Please check your connection and try again.',
  'errors.unauthorized': 'Your session has expired. Please sign in again.',
  'errors.forbidden': "You don't have permission to perform this action.",
  'errors.notFound': 'The requested resource was not found.',
  'errors.server': 'Something went wrong. Please try again later.',
  'errors.timeout': 'Request timed out. Please try again.',
  'table.noData': 'No data available',
  'table.loading': 'Loading…',
  'table.page': 'Page',
  'table.selectAll': 'Select all',
  'table.actions': 'Actions',
  'modal.confirmDelete': 'Are you sure you want to delete this?',
  'modal.confirmDeleteHint': 'This action cannot be undone.',
}

function setNested(obj, keyPath, value) {
  const parts = keyPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (cur[p] === undefined || typeof cur[p] !== 'object') cur[p] = {}
    cur = cur[p]
  }
  cur[parts[parts.length - 1]] = value
}

function humanize(key) {
  const last = key.split('.').pop() ?? key
  return last.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim()
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
let added = 0
for (const [key, value] of Object.entries(VALUES)) {
  setNested(en, key, value)
  added++
}

// Also run missing-keys detection and humanize any remaining
import { spawnSync } from 'child_process'
const missingScript = path.join(__dirname, 'i18n-missing-keys.mjs')
// Re-read after patch - add any still missing via humanize
function flatten(obj, prefix = '') {
  const out = new Set()
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key).forEach((x) => out.add(x))
    } else out.add(key)
  }
  return out
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8')
console.log(`Patched ${added} keys into en-US.json`)
