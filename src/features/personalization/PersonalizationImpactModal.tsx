/**
 * PersonalizationImpactModal
 *
 * Shown before saving a profile change that carries MAJOR_RESET severity.
 * Warns the teacher that their recommendation set will be rebuilt, lists
 * the changed fields, and offers Cancel / Save and Reset actions.
 */
import { AlertTriangle, X, RefreshCw } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PreflightResult {
  severity: 'major_reset' | 'minor_recompute' | 'none'
  operation: string
  changed_fields: string[]
  message: string
  user_display_title: string
  user_display_body: string
  requires_confirmation: boolean
}

interface PersonalizationImpactModalProps {
  preflight: PreflightResult
  onConfirm: () => void
  onCancel: () => void
  isSaving?: boolean
}

// ─── Field label map ──────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  country: 'Country',
  region: 'Region',
  subjects: 'Subjects',
  grade_band: 'Grade Band',
  school_type: 'School Type',
  curriculum_framework: 'Curriculum Framework',
  language_preference: 'Language Preference',
  years_experience: 'Years of Experience',
  professional_goals: 'Professional Goals',
  school_name: 'School Name',
  city: 'City',
  postal_code: 'Postal Code',
  identity_fingerprint: 'Professional Identity',
}

function formatField(field: string): string {
  return FIELD_LABELS[field] ?? field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PersonalizationImpactModal({
  preflight,
  onConfirm,
  onCancel,
  isSaving = false,
}: PersonalizationImpactModalProps) {
  const isMajor = preflight.severity === 'major_reset'

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="impact-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className={`px-6 pt-6 pb-4 ${isMajor ? 'bg-rose-50' : 'bg-amber-50'}`}>
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${
                isMajor ? 'bg-rose-100' : 'bg-amber-100'
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${isMajor ? 'text-rose-600' : 'text-amber-600'}`}
              />
            </div>
            <div>
              <h2
                id="impact-modal-title"
                className={`text-base font-semibold ${isMajor ? 'text-rose-900' : 'text-amber-900'}`}
              >
                {preflight.user_display_title || 'Profile change detected'}
              </h2>
              <p className={`mt-1 text-sm ${isMajor ? 'text-rose-700' : 'text-amber-700'}`}>
                {preflight.user_display_body || preflight.message}
              </p>
            </div>
          </div>
        </div>

        {/* Changed fields list */}
        {preflight.changed_fields.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Fields changing
            </p>
            <div className="flex flex-wrap gap-1.5">
              {preflight.changed_fields.map((f) => (
                <span
                  key={f}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isMajor
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {formatField(f)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* What is preserved note */}
        {isMajor && (
          <div className="px-6 py-3 bg-green-50 border-t border-green-100">
            <p className="text-xs text-green-700">
              Your completed items, certificates, and learning progress are fully preserved.
              Only your recommendation queue will be rebuilt.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-full px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
              isMajor
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : isMajor ? (
              'Save and Reset Personalization'
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
