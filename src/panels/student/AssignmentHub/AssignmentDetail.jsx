import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sendCopilotMessage } from '../api/aiApi';

const lookup = (id) => {
  const all = [
    { id: 'a1', title: 'Physics: Forces worksheet', subject: 'Science', prompt: "Explain Newton's 3rd Law and give an example." },
    { id: 'a2', title: 'English: Essay draft (climate change)', subject: 'English', prompt: 'Help me outline a 5-paragraph essay with a clear thesis.' },
    { id: 'a3', title: 'Biology: Photosynthesis questions', subject: 'Biology', prompt: 'Summarise photosynthesis and give 3 practice questions.' },
    { id: 'a4', title: 'Math: Quadratics practice set', subject: 'Math', prompt: 'Explain how to factor simple quadratics and give an example.' },
    { id: 'a5', title: 'History: Industrial revolution short answers', subject: 'History', prompt: 'Give a concise summary and 3 key impacts.' },
  ];
  return all.find((a) => a.id === id) || null;
};

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignment = lookup(id);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState('');
  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  const runAi = async () => {
    if (!assignment) return;
    setAiLoading(true);
    setAiText('');
    cleanupRef.current?.();
    cleanupRef.current = null;

    try {
      cleanupRef.current = await sendCopilotMessage(
        assignment.prompt,
        'explain',
        (chunk) => setAiText(chunk),
        () => {
          setAiLoading(false);
          cleanupRef.current = null;
        }
      );
    } catch (e) {
      setAiText(`Failed to load AI help. ${e?.message || ''}`.trim());
      setAiLoading(false);
      cleanupRef.current = null;
    }
  };

  if (!assignment) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">Assignment not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{assignment.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{assignment.subject}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/student/assignments/${assignment.id}/submit`)}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate('/student/assignments')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Back
          </button>
        </div>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Instructions</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              Demo assignment detail page. In Phase 2, this content will come from the backend.
            </p>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
              Suggested starting point: <span className="font-medium">{assignment.prompt}</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">AI Help</h2>
              <button
                type="button"
                onClick={() => {
                  setAiOpen((v) => !v);
                  if (!aiOpen) {
                    runAi();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {aiOpen ? 'Hide' : 'Open'}
              </button>
            </div>

            {aiOpen ? (
              <div className="mt-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={runAi}
                    disabled={aiLoading}
                    className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 text-sm"
                  >
                    {aiLoading ? 'Generating…' : 'Regenerate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      cleanupRef.current?.();
                      cleanupRef.current = null;
                      setAiLoading(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    Stop
                  </button>
                </div>

                <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap min-h-[140px]">
                  {aiText || (aiLoading ? 'Thinking…' : 'No AI output yet.')}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Open to see a demo AI explanation (streaming).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;

