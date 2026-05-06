import type { Theme } from '../redux/features/preferences/preferencesSlice'

let systemListener: ((e: MediaQueryListEvent) => void) | null = null

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)')

  if (systemListener && mq) {
    mq.removeEventListener('change', systemListener)
    systemListener = null
  }

  if (theme === 'dark') {
    root.classList.add('dark')
    return
  }
  if (theme === 'light') {
    root.classList.remove('dark')
    return
  }

  // system
  if (!mq) {
    root.classList.remove('dark')
    return
  }
  root.classList.toggle('dark', mq.matches)
  systemListener = () => root.classList.toggle('dark', mq.matches)
  mq.addEventListener('change', systemListener)
}

