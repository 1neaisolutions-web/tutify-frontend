import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useRecordGamificationEvent } from '@/features/gamification';

const STORAGE_KEY = 'tutify_student_youtube_quizzes_v1';

const YouTubeQuizTake = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const recordGamificationEvent = useRecordGamificationEvent();
  const quiz = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      return list.find((q) => String(q.id) === String(id)) || null;
    } catch {
      return null;
    }
  }, [id]);

  const [answers, setAnswers] = useState({});

  if (!quiz) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.quiz.take.notFound')}</p>
      </div>
    );
  }

  const submit = () => {
    const scored = quiz.questions.reduce((acc, q) => {
      const a = answers[q.id];
      return acc + (Number(a) === Number(q.answerIndex) ? 1 : 0);
    }, 0);
    const result = {
      quizId: quiz.id,
      score: scored,
      total: quiz.questions.length,
      answers,
      completedAt: new Date().toISOString(),
    };
    const scorePercent =
      quiz.questions.length > 0 ? Math.round((scored / quiz.questions.length) * 100) : 0;
    recordGamificationEvent(
      'quiz_completed',
      {
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: scored,
        total: quiz.questions.length,
        scorePercent,
        completedAt: result.completedAt,
      },
      `youtube-quiz:${quiz.id}`,
    );
    try {
      localStorage.setItem(`tutify_student_youtube_quiz_result_${quiz.id}`, JSON.stringify(result));
    } catch {
      // ignore
    }
    navigate(`/student/youtube-quiz/${quiz.id}/results`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.youtubeQuiz.take.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/youtube-quiz')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >{t('studentPanel.common.back')}</button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {idx + 1}. {q.text}
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/40 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={Number(answers[q.id]) === oi}
                    onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={submit}
          className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default YouTubeQuizTake;

