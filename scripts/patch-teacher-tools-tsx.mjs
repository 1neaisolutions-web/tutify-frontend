/**
 * Patches all teacher-tools .tsx files with useTranslation + t() calls.
 * Run: node scripts/patch-teacher-tools-tsx.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ttRoot = path.join(__dirname, '../src/pages/features/teacher-tools')

function walk(d, acc = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p, acc)
    else if (f.endsWith('.tsx')) acc.push(p)
  }
  return acc
}

function ensureImport(c) {
  if (c.includes("from 'react-i18next'")) return c
  const idx = c.indexOf('import ')
  if (idx === -1) return "import { useTranslation } from 'react-i18next'\n" + c
  const end = c.indexOf('\n', idx)
  return c.slice(0, end + 1) + "import { useTranslation } from 'react-i18next'\n" + c.slice(end + 1)
}

function ensureHook(c) {
  if (c.includes('const { t } = useTranslation()')) return c
  const patterns = [
    /export default function \w+\([^)]*\)\s*\{/,
    /export function \w+\([^)]*\)\s*\{/,
  ]
  for (const pat of patterns) {
    const m = c.match(pat)
    if (m) {
      const pos = c.indexOf(m[0]) + m[0].length
      const nl = c.indexOf('\n', pos)
      const indent = c.slice(nl + 1).match(/^(\s*)/)?.[1] ?? '  '
      return c.slice(0, nl + 1) + `${indent}const { t } = useTranslation()\n` + c.slice(nl + 1)
    }
  }
  return c
}

/** Global replacements applied to every file (order matters — longest first) */
const GLOBAL = [
  ["toast.success('Created an editable copy from the sample library')", "toast.success(t('teacherTools.toastEditableCopy'))"],
  ["toast.error('Could not create a copy')", "toast.error(t('teacherTools.toastCopyFailed'))"],
  ["toast.error('Sample library items cannot be deleted.')", "toast.error(t('teacherTools.toastReadOnlyDelete'))"],
  ["toast.error('Sample items cannot be archived. Duplicate first.')", "toast.error(t('teacherTools.toastReadOnlyArchive'))"],
  ["toast.error('Sample library items cannot be edited.')", "toast.error(t('teacherTools.toastReadOnly'))"],
  ["toast.success('Duplicated selected')", "toast.success(t('teacherTools.toastBulkDuplicated'))"],
  ["toast.error('Could not duplicate')", "toast.error(t('teacherTools.toastDuplicateFailed'))"],
  ["toast.success('PDF downloaded')", "toast.success(t('teacherTools.toastPdfDownloaded'))"],
  ["toast.error('Could not generate PDF')", "toast.error(t('teacherTools.toastPdfFailed'))"],
  ["toast.success('Exemplar loaded — edit or regenerate anytime.')", "toast.success(t('teacherTools.toastExemplarLoaded'))"],
  ["toast.success('Prefilled from template')", "toast.success(t('teacherTools.toastPrefilledTemplate'))"],
  ["toast.error('Fix the highlighted fields to generate.')", "toast.error(t('teacherTools.toastFixFields'))"],
  ["toast.success('Draft saved')", "toast.success(t('teacherTools.toastDraftSaved'))"],
  ["toast.error('Could not save draft')", "toast.error(t('teacherTools.toastDraftFailed'))"],
  ["toast.error('Stats not loaded yet')", "toast.error(t('teacherTools.toastStatsNotLoaded'))"],
  ["toast.success('CSV downloaded')", "toast.success(t('teacherTools.toastCsvDownloaded'))"],
  ["toast.success('Graded')", "toast.success(t('assignment.submissions.toastGraded'))"],
  ["toast.error('Could not delete assignment')", "toast.error(t('assignment.toastDeleteFailed'))"],
  ["toast.error('Assignment not found')", "toast.error(t('assignment.toastNotFound'))"],
  ["toast.error('Could not create assignment.')", "toast.error(t('assignment.toastCreateFailed'))"],
  ["toast.success('Assignment brief generated — review below.')", "toast.success(t('assignment.toastBriefGenerated'))"],
  ["toast.error('Could not generate assignment brief.')", "toast.error(t('assignment.toastGenerateFailed'))"],
  ["toast.success('Brief regenerated.')", "toast.success(t('assignment.toastBriefRegenerated'))"],
  ["toast.error('Could not regenerate brief.')", "toast.error(t('assignment.toastBriefRegenFailed'))"],
  ["toast.success('Topic section regenerated.')", "toast.success(t('assignment.toastTopicRegenerated'))"],
  ["toast.error('Keep at least one line in each topic, or remove the whole topic from build.')", "toast.error(t('assignment.toastKeepOneLine'))"],
  ["toast.success('Line removed')", "toast.success(t('assignment.toastLineRemoved'))"],
  ["toast.success('Line regenerated.')", "toast.success(t('assignment.toastLineRegenerated'))"],
  ["toast.success('Line added.')", "toast.success(t('assignment.toastLineAdded'))"],
  ["toast.success('Topic section added.')", "toast.success(t('assignment.toastTopicAdded'))"],
  ["toast.success('Topic section removed')", "toast.success(t('assignment.toastTopicRemoved'))"],
  ["toast.success('Handout spacing saved. PDF export and print use these settings.')", "toast.success(t('assignment.toastHandoutSaved'))"],
  ["toast.error('Generate your assignment first — exemplar preview is not saved.')", "toast.error(t('teacherTools.toastExemplarNotSaved'))"],
  ["toast.error('Generate a brief before saving a draft.')", "toast.error(t('assignment.toastDraftNeedsBrief'))"],
  ["toast.error('Generate your assignment first — exemplar preview cannot be published.')", "toast.error(t('teacherTools.toastExemplarCannotPublish'))"],
  ["toast.error('Generate a brief before publishing.')", "toast.error(t('assignment.toastPublishNeedsBrief'))"],
  ["toast.error('Sample library items cannot be edited. Duplicate from the list first.')", "toast.error(t('assignment.toastDuplicateFirst'))"],
  ["toast.error('Could not save assignment')", "toast.error(t('assignment.toastSaveFailed'))"],
  ["toast.success('Assignment updated')", "toast.success(t('assignment.publishUpdated'))"],
  ["toast.success('Assignment published')", "toast.success(t('assignment.publishAssignment'))"],
  ["toast.error('Generate the brief first to open review.')", "toast.error(t('assignment.toastReviewNeedsGenerate'))"],
  ["toast.error('Could not archive exam')", "toast.error(t('exam.toastArchiveFailed'))"],
  ["toast.error('Could not delete exam')", "toast.error(t('exam.toastDeleteListFailed'))"],
  ["toast.error('Generate your quiz first — exemplar preview is not saved.')", "toast.error(t('teacherTools.toastExemplarNotSaved'))"],
  ["toast.error('Generate your quiz first — exemplar preview cannot be published.')", "toast.error(t('teacherTools.toastExemplarCannotPublish'))"],
  ["toast.error('Generate questions before opening review.')", "toast.error(t('quiz.toastReviewNeedsGenerate'))"],
  ["toast.error('Generate your worksheet first — exemplar preview is not saved.')", "toast.error(t('teacherTools.toastExemplarNotSaved'))"],
  ["toast.error('Generate your worksheet first — exemplar preview cannot be published.')", "toast.error(t('teacherTools.toastExemplarCannotPublish'))"],
  ["toast.error('No session selected. Close and use \"Add question\" on a session again.')", "toast.error(t('worksheet.toastNoSession'))"],
  ["toast.error('Generate the exam shell first.')", "toast.error(t('exam.toastShellFirstShort'))"],
  ["toast.error('Generate your exam first — exemplar preview is not saved.')", "toast.error(t('teacherTools.toastExemplarNotSaved'))"],
  ["toast.error('Generate the exam first, then save.')", "toast.error(t('exam.toastSaveFirst'))"],
  ["toast.success(isEdit ? 'Exam updated' : 'Exam scheduled')", "toast.success(isEdit ? t('exam.toastUpdated') : t('exam.toastScheduled'))"],
  ["title=\"Leave without saving?\"", "title={t('teacherTools.leaveTitle')}"],
  ["primaryButtonText=\"Leave\"", "primaryButtonText={t('teacherTools.leave')}"],
  ["primaryButtonText=\"Delete\"", "primaryButtonText={t('teacherTools.delete')}"],
  ["primaryButtonText=\"Archive\"", "primaryButtonText={t('teacherTools.archive')}"],
  ["{ label: 'Teacher Tools', to: '/teacher-tools' }", "{ label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' }"],
  ["label: 'Edit',", "label: t('teacherTools.edit'),"],
  ["label: 'Duplicate',", "label: t('teacherTools.duplicate'),"],
  ["label: 'Archive',", "label: t('teacherTools.archive'),"],
  ["label: 'Delete',", "label: t('teacherTools.delete'),"],
  ["aria-label=\"Select all\"", "aria-label={t('teacherTools.ariaSelectAll')}"],
  ["aria-label=\"Actions\"", "aria-label={t('teacherTools.actions')}"],
  ["aria-label=\"Close overlay\"", "aria-label={t('teacherTools.ariaCloseOverlay')}"],
  ["aria-label=\"Close preview\"", "aria-label={t('teacherTools.ariaClosePreview')}"],
  ["aria-label=\"Configure steps\"", "aria-label={t('teacherTools.ariaConfigureSteps')}"],
  ['>Try again<', '>{t(\'teacherTools.tryAgain\')}<'],
  ['>Clear filters<', '>{t(\'teacherTools.clearFilters\')}<'],
  ['>Duplicate selected<', '>{t(\'teacherTools.duplicateSelected\')}<'],
  ["{bulkPending ? 'Working…' : 'Duplicate selected'}", "{bulkPending ? t('teacherTools.working') : t('teacherTools.duplicateSelected')}"],
  ['>Title</th>', '>{t(\'teacherTools.title\')}</th>'],
  ['>Subject</th>', '>{t(\'teacherTools.subject\')}</th>'],
  ['>Grade</th>', '>{t(\'teacherTools.grade\')}</th>'],
  ['>Status</th>', '>{t(\'teacherTools.status\')}</th>'],
  ['>Avg</th>', '>{t(\'teacherTools.avg\')}</th>'],
  ['>Marks</th>', '>{t(\'teacherTools.marks\')}</th>'],
  ['>Qs</th>', '>{t(\'teacherTools.colQs\')}</th>'],
  ['>Actions</th>', '>{t(\'teacherTools.colActions\')}</th>'],
  ['{selectedCount} selected', '{t(\'teacherTools.selectedCount\', { count: selectedCount })}'],
  ['>Clear<', '>{t(\'teacherTools.clear\')}<'],
  ['title="Available in Phase 2"', 'title={t(\'teacherTools.phase2Tooltip\')}'],
  ['title="This workflow is locked until Phase 2."', 'title={t(\'teacherTools.phase2OverlayTitle\')}'],
  ['>Phase 2<', '>{t(\'teacherTools.phase2Badge\')}<'],
]

