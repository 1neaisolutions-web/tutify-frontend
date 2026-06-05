const KEY = 'tutify_pending_language'

export function savePendingLanguage(code: string) {
  localStorage.setItem(KEY, code)
}

export function loadPendingLanguage(): string | null {
  return localStorage.getItem(KEY)
}

export function clearPendingLanguage() {
  localStorage.removeItem(KEY)
}
