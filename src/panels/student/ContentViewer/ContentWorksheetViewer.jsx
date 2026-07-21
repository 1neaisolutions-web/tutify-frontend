import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { sendCopilotMessage } from '../api/aiApi';
import { MAYA_CONTENT } from '../data/mayaChenDemoData';
import { readJson, writeJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import { emitStudentEvent } from '../utils/studentEventLog';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import SkeletonBlock from '../_shared/SkeletonBlock';
import FadeIn from '../_shared/FadeIn';
import AiAssistedChip from '../_shared/AiAssistedChip';

const findWorksheet = (id) => {
  for (const subject of Object.values(MAYA_CONTENT)) {
    const found = subject.worksheets.find((w) => w.id === id);
    if (found) return { ...found, subjectName: subject.name, subjectId: subject.id };
  }
  return null;
};

const ContentWorksheetViewer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const worksheet = useMemo(() => findWorksheet(id), [id]);

  const summarise = async () => {
    if (!worksheet) return;
    setLoading(true);
    setSummary('');
    try {
      await sendCopilotMessage(
        `Summarise this worksheet titled "${worksheet.title}" and list key concepts + 3 practice prompts.\n\n${worksheet.body}`,
        'summarise',
        (chunk) => setSummary(chunk),
        () => setLoading(false)
      );
      emitStudentEvent({ module: 'content', action: 'generated', subject: worksheet.subjectName, artifactRef: worksheet.id });
    } catch (e) {
      setSummary(t('studentPanel.content.worksheet.summary.failed', { message: e?.message || '' }).trim());
      setLoading(false);
    }
  };

  const addToNotes = () => {
    const list = readJson(STUDENT_STORAGE_KEYS.NOTES, []);
    const note = {
      id: `note_${Date.now()}`,
      title: `${worksheet?.title || `Worksheet ${id}`} summary`,
      content: summary || t('studentPanel.content.worksheet.summary.noneYet'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeJson(STUDENT_STORAGE_KEYS.NOTES, [note, ...list].slice(0, 200));
    navigate(`/student/notes/${note.id}`);
  };

  if (!worksheet) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 px-6 py-6">
        <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.content.worksheet.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="Study Materials"
        title={worksheet.title}
        subtitle={worksheet.subjectName}
        right={
          <button
            type="button"
            onClick={() => navigate(`/student/content/${worksheet.subjectId}`)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.back')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn>
          <SectionCard className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.content.worksheet.contentTitle')}</h2>
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-200 space-y-2">
              <p>{worksheet.body}</p>
            </div>
          </SectionCard>
        </FadeIn>

        <FadeIn delayMs={80}>
          <SectionCard accent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.content.worksheet.summary.title')}</h2>
                {summary ? <AiAssistedChip /> : null}
              </div>
              <button
                type="button"
                onClick={summarise}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? t('studentPanel.content.worksheet.summary.summarising') : t('studentPanel.content.worksheet.summary.summarise')}
              </button>
            </div>
            {loading && !summary ? (
              <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 min-h-[160px]">
                <SkeletonBlock rows={5} />
              </div>
            ) : (
              <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap min-h-[160px]">
                {summary || t('studentPanel.content.worksheet.summary.emptyHint')}
              </div>
            )}
            <button
              type="button"
              onClick={addToNotes}
              className="mt-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {t('studentPanel.content.worksheet.addToNotes')}
            </button>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default ContentWorksheetViewer;
