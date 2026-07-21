import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { MAYA_QUIZZES } from '../data/mayaChenDemoData';
import { getBridgedQuizzes } from '../api/teacherToolsBridge';
import PageHeader from '../_shared/PageHeader';
import FadeIn from '../_shared/FadeIn';

const QuizCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectFilter = searchParams.get('subject');
  const [allQuizzes, setAllQuizzes] = useState(MAYA_QUIZZES);

  useEffect(() => {
    let active = true;
    getBridgedQuizzes().then((list) => {
      if (active) setAllQuizzes(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const quizzes = useMemo(() => {
    if (!subjectFilter) return allQuizzes;
    const filtered = allQuizzes.filter((q) => q.subjectId === subjectFilter);
    return filtered.length ? filtered : allQuizzes;
  }, [subjectFilter, allQuizzes]);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Quizzes" title={t('studentPanel.quiz.title')} subtitle={t('studentPanel.quiz.subtitle')} />

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((q, i) => {
          const topics = [...new Set(q.questions.map((qq) => qq.topic).filter(Boolean))];
          return (
            <FadeIn key={q.id} delayMs={i * 60}>
              <button
                type="button"
                onClick={() => navigate(`/student/quiz/${q.id}/take`)}
                className="text-left w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{q.title}</h2>
                  <div className="flex shrink-0 gap-1.5">
                    {q.source === 'live' ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                        {t('studentPanel.quiz.liveBadge')}
                      </span>
                    ) : null}
                    {q.isFixIt ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                        Fix-it
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{q.subject}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {q.questions.length} questions • {Math.round(q.timeLimitSec / 60)} min
                </p>
                {topics.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {topics.map((topic) => (
                      <span key={topic} className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">{t('studentPanel.quiz.start')}</p>
              </button>
            </FadeIn>
          );
        })}

        {quizzes.length <= 2 ? (
          <FadeIn delayMs={quizzes.length * 60} className="md:col-span-2">
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/30 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              More quizzes appear here as your teacher assigns them.
            </div>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default QuizCenter;
