import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const templateMeta = {
  'essay-outline': { title: 'Essay Outline', fields: ['Topic', 'Thesis statement'] },
  'study-schedule': { title: 'Study Schedule', fields: ['Subject', 'Test date'] },
  'lab-report': { title: 'Lab Report', fields: ['Experiment title', 'Independent variable', 'Dependent variable'] },
  'book-review': { title: 'Book Review', fields: ['Book title', 'Main theme'] },
  flashcards: { title: 'Flashcards', fields: ['Topic', 'Difficulty (easy/medium/hard)'] },
};

const fakeGenerate = (templateId, values) => {
  const title = templateMeta[templateId]?.title || 'Template';
  const input = Object.entries(values)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `${title}\n\nGenerated draft (demo)\n\n${input}\n\nNext steps:\n- Review\n- Customize\n- Export / copy`;
};

const StudentTemplateRunner = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const meta = templateMeta[templateId] || { title: 'Template', fields: ['Input'] };
  const initial = useMemo(() => Object.fromEntries(meta.fields.map((f) => [f, ''])), [meta.fields]);
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    setLoading(true);
    setOutput('');
    await new Promise((r) => setTimeout(r, 700));
    setOutput(fakeGenerate(templateId, values));
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{meta.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Fill inputs → generate a demo draft.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/templates')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4">
          {meta.fields.map((f) => (
            <label key={f} className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{f}</span>
              <input
                value={values[f]}
                onChange={(e) => setValues((p) => ({ ...p, [f]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              />
            </label>
          ))}
          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Output</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100 rounded-lg bg-gray-50 dark:bg-gray-900/40 p-4 min-h-[240px]">
            {output || (loading ? 'Thinking…' : 'Run a template to see output.')}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StudentTemplateRunner;

