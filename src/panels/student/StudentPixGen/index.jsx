import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

import { generatePixGenImage } from '../../../api/pixgen';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import AiAssistedChip from '../_shared/AiAssistedChip';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const STYLE_PRESETS = ['illustration', 'diagram', 'photo-real', 'watercolor'];
const ASPECT_RATIOS = ['1:1', '16:9', '4:3', '9:16'];
const SUBJECT_STARTERS = [
  { subject: 'Biology', prompt: 'Labeled diagram of mitosis phases' },
  { subject: 'Algebra II', prompt: 'Right triangle with 30-60-90 angles labeled' },
  { subject: 'World History', prompt: 'Map of trade routes during the Industrial Revolution' },
];

const StudentPixGen = () => {
  const { t } = useTranslation();
  const { toast } = useSnackbar();
  const [prompt, setPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => readJson(STUDENT_STORAGE_KEYS.PIXGEN_HISTORY, []));

  useEffect(() => {
    writeJson(STUDENT_STORAGE_KEYS.PIXGEN_HISTORY, history.slice(0, 30));
  }, [history]);

  const latest = history[0];

  const generate = async (overridePrompt) => {
    const p = (overridePrompt ?? prompt).trim();
    if (!p || loading) return;
    setLoading(true);
    try {
      const result = await generatePixGenImage({ prompt: p, stylePreset, aspectRatio });
      const item = {
        id: result.id || `img_${Date.now()}`,
        prompt: p,
        stylePreset,
        aspectRatio,
        url: result.imageUrl,
        status: result.status,
        createdAt: result.createdAt || new Date().toISOString(),
      };
      setHistory((prev) => [item, ...prev].slice(0, 30));
      emitStudentEvent({
        module: 'pixgen',
        action: 'generated',
        artifactRef: item.id,
        outcome: { stylePreset, aspectRatio },
      });
      if (!result.imageUrl) {
        toast.info(t('studentPanel.pixGen.errors.stillProcessing'));
      }
    } catch (err) {
      toast.error(err?.message || t('studentPanel.pixGen.errors.generateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const count = useMemo(() => history.length, [history.length]);

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="AI Image Studio" title={t('studentPanel.pixGen.title')} subtitle={t('studentPanel.common.imagesCount', { count })} />

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FadeIn>
            <SectionCard accent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
                  placeholder={t('studentPanel.pixGen.placeholder')}
                />
                <button
                  type="button"
                  onClick={() => generate()}
                  disabled={loading || !prompt.trim()}
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {loading ? t('studentPanel.pixGen.generating') : t('studentPanel.pixGen.generate')}
                </button>
              </div>

              {!latest ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUBJECT_STARTERS.map((s) => (
                    <button
                      key={s.prompt}
                      type="button"
                      onClick={() => {
                        setPrompt(s.prompt);
                        generate(s.prompt);
                      }}
                      className="px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {s.subject}: {s.prompt}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  {t('studentPanel.pixGen.style')}
                  <select
                    value={stylePreset}
                    onChange={(e) => setStylePreset(e.target.value)}
                    className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1 text-xs text-gray-900 dark:text-gray-100"
                  >
                    {STYLE_PRESETS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  {t('studentPanel.pixGen.aspectRatio')}
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1 text-xs text-gray-900 dark:text-gray-100"
                  >
                    {ASPECT_RATIOS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40">
                {latest?.url ? (
                  <img src={latest.url} alt={latest.prompt} className="w-full h-auto" />
                ) : (
                  <div className="p-10 text-center text-sm text-gray-600 dark:text-gray-300">
                    {loading ? t('studentPanel.pixGen.generating') : t('studentPanel.pixGen.emptyCanvas')}
                  </div>
                )}
              </div>

              {latest ? (
                <div className="mt-3 flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.common.promptLabel', { prompt: latest.prompt })}</p>
                  <AiAssistedChip />
                </div>
              ) : null}
            </SectionCard>
          </FadeIn>
        </div>

        <div className="lg:col-span-1">
          <FadeIn delayMs={80}>
            <SectionCard className="p-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.pixGen.history.title')}</h2>
              {history.length === 0 ? (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.pixGen.history.empty')}</p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 max-h-[560px] overflow-y-auto">
                  {history.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHistory((prev) => [h, ...prev.filter((x) => x.id !== h.id)])}
                      className="text-left rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800 overflow-hidden transition-colors"
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-900">
                        {h.url ? (
                          <img src={h.url} alt={h.prompt} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 text-center px-1">
                            {t('studentPanel.pixGen.errors.stillProcessing')}
                          </div>
                        )}
                      </div>
                      <div className="p-1.5">
                        <p className="text-[11px] text-gray-800 dark:text-gray-100 line-clamp-2">{h.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default StudentPixGen;
