import { useState, useEffect } from 'react'
import {
  Plus,
  Copy,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Key,
  Users,
  Zap,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  listAdminCodes,
  createAdminCode,
  toggleAdminCode,
  AdminCode,
  CreateCodePayload,
} from '../../api/subscriptions'
import { formatAccessCodeDisplay } from '../../utils/accessCodeDisplay'

const CODE_TYPES = [
  { value: 'beta', label: 'Beta', description: 'For external testers — limited uses, expires' },
  { value: 'staff', label: 'Staff', description: 'For internal team — auto-renews, unlimited' },
]

function generateCode(type: string): string {
  const prefix = type === 'staff' ? 'STAFF' : 'BETA'
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${rand()}-${rand()}`
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
      <XCircle className="h-3 w-3" /> Inactive
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  return type === 'staff' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
      <Zap className="h-3 w-3" /> Staff
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
      <Key className="h-3 w-3" /> Beta
    </span>
  )
}

export default function AccessCodesAdmin() {
  const [codes, setCodes] = useState<AdminCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CreateCodePayload>({
    code: '',
    code_type: 'beta',
    credit_allocation: 50000,
    validity_days: 30,
    max_uses: null,
    auto_renew: false,
    auto_renew_threshold_pct: 20,
    description: '',
  })

  const load = async () => {
    try {
      setLoading(true)
      const data = await listAdminCodes()
      setCodes(data)
    } catch (e: any) {
      setError('Failed to load codes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleTypeChange = (type: string) => {
    setForm((f) => ({
      ...f,
      code_type: type,
      auto_renew: type === 'staff',
      max_uses: type === 'staff' ? null : f.max_uses,
      code: generateCode(type),
    }))
  }

  const handleGenerate = () => {
    setForm((f) => ({ ...f, code: generateCode(f.code_type) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createAdminCode(form)
      await load()
      setShowForm(false)
      setForm({
        code: '',
        code_type: 'beta',
        credit_allocation: 50000,
        validity_days: 30,
        max_uses: null,
        auto_renew: false,
        auto_renew_threshold_pct: 20,
        description: '',
      })
    } catch (e: any) {
      setError(e.message || 'Failed to create code')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    setToggling(id)
    try {
      await toggleAdminCode(id, !current)
      setCodes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
      )
    } catch {
      setError('Failed to update code')
    } finally {
      setToggling(null)
    }
  }

  const handleCopy = (code: string) => {
    const text = formatAccessCodeDisplay(code)
    navigator.clipboard.writeText(text)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const activeCodes = codes.filter((c) => c.is_active)
  const totalRedemptions = codes.reduce((sum, c) => sum + c.times_used, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Access Codes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage credit activation codes for users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              if (!showForm) {
                setForm((f) => ({ ...f, code: generateCode(f.code_type) }))
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 transition"
          >
            {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'New Code'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total codes', value: codes.length, icon: Key, color: 'bg-primary-50 text-primary-600' },
          { label: 'Active codes', value: activeCodes.length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total activations', value: totalRedemptions, icon: Users, color: 'bg-amber-50 text-amber-600' },
          { label: 'Auto-renewing', value: codes.filter((c) => c.auto_renew && c.is_active).length, icon: Zap, color: 'bg-indigo-50 text-indigo-600' },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-6 border-2 border-primary-100">
          <h2 className="text-base font-semibold text-gray-900">Create new access code</h2>

          {/* Type selector */}
          <div className="grid grid-cols-2 gap-3">
            {CODE_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTypeChange(t.value)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  form.code_type === t.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TypeBadge type={t.value} />
                  <span className="font-semibold text-gray-900 text-sm">{t.label}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{t.description}</p>
              </button>
            ))}
          </div>

          {/* Code field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Access code</label>
            <div className="flex gap-2">
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                required
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-mono text-sm font-semibold tracking-widest uppercase focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="CODE-XXXX-XXXX"
              />
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Credit allocation + validity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Credit allocation</label>
              <input
                type="number"
                value={form.credit_allocation}
                onChange={(e) => setForm((f) => ({ ...f, credit_allocation: Number(e.target.value) }))}
                min={1}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <p className="text-xs text-gray-400">Credits added on activation</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Valid for (days)</label>
              <input
                type="number"
                value={form.validity_days}
                onChange={(e) => setForm((f) => ({ ...f, validity_days: Number(e.target.value) }))}
                min={1}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <p className="text-xs text-gray-400">Days from activation date</p>
            </div>
          </div>

          {/* Max uses (beta only) */}
          {form.code_type === 'beta' && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Max activations{' '}
                <span className="text-gray-400 font-normal">(leave blank for unlimited)</span>
              </label>
              <input
                type="number"
                value={form.max_uses ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))
                }
                min={1}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="e.g. 100"
              />
            </div>
          )}

          {/* Auto-renew threshold (staff only) */}
          {form.code_type === 'staff' && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Auto-renew when balance drops below (%)
              </label>
              <input
                type="number"
                value={form.auto_renew_threshold_pct}
                onChange={(e) =>
                  setForm((f) => ({ ...f, auto_renew_threshold_pct: Number(e.target.value) }))
                }
                min={5}
                max={50}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <p className="text-xs text-gray-400">
                Credits will be topped back up to the full allocation when balance falls below this threshold
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="e.g. May 2025 beta cohort"
            />
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm space-y-1 text-gray-600">
            <p className="font-medium text-gray-800 mb-2">Code summary</p>
            <p>Code: <span className="font-mono font-semibold text-gray-900">{form.code ? formatAccessCodeDisplay(form.code) : '—'}</span></p>
            <p>Type: <span className="font-medium text-gray-900 capitalize">{form.code_type}</span></p>
            <p>Gives: <span className="font-medium text-gray-900">{form.credit_allocation.toLocaleString()} credits</span></p>
            <p>Valid for: <span className="font-medium text-gray-900">{form.validity_days} days from activation</span></p>
            {form.code_type === 'beta' && (
              <p>Max uses: <span className="font-medium text-gray-900">{form.max_uses ?? 'Unlimited'}</span></p>
            )}
            {form.code_type === 'staff' && (
              <p>Auto-renews at: <span className="font-medium text-gray-900">{form.auto_renew_threshold_pct}% balance</span></p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create code
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Codes list */}
      <div className="card p-0 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">All codes</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : codes.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Key className="mx-auto mb-3 h-10 w-10 text-gray-200" />
            <p className="text-sm font-medium">No codes yet</p>
            <p className="text-xs mt-1">Create your first access code above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {codes.map((code) => (
              <div
                key={code.id}
                className={`flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50 ${
                  !code.is_active ? 'opacity-60' : ''
                }`}
              >
                {/* Code + type */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-gray-900 tracking-wider">
                      {formatAccessCodeDisplay(code.code)}
                    </span>
                    <TypeBadge type={code.code_type} />
                    <StatusBadge active={code.is_active} />
                    {code.auto_renew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                        <RefreshCw className="h-3 w-3" /> Auto-renew
                      </span>
                    )}
                  </div>
                  {code.description && (
                    <p className="mt-0.5 text-xs text-gray-400">{code.description}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="hidden lg:flex items-center gap-6 text-sm text-gray-500 shrink-0">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{code.credit_allocation.toLocaleString()}</p>
                    <p className="text-xs">credits</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{code.validity_days}d</p>
                    <p className="text-xs">validity</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">
                      {code.times_used}{code.max_uses ? ` / ${code.max_uses}` : ''}
                    </p>
                    <p className="text-xs">used</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(code.code)}
                    title="Copy code"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-primary-200 hover:text-primary-600 transition"
                  >
                    {copied === code.code ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggle(code.id, code.is_active)}
                    disabled={toggling === code.id}
                    title={code.is_active ? 'Deactivate' : 'Activate'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-primary-200 hover:text-primary-600 transition disabled:opacity-50"
                  >
                    {toggling === code.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : code.is_active ? (
                      <ToggleRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
