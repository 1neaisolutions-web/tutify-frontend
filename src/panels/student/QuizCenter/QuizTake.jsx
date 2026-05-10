import { useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const quizBank = {
  qz1: {
    id: 'qz1',
    title: 'Newton’s Laws (MCQ)',
    durationSec: 5 * 60,
    questions: [
      { id: '1', text: 'Newton’s 3rd law means…', options: ['No forces', 'Forces come in pairs', 'More mass = more speed', 'Energy is conserved'], answer: 1, hint: 'Think action-reaction pairs.' },
      { id: '2', text: 'Action and reaction forces act on…', options: ['Same object', 'Different objects', 'Only moving objects', 'Only in space'], answer: 1, hint: 'They are equal/opposite but on different bodies.' },
      { id: '3', text: 'A rocket moves forward because…', options: ['Air pushes it', 'Exhaust pushes backward', 'Gravity increases', 'Mass disappears'], answer: 1, hint: 'Momentum exchange with exhaust.' },
    ],
  },
  qz2: {
    id: 'qz2',
    title: 'Photosynthesis Basics (MCQ)',
    durationSec: 5 * 60,
    questions: [
      { id: '1', text: 'Photosynthesis mainly happens in…', options: ['Mitochondria', 'Chloroplasts', 'Nucleus', 'Ribosomes'], answer: 1, hint: 'Think green organelles.' },
      { id: '2', text: 'Oxygen released comes from…', options: ['CO2', 'Glucose', 'Water', 'ATP'], answer: 2, hint: 'Water splitting in light reactions.' },
      { id: '3', text: 'Calvin cycle uses…', options: ['CO2', 'O2', 'Nitrogen', 'Salt'], answer: 0, hint: 'Carbon fixation.' },
    ],
  },
};

const initialState = (quiz) => ({
  answers: {},
  showHintFor: null,
  remainingSec: quiz.durationSec,
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

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = useMemo(() => quizBank[id] || null, [id]);
  const [state, dispatch] = useReducer(reducer, quiz ? initialState(quiz) : { answers: {}, showHintFor: null, remainingSec: 0 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    const t = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(t);
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
    const score = quiz.questions.reduce((acc, q) => acc + (Number(state.answers[q.id]) === q.answer ? 1 : 0), 0);
    const result = { quizId: quiz.id, score, total, answers: state.answers, autoSubmitted: auto, completedAt: new Date().toISOString() };
    try {
      localStorage.setItem(`tutify_student_quiz_result_${quiz.id}`, JSON.stringify(result));
    } catch {
      // ignore
    }
    navigate(`/student/quiz/${quiz.id}/results`);
  };

  if (!quiz) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Timer: {formatTime(state.remainingSec)}</p>
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
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {idx + 1}. {q.text}
              </p>
              <button
                type="button"
                onClick={() => dispatch({ type: 'hint', qid: q.id })}
                className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-200 border border-primary-100 dark:border-primary-900 text-sm"
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
              {q.options.map((opt, oi) => (
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