/** Per-file replacements keyed by relative path with forward slashes */
const PER_FILE = {
  'components/Phase2Lock.tsx': [
    ['>Phase 2<', '>{t(\'teacherTools.phase2Badge\')}<'],
  ],
  'components/TeacherToolsFilterBar.tsx': [
    ['placeholder="Search titles, topics…"', 'placeholder={t(\'teacherTools.searchPlaceholder\')}'],
    ['aria-label="Search titles and topics"', 'aria-label={t(\'teacherTools.ariaSearch\')}'],
    ['>Filters<', '>{t(\'teacherTools.filters\')}<'],
    ['>All subjects<', '>{t(\'teacherTools.allSubjects\')}<'],
    ['>All grades<', '>{t(\'teacherTools.allGrades\')}<'],
    ['>All classes<', '>{t(\'teacherTools.allClasses\')}<'],
    ['title={phase2ClassHint ? \'Roster-scoped class filters connect in Phase 2.\' : undefined}', 'title={phase2ClassHint ? t(\'teacherTools.classPhase2Title\') : undefined}'],
    ['aria-label="Class or group"', 'aria-label={t(\'teacherTools.ariaClass\')}'],
    ['aria-label="Status or activity type"', 'aria-label={t(\'teacherTools.ariaStatus\')}'],
    ['label: \'Any status\'', 'label: t(\'teacherTools.anyStatus\')'],
    ['>From</span>', '>{t(\'teacherTools.dateFrom\')}</span>'],
    ['>To</span>', '>{t(\'teacherTools.dateTo\')}</span>'],
  ],
  'components/TeacherToolsListSyncHint.tsx': [
    ['Sample library.', '{t(\'teacherTools.sampleLibrary\')}'],
    ['Your live {label} could not be loaded from the server. New items will appear here after the API is running with the latest version.', '{t(\'teacherTools.syncHintBody\', { kind: t(`teacherTools.kind${kind.charAt(0).toUpperCase()}${kind.slice(1)}`) })}'],
  ],
  'components/TeacherToolsReviewPublishDock.tsx': [
    ['>Publish<', '>{t(\'teacherTools.publishHeading\')}<'],
    ['>Print<', '>{t(\'teacherTools.print\')}<'],
    ["saveDraftPending ? 'Saving…' : 'Draft'", "saveDraftPending ? t('teacherTools.saving') : t('teacherTools.draft')"],
    ['title="Coming with LMS integration"', 'title={t(\'teacherTools.lmsTitle\')}'],
    ["publishPending ? 'Publishing…' : publishLabel", "publishPending ? t('teacherTools.publishing') : publishLabel"],
  ],
  'components/TeacherToolsReviewHeaderCompact.tsx': [
    ['>Review<', '>{t(\'teacherTools.reviewKicker\')}<'],
    ["title ?? 'Generated question set'", "title ?? t('teacherTools.defaultGeneratedTitle')"],
  ],
  'components/TeacherToolsCreateReviewFooter.tsx': [
    ["label: 'Edit requirements'", "label: t('teacherTools.editRequirements')"],
  ],
  'components/TeacherToolsExemplarReviewBanner.tsx': [
    ['>Exemplar preview<', '>{t(\'teacherTools.exemplarTitle\')}<'],
    ['Sample content only — nothing is saved until you generate or save a draft. Use Edit requirements to return to configure.', '{t(\'teacherTools.exemplarBody\')}'],
  ],
  'quiz/QuizList.tsx': [
    ['title="Quizzes"', 'title={t(\'quiz.title\')}'],
    ['subtitle="Create and manage formative quizzes with scheduling, attempts, and analytics."', 'subtitle={t(\'quiz.listSubtitle\')}'],
    ['{ label: \'Quiz\' }', '{ label: t(\'quiz.breadcrumb\') }'],
    ['> Create Quiz<', '> {t(\'teacherTools.createQuiz\')}<'],
    ['title="Delete quiz?"', 'title={t(\'quiz.deleteTitle\')}'],
    ['title="Archive quiz?"', 'title={t(\'quiz.archiveTitle\')}'],
    ['>No quizzes to show<', '>{t(\'quiz.listErrorTitle\')}<'],
    ['No quizzes match your filters.', '{t(\'quiz.emptyFilters\')}'],
    ['Create a quiz', '{t(\'quiz.createLink\')}'],
    ["toast.success('Quiz deleted')", "toast.success(t('quiz.toastDeleted'))"],
    ["toast.error('Could not delete quiz')", "toast.error(t('quiz.toastDeleteFailed'))"],
    ["toast.success('Quiz duplicated')", "toast.success(t('quiz.toastDuplicated'))"],
    ["toast.success('Quiz archived')", "toast.success(t('quiz.toastArchived'))"],
    ['{tabs.map((t) => (', '{tabs.map((tabItem) => ('],
    ['key={t}', 'key={tabItem}'],
    ['tab === t', 'tab === tabItem'],
    ['setTab(t)', 'setTab(tabItem)'],
    ['{t}', "{t({ All: 'teacherTools.tabAll', Draft: 'teacherTools.tabDraft', Published: 'teacherTools.tabPublished', Scheduled: 'teacherTools.tabScheduled', Archived: 'teacherTools.tabArchived' }[tabItem])}"],
  ],
  'assignment/AssignmentList.tsx': [
    ['title="Assignments"', 'title={t(\'assignment.title\')}'],
    ['subtitle="Essays, projects, and files with rubrics, late policies, and grading workflows."', 'subtitle={t(\'assignment.listSubtitle\')}'],
    ['{ label: \'Assignment\' }', '{ label: t(\'assignment.breadcrumb\') }'],
    ['title="Delete assignment?"', 'title={t(\'assignment.deleteTitle\')}'],
    ['title="Archive assignment?"', 'title={t(\'assignment.archiveTitle\')}'],
    ["toast.success('Assignment deleted')", "toast.success(t('assignment.toastDeleted'))"],
    ["toast.success('Assignment duplicated')", "toast.success(t('assignment.toastDuplicated'))"],
    ["toast.success('Assignment archived')", "toast.success(t('assignment.toastArchived'))"],
  ],
  'worksheet/WorksheetList.tsx': [
    ['title="Worksheets"', 'title={t(\'worksheet.title\')}'],
    ['subtitle="Printable packs and interactive practice with topic-aware blocks."', 'subtitle={t(\'worksheet.listSubtitle\')}'],
    ['{ label: \'Worksheet\' }', '{ label: t(\'worksheet.breadcrumb\') }'],
    ['title="Delete worksheet?"', 'title={t(\'worksheet.deleteTitle\')}'],
    ['title="Archive worksheet?"', 'title={t(\'worksheet.archiveTitle\')}'],
    ["toast.success('Worksheet deleted')", "toast.success(t('worksheet.toastDeleted'))"],
    ["toast.error('Could not delete worksheet')", "toast.error(t('worksheet.toastDeleteFailed'))"],
    ["toast.success('Worksheet duplicated')", "toast.success(t('worksheet.toastDuplicated'))"],
    ["toast.success('Worksheet archived')", "toast.success(t('worksheet.toastArchived'))"],
    ["toast.error('Could not archive worksheet')", "toast.error(t('worksheet.toastArchiveFailed'))"],
    ["toast.error('Bulk duplicate failed')", "toast.error(t('worksheet.toastBulkDuplicateFailed'))"],
  ],
  'exams/ExamList.tsx': [
    ['title="Exams"', 'title={t(\'exam.title\')}'],
    ['subtitle="Formal assessments with sections, integrity controls, and results publishing."', 'subtitle={t(\'exam.listSubtitle\')}'],
    ['{ label: \'Exams\' }', '{ label: t(\'exam.breadcrumb\') }'],
    ['title="Delete exam?"', 'title={t(\'exam.deleteTitle\')}'],
    ['title="Archive exam?"', 'title={t(\'exam.archiveTitle\')}'],
    ["toast.success('Exam deleted')", "toast.success(t('exam.toastDeleted'))"],
    ["toast.success('Exam duplicated')", "toast.success(t('exam.toastDuplicated'))"],
    ["toast.success('Exam archived')", "toast.success(t('exam.toastArchived'))"],
  ],
}

let modified = 0
const skip = new Set(['TeacherToolsStatusBadge.tsx', 'TeacherToolsDemoProvider.tsx'])

for (const fp of walk(ttRoot)) {
  const base = path.basename(fp)
  if (skip.has(base)) continue
  const rel = path.relative(ttRoot, fp).split(path.sep).join('/')
  let c = fs.readFileSync(fp, 'utf8')
  const orig = c

  const reps = [...GLOBAL, ...(PER_FILE[rel] || [])]
  for (const [from, to] of reps) {
    if (c.includes(from)) c = c.split(from).join(to)
  }

  // Add i18n if file had string replacements or contains user-visible English in JSX
  const hasStrings = c !== orig || /(?:>|toast\.(?:success|error)\()['"][\w][^'"]{2,}['"]/.test(orig)
  if (hasStrings || PER_FILE[rel]) {
    c = ensureImport(c)
    c = ensureHook(c)
  }

  if (c !== orig) {
    fs.writeFileSync(fp, c)
    modified++
    console.log('Patched', rel)
  }
}

console.log('Total modified:', modified)
