import { Sparkles } from 'lucide-react'

export function TeacherToolsExemplarReviewBanner() {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
      <div>
        <p className="font-semibold">Exemplar preview</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-900/90">
          Sample content only — nothing is saved until you generate or save a draft. Use{' '}
          <span className="font-medium">Edit requirements</span> to return to configure.
        </p>
      </div>
    </div>
  )
}
