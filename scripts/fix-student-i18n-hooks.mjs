import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studentRoot = path.join(__dirname, '..', 'src', 'panels', 'student');

/** @type {Array<[string, string]>} */
const subtitleReplacements = [
  ['Weekly view (demo data).', "{t('studentPanel.timetable.subtitle')}"],
  ['Messages + doubt tickets (demo).', "{t('studentPanel.teachers.subtitle')}"],
  ['Tickets raised to teachers (demo).', "{t('studentPanel.teachers.doubts.subtitle')}"],
  ['Scoped Phase 1: static resources + notes shortcut.', "{t('studentPanel.studyRoom.detail.subtitle')}"],
  ['Resources (demo)', "{t('studentPanel.studyRoom.detail.resources.title')}"],
  ['Recent notes', "{t('studentPanel.studyRoom.detail.recentNotes')}"],
  ['No notes yet.', "{t('studentPanel.notes.empty')}"],
  ['Resources • notes • quick practice', "{t('studentPanel.studyRoom.cardSubtitle')}"],
  ['Timer + weekly summary (Phase 1 demo).', "{t('studentPanel.studyTime.subtitle')}"],
  ['No sessions yet.', "{t('studentPanel.studyTime.empty')}"],
  ['Answer the questions and submit.', "{t('studentPanel.youtubeQuiz.take.subtitle')}"],
  ['Demo scoring summary.', "{t('studentPanel.youtubeQuiz.results.subtitle')}"],
  ['No results found for this quiz.', "{t('studentPanel.youtubeQuiz.results.empty')}"],
  ['Fill inputs → generate a demo draft.', "{t('studentPanel.templates.runner.subtitle')}"],
  ['Paste a YouTube URL → generate a quiz (demo).', "{t('studentPanel.youtubeQuiz.subtitle')}"],
  ['Fast AI starters for common student tasks.', "{t('studentPanel.templates.subtitle')}"],
  ['Generate your first image.', "{t('studentPanel.pixGen.emptyCanvas')}"],
  ['No images yet.', "{t('studentPanel.pixGen.history.empty')}"],
  ['Demo note detail', "{t('studentPanel.notes.detail.subtitle')}"],
  ['Saved locally for Phase 1 demo.', "{t('studentPanel.notes.editor.subtitle')}"],
  ['Create notes and attach AI summaries later (demo).', "{t('studentPanel.notes.subtitle')}"],
  ['Demo scoring + AI review.', "{t('studentPanel.quiz.results.subtitle')}"],
  ['No results found.', "{t('studentPanel.quiz.results.empty')}"],
  ['Take a quiz with timer and AI hint (demo).', "{t('studentPanel.quiz.subtitle')}"],
  ['Summary across subjects (demo).', "{t('studentPanel.progress.subtitle')}"],
  ['Demo edit flow.', "{t('studentPanel.tasks.edit.subtitle')}"],
  ['Personal productivity tasks (Phase 1 local demo).', "{t('studentPanel.tasks.subtitle')}"],
  ['Saved locally for Phase 1 demo.', "{t('studentPanel.tasks.create.subtitle')}"],
  ['What score do you need on the final to hit your target?', "{t('studentPanel.gradeCalculator.subtitle')}"],
  ['Prepare, take, and reflect (demo scaffolding).', "{t('studentPanel.exam.subtitle')}"],
  ['Checklist + countdown (demo).', "{t('studentPanel.exam.preparePage.subtitle')}"],
  ['Private notes saved to localStorage (demo).', "{t('studentPanel.exam.reflectPage.subtitle')}"],
  ['Step-by-step solution + practice (demo).', "{t('studentPanel.doubtSolver.subtitle')}"],
  ['No practice problems for this demo input.', "{t('studentPanel.doubtSolver.session.practice.empty')}"],
  ['Teacher resources + worksheet viewer (demo).', "{t('studentPanel.content.subtitle')}"],
  ['Read-only viewer + AI summary (demo).', "{t('studentPanel.content.worksheet.subtitle')}"],
  ['Select an item to view.', "{t('studentPanel.content.subject.subtitle')}"],
  ['No items.', "{t('studentPanel.content.subject.empty')}"],
  ['Demo submission flow.', "{t('studentPanel.assignments.submit.subtitle')}"],
  ['Pick a tutor for a domain-specific style.', "{t('studentPanel.tutors.subtitle')}"],
  ['Domain style chat (demo).', "{t('studentPanel.tutors.chat.subtitle')}"],
  ['A workspace per subject (scoped Phase 1 demo).', "{t('studentPanel.studyRoom.subtitle')}"],
  ['Send a message', "{t('studentPanel.teachers.detail.sendMessage')}"],
  ['Your question / problem', "{t('studentPanel.doubtSolver.fields.question')}"],
  ['Your submission', "{t('studentPanel.assignments.submit.label')}"],
  ['Current grade (%)', "{t('studentPanel.gradeCalculator.fields.currentGrade')}"],
  ['Target grade (%)', "{t('studentPanel.gradeCalculator.fields.targetGrade')}"],
  ['Current weight (%)', "{t('studentPanel.gradeCalculator.fields.currentWeight')}"],
  ['Final weight is 100 − currentWeight.', "{t('studentPanel.gradeCalculator.fields.weightHint')}"],
  ['Name', "{t('studentPanel.onboarding.fields.name')}"],
  ['Grade / Level', "{t('studentPanel.onboarding.fields.gradeLevel')}"],
  ['Timezone', "{t('studentPanel.onboarding.fields.timezone')}"],
  ['Classes', "{t('studentPanel.onboarding.fields.classes')}"],
  ['Goals', "{t('studentPanel.onboarding.fields.goals')}"],
  ['Demo assignment detail page. In Phase 2, this content will come from the backend.', "{t('studentPanel.assignments.detail.instructionsDemo')}"],
  ['Suggested starting point:', "{t('studentPanel.common.suggestedStartingPoint')}"],
  ['No AI output yet.', "{t('studentPanel.assignments.detail.aiHelp.noOutput')}"],
  ['Open to see a demo AI explanation (streaming).', "{t('studentPanel.assignments.detail.aiHelp.openHint')}"],
  ['File upload placeholder (Phase 2).', "{t('studentPanel.assignments.submit.fileUploadPlaceholder')}"],
  ['Detail view (demo).', "{t('studentPanel.progress.subject.subtitle')}"],
  ['Score history (placeholder)', "{t('studentPanel.progress.subject.scoreHistory')}"],
  ['Phase 2: charts + AI analysis card.', "{t('studentPanel.progress.subject.scoreHistoryPlaceholder')}"],
  ['Recommendations (placeholder)', "{t('studentPanel.progress.subject.recommendations')}"],
  ['Tip: Use AI Copilot to generate targeted practice based on recent mistakes.', "{t('studentPanel.progress.subject.recommendationsTip')}"],
  ['Run the AI review to see feedback.', "{t('studentPanel.quiz.results.review.empty')}"],
  ['Auto-submitted when timer ended.', "{t('studentPanel.quiz.results.autoSubmitted')}"],
  ['Run summarise to see output.', "{t('studentPanel.content.worksheet.summary.empty')}"],
  ['Run a template to see output.', "{t('studentPanel.templates.runner.outputEmpty')}"],
  ['Demo worksheet content.', "{t('studentPanel.content.worksheet.contentDemo')}"],
  ['1) Solve problems A–D.', "{t('studentPanel.content.worksheet.step1')}"],
  ['2) Show your working.', "{t('studentPanel.content.worksheet.step2')}"],
  ['3) Submit by the due date.', "{t('studentPanel.content.worksheet.step3')}"],
  ['Key formulas / definitions', "{t('studentPanel.studyRoom.detail.resources.formulas')}"],
  ['Practice set starter', "{t('studentPanel.studyRoom.detail.resources.practice')}"],
  ['AI: ask questions in Copilot or Tutors', "{t('studentPanel.studyRoom.detail.resources.aiHint')}"],
  ['Review weak topics', "{t('studentPanel.exam.preparePage.checklist.review')}"],
  ['Do 10 practice questions', "{t('studentPanel.exam.preparePage.checklist.practice')}"],
  ['Sleep + plan your time', "{t('studentPanel.exam.preparePage.checklist.sleep')}"],
  ['Phase 1 demo: exam-taking UI is scaffolded. In Phase 2 this will include sections, timers, and answer review rules.', "{t('studentPanel.exam.takePage.placeholder')}"],
  ['What went well? What will you improve next time?', "{t('studentPanel.exam.reflectPage.placeholder')}"],
  ['Sessions under 10s are ignored (to avoid accidental saves).', "{t('studentPanel.studyTime.minDurationHint')}"],
  ['AI Suggestions (demo)', "{t('studentPanel.tasks.suggestions.title')}"],
  ['Review weak quiz topics', "{t('studentPanel.tasks.suggestions.reviewQuiz')}"],
  ['Create flashcards for photosynthesis', "{t('studentPanel.tasks.suggestions.flashcards')}"],
  ['Tomorrow', "{t('studentPanel.tasks.suggestions.dueTomorrow')}"],
  ['This week', "{t('studentPanel.tasks.suggestions.dueThisWeek')}"],
  ['Mark completed', "{t('studentPanel.tasks.detail.markCompleted')}"],
  ['Mark as open', "{t('studentPanel.tasks.detail.markOpen')}"],
  ['No notes yet. Create one to get started.', "{t('studentPanel.notes.empty')}"],
  ['Failed to solve', "{t('studentPanel.doubtSolver.session.failed')}"],
  ['Failed to load AI help.', "{t('studentPanel.assignments.detail.aiHelp.failed', { message: '' }).replace(' ', '')}"],
];

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.jsx')) out.push(p);
  }
  return out;
}

