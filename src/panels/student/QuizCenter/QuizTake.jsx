import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { findQuizById } from '../api/teacherToolsBridge';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent, setMasteryOverride } from '../utils/studentEventLog';

const initialState = (quiz) => ({
  answers: {},
  showHintFor: null,
  remainingSec: quiz.timeLimitSec,
  startedAt: Date.now(),
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'answer':
      return { ...state, answers: { ...state.answers, [action.qid]: action.value } };
    case 'tick':
      return { ...state, remainingSec: Math.max(0, state.remainingSec - 1) };
    case 'hint':
      return { ...state, showHintFor: action.qid };
    case 'hideHint':
      return { ...state, showHintFor: null };
    default:
      return state;
  }
};

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const LOGARITHMS_TOPIC = 'Logarithms';

const QuizTake = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = useMemo(() => findQuizById(id), [id]);
  const [state, dispatch] = useReducer(reducer, quiz ? initialState(quiz) : { answers: {}, showHintFor: null, remainingSec: 0, startedAt: Date.now() });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    const timer = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timer);
  }, [quiz]);

  useEffect(() => {
    if (!quiz) return;
    if (state.remainingSec === 0 && !submitted) {
      setSubmitted(true);
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.remainingSec, submitted, quiz]);

  const handleSubmit = (auto = false) => {
    if (!quiz) return;
    const total = quiz.questions.length;
    let score = 0;
    const missedTopics = [];
    quiz.questions.forEach((q) => {
      const correct = Number(state.answers[q.id]) === q.correctIndex;
      if (correct) score += 1;
      else missedTopics.push(q.topic);
    });

    const timeSpentSec = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
    const result = {
      quizId: quiz.id,
      subject: quiz.subject,
      score,
      total,
      answers: state.answers,
      missedTopics,
      autoSubmitted: auto,
      completedAt: new Date().toISOString(),
    };
    writeJson(`tutify_student_quiz_result_${quiz.id}`, result);

    emitStudentEvent({
      module: 'quiz_center',
      action: 'completed',
      subject: quiz.subject,
      topic: missedTopics[0] || quiz.questions[0]?.topic,
      outcome: { score, timeSpentSec, correct: score === total },
    });

    if (quiz.subjectId === 'algebra-ii' && missedTopics.includes(LOGARITHMS_TOPIC) && !quiz.isFixIt) {
      const flags = readJson(STUDENT_STORAGE_KEYS.QUIZ_MISSED_TOPICS, {});
      writeJson(STUDENT_STORAGE_KEYS.QUIZ_MISSED_TOPICS, { ...flags, logarithms: true });
    }

    if (quiz.isFixIt && quiz.subjectId === 'algebra-ii') {
      const flags = readJson(STUDENT_STORAGE_KEYS.QUIZ_MISSED_TOPICS, {});
      const previouslyMissed = Boolean(flags.logarithms);
      const improved = score === total;
      if (previouslyMissed && improved) {
        setMasteryOverride('algebra-ii', 'logarithms', Math.min(95, 52 + 12));
        emitStudentEvent({ module: 'quiz_center', action: 'mastery_check', subject: 'Algebra II', topic: LOGARITHMS_TOPIC, outcome: { score, correct: true } });
        writeJson(STUDENT_STORAGE_KEYS.QUIZ_MISSED_TOPICS, { ...flags, logarithms: false });
      }
    }

    navigate(`/student/quiz/${quiz.id}/results`);
  };

  if (!quiz) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.quiz.take.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.quiz.take.timer', { time: formatTime(state.remainingSec) })}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/quizzes')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Exit
        </button>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {quiz.source === 'live' ? (
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 text-xs text-emerald-800 dark:text-emerald-200">
            {t('studentPanel.quiz.take.liveNotice')}
          </div>
        ) : null}
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {idx + 1}. {q.prompt}
              </p>
              <button
                type="button"
                onClick={() => dispatch({ type: 'hint', qid: q.id })}
                className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-200 border border-primary-100 dark:border-primary-900 text-sm shrink-0"
              >
                AI Hint
              </button>
            </div>

            {state.showHintFor === q.id ? (
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-3 text-sm text-gray-800 dark:text-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <span>{q.hint}</span>
                  <button type="button" onClick={() => dispatch({ type: 'hideHint' })} className="text-xs text-gray-600 dark:text-gray-300">
                    Close
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.choices.map((opt, oi) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/40 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    checked={Number(state.answers[q.id]) === oi}
                    onChange={() => dispatch({ type: 'answer', qid: q.id, value: oi })}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="button" onClick={() => handleSubmit(false)} className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizTake;
