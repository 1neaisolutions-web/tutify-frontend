import { X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export function TeacherToolsSideReviewDrawer({ open, title, onClose, children, footer }: Props) {
  if (!open) return null
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/30"
        aria-label="Close overlay"
        onClick={onClose}
      />
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">{footer}</div>}
      </aside>
    </>
  )
}