for (const fp of walk(studentRoot)) {
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  if (content.includes('useTranslation') && !content.includes('const { t } = useTranslation()')) {
    const patterns = [
      /(const \w+ = \(\) => \{\n)/,
      /(const \w+ = \(\{[^}]*\}\) => \{\n)/,
      /(export default function \w+\([^)]*\) \{\n)/,
    ];
    for (const pat of patterns) {
      if (pat.test(content)) {
        content = content.replace(pat, `$1  const { t } = useTranslation();\n`);
        changed = true;
        break;
      }
    }
  }

  for (const [from, to] of subtitleReplacements) {
    const patterns = [
      `>${from}<`,
      `>${from}</p>`,
      `">${from}"`,
      `">${from}</span>`,
    ];
    for (const p of patterns) {
      if (content.includes(p)) {
        if (p.startsWith('>')) {
          content = content.replaceAll(p, `>{${to}}${p.endsWith('</p>') ? '</p>' : p.endsWith('</span>') ? '</span>' : '<'}`);
        } else {
          content = content.replaceAll(from, to);
        }
        changed = true;
      }
    }
    // plain text in JSX children
    content = content.replace(new RegExp(`>\\s*${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g'), `>{${to}}<`);
  }

  // dynamic headings
  content = content.replace(
    /<h1[^>]*>Progress: \{subjectId\}<\/h1>/,
    "<h1 className=\"text-lg font-semibold text-gray-900 dark:text-gray-100\">{t('studentPanel.common.progressSubject', { subjectId })}</h1>"
  );
  content = content.replace(
    /<h1[^>]*>Materials: \{subjectId\}<\/h1>/,
    "<h1 className=\"text-lg font-semibold text-gray-900 dark:text-gray-100\">{t('studentPanel.common.materialsSubject', { subjectId })}</h1>"
  );
  content = content.replace(
    /<h1[^>]*>Worksheet \{id\}<\/h1>/,
    "<h1 className=\"text-lg font-semibold text-gray-900 dark:text-gray-100\">{t('studentPanel.common.worksheetTitle', { id })}</h1>"
  );
  content = content.replace(
    /<h2[^>]*>Prepare for exam \{id\}<\/h2>/,
    "<h2 className=\"font-semibold text-gray-900 dark:text-gray-100\">{t('studentPanel.common.prepareHeading', { id })}</h2>"
  );
  content = content.replace(
    /<h2[^>]*>Reflection for exam \{id\}<\/h2>/,
    "<h2 className=\"font-semibold text-gray-900 dark:text-gray-100\">{t('studentPanel.common.reflectionHeading', { id })}</h2>"
  );
  content = content.replace(
    /Exam \{id\} \(demo placeholder\)\./,
    "{t('studentPanel.exam.takePage.subtitle', { id })}"
  );
  content = content.replace(
    /Starts: \{new Date\(e\.startsAt\)\.toLocaleString\(\)\}/,
    "{t('studentPanel.common.startsAt', { date: new Date(e.startsAt).toLocaleString() })}"
  );
  content = content.replace(
    /Timer: \{formatTime\(state\.remainingSec\)\}/,
    "{t('studentPanel.quiz.take.timer', { time: formatTime(state.remainingSec) })}"
  );
  content = content.replace(
    /Quiz avg: \{s\.quizAvg\}%/,
    "{t('studentPanel.common.quizAvg', { pct: s.quizAvg })}"
  );
  content = content.replace(
    /Assignments: \{s\.done\}\/\{s\.total\}/,
    "{t('studentPanel.common.assignmentsCount', { done: s.done, total: s.total })}"
  );
  content = content.replace(
    /School-safe demo generation • \{count\} images/,
    "{t('studentPanel.common.imagesCount', { count })}"
  );
  content = content.replace(
    /Prompt: \{latest\.prompt\}/,
    "{t('studentPanel.common.promptLabel', { prompt: latest.prompt })}"
  );
  content = content.replace(
    /Status: \{doubt\.status\}/,
    "{t('studentPanel.common.status', { status: doubt.status })}"
  );
  content = content.replace(
    /`Failed to load AI help\. \$\{e\?\.message \|\| ''\}`\.trim\(\)/,
    "t('studentPanel.assignments.detail.aiHelp.failed', { message: e?.message || '' }).trim()"
  );
  content = content.replace(
    /`Failed to explain mistakes\. \$\{[^}]+\}`/,
    "t('studentPanel.quiz.results.review.failed', { message: e?.message || '' })"
  );
  content = content.replace(
    /`Failed to summarise\. \$\{[^}]+\}`/,
    "t('studentPanel.content.worksheet.summary.failed', { message: e?.message || '' })"
  );
  content = content.replace(
    /\{count\} blocks this week • demo AI regeneration/,
    "{t('studentPanel.common.blocksThisWeek', { count: flatCount })}"
  );
  content = content.replace(
    /\{q\.questions\.length\} questions • \{q\.minutes\} min/,
    "{t('studentPanel.common.questionsMeta', { count: q.questions.length, min: q.minutes })}"
  );
  content = content.replace(
    /\{items\.length\} items/,
    "{t('studentPanel.common.itemsCount', { count: items.length })}"
  );

  if (changed || content !== fs.readFileSync(fp, 'utf8')) {
    fs.writeFileSync(fp, content);
    console.log('Fixed', path.relative(studentRoot, fp));
  }
}

// Fix StudentStub
const stubPath = path.join(studentRoot, '_shared', 'StudentStub.jsx');
fs.writeFileSync(
  stubPath,
  `import { useTranslation } from 'react-i18next';
import { ComingSoon } from '../../../components/shared/ComingSoon';

const StudentStub = ({ name }) => {
  const { t } = useTranslation();
  const displayName = name ?? t('studentPanel.stub.defaultName');
  return (
    <div className="min-h-screen w-full">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{displayName}</h1>
      </div>
      <ComingSoon />
    </div>
  );
};

export default StudentStub;
`
);

console.log('Hook/subtitle fix complete');
