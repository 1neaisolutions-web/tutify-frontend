import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { generateYouTubeQuiz } from '../../../api/youtubeQuiz';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import { MAYA_PROFILE, MAYA_SUBJECTS } from '../data/mayaChenDemoData';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const QUESTION_STYLES = [
  { id: 'multiple_choice', labelKey: 'studentPanel.youtubeQuiz.styles.multipleChoice' },
  { id: 'quick_check', labelKey: 'studentPanel.youtubeQuiz.styles.quickCheck' },
  { id: 'higher_order', labelKey: 'studentPanel.youtubeQuiz.styles.higherOrder' },
  { id: 'discussion_prompt', labelKey: 'studentPanel.youtubeQuiz.styles.discussionPrompt' },
];

const DIFFICULTY_LEVELS = ['easy', 'medium', 'challenging'];

const gradeBandForGrade = (grade) => {
  const n = Number(grade);
  if (n <= 5) return 'elementary';
  if (n <= 8) return 'middle';
  return 'high';
};

const normalizeQuiz = (response, meta) => {
  const questions = (response.sections || []).flatMap((section) =>
    (section.questions || []).map((q) => ({ ...q, sectionHeading: section.heading }))
  );
  return {
    id: response.id || `ytq_${Date.now()}`,
    url: meta.video_url,
    title: response.title || 'YouTube Quiz',
    summary: response.summary || '',
    subjectLens: meta.subject_lens,
    learningFocus: meta.learning_focus,
    difficultyLevel: meta.difficultyLevel,
    createdAt: new Date().toISOString(),
    questions,
  };
};

const StudentYouTubeQuiz = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useSnackbar();
  const [url, setUrl] = useState('');
  const [subjectLens, setSubjectLens] = useState(MAYA_SUBJECTS[0]?.name || 'General');
  const [learningFocus, setLearningFocus] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [questionStyles, setQuestionStyles] = useState(['multiple_choice', 'quick_check']);
  const [loading, setLoading] = useState(false);

  const toggleStyle = (id) => {
    setQuestionStyles((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const generate = async () => {
    const u = url.trim();
    if (!u || loading) return;
    if (questionStyles.length === 0) {
      toast.warning(t('studentPanel.youtubeQuiz.errors.noStyles'));
      return;
    }
    setLoading(true);
    const payload = {
      video_url: u,
      grade_band: gradeBandForGrade(MAYA_PROFILE.grade),
      subject_lens: subjectLens,
      learning_focus: learningFocus.trim() || subjectLens,
      quiz_language: 'en',
      question_styles: questionStyles,
      question_count: Number(questionCount) || 5,
      difficultyLevel,
    };
    try {
      const response = await generateYouTubeQuiz(payload);
      const quiz = normalizeQuiz(response, payload);
      const list = readJson(STUDENT_STORAGE_KEYS.YOUTUBE_QUIZZES, []);
      writeJson(STUDENT_STORAGE_KEYS.YOUTUBE_QUIZZES, [quiz, ...list].slice(0, 20));
      emitStudentEvent({
        module: 'youtube_quiz',
        action: 'generated',
        artifactRef: quiz.id,
        subject: subjectLens,
        outcome: { questionCount: quiz.questions.length },
      });
      navigate(`/student/youtube-quiz/${quiz.id}/take`);
    } catch (err) {
      toast.error(err?.message || t('studentPanel.youtubeQuiz.errors.generateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="YouTube Quiz" title={t('studentPanel.youtubeQuiz.title')} subtitle={t('studentPanel.youtubeQuiz.subtitle')} />

      <div className="px-6 py-6 max-w-2xl">
        <FadeIn>
          <SectionCard accent className="p-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.urlLabel')}</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
                placeholder={t('studentPanel.youtubeQuiz.urlPlaceholder')}
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.subjectLens')}</span>
                <select
                  value={subjectLens}
                  onChange={(e) => setSubjectLens(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  {MAYA_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.difficulty')}</span>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.learningFocus')}</span>
              <input
                value={learningFocus}
                onChange={(e) => setLearningFocus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder={t('studentPanel.youtubeQuiz.learningFocusPlaceholder')}
              />
            </label>

            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.questionStyles')}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {QUESTION_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleStyle(style.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      questionStyles.includes(style.id)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                    }`}
                  >
                    {t(style.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <label className="block max-w-[160px]">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.questionCount')}</span>
              <input
                type="number"
                min={3}
                max={10}
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              />
            </label>

            <button
              type="button"
              onClick={generate}
              disabled={!url.trim() || loading}
              className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? t('studentPanel.youtubeQuiz.generating') : t('studentPanel.youtubeQuiz.generate')}
            </button>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default StudentYouTubeQuiz;
