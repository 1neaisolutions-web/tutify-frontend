import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'

import type { HistoryItem } from '../../../api/historyApi'
import * as examApi from '../../../api/examApi'
import { getConversation } from '../../../api/chatbots'
import { useGetAssignmentQuery } from '../../../redux/features/teacherTools/assignment/assignmentApiSlice'
import { useGetQuizQuery } from '../../../redux/features/teacherTools/quiz/quizApiSlice'
import { useGetWorksheetQuery } from '../../../redux/features/teacherTools/worksheet/worksheetApiSlice'

export function HistoryContentPreview({ item }: { item: HistoryItem }) {
  switch (item.sourceType) {
    case 'quiz':
      return <QuizPreview item={item} />
    case 'assignment':
      return <AssignmentPreview item={item} />
    case 'worksheet':
      return <WorksheetPreview item={item} />
    case 'exam':
      return <ExamPreview item={item} />
    case 'chatbot_conversation':
      return <ChatbotPreview item={item} />
    case 'pixgen_generation':
      return <PixGenPreview item={item} />
    case 'youtube_quiz':
      return <YouTubeQuizPreview item={item} />
    case 'template_execution':
      return <TemplatePreview item={item} />
    default:
      return null
  }
}

function renderMaybeJson(content: string): React.ReactNode {
  const text = String(content ?? '').trim()
  if (!text) return null
  if (!(text.startsWith('{') || text.startsWith('['))) {
    return text
  }
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      const items = parsed
        .map((v) => (typeof v === 'string' ? v.trim() : null))
        .filter((v): v is string => Boolean(v))
      if (items.length === 0) return text
      return (
        <ul className="list-disc space-y-1 pl-4">
          {items.slice(0, 6).map((s, i) => (
            <li key={i} className="line-clamp-2">
              {s}
            </li>
          ))}
        </ul>
      )
    }
    if (parsed && typeof parsed === 'object') {
      const entries = Object.entries(parsed as Record<string, unknown>).slice(0, 6)
      return (
        <div className="space-y-2">
          {entries.map(([k, v]) => {
            const title = k.replace(/_/g, ' ')
            if (Array.isArray(v)) {
              const arr = v.map((x) => (typeof x === 'string' ? x.trim() : null)).filter((x): x is string => Boolean(x))
              if (arr.length === 0) return null
              return (
                <div key={k}>
                  <p className="mb-1 text-[10px] font-semibold uppercase opacity-60">{title}</p>
                  <ul className="list-disc space-y-1 pl-4">
                    {arr.slice(0, 5).map((s, i) => (
                      <li key={i} className="line-clamp-2">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            if (typeof v === 'string') {
              return (
                <div key={k}>
                  <p className="mb-1 text-[10px] font-semibold uppercase opacity-60">{title}</p>
                  <p className="line-clamp-3">{v}</p>
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }
    return text
  } catch {
    return text
  }
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2 text-center">
      <p className="text-base font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-[10px] text-gray-400">{label}</p>
    </div>
  )
}

export function PreviewSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100" />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-10 rounded-xl bg-gray-100" />
      ))}
    </div>
  )
}

function QuizPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const { data: quiz, isLoading } = useGetQuizQuery(item.id)

  if (isLoading) return <PreviewSkeleton />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t('historyPage.preview.questions')} value={quiz?.questions ?? '—'} />
        <Stat label={t('historyPage.preview.totalMarks')} value={quiz?.totalMarks ?? '—'} />
        <Stat
          label={t('historyPage.preview.timeLimit')}
          value={quiz?.timeLimitMinutes ? t('historyPage.preview.timeLimitMin', { count: quiz.timeLimitMinutes }) : '—'}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t('historyPage.preview.questions')}
        </p>
        <div className="space-y-2">
          {(quiz?.questionStubs ?? []).slice(0, 3).map((q, i) => (
            <div key={q.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="mb-0.5 text-xs font-medium text-gray-500">
                {t('historyPage.preview.questionLabel', {
                  num: i + 1,
                  type: q.type.toUpperCase(),
                  points: q.points,
                })}
              </p>
              <p className="line-clamp-2 text-xs text-gray-800">{q.prompt}</p>
            </div>
          ))}
          {(quiz?.questionStubs?.length ?? 0) > 3 && (
            <p className="text-center text-xs text-gray-400">
              {t('historyPage.preview.moreQuestions', { count: (quiz?.questionStubs?.length ?? 0) - 3 })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function AssignmentPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const { data: assignment, isLoading } = useGetAssignmentQuery(item.id)

  if (isLoading) return <PreviewSkeleton />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat label={t('historyPage.preview.topics')} value={assignment?.briefTopics?.length ?? '—'} />
        <Stat label={t('historyPage.preview.rigor')} value={assignment?.rigorProfile ?? '—'} />
        <Stat label={t('historyPage.preview.assigned')} value={assignment?.assignedCount ?? 0} />
        <Stat label={t('historyPage.preview.submitted')} value={assignment?.submitted ?? 0} />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t('historyPage.preview.briefTopics')}
        </p>
        <div className="space-y-1.5">
          {(assignment?.briefTopics ?? []).slice(0, 4).map((topic) => (
            <div key={topic.id} className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <p className="line-clamp-1 text-xs text-gray-700">{topic.title}</p>
            </div>
          ))}
          {(assignment?.briefTopics?.length ?? 0) > 4 && (
            <p className="text-center text-xs text-gray-400">
              {t('historyPage.preview.moreTopics', { count: (assignment?.briefTopics?.length ?? 0) - 4 })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function WorksheetPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const { data: worksheet, isLoading } = useGetWorksheetQuery(item.id)

  if (isLoading) return <PreviewSkeleton />

  const fmt = worksheet?.outputFormat?.replace(/_/g, ' ') ?? '—'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t('historyPage.preview.sessions')} value={worksheet?.sessionsCount ?? '—'} />
        <Stat label={t('historyPage.preview.blocks')} value={worksheet?.blocksCount ?? '—'} />
        <Stat label={t('historyPage.preview.format')} value={fmt} />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t('historyPage.preview.sessions')}
        </p>
        <div className="space-y-1.5">
          {(worksheet?.sessions ?? []).slice(0, 4).map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-[10px] font-bold text-violet-500">{i + 1}</span>
              <p className="truncate text-xs text-gray-700">{s.title}</p>
              <span className="ml-auto text-[10px] text-gray-400">
                {t('historyPage.preview.blocksCount', { count: s.blocks.length })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExamPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const [exam, setExam] = useState<Awaited<ReturnType<typeof examApi.fetchExam>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    examApi
      .fetchExam(item.id)
      .then((e) => {
        if (!cancelled) setExam(e)
      })
      .catch(() => {
        if (!cancelled) setExam(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [item.id])

  if (loading) return <PreviewSkeleton />
  if (!exam) return <p className="text-xs text-gray-500">{t('historyPage.preview.examLoadFailed')}</p>

  const qCount = exam.mcqs.length + exam.shorts.length + exam.longs.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat
          label={t('historyPage.preview.duration')}
          value={exam.durationMinutes ? t('historyPage.preview.timeLimitMin', { count: exam.durationMinutes }) : '—'}
        />
        <Stat label={t('historyPage.preview.totalMarks')} value={exam.totalMarks ?? '—'} />
        <Stat label={t('historyPage.preview.sections')} value={exam.sections?.length ?? '—'} />
        <Stat label={t('historyPage.preview.questions')} value={qCount} />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t('historyPage.preview.sections')}
        </p>
        <div className="space-y-1.5">
          {(exam.sections ?? []).slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <p className="flex-1 truncate text-xs text-gray-700">
                {s.title ?? t('historyPage.preview.sectionFallback', { order: s.sortOrder })}
              </p>
              <span className="ml-2 text-[10px] text-gray-400">
                {t('historyPage.preview.points', { count: s.marks })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatbotPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getConversation(item.id)
      .then((d) => {
        if (cancelled) return
        const msgs = (d.messages ?? []).slice(-4)
        setMessages(msgs.map((m) => ({ id: m.id, role: m.role, content: m.content })))
      })
      .catch(() => {
        if (!cancelled) setMessages([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [item.id])

  if (loading) return <PreviewSkeleton />

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {t('historyPage.preview.lastMessages')}
      </p>
      <div className="space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl px-3 py-2 text-xs ${
              msg.role === 'user' ? 'ml-6 bg-primary-50 text-primary-900' : 'mr-6 bg-gray-100 text-gray-800'
            }`}
          >
            <p className="mb-0.5 text-[10px] font-semibold uppercase opacity-60">
              {msg.role === 'user' ? t('historyPage.preview.you') : t('historyPage.preview.assistant')}
            </p>
            <div className="line-clamp-3">{renderMaybeJson(msg.content)}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="py-4 text-center text-xs text-gray-400">{t('historyPage.preview.noMessages')}</p>
        )}
      </div>
    </div>
  )
}

function PixGenPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const meta = item.meta as Record<string, unknown>
  const urls = (meta.image_urls as string[] | undefined) ?? (meta.image_url ? [String(meta.image_url)] : [])
  const prompt = meta.prompt != null ? String(meta.prompt) : ''
  const style = meta.style_preset != null ? String(meta.style_preset) : ''
  const ratio = meta.aspect_ratio != null ? String(meta.aspect_ratio) : ''

  return (
    <div className="space-y-4">
      {urls.length > 0 ? (
        <div className={`grid gap-2 ${urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {urls.map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={url}
                alt={t('historyPage.preview.generatedImageAlt', { num: i + 1 })}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl bg-gray-100">
          <p className="text-xs text-gray-400">{t('historyPage.preview.imageNotAvailable')}</p>
        </div>
      )}
      {prompt && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t('historyPage.preview.prompt')}
          </p>
          <p className="line-clamp-4 text-xs leading-relaxed text-gray-700">{prompt}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {style && <Stat label={t('historyPage.preview.style')} value={style} />}
        {ratio && <Stat label={t('historyPage.preview.ratio')} value={ratio} />}
      </div>
    </div>
  )
}

function YouTubeQuizPreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const meta = item.meta as Record<string, unknown>
  const videoUrl = meta.video_url != null ? String(meta.video_url) : ''
  const result = meta.result_json as
    | { sections?: Array<{ heading: string; questions?: unknown[] }> }
    | undefined
  const sections = result?.sections ?? []

  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null

  const totalQ = sections.reduce((acc, s) => acc + (Array.isArray(s.questions) ? s.questions.length : 0), 0)

  return (
    <div className="space-y-4">
      {thumbnailUrl && (
        <div className="overflow-hidden rounded-xl">
          <img
            src={thumbnailUrl}
            alt={t('historyPage.preview.videoThumbnailAlt')}
            className="w-full object-cover"
          />
        </div>
      )}
      {videoUrl && <p className="truncate text-[10px] text-gray-400">{videoUrl}</p>}
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t('historyPage.preview.sections')} value={sections.length} />
        <Stat label={t('historyPage.preview.questions')} value={totalQ} />
        <Stat label={t('historyPage.preview.grade')} value={item.grade ?? '—'} />
      </div>
      {sections.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t('historyPage.preview.sections')}
          </p>
          <div className="space-y-1.5">
            {sections.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <p className="flex-1 truncate text-xs text-gray-700">{s.heading}</p>
                <span className="ml-2 text-[10px] text-gray-400">
                  {Array.isArray(s.questions) ? s.questions.length : 0}q
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return match?.[1] ?? null
}

function TemplatePreview({ item }: { item: HistoryItem }) {
  const { t } = useTranslation()
  const meta = item.meta as Record<string, unknown>
  const slug = meta.template_slug != null ? String(meta.template_slug) : ''
  const name = meta.template_name != null ? String(meta.template_name) : item.title

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3">
        <Sparkles className="h-8 w-8 shrink-0 text-indigo-500" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          {slug && <p className="truncate text-xs text-gray-500">/{slug}</p>}
        </div>
      </div>
      <p className="text-xs text-gray-600">{t('historyPage.preview.templateOpenHint')}</p>
    </div>
  )
}
