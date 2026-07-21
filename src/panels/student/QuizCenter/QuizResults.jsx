import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sendCopilotMessage } from '../api/aiApi';
import { findQuizById } from '../api/teacherToolsBridge';
import { readJson } from '../utils/studentStorage';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import SkeletonBlock from '../_shared/SkeletonBlock';
import FadeIn from '../_shared/FadeIn';
import MasteryRing from '../_shared/MasteryRing';
import AiAssistedChip from '../_shared/AiAssistedChip';

const QuizResults = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [explaining, setExplaining] = useState(false);
  const [explainText, setExplainText] = useState('');

  const result = useMemo(() => readJson(`tutify_student_quiz_result_${id}`, null), [id]);
  const quiz = useMemo(() => findQuizById(id), [id]);

  const percent = result ? Math.round((result.score / result.total) * 100) : 0;
  const missedLogarithms = Boolean(result?.missedTopics?.includes('Logarithms')) && !quiz?.isFixIt;
  const uniqueMissed = result?.missedTopics?.length ? [...new Set(result.missedTopics)] : [];
  const hasMistakes = uniqueMissed.length > 0;

  const explainMistakes = async () => {
    if (explaining) return;
    setExplaining(true);
    setExplainText('');
    try {
      await sendCopilotMessage(
        'Explain my mistakes and give me a short improvement plan.',
        'explain',
        (chunk) => setExplainText(chunk),
        () => setExplaining(false)
      );
    } catch (e) {
      setExplainText(t('studentPanel.quiz.results.review.failed', { message: e?.message || '' }).trim());
      setExplaining(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Quizzes"
        title={t('studentPanel.quiz.results.title')}
        subtitle={t('studentPanel.quiz.results.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/quizzes')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {result ? (
          <FadeIn>
            <SectionCard hero accent className="p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <MasteryRing value={percent} label="Score" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">{result.score}</span> / {result.total} correct
                  </p>
                  {result.autoSubmitted ? <p className="mt-1 text-xs text-gray-500">{t('studentPanel.quiz.results.autoSubmitted')}</p> : null}
                  {hasMistakes ? (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1.5">Why you missed points</p>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueMissed.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-200"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300 font-medium">No mistakes — clean sweep. 🎉</p>
                  )}
                </div>
              </div>
            </SectionCard>
          </FadeIn>
        ) : (
          <SectionCard className="p-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.quiz.results.empty')}</p>
          </SectionCard>
        )}

        {missedLogarithms ? (
          <FadeIn delayMs={80}>
            <SectionCard className="p-4 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-amber-900 dark:text-amber-100">Fix-it recommended: Logarithms</h2>
                <AiAssistedChip label="AI-flagged" />
              </div>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                You missed a Logarithms question. Take the 3-question fix-it quiz to lock in the rules before your midterm.
              </p>
              <button
                type="button"
                onClick={() => navigate('/student/quiz/qz-fixit-logs/take')}
                className="mt-3 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-sm font-medium transition-colors"
              >
                Take Fix-it Quiz
              </button>
            </SectionCard>
          </FadeIn>
        ) : null}

        {result && percent < 70 ? (
          <FadeIn delayMs={140}>
            <SectionCard accent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.quiz.results.review.title')}</h2>
                  {explainText ? <AiAssistedChip /> : null}
                </div>
                <button
                  type="button"
                  onClick={explainMistakes}
                  disabled={explaining}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {explaining ? 'Explaining…' : 'Run AI Review'}
                </button>
              </div>
              {explaining && !explainText ? (
                <div className="mt-3">
                  <SkeletonBlock rows={3} />
                </div>
              ) : (
                <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap min-h-[120px]">
                  {explainText || 'Run the AI review to see feedback.'}
                </div>
              )}
            </SectionCard>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default QuizResults;
