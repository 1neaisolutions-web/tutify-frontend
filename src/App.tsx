import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Router } from './routes'
import { Toastbar } from './components/shared/Toastbar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { applyTheme } from './lib/theme'
import type { Theme } from './redux/features/preferences/preferencesSlice'
import i18n, { SUPPORTED_LOCALES } from './i18n'
import { useDispatch } from 'react-redux'
import { loadFromProfile, setLanguage, setTimezone, syncPreferences } from './redux/features/preferences/preferencesSlice'
import { LOCKED_LANGUAGE, LOCKED_THEME, PREFERENCES_LOCKED } from './config/preferencesLock'

function App() {
  const theme = useSelector((s: any) => (s.preferences?.theme ?? 'system') as Theme)
  const language = useSelector((s: any) => (s.preferences?.language ?? 'en-US') as string)
  const timezone = useSelector((s: any) => (s.preferences?.timezone ?? 'UTC') as string)
  const lastSyncedAt = useSelector((s: any) => (s.preferences?.lastSyncedAt ?? null) as string | null)
  const isAuthenticated = useSelector((s: any) => !!s.auth?.isAuthenticated)
  const profileDetails = useSelector((s: any) => s.auth?.profileDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    // Debug: Log that App component is rendering
    console.log('[App] Component rendered')
  }, [])

  useEffect(() => {
    applyTheme(PREFERENCES_LOCKED ? LOCKED_THEME : theme)
  }, [theme])

  useEffect(() => {
    const finalLang = PREFERENCES_LOCKED ? LOCKED_LANGUAGE : language
    if (finalLang && i18n.language !== finalLang) {
      i18n.changeLanguage(finalLang).catch(() => {})
    }
  }, [language])

  useEffect(() => {
    const prefs = profileDetails?.preferences
    if (prefs) {
      dispatch(loadFromProfile(prefs))
    }
  }, [profileDetails?.preferences])

  useEffect(() => {
    if (!isAuthenticated) return
    if (lastSyncedAt) return
    if (PREFERENCES_LOCKED) return

    const patch: { language?: string; timezone?: string } = {}

    try {
      const detectedLang = navigator.language
      const best =
        (SUPPORTED_LOCALES as readonly string[]).find((l) => l.toLowerCase() === detectedLang.toLowerCase()) ||
        (SUPPORTED_LOCALES as readonly string[]).find((l) => l.split('-')[0] === detectedLang.split('-')[0]) ||
        null
      if (best && best !== language) {
        patch.language = best
        dispatch(setLanguage(best))
      }
    } catch {}

    try {
      const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (detectedTz && detectedTz !== timezone) {
        patch.timezone = detectedTz
        dispatch(setTimezone(detectedTz))
      }
    } catch {}

    if (Object.keys(patch).length > 0) {
      dispatch(syncPreferences(patch) as any)
    }
  }, [isAuthenticated, lastSyncedAt])

  return (
    <ErrorBoundary>
      <Router />
      <Toastbar />
    </ErrorBoundary>
  )
}

export default App

