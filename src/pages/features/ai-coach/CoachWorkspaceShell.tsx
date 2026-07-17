import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Download, RotateCcw, Wrench } from 'lucide-react'
import type { CoachCapability } from '../../../data/coachCatalog'
import { capabilityWorkspacePath } from '../../../data/coachCatalog'

export interface CoachWorkspaceShellProps {
  capability: CoachCapability
  siblings: CoachCapability[]
  categoryKey?: string
  categoryLabel?: string
  children: React.ReactNode
  /** True when there is a result to copy/download */
  hasResult?: boolean
  onCopy?: () => void
  onDownload?: () => void
  onNewTask?: () => void
}

export function CoachWorkspaceShell({
  capability,
  siblings,
  categoryKey,
  categoryLabel,
  children,
  hasResult = false,
  onCopy,
  onDownload,
  onNewTask,
}: CoachWorkspaceShellProps) {
  const backTo = categoryKey ? `/chatbots/category/${categoryKey}` : '/chatbots'
  const backLabel = categoryLabel ? `Back to ${categoryLabel}` : 'AI Coach Desk'

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Wrench className="h-4 w-4" />
                </span>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{capability.label}</h1>
                  <p className="mt-0.5 text-sm text-gray-500">{capability.description}</p>
                </div>
              </div>

              {siblings.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {siblings.map((sib) => {
                    const active = sib.id === capability.id
                    return (
                      <Link
                        key={`${sib.toolSlug}-${sib.id}`}
                        to={capabilityWorkspacePath(sib)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          active
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {sib.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {onNewTask && (
                <button
                  type="button"
                  onClick={onNewTask}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  New task
                </button>
              )}
              {onCopy && (
                <button
                  type="button"
                  onClick={onCopy}
                  disabled={!hasResult}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              )}
              {onDownload && (
                <button
                  type="button"
                  onClick={onDownload}
                  disabled={!hasResult}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">{children}</div>
    </div>
  )
}

export default CoachWorkspaceShell
