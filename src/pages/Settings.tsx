import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Settings2,
  Bell,
  Moon,
  Sun,
  Globe,
  Palette,
  Laptop,
  Cloud,
  Link2,
  ArrowDownToLine,
  Coins,
  Zap,
  TrendingUp,
  Clock,
  BarChart3,
  Loader2,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react'
import { creditBalanceUiPercents } from '../utils/creditBalanceUi'
import {
  getCreditBalance,
  getUsageSummary,
  getUsageBreakdown,
  getTransactionHistory,
  CreditBalance,
  UsageSummary,
  UsageBreakdownItem,
  CreditTransaction,
} from '../api/subscriptions'
import ActivateCreditsModal from '../components/ActivateCreditsModal'
import { formatDate, formatNumber } from '../lib/i18n/format'
import i18n, { SUPPORTED_LOCALES } from '../i18n'
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '../constants/preferencesOptions'
import {
  setLanguage,
  setTheme,
  setTimezone,
  syncPreferences,
  type Theme,
} from '../redux/features/preferences/preferencesSlice'
import { useTranslation } from 'react-i18next'

type Tab = 'general' | 'notifications' | 'plan' | 'integrations' | 'developer' | 'export'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'plan', label: 'Plan & Credits' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'developer', label: 'Developer' },
  { key: 'export', label: 'Export' },
]

// ── Plan & Credits Tab ────────────────────────────────────────────────────────

