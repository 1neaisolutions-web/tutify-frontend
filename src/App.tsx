import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Router } from './routes'
import { Toastbar } from './components/shared/Toastbar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { applyTheme } from './lib/theme'
import type { Theme } from './redux/features/preferences/preferencesSlice'
import i18n, { resolveTranslationLocale } from './i18n'
import { documentDirectionForLocale } from './i18n/rtlLocales'
import { loadFromProfile } from './redux/features/preferences/preferencesSlice'
import { LOCKED_THEME, THEME_LOCKED } from './config/preferencesLock'
import { loadPendingLanguage } from './utils/pendingLanguage'

function App() {
  const theme = useSelector(
    (s: { preferences?: { theme?: Theme } }) => (s.preferences?.theme ?? 'system') as Theme,
  )
  const language = useSelector(
    (s: { preferences?: { language?: string } }) => (s.preferences?.language ?? 'en-US') as string,
  )
  const isAuthenticated = useSelector(
    (s: { auth?: { isAuthenticated?: boolean } }) => !!s.auth?.isAuthenticated,
  )
  const profileDetails = useSelector(
    (s: { auth?: { profileDetails?: { preferences?: object } } }) => s.auth?.profileDetails,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    applyTheme(THEME_LOCKED ? LOCKED_THEME : theme)
  }, [theme])

  useEffect(() => {
    const resolved = resolveTranslationLocale(language)
    if (i18n.language !== resolved) {
      i18n.changeLanguage(resolved).catch(() => {})
    }
  }, [language])

  const resolvedLocale = resolveTranslationLocale(language)

  useEffect(() => {
    document.documentElement.lang = resolvedLocale
    document.documentElement.dir = documentDirectionForLocale(resolvedLocale)
  }, [resolvedLocale])

  useEffect(() => {
    const prefs = profileDetails?.preferences
    if (prefs) {
      dispatch(loadFromProfile(prefs))
    }
  }, [profileDetails?.preferences, dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      const pending = loadPendingLanguage()
      if (pending) {
        i18n.changeLanguage(resolveTranslationLocale(pending)).catch(() => {})
      }
    }
  }, [isAuthenticated])

  return (
    <ErrorBoundary>
      <div key={resolvedLocale} className="min-h-screen">
        <Router />
        <Toastbar />
      </div>
    </ErrorBoundary>
  )
}

export default App
