import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studentRoot = path.join(__dirname, '..', 'src', 'panels', 'student');

/** @type {Array<[string, string]>} */
const replacements = [
  // common UI
  ['>Back<', '>{t(\'studentPanel.common.back\')}<'],
  ['>Cancel<', '>{t(\'studentPanel.common.cancel\')}<'],
  ['>Save<', '>{t(\'studentPanel.common.save\')}<'],
  ['>Delete<', '>{t(\'studentPanel.common.delete\')}<'],
  ['>Submit<', '>{t(\'studentPanel.common.submit\')}<'],
  ['>Edit<', '>{t(\'studentPanel.common.edit\')}<'],
  ['>Exit<', '>{t(\'studentPanel.common.exit\')}<'],
  ['>Done<', '>{t(\'studentPanel.common.done\')}<'],
  ['>Open<', '>{t(\'studentPanel.common.open\')}<'],
  ['>Hide<', '>{t(\'studentPanel.common.hide\')}<'],
  ['>Stop<', '>{t(\'studentPanel.common.stop\')}<'],
  ['>Send<', '>{t(\'studentPanel.common.send\')}<'],
  ['>Close<', '>{t(\'studentPanel.common.close\')}<'],
  ['>Generate<', '>{t(\'studentPanel.common.generate\')}<'],
  ['>Regenerate<', '>{t(\'studentPanel.common.regenerate\')}<'],
  ['>Generating…<', '>{t(\'studentPanel.common.generating\')}<'],
  ['>Thinking…<', '>{t(\'studentPanel.common.thinking\')}<'],
  ['>Solving…<', '>{t(\'studentPanel.common.solving\')}<'],
  ['>Summarising…<', '>{t(\'studentPanel.common.summarising\')}<'],
  ['>Explaining…<', '>{t(\'studentPanel.common.explaining\')}<'],
  ['>Submitting…<', '>{t(\'studentPanel.common.submitting\')}<'],
  ['>Regenerating…<', '>{t(\'studentPanel.common.regenerating\')}<'],
  ['>Next<', '>{t(\'studentPanel.common.next\')}<'],
  ['>Finish<', '>{t(\'studentPanel.common.finish\')}<'],
  ['>Summarise<', '>{t(\'studentPanel.common.summarise\')}<'],
  ['>Add to Notes<', '>{t(\'studentPanel.common.addToNotes\')}<'],
  ['>View all<', '>{t(\'studentPanel.common.viewAll\')}<'],
  ['>Start<', '>{t(\'studentPanel.common.start\')}<'],
  ['>Pause<', '>{t(\'studentPanel.common.pause\')}<'],
  ['>Reset<', '>{t(\'studentPanel.common.reset\')}<'],
  ['>Add task<', '>{t(\'studentPanel.common.addTask\')}<'],
  ['>Chat →<', '>{t(\'studentPanel.common.chat\')}<'],
  ['>Open →<', '>{t(\'studentPanel.common.openArrow\')}<'],
  ['>Start →<', '>{t(\'studentPanel.quiz.start\')}<'],
  ['>Prepare<', '>{t(\'studentPanel.exam.prepare\')}<'],
  ['>Take<', '>{t(\'studentPanel.exam.take\')}<'],
  ['>Reflect<', '>{t(\'studentPanel.exam.reflect\')}<'],
  ['>Solve<', '>{t(\'studentPanel.doubtSolver.solve\')}<'],
  ['>New note<', '>{t(\'studentPanel.notes.newNote\')}<'],
  ['>New<', '>{t(\'studentPanel.common.new\')}<'],
  ['>Completed<', '>{t(\'studentPanel.common.completed\')}<'],
  ['>Open<', '>{t(\'studentPanel.common.openStatus\')}<'],
  ['>No due date<', '>{t(\'studentPanel.common.noDueDate\')}<'],
  ['>—<', '>{t(\'studentPanel.common.emDash\')}<'],
  // titles
  ['>My Progress<', '>{t(\'studentPanel.progress.title\')}<'],
  ['>Study Rooms<', '>{t(\'studentPanel.studyRoom.title\')}<'],
  ['>Timetable<', '>{t(\'studentPanel.timetable.title\')}<'],
  ['>Study Plan<', '>{t(\'studentPanel.studyPlan.title\')}<'],
  ['>Exams<', '>{t(\'studentPanel.exam.title\')}<'],
  ['>Notes<', '>{t(\'studentPanel.notes.title\')}<'],
  ['>Quizzes<', '>{t(\'studentPanel.quiz.title\')}<'],
  ['>YouTube Quiz<', '>{t(\'studentPanel.youtubeQuiz.title\')}<'],
  ['>AI Doubt Solver<', '>{t(\'studentPanel.doubtSolver.title\')}<'],
  ['>Grade Calculator<', '>{t(\'studentPanel.gradeCalculator.title\')}<'],
  ['>Study Time Tracker<', '>{t(\'studentPanel.studyTime.title\')}<'],
  ['>Study Materials<', '>{t(\'studentPanel.content.title\')}<'],
  ['>Templates<', '>{t(\'studentPanel.templates.title\')}<'],
  ['>AI Tutors<', '>{t(\'studentPanel.tutors.title\')}<'],
  ['>Teachers<', '>{t(\'studentPanel.teachers.title\')}<'],
  ['>My Tasks<', '>{t(\'studentPanel.tasks.title\')}<'],
  ['>Quiz Results<', '>{t(\'studentPanel.quiz.results.title\')}<'],
  ['>Quiz not found.<', '>{t(\'studentPanel.quiz.take.notFound\')}<'],
  ['>Assignment not found.<', '>{t(\'studentPanel.assignments.notFound\')}<'],
  ['>Task not found.<', '>{t(\'studentPanel.tasks.notFound\')}<'],
  ['>Note not found.<', '>{t(\'studentPanel.notes.detail.notFound\')}<'],
  ['>Not found.<', '>{t(\'studentPanel.common.notFound\')}<'],
  ['>Instructions<', '>{t(\'studentPanel.assignments.detail.instructions\')}<'],
  ['>AI Help<', '>{t(\'studentPanel.assignments.detail.aiHelp.title\')}<'],
  ['>Submit Assignment<', '>{t(\'studentPanel.assignments.submit.title\')}<'],
  ['>Create Task<', '>{t(\'studentPanel.tasks.create.title\')}<'],
  ['>Edit Task<', '>{t(\'studentPanel.tasks.edit.title\')}<'],
  ['>Exam Prepare<', '>{t(\'studentPanel.exam.preparePage.title\')}<'],
  ['>Exam Take<', '>{t(\'studentPanel.exam.takePage.title\')}<'],
  ['>Exam Reflect<', '>{t(\'studentPanel.exam.reflectPage.title\')}<'],
  ['>Doubt Solver Session<', '>{t(\'studentPanel.doubtSolver.session.title\')}<'],
  ['>Problem<', '>{t(\'studentPanel.doubtSolver.session.problem\')}<'],
  ['>Solution<', '>{t(\'studentPanel.doubtSolver.session.solution\')}<'],
  ['>Practice<', '>{t(\'studentPanel.doubtSolver.session.practice.title\')}<'],
  ['>Save to Notes<', '>{t(\'studentPanel.doubtSolver.session.saveToNotes\')}<'],
  ['>Ask Teacher Instead<', '>{t(\'studentPanel.doubtSolver.session.askTeacher\')}<'],
  ['>My Teachers<', '>{t(\'studentPanel.teachers.myTeachers\')}<'],
  ['>My Doubts<', '>{t(\'studentPanel.teachers.myDoubts\')}<'],
  ['>Teacher reply<', '>{t(\'studentPanel.teachers.doubtDetail.teacherReply\')}<'],
  ['>AI Hint<', '>{t(\'studentPanel.quiz.take.aiHint\')}<'],
  ['>Submit Quiz<', '>{t(\'studentPanel.quiz.take.submitQuiz\')}<'],
  ['>Run AI Review<', '>{t(\'studentPanel.quiz.results.review.run\')}<'],
  ['>Explain my mistakes<', '>{t(\'studentPanel.quiz.results.review.title\')}<'],
  ['>Generate Quiz<', '>{t(\'studentPanel.youtubeQuiz.generate\')}<'],
  ['>YouTube URL<', '>{t(\'studentPanel.youtubeQuiz.urlLabel\')}<'],
  ['>Result<', '>{t(\'studentPanel.gradeCalculator.result.title\')}<'],
  ['>Elapsed<', '>{t(\'studentPanel.studyTime.elapsed\')}<'],
  ['>Save session<', '>{t(\'studentPanel.studyTime.saveSession\')}<'],
  ['>Last 7 days<', '>{t(\'studentPanel.studyTime.last7Days\')}<'],
  ['>Recent sessions<', '>{t(\'studentPanel.studyTime.recentSessions\')}<'],
  ['>AI Summary<', '>{t(\'studentPanel.content.worksheet.summary.title\')}<'],
  ['>Content<', '>{t(\'studentPanel.content.worksheet.contentTitle\')}<'],
  ['>Output<', '>{t(\'studentPanel.templates.runner.outputTitle\')}<'],
  ['>History<', '>{t(\'studentPanel.pixGen.history.title\')}<'],
  ['>Subject<', '>{t(\'studentPanel.doubtSolver.fields.subject\')}<'],
  ['>Title<', '>{t(\'studentPanel.tasks.fields.title\')}<'],
  ['>Description<', '>{t(\'studentPanel.tasks.fields.description\')}<'],
  ['>Due date (optional)<', '>{t(\'studentPanel.tasks.fields.dueDate\')}<'],
  ['>Time<', '>{t(\'studentPanel.timetable.columnTime\')}<'],
  ['>Quiz average<', '>{t(\'studentPanel.progress.stats.quizAverage\')}<'],
  ['>Assignments<', '>{t(\'studentPanel.progress.stats.assignments\')}<'],
  ['>Streak<', '>{t(\'studentPanel.progress.stats.streak\')}<'],
  ['>3 days<', '>{t(\'studentPanel.progress.streakDays\')}<'],
  ['>View details →<', '>{t(\'studentPanel.progress.viewDetails\')}<'],
  ['>Untitled note<', '>{t(\'studentPanel.notes.untitled\')}<'],
  ['>Already secured<', '>{t(\'studentPanel.gradeCalculator.result.status.secured\')}<'],
  ['>Possible<', '>{t(\'studentPanel.gradeCalculator.result.status.possible\')}<'],
  ['>Unlikely<', '>{t(\'studentPanel.gradeCalculator.result.status.unlikely\')}<'],
  // subtitles in p tags - multiline patterns handled separately
];

