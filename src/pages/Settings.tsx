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
import i18n from '../i18n'
import { TIMEZONE_OPTIONS } from '../constants/preferencesOptions'
import { LanguageSearchDropdown } from '../components/shared/LanguageSearchDropdown'
import { hasUiTranslation, resolveTranslationLocale } from '../i18n'
import { useLanguageList } from '../hooks/useLanguageList'
import { LOCKED_THEME, THEME_LOCKED } from '../config/preferencesLock'
import {
  setLanguage,
  setTheme,
  setTimezone,
  syncPreferences,
  type Theme,
} from '../redux/features/preferences/preferencesSlice'
import { useTranslation } from 'react-i18next'
import { getStudentEvents } from '../panels/student/utils/studentEventLog'

type Tab = 'general' | 'notifications' | 'plan' | 'integrations' | 'developer' | 'export' | 'privacy'

const TAB_KEYS: { key: Tab; labelKey: string }[] = [
  { key: 'general', labelKey: 'settings.tabs.general' },
  { key: 'notifications', labelKey: 'settings.tabs.notifications' },
  { key: 'plan', labelKey: 'settings.tabs.plan' },
  { key: 'privacy', labelKey: 'settings.tabs.privacy' },
  { key: 'integrations', labelKey: 'settings.tabs.integrations' },
  { key: 'developer', labelKey: 'settings.tabs.developer' },
  { key: 'export', labelKey: 'settings.tabs.export' },
]

