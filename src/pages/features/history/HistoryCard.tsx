import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Image,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Sparkles,
  TrendingUp,
  Youtube,
} from 'lucide-react'

import type { HistoryItem, HistorySourceType } from '../../../api/historyApi'
import { HistoryCardMenu } from './HistoryCardMenu'
import { StatusPill } from './StatusPill'
import { formatRelativeDate } from './historyUtils'

export const SOURCE_META: Record<
  HistorySourceType,
  {
    label: string
    borderColor: string
    iconBg: string
    iconColor: string
    Icon: React.FC<{ className?: string }>
  }
> = {
  quiz: {
    label: 'Quiz',
    borderColor: 'border-l-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    Icon: BookOpen,
  },
  assignment: {
    label: 'Assignment',
    borderColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    Icon: ClipboardList,
  },
  worksheet: {
    label: 'Worksheet',
    borderColor: 'border-l-violet-500',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    Icon: FileText,
  },
  exam: {
    label: 'Exam',
    borderColor: 'border-l-rose-500',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    Icon: GraduationCap,
  },
  chatbot_conversation: {
    label: 'Chatbot',
    borderColor: 'border-l-teal-500',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    Icon: MessageSquare,
  },
  pixgen_generation: {
    label: 'PixGen',
    borderColor: 'border-l-pink-500',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    Icon: Image,
  },
  youtube_quiz: {
    label: 'YouTube Quiz',
    borderColor: 'border-l-orange-500',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    Icon: Youtube,
  },
  template_execution: {
    label: 'Template',
    borderColor: 'border-l-indigo-500',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    Icon: Sparkles,
  },
}

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

export interface HistoryCardProps {
  item: HistoryItem
  viewMode: 'grid' | 'list'
  isSelected: boolean
  isActive: boolean
  selectMode: boolean
  onSelect: (id: string) => void
  onClick: (item: HistoryItem) => void
  onDelete: (item: HistoryItem) => void
  onDuplicate: (item: HistoryItem) => void
  onTogglePin: (item: HistoryItem) => void
  onOpenEdit: (item: HistoryItem) => void
}

export function HistoryCard({
  item,
  viewMode,
  isSelected,
  isActive,
  selectMode,
  onSelect,
  onClick,
  onDelete,
  onDuplicate,
  onTogglePin,
  onOpenEdit,
}: HistoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const meta = SOURCE_META[item.sourceType]

  const ringActive = isActive ? 'ring-2 ring-primary-400 shadow-md' : 'hover:shadow-md hover:border-gray-200'
  const ringSel = isSelected ? 'ring-2 ring-primary-300 bg-primary-50/40' : ''

  if (viewMode === 'list') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(item)
          }
        }}
        className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 border-l-4 bg-white px-4 py-3 transition-all ${meta.borderColor} ${isActive ? 'ring-2 ring-primary-400' : 'hover:border-gray-200 hover:shadow-sm'} ${ringSel}`}
      >
        <div
          className={`shrink-0 transition-opacity ${selectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(item.id)
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
        <div className={`shrink-0 rounded-lg p-1.5 ${meta.iconBg}`}>
          <meta.Icon className={`h-3.5 w-3.5 ${meta.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {item.subject && <span className="text-[10px] text-gray-500">{item.subject}</span>}
            {item.grade && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-[10px] text-gray-500">{item.grade}</span>
              </>
            )}
          </div>
        </div>
        {item.status && <StatusPill status={item.status} className="shrink-0" />}
        <span className="shrink-0 text-[11px] text-gray-400">{formatRelativeDate(String(item.createdAt))}</span>
        {item.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-amber-400" />}
        <div
          className="relative shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
        >
          <button type="button" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <HistoryCardMenu
              item={item}
              onOpenEdit={() => {
                setMenuOpen(false)
                onOpenEdit(item)
              }}
              onDuplicate={() => {
                setMenuOpen(false)
                onDuplicate(item)
              }}
              onTogglePin={() => {
                setMenuOpen(false)
                onTogglePin(item)
              }}
              onDelete={() => {
                setMenuOpen(false)
                onDelete(item)
              }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(item)
        }
      }}
      className={`group relative cursor-pointer rounded-2xl border border-gray-100 border-l-4 bg-white p-5 shadow-sm transition-all ${meta.borderColor} ${ringActive} ${ringSel}`}
    >
      <div
        className={`absolute left-4 top-4 transition-opacity ${selectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(item.id)
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </div>

      <div className={`absolute right-4 top-4 rounded-lg p-1.5 ${meta.iconBg}`}>
        <meta.Icon className={`h-4 w-4 ${meta.iconColor}`} />
      </div>

      <div className="pl-6 pr-10">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
          {item.pinned && <Pin className="mr-1 inline h-3 w-3 text-amber-500" />}
          {item.title}
        </h3>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-6">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${SOURCE_TAG_COLORS[item.sourceType]}`}>
          {meta.label}
        </span>
        {item.subject && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{item.subject}</span>
        )}
        {item.grade && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{item.grade}</span>
        )}
        {item.status && <StatusPill status={item.status} />}
      </div>

      <div className="mt-3 flex items-center gap-3 pl-6 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatRelativeDate(String(item.createdAt))}
        </span>
        {item.usageCount > 0 && (
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {item.usageCount}× used
          </span>
        )}
        {item.performanceHint === 'effective' && (
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            Effective
          </span>
        )}
      </div>

      <div
        className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen((v) => !v)
        }}
      >
        <button type="button" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <HistoryCardMenu
            item={item}
            onOpenEdit={() => {
              setMenuOpen(false)
              onOpenEdit(item)
            }}
            onDuplicate={() => {
              setMenuOpen(false)
              onDuplicate(item)
            }}
            onTogglePin={() => {
              setMenuOpen(false)
              onTogglePin(item)
            }}
            onDelete={() => {
              setMenuOpen(false)
              onDelete(item)
            }}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
