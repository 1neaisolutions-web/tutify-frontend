import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { readJson, STUDENT_STORAGE_KEYS } from '../utils/studentStorage';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';
import MasteryRing from '../_shared/MasteryRing';

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const YouTubeQuizResults = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const result = useMemo(() => readJson(`tutify_student_youtube_quiz_result_${id}`, null), [id]);
  const quiz = useMemo(() => {
    const list = readJson(STUDENT_STORAGE_KEYS.YOUTUBE_QUIZZES, []);
    return list.find((q) => String(q.id) === String(id)) || null;
  }, [id]);

  const videoId = useMemo(() => extractYouTubeId(quiz?.url), [quiz]);
  const percent = result && result.total > 0 ? Math.round((result.score / result.total) * 100) : null;

  const reflectiveQuestions = useMemo(
    () => (quiz?.questions || []).filter((q) => q.style === 'higher_order' || q.style === 'discussion_prompt'),
    [quiz]
  );

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader
        eyebrow="YouTube Quiz"
        title={t('studentPanel.quiz.results.title')}
        subtitle={t('studentPanel.youtubeQuiz.results.subtitle')}
        right={
          <button
            type="button"
            onClick={() => navigate('/student/youtube-quiz')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.done')}
          </button>
        }
      />

      <div className="px-6 py-6 max-w-2xl space-y-4">
        {videoId ? (
          <FadeIn>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={quiz?.title || 'YouTube video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </FadeIn>
        ) : null}

        <FadeIn delayMs={60}>
          <SectionCard hero={percent != null} accent className="p-4">
            {result ? (
              <div className="flex items-center gap-5">
                {percent != null ? <MasteryRing value={percent} label="Score" size={80} strokeWidth={7} /> : null}
                <div className="space-y-2">
                  {result.total > 0 ? (
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {t('studentPanel.youtubeQuiz.results.scoreLabel')}: <span className="font-semibold">{result.score}</span> / {result.total}
                    </p>
                  ) : null}
                  {result.reflectiveTotal > 0 ? (
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {t('studentPanel.youtubeQuiz.results.reflectiveLabel')}: <span className="font-semibold">{result.reflectiveAnswered}</span> / {result.reflectiveTotal}
                    </p>
                  ) : null}
                  <p className="text-xs text-gray-500">
                    {t('studentPanel.youtubeQuiz.results.completedLabel')}: {new Date(result.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-200">{t('studentPanel.youtubeQuiz.results.empty')}</p>
            )}
          </SectionCard>
        </FadeIn>

        {result && reflectiveQuestions.length > 0 ? (
          <FadeIn delayMs={120}>
            <SectionCard className="p-4 space-y-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.youtubeQuiz.results.reflectiveReview')}</h2>
              {reflectiveQuestions.map((q) => (
                <div key={q.id} className="border-t border-gray-100 dark:border-gray-800 pt-3 first:border-0 first:pt-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{q.prompt}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{result.answers?.[q.id] || t('studentPanel.youtubeQuiz.results.noResponse')}</p>
                  {q.sample_answer ? (
                    <p className="mt-1 text-xs text-sky-700 dark:text-sky-300">{t('studentPanel.youtubeQuiz.results.sampleAnswer')}: {q.sample_answer}</p>
                  ) : null}
                </div>
              ))}
            </SectionCard>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default YouTubeQuizResults;
