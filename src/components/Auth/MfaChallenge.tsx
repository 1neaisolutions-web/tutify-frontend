import { useState } from 'react'
import { Shield, Copy, CheckCircle2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { verifyMfaLogin } from '@/redux/features/auth/authSlice'
import { CustomButton, CustomInput } from '@/components/shared'

interface MfaChallengeProps {
  challengeType: 'MFA_ENROLL_REQUIRED' | 'MFA_REQUIRED'
  loginToken: string
  mfaSecret?: string
  otpauthUrl?: string
  onSuccess: (tokens: { access_token: string; refresh_token: string; user: unknown }) => void
  onCancel?: () => void
}

export default function MfaChallenge({ challengeType, loginToken, mfaSecret, otpauthUrl, onSuccess, onCancel }: MfaChallengeProps) {
  const dispatch = useDispatch()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const isEnroll = challengeType === 'MFA_ENROLL_REQUIRED'

  const handleVerify = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await dispatch(verifyMfaLogin({ loginToken, code }))
      if (result?.meta?.requestStatus === 'fulfilled') {
        const res = result.payload as { access_token: string; refresh_token: string; user: unknown }
        onSuccess({ access_token: res.access_token, refresh_token: res.refresh_token, user: res.user })
      } else {
        setError('Invalid code. Please try again.')
      }
    } catch {
      setError('Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copySecret = () => {
    if (mfaSecret) {
      navigator.clipboard.writeText(mfaSecret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-sky-100 p-3 text-sky-600">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEnroll ? 'Set Up Two-Factor Auth' : 'Verify Your Identity'}
          </h2>
          <p className="text-sm text-gray-500">
            {isEnroll ? 'Required for super admin access' : 'Enter your authenticator code'}
          </p>
        </div>
      </div>

      {isEnroll && mfaSecret && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Add this secret to your authenticator app (Google Authenticator, Authy, etc.):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-white px-3 py-2 text-sm font-mono dark:bg-gray-900">{mfaSecret}</code>
            <button onClick={copySecret} className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          {otpauthUrl && (
            <p className="mt-2 text-xs text-gray-500 break-all">{otpauthUrl}</p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          6-digit code
        </label>
        <CustomInput
          value={code}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="text-center text-2xl tracking-widest"
        />
      </div>

      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <div className="flex gap-3">
        {onCancel && (
          <CustomButton variant="outlined" onClick={onCancel} className="flex-1">Cancel</CustomButton>
        )}
        <CustomButton onClick={handleVerify} loading={loading} disabled={code.length < 6} className="flex-1">
          {isEnroll ? 'Enable & Continue' : 'Verify'}
        </CustomButton>
      </div>
    </div>
  )
}
