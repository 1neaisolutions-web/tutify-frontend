import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flag } from 'lucide-react';

import { getExamById } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';

const ExamTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = useMemo(() => getExamById(id), [id]);

  const attempts = useMemo(() => readJson(STUDENT_STORAGE_KEYS.EXAM_ATTEMPTS, {}), [id]);
  const savedAttempt = attempts?.[id];

  const [answers, setAnswers] = useState(() => savedAttempt?.answers || {});
  const [flagged, setFlagged] = useState(() => savedAttempt?.flagged || []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(() =>
    savedAttempt?.submittedAt
      ? { score: savedAttempt.score, total: savedAttempt.total, submittedAt: savedAttempt.submittedAt }
      : null
  );

  useEffect(() => {
    if (!exam || result) return;
    const all = readJson(STUDENT_STORAGE_KEYS.EXAM_ATTEMPTS, {});
    all[exam.id] = { ...(all[exam.id] || {}), examId: exam.id, answers, flagged, updatedAt: new Date().toISOString() };
    writeJson(STUDENT_STORAGE_KEYS.EXAM_ATTEMPTS, all);
  }, [answers, flagged, exam, result]);

  if (!exam) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">Exam not found.</p>
      </div>
    );
  }

  const questions = exam.questions;
  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  const selectAnswer = (choiceIdx) => {
    setAnswers((prev) => ({ ...prev, [current.id]: choiceIdx }));
  };

  const toggleFlag = (qid) => {
    setFlagged((prev) => (prev.includes(qid) ? prev.filter((f) => f !== qid) : [...prev, qid]));
  };

  const submitExam = () => {
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0);
    const total = questions.length;
    const submittedAt = new Date().toISOString();

    const all = readJson(STUDENT_STORAGE_KEYS.EXAM_ATTEMPTS, {});
    all[exam.id] = { examId: exam.id, answers, flagged, score, total, submittedAt };
    writeJson(STUDENT_STORAGE_KEYS.EXAM_ATTEMPTS, all);

    emitStudentEvent({
      module: 'exam_center',
      action: 'submitted',
      subject: exam.subject,
      outcome: { score, total, correct: score === total },
      artifactRef: exam.id,
    });

    setConfirmOpen(false);
    setResult({ score, total, submittedAt });
  };

  if (result) {
    const percent = Math.round((result.score / result.total) * 100);
    return (
      <div className="w-full bg-white dark:bg-gray-950">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{exam.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Submitted {new Date(result.submittedAt).toLocaleString()}</p>
        </div>

        <div className="px-6 py-6 max-w-2xl space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 text-center">
            <p className="text-sm text-gray-500">Score</p>
            <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-gray-100">
              {result.score}/{result.total}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{percent}%</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(`/student/exams/${exam.id}/reflect`)}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Reflect on this exam
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/exams')}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Back to Exams
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{exam.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Question {currentIdx + 1} of {questions.length} • {answeredCount}/{questions.length} answered
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/exams')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Exit
        </button>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6 max-w-5xl">
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {currentIdx + 1}. {current.prompt}
              </p>
              <button
                type="button"
                onClick={() => toggleFlag(current.id)}
                aria-pressed={flagged.includes(current.id)}
                title="Flag for review"
                className={`shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium ${
                  flagged.includes(current.id)
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`}
              >
                <Flag className="h-3.5 w-3.5" aria-hidden />
                {flagged.includes(current.id) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {current.choices.map((choice, oi) => (
                <label
                  key={choice}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                    answers[current.id] === oi
                      ? 'border-primary-400 bg-primary-50 dark:border-primary-700 dark:bg-primary-950/30 text-primary-900 dark:text-primary-100'
                      : 'border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${current.id}`}
                    checked={answers[current.id] === oi}
                    onChange={() => selectAnswer(oi)}
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-40"
            >
              Previous
            </button>
            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Questions</p>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged.includes(q.id);
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative h-8 w-8 rounded-md text-xs font-medium border ${
                    isCurrent
                      ? 'border-primary-500 bg-primary-600 text-white'
                      : isAnswered
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
                        : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                  }`}
                >
                  {idx + 1}
                  {isFlagged ? (
                    <Flag className="absolute -top-1.5 -right-1.5 h-3 w-3 text-amber-500 fill-amber-500" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-3 w-full px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Submit this exam?</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              You've answered {answeredCount} of {questions.length} questions
              {flagged.length ? ` (${flagged.length} flagged for review)` : ''}. You won't be able to change answers after submitting.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Keep reviewing
              </button>
              <button
                type="button"
                onClick={submitExam}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExamTake;
