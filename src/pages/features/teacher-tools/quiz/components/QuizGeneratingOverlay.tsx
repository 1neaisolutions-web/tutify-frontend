import { Loader2, Sparkles } from 'lucide-react'

type Props = {
  open: boolean
  /** 0–1 simulated progress for demo bar */
  progress?: number
}

export function QuizGeneratingOverlay({ open, progress = 0.62 }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gen-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h2 id="gen-title" className="text-lg font-semibold text-gray-900">
              Generating questions
            </h2>
            <p className="text-sm text-gray-600">
              Retrieving catalog passages · shaping stems · balancing formats for your scope…
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-primary-600 transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(8, progress * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" aria-hidden />
            <span>Vector retrieval · constraint checks · item synthesis (demo pipeline)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
