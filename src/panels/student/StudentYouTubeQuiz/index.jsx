import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'tutify_student_youtube_quizzes_v1';

const makeQuiz = (url) => {
  const id = `ytq_${Date.now()}`;
  return {
    id,
    url,
    title: 'YouTube Quiz (Demo)',
    createdAt: new Date().toISOString(),
    questions: [
      { id: 'q1', text: 'What is the main idea of the video segment?', options: ['A', 'B', 'C', 'D'], answerIndex: 1 },
      { id: 'q2', text: 'Which example best supports the explanation?', options: ['A', 'B', 'C', 'D'], answerIndex: 2 },
      { id: 'q3', text: 'What should you review next to understand better?', options: ['A', 'B', 'C', 'D'], answerIndex: 0 },
    ],
  };
};

const StudentYouTubeQuiz = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    const u = url.trim();
    if (!u || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const quiz = makeQuiz(u);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([quiz, ...list].slice(0, 20)));
    } catch {
      // ignore
    }

    setLoading(false);
    navigate(`/student/youtube-quiz/${quiz.id}/take`);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">YouTube Quiz</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Paste a YouTube URL → generate a quiz (demo).</p>
      </div>

      <div className="px-6 py-6 max-w-2xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">YouTube URL</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>
          <button
            type="button"
            onClick={generate}
            disabled={!url.trim() || loading}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentYouTubeQuiz;

