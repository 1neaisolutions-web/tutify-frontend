import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { executeTemplate, fetchTemplateDetail } from '../../../api/templates';
import { useSnackbar } from '../../../hooks/useSnackbar';
import AiAssistedChip from '../_shared/AiAssistedChip';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import SkeletonBlock from '../_shared/SkeletonBlock';
import FadeIn from '../_shared/FadeIn';

const FALLBACK_FIELDS = {
  'essay-outline': ['Topic', 'Thesis statement'],
  'study-schedule': ['Subject', 'Test date'],
  'lab-report': ['Experiment title', 'Independent variable', 'Dependent variable'],
  'book-review': ['Book title', 'Main theme'],
  flashcards: ['Topic', 'Difficulty (easy/medium/hard)'],
};

const MARKDOWN_COMPONENTS = {
  h1: ({ children }) => <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1.5 first:mt-0">{children}</h3>,
  p: ({ children }) => <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed mb-2">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2 text-sm text-gray-800 dark:text-gray-100">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-2 text-sm text-gray-800 dark:text-gray-100">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
  li: ({ children }) => <li>{children}</li>,
};

const parseFields = (template) => {
  const schema = template?.inputSchema;
  if (!schema) {
    const names = FALLBACK_FIELDS[template?.slug] || ['Topic'];
    return names.map((name) => ({ name, label: name, type: 'text', required: true }));
  }
  if (Array.isArray(schema.fields)) {
    return schema.fields.map((f) => ({
      name: f.name,
      label: f.label || f.name,
      type: f.type || 'text',
      required: Boolean(f.required),
      options: f.options,
    }));
  }
  if (schema.type === 'object' && schema.properties) {
    const required = Array.isArray(schema.required) ? schema.required : [];
    return Object.entries(schema.properties).map(([name, prop]) => {
      let type = 'text';
      if (prop.type === 'string') {
        if (prop.enum) type = 'select';
        else if (prop.format === 'textarea' || (prop.maxLength && prop.maxLength > 200)) type = 'textarea';
      } else if (prop.type === 'number' || prop.type === 'integer') {
        type = 'number';
      } else if (prop.type === 'boolean') {
        type = 'select';
      }
      return {
        name,
        label: prop.title || name,
        type,
        required: required.includes(name),
        options: prop.enum || (prop.type === 'boolean' ? ['true', 'false'] : undefined),
      };
    });
  }
  return [{ name: 'Topic', label: 'Topic', type: 'text', required: true }];
};

const StudentTemplateRunner = () => {
  const { t } = useTranslation();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { toast } = useSnackbar();

  const [template, setTemplate] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingTemplate(true);
    setLoadError(false);
    fetchTemplateDetail(templateId)
      .then((detail) => {
        if (!active) return;
        setTemplate(detail);
      })
      .catch(() => {
        if (!active) return;
        setTemplate({ slug: templateId, title: templateId });
        setLoadError(true);
      })
      .finally(() => {
        if (active) setLoadingTemplate(false);
      });
    return () => {
      active = false;
    };
  }, [templateId]);

  const fields = useMemo(() => parseFields(template), [template]);

  useEffect(() => {
    setValues(Object.fromEntries(fields.map((f) => [f.name, ''])));
  }, [fields]);

  const run = async () => {
    const missing = fields.filter((f) => f.required && !String(values[f.name] || '').trim());
    if (missing.length > 0) {
      toast.warning(t('studentPanel.templates.runner.fillRequired'));
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const response = await executeTemplate(templateId, values, 0);
      setOutput(response.result?.preview || '');
    } catch (err) {
      toast.error(err?.message || t('studentPanel.templates.runner.generateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy — select and copy the text manually.');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Templates"
        title={template?.title || templateId}
        subtitle={t('studentPanel.templates.runner.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/templates')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      {loadingTemplate ? (
        <div className="px-6 py-10 max-w-2xl">
          <SkeletonBlock rows={5} />
        </div>
      ) : (
        <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn>
            <SectionCard accent className="p-4 space-y-4">
              {loadError ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">{t('studentPanel.templates.runner.detailFailed')}</p>
              ) : null}
              {fields.map((f) => (
                <label key={f.name} className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {f.label}
                    {f.required ? <span className="text-red-500 ml-1">*</span> : null}
                  </span>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={values[f.name] || ''}
                      onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))}
                      rows={4}
                      className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                    />
                  ) : f.type === 'select' && f.options ? (
                    <select
                      value={values[f.name] || ''}
                      onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                    >
                      <option value="">{t('studentPanel.common.selectPlaceholder')}</option>
                      {f.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={values[f.name] || ''}
                      onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                onClick={run}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
              >
                {loading ? t('studentPanel.templates.runner.generating') : t('studentPanel.templates.runner.generate')}
              </button>
            </SectionCard>
          </FadeIn>

          <FadeIn delayMs={80}>
            <SectionCard className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.templates.runner.outputTitle')}</h2>
                  {output ? <AiAssistedChip /> : null}
                </div>
                {output ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing((v) => !v)}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {editing ? 'Preview' : t('studentPanel.common.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={copyOutput}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {copied ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                ) : null}
              </div>

              {loading ? (
                <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-4 min-h-[240px]">
                  <SkeletonBlock rows={6} />
                </div>
              ) : output ? (
                editing ? (
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    className="mt-3 w-full min-h-[240px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono"
                  />
                ) : (
                  <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-4 min-h-[240px] overflow-y-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                      {output}
                    </ReactMarkdown>
                  </div>
                )
              ) : (
                <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-4 min-h-[240px] flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                  {t('studentPanel.templates.runner.emptyOutput')}
                </div>
              )}
            </SectionCard>
          </FadeIn>
        </div>
      )}
    </div>
  );
};

export default StudentTemplateRunner;