function PlanCreditsTab() {
  const [balance, setBalance] = useState<CreditBalance | null>(null)
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [breakdown, setBreakdown] = useState<UsageBreakdownItem[]>([])
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activateOpen, setActivateOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [bal, sum, bk, txns] = await Promise.all([
          getCreditBalance(),
          getUsageSummary(),
          getUsageBreakdown(30),
          getTransactionHistory(1, 10),
        ])
        if (!mounted) return
        setBalance(bal)
        setSummary(sum)
        setBreakdown(bk.breakdown)
        setTransactions(txns.items)
      } catch {
        // Graceful — tables may not exist yet
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [activateOpen]) // re-fetch after modal closes

  const bal = balance?.balance ?? 0
  const total = balance?.total_allocated ?? 0
  const { ratio, barWidthPct, labelPct } = creditBalanceUiPercents(bal, total)

  const barColor = ratio > 0.5 ? 'bg-emerald-500' : ratio > 0.2 ? 'bg-amber-500' : 'bg-red-500'
  const pctColor = ratio > 0.5 ? 'text-emerald-600' : ratio > 0.2 ? 'text-amber-600' : 'text-red-600'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Coins className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your credits</h2>
              {balance?.subscription_started_at && (
                <p className="text-xs text-gray-400">
                  Member since{' '}
                  {formatDate(balance.subscription_started_at, { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActivateOpen(true)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition"
          >
            + Activate code
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{formatNumber(bal)}</span>
            {total > 0 && (
              <span className="text-sm text-gray-400">/ {formatNumber(total)} credits</span>
            )}
          </div>

          {total > 0 && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(100, barWidthPct)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className={`font-semibold ${pctColor}`}>{labelPct}% remaining</span>
                {balance?.expires_at && !balance.auto_renew && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires{' '}
                    {formatDate(balance.expires_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {balance?.auto_renew && (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Zap className="h-3 w-3" />
                    Auto-renewing
                  </span>
                )}
              </div>
            </div>
          )}

          {bal === 0 && !loading && (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">No active credits. Activate a code to get started.</p>
              <button
                onClick={() => setActivateOpen(true)}
                className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-500"
              >
                Activate credits →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Usage breakdown */}
      {breakdown.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Usage breakdown</h2>
            </div>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.feature_key} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-sm font-medium text-gray-700 truncate">
                  {item.display_name}
                </div>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-500"
                    style={{ width: `${item.pct_of_total}%` }}
                  />
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-semibold text-gray-700">{item.credits}</span>
                  <span className="text-xs text-gray-400 ml-1">cr</span>
                </div>
                <span className="w-10 text-right text-xs text-gray-400">{item.pct_of_total}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Activity</h2>
          </div>
          <div className="space-y-1">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    txn.type === 'credit' || txn.type === 'renewal'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {txn.type === 'credit' || txn.type === 'renewal'
                      ? <Zap className="h-3.5 w-3.5" />
                      : <Coins className="h-3.5 w-3.5" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {txn.description || txn.feature_key || 'Activity'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(txn.created_at, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={`text-sm font-semibold ${
                    txn.amount > 0 ? 'text-emerald-600' : 'text-gray-700'
                  }`}>
                    {txn.amount > 0 ? '+' : ''}{formatNumber(txn.amount)}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {formatNumber(txn.balance_after)} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ActivateCreditsModal open={activateOpen} onClose={() => setActivateOpen(false)} />
    </div>
  )
}

// ── Main Settings page ────────────────────────────────────────────────────────

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const theme = useSelector((s: any) => (s.preferences?.theme ?? 'system') as Theme)
  const language = useSelector((s: any) => (s.preferences?.language ?? 'en-US') as string)
  const timezone = useSelector((s: any) => (s.preferences?.timezone ?? 'UTC') as string)
  const syncStatus = useSelector((s: any) => (s.preferences?.syncStatus ?? 'idle') as string)

  const [languageOpen, setLanguageOpen] = useState(false)
  const [timezoneOpen, setTimezoneOpen] = useState(false)
  const [tzQuery, setTzQuery] = useState('')
  const { t } = useTranslation()

  const initialTab = (searchParams.get('tab') as Tab) || 'general'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab
    if (tab && TABS.some((t) => t.key === tab)) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'general' ? {} : { tab })
  }

  const currentLanguageLabel =
    LANGUAGE_OPTIONS.find((l) => l.value === language)?.label ||
    LANGUAGE_OPTIONS[0]?.label ||
    language

  const currentTimezoneLabel = TIMEZONE_OPTIONS.find((z) => z.value === timezone)?.label ?? timezone

  const filteredTimezones = useMemo(() => {
    const q = tzQuery.trim().toLowerCase()
    if (!q) return TIMEZONE_OPTIONS.slice(0, 120)
    return TIMEZONE_OPTIONS.filter((z) => z.value.toLowerCase().includes(q) || z.label.toLowerCase().includes(q)).slice(0, 120)
  }, [tzQuery])

  const onSelectLanguage = (next: string) => {
    const supported = (SUPPORTED_LOCALES as readonly string[]).includes(next)
    const finalLang = supported ? next : 'en-US'
    dispatch(setLanguage(finalLang))
    dispatch(syncPreferences({ language: finalLang }) as any)
    i18n.changeLanguage(finalLang).catch(() => {})
    setLanguageOpen(false)
  }

  const onSelectTimezone = (next: string) => {
    dispatch(setTimezone(next))
    dispatch(syncPreferences({ timezone: next }) as any)
    setTimezoneOpen(false)
    setTzQuery('')
  }

  const onSelectTheme = (next: Theme) => {
    dispatch(setTheme(next))
    dispatch(syncPreferences({ theme: next }) as any)
  }

  const SyncPill = () => {
    if (syncStatus === 'idle') return null
    if (syncStatus === 'syncing') {
      return (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{t('settings.general.syncSaving')}</span>
        </div>
      )
    }
    if (syncStatus === 'synced') {
      return (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>{t('settings.general.syncSaved')}</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>{t('settings.general.syncError')}</span>
      </div>
    )
  }

  const integrations = [
    { name: 'Google Classroom', status: 'Connected', description: 'Sync assignments and rosters automatically.' },
    { name: 'Microsoft Teams', status: 'Available', description: 'Enable Teams meetings and assignment syncing.' },
    { name: 'Canvas LMS', status: 'Coming soon', description: 'Direct gradebook integration for Canvas users.' },
  ]

  const notificationPrefs = [
    { label: 'Product updates & release notes', channel: 'Email + in-app' },
    { label: 'Lesson plan reminders', channel: 'Email only' },
    { label: 'Weekly insights report', channel: 'In-app only' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'plan' ? (
        <PlanCreditsTab />
      ) : (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            {activeTab === 'general' && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{t('settings.general.title')}</h2>
                  <SyncPill />
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t('settings.general.language.label')}</p>
                        <p>{currentLanguageLabel}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setLanguageOpen((v) => !v)}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-500"
                      >
                        {t('settings.general.language.change')}
                      </button>
                      {languageOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setLanguageOpen(false)} />
                          <div className="absolute right-0 top-7 z-20 w-72 rounded-2xl border border-gray-200 bg-white shadow-xl py-1">
                            {LANGUAGE_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => onSelectLanguage(opt.value)}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                                  opt.value === language ? 'font-semibold text-primary-600' : 'text-gray-700'
                                }`}
                              >
                                <span>{opt.label}</span>
                                {opt.value === language && <CheckCircle className="h-4 w-4 text-primary-500" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t('settings.general.timezone.label')}</p>
                        <p>{currentTimezoneLabel}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setTimezoneOpen((v) => !v)}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-500"
                      >
                        {t('settings.general.timezone.adjust')}
                      </button>
                      {timezoneOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => {
                              setTimezoneOpen(false)
                              setTzQuery('')
                            }}
                          />
                          <div className="absolute right-0 top-7 z-20 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl">
                            <div className="border-b border-gray-100 p-3">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                  autoFocus
                                  value={tzQuery}
                                  onChange={(e) => setTzQuery(e.target.value)}
                                  placeholder={`${t('common.search')}…`}
                                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-400"
                                />
                              </div>
                            </div>
                            <ul className="max-h-64 overflow-y-auto py-1">
                              {filteredTimezones.length === 0 ? (
                                <li className="px-4 py-3 text-sm text-gray-400">No timezones match.</li>
                              ) : (
                                filteredTimezones.map((z) => (
                                  <li key={z.value}>
                                    <button
                                      onClick={() => onSelectTimezone(z.value)}
                                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                                        z.value === timezone ? 'font-semibold text-primary-600' : 'text-gray-700'
                                      }`}
                                    >
                                      {z.label}
                                    </button>
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-rose-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t('settings.general.theme.label')}</p>
                        <p className="capitalize">{theme}{theme === 'system' ? ' (follows device)' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                      {([
                        { value: 'light' as Theme, icon: Sun, label: t('settings.general.theme.light') },
                        { value: 'dark' as Theme, icon: Moon, label: t('settings.general.theme.dark') },
                        { value: 'system' as Theme, icon: Laptop, label: t('settings.general.theme.system') },
                      ] as const).map((opt) => {
                        const Icon = opt.icon
                        const active = theme === opt.value
                        return (
                          <button
                            key={opt.value}
                            onClick={() => onSelectTheme(opt.value)}
                            title={opt.label}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                              active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{opt.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-4 text-sm text-gray-600">
                  {notificationPrefs.map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{pref.label}</p>
                        <p className="text-xs text-gray-500">Current channel: {pref.channel}</p>
                      </div>
                      <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">Edit</button>
                    </div>
                  ))}
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Manage notification defaults
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="rounded-lg border border-gray-100 px-4 py-3 hover:border-primary-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Cloud className="h-5 w-5 text-sky-500" />
                          <div>
                            <p className="font-medium text-gray-900">{integration.name}</p>
                            <p className="text-xs text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          {integration.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Add new integration
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {(activeTab === 'developer' || activeTab === 'general') && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">API & developer access</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <Link2 className="h-5 w-5 text-fuchsia-600" />
                    <div>
                      <p className="font-medium text-gray-900">Connected apps</p>
                      <p>3 apps have access to your teaching workspace.</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Manage API tokens
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'export' || activeTab === 'general') && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Export & backup</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowDownToLine className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="font-medium text-gray-900">Download workspace data</p>
                        <p className="text-xs text-gray-500">Templates, assessments, and chat history</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                      Export
                    </button>
                  </div>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    Schedule weekly backups
                  </button>
                </div>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  )
}

export default Settings
