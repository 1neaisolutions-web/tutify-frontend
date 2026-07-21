import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';

const GRADABLE_STYLES = ['multiple_choice', 'quick_check'];

const isCorrect = (question, answer) => {
  if (question.style === 'multiple_choice') {
    return Number(answer) === Number(question.correct_option_index);
  }
  if (question.style === 'quick_check') {
    if (question.expected_response_type === 'true_false') {
      return String(answer).toLowerCase() === String(question.answer).toLowerCase();
    }
    if (typeof question.answer === 'string' && typeof answer === 'string') {
      return answer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    }
    return Boolean(answer && String(answer).trim().length > 0);
  }
  return null;
};

const YouTubeQuizTake = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.YOUTUBE_QUIZZES, []);
    return list.find((q) => String(q.id) === String(id)) || null;
  }, [id]);

  const [answers, setAnswers] = useState({});

  if (!quiz) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.quiz.take.notFound')}</p>
      </div>
    );
  }

  const submit = () => {
    const gradable = quiz.questions.filter((q) => GRADABLE_STYLES.includes(q.style));
    const reflective = quiz.questions.filter((q) => !GRADABLE_STYLES.includes(q.style));
    const score = gradable.reduce((acc, q) => (isCorrect(q, answers[q.id]) ? acc + 1 : acc), 0);
    const result = {
      quizId: quiz.id,
      score,
      total: gradable.length,
      reflectiveAnswered: reflective.filter((q) => answers[q.id]).length,
      reflectiveTotal: reflective.length,
      answers,
      completedAt: new Date().toISOString(),
    };
    writeJson(`tutify_student_youtube_quiz_result_${quiz.id}`, result);
    emitStudentEvent({
      module: 'youtube_quiz',
      action: 'completed',
      artifactRef: quiz.id,
      subject: quiz.subjectLens,
      outcome: { score, total: gradable.length },
    });
    navigate(`/student/youtube-quiz/${quiz.id}/results`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.youtubeQuiz.take.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/youtube-quiz')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          {t('studentPanel.common.back')}
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {quiz.summary ? <p className="text-sm text-gray-600 dark:text-gray-300 italic">{quiz.summary}</p> : null}

        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            {q.sectionHeading ? <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{q.sectionHeading}</p> : null}
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {idx + 1}. {q.prompt}
            </p>

            {q.style === 'multiple_choice' && Array.isArray(q.options) ? (
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
            ) : null}

            {q.style === 'quick_check' && q.expected_response_type === 'true_false' ? (
              <div className="mt-3 flex gap-2">
                {['true', 'false'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAnswers((p) => ({ ...p, [q.id]: val }))}
                    className={`px-4 py-1.5 rounded-lg border text-sm capitalize ${
                      answers[q.id] === val
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            ) : null}

            {q.style === 'quick_check' && q.expected_response_type !== 'true_false' ? (
              <input
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                className="mt-3 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder={t('studentPanel.youtubeQuiz.take.shortAnswerPlaceholder')}
              />
            ) : null}

            {(q.style === 'higher_order' || q.style === 'discussion_prompt') ? (
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                rows={3}
                className="mt-3 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder={t('studentPanel.youtubeQuiz.take.reflectivePlaceholder')}
              />
            ) : null}
          </div>
        ))}

        <button
          type="button"
          onClick={submit}
          className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          {t('studentPanel.common.submit')}
        </button>
      </div>
    </div>
  );
};

export default YouTubeQuizTake;
