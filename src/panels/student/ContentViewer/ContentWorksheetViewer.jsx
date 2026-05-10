import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sendCopilotMessage } from '../api/aiApi';

const NOTES_KEY = 'tutify_student_notes_v1';

const ContentWorksheetViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const summarise = async () => {
    setLoading(true);
    setSummary('');
    try {
      await sendCopilotMessage(
        'Summarise this worksheet and list key concepts + 3 practice prompts.',
        'summarise',
        (chunk) => setSummary(chunk),
        () => setLoading(false)
      );
    } catch (e) {
      setSummary(`Failed to summarise. ${e?.message || ''}`.trim());
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Worksheet {id}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Read-only viewer + AI summary (demo).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/content')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Content</h2>
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-200 space-y-2">
            <p>Demo worksheet content.</p>
            <p>1) Solve problems A–D.</p>
            <p>2) Show your working.</p>
            <p>3) Submit by the due date.</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">AI Summary</h2>
            <button
              type="button"
              onClick={summarise}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Summarising…' : 'Summarise'}
            </button>
          </div>
          <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap min-h-[160px]">
            {summary || (loading ? 'Thinking…' : 'Run summarise to see output.')}
          </div>
          <button
            type="button"
            onClick={() => {
              try {
                const raw = localStorage.getItem(NOTES_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                const list = Array.isArray(parsed) ? parsed : [];
                const note = {
                  id: `note_${Date.now()}`,
                  title: `Worksheet ${id} summary`,
                  content: summary || 'No summary generated yet.',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                localStorage.setItem(NOTES_KEY, JSON.stringify([note, ...list].slice(0, 200)));
                navigate(`/student/notes/${note.id}`);
              } catch {
                navigate('/student/notes/new');
              }
            }}
            className="mt-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Add to Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentWorksheetViewer;

