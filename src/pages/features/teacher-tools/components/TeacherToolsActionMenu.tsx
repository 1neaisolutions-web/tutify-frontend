import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export interface ActionItem {
  key: string
  label: string
  onClick: () => void
  danger?: boolean
}

interface Props {
  actions: ActionItem[]
}

const MENU_WIDTH_PX = 192
const VIEWPORT_PAD = 8
const GAP_PX = 4

function computeMenuPosition(trigger: DOMRect, menuHeight: number): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  let left = trigger.right - MENU_WIDTH_PX
  left = Math.min(Math.max(left, VIEWPORT_PAD), vw - MENU_WIDTH_PX - VIEWPORT_PAD)

  let top = trigger.bottom + GAP_PX
  if (top + menuHeight > vh - VIEWPORT_PAD) {
    top = trigger.top - menuHeight - GAP_PX
  }
  const maxTop = vh - menuHeight - VIEWPORT_PAD
  top = Math.min(Math.max(top, VIEWPORT_PAD), maxTop)
  return { top, left }
}

export function TeacherToolsActionMenu({ actions }: Props) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const placeMenu = useCallback(() => {
    const triggerEl = triggerRef.current
    if (!triggerEl) return
    const tr = triggerEl.getBoundingClientRect()
    const menuEl = menuRef.current
    const fallbackH = Math.min(actions.length * 40 + 16, window.innerHeight - 24)
    const mh = menuEl?.offsetHeight ?? fallbackH
    setCoords(computeMenuPosition(tr, mh))
  }, [actions.length])

  useLayoutEffect(() => {
    if (!open) return
    placeMenu()
    const id = requestAnimationFrame(() => placeMenu())
    return () => cancelAnimationFrame(id)
  }, [open, placeMenu, actions.length])

  useEffect(() => {
    if (!open) return
    const onScrollOrResize = () => placeMenu()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open, placeMenu])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const portalTarget = typeof document !== 'undefined' ? document.body : null

  return (
    <div className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        aria-label="Actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open &&
        portalTarget &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="z-[10000] w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          >
            {actions.map((a) => (
              <button
                key={a.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  a.onClick()
                  setOpen(false)
                }}
                className={`block w-full px-3 py-2 text-left text-sm ${
                  a.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>,
          portalTarget,
        )}
    </div>
  )
}
