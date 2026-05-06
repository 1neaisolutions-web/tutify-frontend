import { useEffect, useRef } from 'react'
import { Copy, ExternalLink, Pin, PinOff, Trash2 } from 'lucide-react'

import type { HistoryItem } from '../../../api/historyApi'

const MENU_ITEM_CLASS =
  'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'

interface Props {
  item: HistoryItem
  onOpenEdit: () => void
  onDuplicate: () => void
  onTogglePin: () => void
  onDelete: () => void
  onClose: () => void
}

export function HistoryCardMenu({ item, onOpenEdit, onDuplicate, onTogglePin, onDelete, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose])

  const canDuplicate = ['quiz', 'assignment', 'worksheet', 'exam'].includes(item.sourceType)

  return (
    <div
      ref={menuRef}
      className="absolute bottom-8 right-0 z-30 min-w-[160px] rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
    >
      <button type="button" onClick={onOpenEdit} className={MENU_ITEM_CLASS}>
        <ExternalLink className="h-4 w-4" /> Open
      </button>
      {canDuplicate && (
        <button type="button" onClick={onDuplicate} className={MENU_ITEM_CLASS}>
          <Copy className="h-4 w-4" /> Duplicate
        </button>
      )}
      <button type="button" onClick={onTogglePin} className={MENU_ITEM_CLASS}>
        {item.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        {item.pinned ? 'Unpin' : 'Pin'}
      </button>
      <div className="my-1 border-t border-gray-100" />
      <button type="button" onClick={onDelete} className={`${MENU_ITEM_CLASS} text-red-600 hover:bg-red-50`}>
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  )
}
