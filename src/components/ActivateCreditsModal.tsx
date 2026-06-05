import { useState, useRef, useEffect } from 'react'
import { X, Loader2, CheckCircle2, AlertCircle, Coins } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { redeemCode } from '../api/subscriptions'
import { useRefreshCreditBalance } from '../hooks/useRefreshCreditBalance'
import { formatAccessCodeInput } from '../utils/accessCodeDisplay'
import { formatDate, formatNumber } from '../lib/i18n/format'

interface Props {
  open: boolean
  onClose: () => void
}

type Stage = 'idle' | 'loading' | 'success' | 'error'

export default function ActivateCreditsModal({ open, onClose }: Props) {
  const { t } = useTranslation()
  const refreshCreditBalance = useRefreshCreditBalance()
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState<{ credits_added: number; expires_at: string | null; auto_renew: boolean } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setCode('')
      setStage('idle')
      setErrorMsg('')
      setResult(null)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(formatAccessCodeInput(e.target.value))
    if (stage === 'error') setStage('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const raw = code.replace(/-/g, '')
    if (raw.length < 3) return

    setStage('loading')
    try {
      const res = await redeemCode(raw)
      if (res.success) {
        setResult({ credits_added: res.credits_added, expires_at: res.expires_at, auto_renew: res.auto_renew })
        setStage('success')
        await refreshCreditBalance()
      } else {
        setErrorMsg(res.error || t('credits.activate.errors.invalid'))
        setStage('error')
      }
    } catch {
      setErrorMsg(t('credits.activate.errors.generic'))
      setStage('error')
    }
  }

  const handleDone = () => {
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={stage !== 'loading' ? onClose : undefined}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {stage !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="p-8">
          {stage === 'success' && result ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('credits.activate.success.title')}</h2>
                <p className="mt-1 text-sm text-gray-500">{t('credits.activate.success.subtitle')}</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t('credits.activate.success.creditsAdded')}</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(result.credits_added)}
                  </span>
                </div>
                {result.expires_at && !result.auto_renew && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t('credits.activate.success.validUntil')}</span>
                    <span className="font-medium text-gray-700">
                      {formatDate(result.expires_at, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {result.auto_renew && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t('credits.activate.success.renewal')}</span>
                    <span className="font-medium text-green-600">{t('credits.activate.success.autoRenewing')}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleDone}
                className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-500 transition"
              >
                {t('credits.activate.success.cta')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <Coins className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{t('credits.activate.title')}</h2>
                    <p className="text-sm text-gray-500">{t('credits.activate.subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('credits.activate.codeLabel')}
                </label>
                <input
                  ref={inputRef}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={t('credits.activate.codePlaceholder')}
                  disabled={stage === 'loading'}
                  className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-mono font-semibold tracking-widest transition focus:outline-none focus:ring-2 ${
                    stage === 'error'
                      ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-100'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {stage === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={stage === 'loading' || code.replace(/-/g, '').length < 3}
                className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {stage === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('credits.activate.actions.activating')}
                  </>
                ) : (
                  t('credits.activate.actions.activate')
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                {t('credits.activate.noCode.prompt')}{' '}
                <a
                  href="mailto:1ne.aisolutions@gmail.com"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  {t('credits.activate.noCode.contact')}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
