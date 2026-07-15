import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { CustomButton, CustomInput } from '../shared'

interface ConfirmActionModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary'
  requireReason?: boolean
  reasonLabel?: string
  loading?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  requireReason = true,
  reasonLabel = 'Reason (required)',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  const [reason, setReason] = useState('')

  if (!open) return null

  const canConfirm = !requireReason || reason.trim().length >= 3

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(reason.trim())
      setReason('')
    }
  }

  const handleCancel = () => {
    setReason('')
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${confirmVariant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {description && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}

        {requireReason && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {reasonLabel}
            </label>
            <CustomInput
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
              placeholder="Provide a reason for this action..."
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <CustomButton variant="outlined" onClick={handleCancel} disabled={loading}>
            Cancel
          </CustomButton>
          <CustomButton
            isDelete={confirmVariant === 'danger'}
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            loading={loading}
          >
            {confirmLabel}
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