/** @type {Array<[RegExp, string]>} */
const regexReplacements = [
  [/placeholder="Title"/g, 'placeholder={t(\'studentPanel.notes.editor.placeholderTitle\')}'],
  [/placeholder="Write your note…"/g, 'placeholder={t(\'studentPanel.notes.editor.placeholderContent\')}'],
  [/placeholder="Paste your answer or notes here…"/g, 'placeholder={t(\'studentPanel.assignments.submit.placeholder\')}'],
  [/placeholder="Paste the problem statement…"/g, 'placeholder={t(\'studentPanel.doubtSolver.placeholder\')}'],
  [/placeholder="Type your question…"/g, 'placeholder={t(\'studentPanel.teachers.detail.placeholder\')}'],
  [/placeholder="https:\/\/www\.youtube\.com\/watch\?v=\.\.\."/g, 'placeholder={t(\'studentPanel.youtubeQuiz.urlPlaceholder\')}'],
  [/placeholder="Describe an educational visual[^"]*"/g, 'placeholder={t(\'studentPanel.pixGen.placeholder\')}'],
  [/alert\('Submitted \(demo\)\.'\)/g, "alert(t('studentPanel.assignments.submit.successAlert'))"],
  [/alert\('Saved reflection \(demo\)\.'\)/g, "alert(t('studentPanel.exam.reflectPage.successAlert'))"],
  [/alert\('Message sent \(demo\)\.'\)/g, "alert(t('studentPanel.teachers.detail.successAlert'))"],
  [/name = 'Student Module'/g, "name = t('studentPanel.stub.defaultName')"],
  [/StudentStub = \(\{ name = /g, 'StudentStub = ({ name: nameProp = '],
  [/<h1[^>]*>\{name\}<\/h1>/g, '<h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{nameProp ?? t(\'studentPanel.stub.defaultName\')}</h1>'],
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

function ensureI18n(content, componentName) {
  if (content.includes('useTranslation')) return content;
  let c = content;
  if (!c.includes("from 'react-i18next'")) {
    const reactImport = c.match(/^import .+ from 'react';?\n/m);
    if (reactImport) {
      c = c.replace(reactImport[0], `${reactImport[0]}import { useTranslation } from 'react-i18next';\n`);
    } else {
      c = `import { useTranslation } from 'react-i18next';\n${c}`;
    }
  }
  // insert const { t } after first arrow function component opening
  const patterns = [
    /(const \w+ = \(\) => \{\n)/,
    /(const \w+ = \(\{[^}]*\}\) => \{\n)/,
    /(export default function \w+\(\) \{\n)/,
    /(function \w+\(\) \{\n)/,
  ];
  for (const pat of patterns) {
    if (pat.test(c) && !c.includes('const { t } = useTranslation()')) {
      c = c.replace(pat, `$1  const { t } = useTranslation();\n`);
      break;
    }
  }
  return c;
}

let modified = 0;
for (const fp of walk(studentRoot)) {
  let content = fs.readFileSync(fp, 'utf8');
  const before = content;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  for (const [re, to] of regexReplacements) {
    content = content.replace(re, to);
  }
  content = ensureI18n(content);
  if (content !== before) {
    fs.writeFileSync(fp, content);
    modified++;
    console.log('Patched', path.relative(studentRoot, fp));
  }
}
console.log('Modified', modified, 'student panel files');
