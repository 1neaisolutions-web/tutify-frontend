import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tutify_student_pixgen_history_v1';

const StudentPixGen = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
    } catch {
      // ignore
    }
  }, [history]);

  const latest = history[0];

  const generate = async () => {
    const p = prompt.trim();
    if (!p || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 950));
    const seed = `${p}-${Date.now()}`;
    const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/560`;
    const item = { id: `img_${Date.now()}`, prompt: p, url, createdAt: new Date().toISOString() };
    setHistory((prev) => [item, ...prev].slice(0, 30));
    setLoading(false);
  };

  const count = useMemo(() => history.length, [history.length]);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Image Studio (PixGen)</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">School-safe demo generation • {count} images</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                placeholder="Describe an educational visual… (e.g., 'labeled diagram of a plant cell')"
              />
              <button
                type="button"
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Generating…' : 'Generate'}
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40">
              {latest ? (
                <img src={latest.url} alt={latest.prompt} className="w-full h-auto" />
              ) : (
                <div className="p-10 text-center text-sm text-gray-600 dark:text-gray-300">Generate your first image.</div>
              )}
            </div>

            {latest ? <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">Prompt: {latest.prompt}</p> : null}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">History</h2>
            <div className="mt-3 space-y-3 max-h-[520px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">No images yet.</p>
              ) : (
                history.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHistory((prev) => [h, ...prev.filter((x) => x.id !== h.id)])}
                    className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 overflow-hidden"
                  >
                    <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-900">
                      <img src={h.url} alt={h.prompt} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleString()}</p>
                      <p className="mt-1 text-sm text-gray-800 dark:text-gray-100 line-clamp-2">{h.prompt}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPixGen;

