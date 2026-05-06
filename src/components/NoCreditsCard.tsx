import { useState, useRef, useEffect, useId } from 'react'
import { Coins, ExternalLink } from 'lucide-react'
import ActivateCreditsModal from './ActivateCreditsModal'

interface NoCreditsCardProps {
  reason?: string
  balance?: number
  required?: number
  /** Compact inline variant for chat message area */
  compact?: boolean
  /** Called after credits are successfully activated */
  onActivated?: () => void
  /**
   * Scroll the card into view when it appears (default true).
   * Disable for rare cases where parent layout handles scroll.
   */
  autoScroll?: boolean
}

export default function NoCreditsCard({
  reason,
  balance,
  required,
  compact = false,
  onActivated,
  autoScroll = true,
}: NoCreditsCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollAnchorId = `no-credits-card-${useId().replace(/:/g, '')}`

  useEffect(() => {
    if (!autoScroll) return
    const el = rootRef.current
    if (!el) return
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      })
    }, 50)
    return () => window.clearTimeout(t)
  }, [autoScroll, reason, balance, required, compact])

  const isExpired = reason === 'credits_expired'
  const title = isExpired ? 'Credits expired' : 'No credits remaining'
  const body = isExpired
    ? 'Your credit balance has expired. Activate an access code to continue using AI features.'
    : 'You need credits to use this feature. Activate an access code to get started.'

  const handleClose = () => {
    setModalOpen(false)
    onActivated?.()
  }

  if (compact) {
    return (
      <>
        <div
          ref={rootRef}
          id={scrollAnchorId}
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3 scroll-mt-24"
        >
          <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
            <Coins className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">{title}</p>
            <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">{body}</p>
            {(balance !== undefined || required !== undefined) && (
              <div className="mt-1.5 flex items-center gap-3 text-xs text-amber-700">
                {balance !== undefined && (
                  <span>Balance: <strong className="text-amber-900">{balance}</strong></span>
                )}
                {required !== undefined && (
                  <span>Required: <strong className="text-amber-900">{required}</strong></span>
                )}
              </div>
            )}
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500 active:scale-95"
              >
                Activate credits
              </button>
              <a
                href="/settings?tab=plan"
                className="text-xs font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2 transition"
              >
                View plan
              </a>
            </div>
          </div>
        </div>
        <ActivateCreditsModal open={modalOpen} onClose={handleClose} />
      </>
    )
  }

  return (
    <>
      <div
        ref={rootRef}
        id={scrollAnchorId}
        className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm scroll-mt-24"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 ring-4 ring-amber-50">
            <Coins className="h-7 w-7 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-amber-900">{title}</h3>
            <p className="text-sm text-amber-700 max-w-xs mx-auto leading-relaxed">{body}</p>
          </div>
          {(balance !== undefined || required !== undefined) && (
            <div className="flex items-center gap-6 rounded-xl bg-white/70 border border-amber-100 px-5 py-3">
              {balance !== undefined && (
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-900">{balance}</div>
                  <div className="text-xs text-amber-600 mt-0.5">your balance</div>
                </div>
              )}
              {balance !== undefined && required !== undefined && (
                <div className="h-8 w-px bg-amber-200" />
              )}
              {required !== undefined && (
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-900">{required}</div>
                  <div className="text-xs text-amber-600 mt-0.5">required</div>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500 active:scale-95"
            >
              Activate credits
            </button>
            <a
              href="/settings?tab=plan"
              className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 transition"
            >
              View plan
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
      <ActivateCreditsModal open={modalOpen} onClose={handleClose} />
    </>
  )
}
