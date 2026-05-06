import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Layers, Pin, Trash2, X } from 'lucide-react'
import { useDispatch } from 'react-redux'

import type { HistoryItem } from '../../../api/historyApi'
import { apiRequest } from '../../../api/client'
import { useSnackbar } from '../../../hooks/useSnackbar'
import { historyApiSlice } from '../../../redux/features/history/historyApiSlice'
import { CustomModal } from '../../../components/shared/CustomModal'
import { HistoryContentPreview } from './HistoryContentPreview'
import { DELETE_PATH_MAP, getItemRoute } from './historyRouting'
import { formatRelativeDate } from './historyUtils'
import { SOURCE_META } from './HistoryCard'
import { StatusPill } from './StatusPill'

interface Props {
  item: HistoryItem | null
  onClose: () => void
}

export function HistoryDetailPanel({ item, onClose }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useSnackbar()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  const invalidateHistory = () => {
    dispatch(
      historyApiSlice.util.invalidateTags([
        { type: 'HistoryList', id: 'LIST' },
        { type: 'HistoryStats', id: 'STATS' },
        { type: 'HistoryQuota', id: 'QUOTA' },
      ]),
    )
  }

  if (!item) {
    return (
      <div className="flex h-[480px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <Layers className="mx-auto h-10 w-10 text-gray-300" />
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-500">Select an item</p>
        <p className="mt-1 max-w-[200px] text-xs text-gray-400">Click any card to preview its content and quick actions.</p>
      </div>
    )
  }

  const meta = SOURCE_META[item.sourceType]

  async function handleDelete() {
    setDeletePending(true)
    try {
      const path = DELETE_PATH_MAP[item.sourceType](item.id)
      await apiRequest(path, { method: 'DELETE' })
      setDeleteOpen(false)
      onClose()
      invalidateHistory()
      toast.success('Item deleted')
    } catch {
      toast.error('Could not delete item')
    } finally {
      setDeletePending(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className={`border-l-4 px-5 pb-4 pt-5 ${meta.borderColor}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg p-1.5 ${meta.iconBg}`}>
              <meta.Icon className={`h-4 w-4 ${meta.iconColor}`} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{meta.label}</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 xl:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-3 line-clamp-3 text-base font-semibold leading-snug text-gray-900">{item.title}</h2>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.subject && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{item.subject}</span>
          )}
          {item.grade && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">{item.grade}</span>
          )}
          {item.status && <StatusPill status={item.status} />}
          {item.pinned && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
              <Pin className="h-2.5 w-2.5" />
              Pinned
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate(getItemRoute(item))}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-500"
        >
          <ExternalLink className="h-4 w-4" />
          Open {meta.label}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <HistoryContentPreview item={item} />
      </div>

      <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] text-gray-400">Created {formatRelativeDate(String(item.createdAt))}</p>
            {item.lastUsedAt && (
              <p className="text-[11px] text-gray-400">Last used {formatRelativeDate(String(item.lastUsedAt))}</p>
            )}
            {item.usageCount > 0 && (
              <p className="text-[11px] text-gray-400">
                Used {item.usageCount} time{item.usageCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-gray-400 transition-colors hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      <CustomModal
        open={deleteOpen}
        close={() => setDeleteOpen(false)}
        title="Delete this item?"
        primaryButtonText="Delete"
        isDelete
        loading={deletePending}
        handleSave={handleDelete}
      >
        <p className="text-sm text-gray-600">
          &quot;<strong>{item.title}</strong>&quot; will be permanently deleted. This cannot be undone.
        </p>
      </CustomModal>
    </div>
  )
}
