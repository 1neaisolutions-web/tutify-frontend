import type { TFunction } from 'i18next'
import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Image,
  MessageSquare,
  Sparkles,
  Youtube,
} from 'lucide-react'

import type { HistorySourceType } from '../../../api/historyApi'

export const SOURCE_TAG_COLORS: Record<HistorySourceType, string> = {
  quiz: 'border-blue-200 bg-blue-50 text-blue-700',
  assignment: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  worksheet: 'border-violet-200 bg-violet-50 text-violet-700',
  exam: 'border-rose-200 bg-rose-50 text-rose-700',
  chatbot_conversation: 'border-teal-200 bg-teal-50 text-teal-700',
  pixgen_generation: 'border-pink-200 bg-pink-50 text-pink-700',
  youtube_quiz: 'border-orange-200 bg-orange-50 text-orange-700',
  template_execution: 'border-indigo-200 bg-indigo-50 text-indigo-700',
}

export function getSourceMeta(t: TFunction) {
  return {
    quiz: {
      label: t('historyPage.sources.quiz'),
      borderColor: 'border-l-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      Icon: BookOpen,
    },
    assignment: {
      label: t('historyPage.sources.assignment'),
      borderColor: 'border-l-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      Icon: ClipboardList,
    },
    worksheet: {
      label: t('historyPage.sources.worksheet'),
      borderColor: 'border-l-violet-500',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      Icon: FileText,
    },
    exam: {
      label: t('historyPage.sources.exam'),
      borderColor: 'border-l-rose-500',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      Icon: GraduationCap,
    },
    chatbot_conversation: {
      label: t('historyPage.sources.chatbot_conversation'),
      borderColor: 'border-l-teal-500',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      Icon: MessageSquare,
    },
    pixgen_generation: {
      label: t('historyPage.sources.pixgen_generation'),
      borderColor: 'border-l-pink-500',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      Icon: Image,
    },
    youtube_quiz: {
      label: t('historyPage.sources.youtube_quiz'),
      borderColor: 'border-l-orange-500',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      Icon: Youtube,
    },
    template_execution: {
      label: t('historyPage.sources.template_execution'),
      borderColor: 'border-l-indigo-500',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      Icon: Sparkles,
    },
  } as const
}

export type HistorySourceMeta = ReturnType<typeof getSourceMeta>[HistorySourceType]