function PlanCreditsTab() {
  const { t } = useTranslation()
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
              <h2 className="text-lg font-semibold text-gray-900">{t('settings.plan.yourCredits')}</h2>
              {balance?.subscription_started_at && (
                <p className="text-xs text-gray-400">
                  {t('settings.plan.memberSince', {
                    date: formatDate(balance.subscription_started_at, { month: 'long', year: 'numeric' }),
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActivateOpen(true)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition"
          >
            {t('settings.plan.activateCode')}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{formatNumber(bal)}</span>
            {total > 0 && (
              <span className="text-sm text-gray-400">{t('settings.plan.creditsRemaining', { total: formatNumber(total) })}</span>
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
                <span className={`font-semibold ${pctColor}`}>{t('settings.plan.remainingPct', { pct: labelPct })}</span>
                {balance?.expires_at && !balance.auto_renew && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t('settings.plan.expires', {
                      date: formatDate(balance.expires_at, { month: 'short', day: 'numeric', year: 'numeric' }),
                    })}
                  </span>
                )}
                {balance?.auto_renew && (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Zap className="h-3 w-3" />
                    {t('settings.plan.autoRenewing')}
                  </span>
                )}
              </div>
            </div>
          )}

          {bal === 0 && !loading && (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">{t('settings.plan.noActiveCredits')}</p>
              <button
                onClick={() => setActivateOpen(true)}
                className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-500"
              >
                {t('settings.plan.activateCreditsLink')}
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
              <h2 className="text-base font-semibold text-gray-900">{t('settings.plan.usageBreakdown')}</h2>
            </div>
            <span className="text-xs text-gray-400">{t('settings.plan.last30Days')}</span>
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
                  <span className="text-xs text-gray-400 ml-1">{t('credits.plan.creditsShort')}</span>
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
            <h2 className="text-base font-semibold text-gray-900">{t('settings.plan.activity')}</h2>
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
                      {txn.description || txn.feature_key || t('settings.plan.activityFallback')}
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
                    {t('settings.plan.left', { count: formatNumber(txn.balance_after) })}
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
  const userRole = useSelector((s: any) => s.auth?.user?.role as string | undefined)
  const isStudent = String(userRole || '').toLowerCase() === 'student'
  const theme = useSelector((s: any) => (s.preferences?.theme ?? 'system') as Theme)
  const language = useSelector((s: any) => (s.preferences?.language ?? 'en-US') as string)
  const timezone = useSelector((s: any) => (s.preferences?.timezone ?? 'UTC') as string)
  const syncStatus = useSelector((s: any) => (s.preferences?.syncStatus ?? 'idle') as string)

  const [timezoneOpen, setTimezoneOpen] = useState(false)
  const [tzQuery, setTzQuery] = useState('')
  const { t } = useTranslation()
  const { languages } = useLanguageList()

  const languageLabel = useMemo(() => {
    const match = languages.find((l) => l.code === language)
    return match ? `${match.name} (${match.nativeName})` : language
  }, [languages, language])
  const showLanguageFallbackNotice = !hasUiTranslation(language)

  const initialTab = (searchParams.get('tab') as Tab) || 'general'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab
    if (tab && TAB_KEYS.some((t) => t.key === tab)) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'general' ? {} : { tab })
  }

  const studentEventsByModule = useMemo(() => {
    if (!isStudent) return []
    const events = getStudentEvents()
    const counts = new Map<string, number>()
    events.forEach((e) => counts.set(e.module, (counts.get(e.module) || 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [isStudent, activeTab])

  const clearStudentLocalData = () => {
    if (!window.confirm('Clear all locally saved Tutify data (notes, tasks, progress, chat history) on this device? This cannot be undone.')) return
    Object.keys(localStorage)
      .filter((k) => k.startsWith('tutify_student_'))
      .forEach((k) => localStorage.removeItem(k))
    window.location.reload()
  }

  const effectiveTheme: Theme = THEME_LOCKED ? LOCKED_THEME : theme

  const currentTimezoneLabel = TIMEZONE_OPTIONS.find((z) => z.value === timezone)?.label ?? timezone

  const filteredTimezones = useMemo(() => {
    const q = tzQuery.trim().toLowerCase()
    if (!q) return TIMEZONE_OPTIONS.slice(0, 120)
    return TIMEZONE_OPTIONS.filter((z) => z.value.toLowerCase().includes(q) || z.label.toLowerCase().includes(q)).slice(0, 120)
  }, [tzQuery])

  const onSelectLanguage = (next: string) => {
    dispatch(setLanguage(next))
    dispatch(syncPreferences({ language: next }) as any)
    i18n.changeLanguage(resolveTranslationLocale(next)).catch(() => {})
  }

  const onSelectTimezone = (next: string) => {
    dispatch(setTimezone(next))
    dispatch(syncPreferences({ timezone: next }) as any)
    setTimezoneOpen(false)
    setTzQuery('')
  }

  const onSelectTheme = (next: Theme) => {
    if (THEME_LOCKED) return
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
    { nameKey: 'settings.integrations.googleClassroom.name', descKey: 'settings.integrations.googleClassroom.description', statusKey: 'settings.integrations.status.connected' },
    { nameKey: 'settings.integrations.microsoftTeams.name', descKey: 'settings.integrations.microsoftTeams.description', statusKey: 'settings.integrations.status.available' },
    { nameKey: 'settings.integrations.canvasLms.name', descKey: 'settings.integrations.canvasLms.description', statusKey: 'settings.integrations.status.comingSoon' },
  ]

  const notificationPrefs = [
    { labelKey: 'settings.notifications.productUpdates', channelKey: 'settings.notifications.channels.emailAndApp' },
    { labelKey: 'settings.notifications.lessonReminders', channelKey: 'settings.notifications.channels.emailOnly' },
    { labelKey: 'settings.notifications.weeklyInsights', channelKey: 'settings.notifications.channels.appOnly' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 overflow-x-auto">
        {TAB_KEYS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t(tab.labelKey)}
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
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary-500 mt-3 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1.5">{t('settings.general.language.label')}</p>
                      <LanguageSearchDropdown
                        value={language}
                        onChange={onSelectLanguage}
                        placeholder={t('common.search')}
                      />
                      {showLanguageFallbackNotice && (
                        <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                          {t('settings.general.language.uiFallback', { language: languageLabel })}
                        </p>
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
                                <li className="px-4 py-3 text-sm text-gray-400">{t('settings.general.timezone.noMatch')}</li>
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
                        <p className="capitalize">
                          {effectiveTheme}
                          {effectiveTheme === 'system' ? t('settings.general.theme.followsDevice') : ''}
                        </p>
                      </div>
                    </div>
                    {!THEME_LOCKED && (
                      <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                        {([
                          { value: 'light' as Theme, icon: Sun, label: t('settings.general.theme.light') },
                          { value: 'dark' as Theme, icon: Moon, label: t('settings.general.theme.dark') },
                          { value: 'system' as Theme, icon: Laptop, label: t('settings.general.theme.system') },
                        ] as const).map((opt) => {
                          const Icon = opt.icon
                          const active = effectiveTheme === opt.value
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
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.notifications.title')}</h2>
                <div className="space-y-4 text-sm text-gray-600">
                  {notificationPrefs.map((pref) => (
                    <div key={pref.labelKey} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{t(pref.labelKey)}</p>
                        <p className="text-xs text-gray-500">{t('settings.notifications.currentChannel', { channel: t(pref.channelKey) })}</p>
                      </div>
                      <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">{t('settings.notifications.edit')}</button>
                    </div>
                  ))}
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    {t('settings.notifications.manageDefaults')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('settings.privacy.title')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('settings.privacy.subtitle')}</p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="rounded-lg bg-gray-50 px-4 py-3">
                    <p className="font-medium text-gray-900">{t('settings.privacy.items.profile')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('settings.privacy.items.profileHint')}</p>
                  </li>
                  <li className="rounded-lg bg-gray-50 px-4 py-3">
                    <p className="font-medium text-gray-900">{t('settings.privacy.items.activity')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('settings.privacy.items.activityHint')}</p>
                  </li>
                  <li className="rounded-lg bg-gray-50 px-4 py-3">
                    <p className="font-medium text-gray-900">{t('settings.privacy.items.ai')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('settings.privacy.items.aiHint')}</p>
                  </li>
                  <li className="rounded-lg bg-gray-50 px-4 py-3">
                    <p className="font-medium text-gray-900">{t('settings.privacy.items.local')}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('settings.privacy.items.localHint')}</p>
                  </li>
                </ul>

                {isStudent ? (
                  <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-4">
                    <h3 className="text-sm font-semibold text-gray-900">Your data</h3>
                    <p className="mt-1 text-xs text-gray-600">
                      What Tutify's AI has learned from your activity, stored only on this device. Every module writes
                      here when it logs a study session, quiz attempt, or AI conversation — this is the same event
                      stream your Progress and Study Plan pages read from.
                    </p>

                    {studentEventsByModule.length === 0 ? (
                      <p className="mt-3 text-xs text-gray-500">No activity recorded yet on this device.</p>
                    ) : (
                      <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {studentEventsByModule.map(([module, count]) => (
                          <li key={module} className="rounded-md bg-white border border-sky-100 px-3 py-2">
                            <p className="text-xs text-gray-500 capitalize">{module.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-semibold text-gray-900">{count}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      onClick={clearStudentLocalData}
                      className="mt-4 text-xs font-semibold text-red-600 hover:text-red-500"
                    >
                      Clear my local data
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.integrations.title')}</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  {integrations.map((integration) => (
                    <div key={integration.nameKey} className="rounded-lg border border-gray-100 px-4 py-3 hover:border-primary-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Cloud className="h-5 w-5 text-sky-500" />
                          <div>
                            <p className="font-medium text-gray-900">{t(integration.nameKey)}</p>
                            <p className="text-xs text-gray-500">{t(integration.descKey)}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          {t(integration.statusKey)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    {t('settings.integrations.addNew')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {(activeTab === 'developer' || activeTab === 'general') && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('settings.developer.title')}</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <Link2 className="h-5 w-5 text-fuchsia-600" />
                    <div>
                      <p className="font-medium text-gray-900">{t('settings.developer.connectedApps')}</p>
                      <p>{t('settings.developer.connectedAppsDesc')}</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    {t('settings.developer.manageTokens')}
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'export' || activeTab === 'general') && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('settings.export.title')}</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowDownToLine className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="font-medium text-gray-900">{t('settings.export.downloadData')}</p>
                        <p className="text-xs text-gray-500">{t('settings.export.downloadDataDesc')}</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                      {t('common.export')}
                    </button>
                  </div>
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                    {t('settings.export.scheduleBackups')}
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
