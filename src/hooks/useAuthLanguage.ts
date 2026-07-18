import { useState } from 'react'
import { useDispatch } from 'react-redux'
import i18n, { resolveTranslationLocale } from '../i18n'
import { setLanguage } from '../redux/features/preferences/preferencesSlice'
import { loadPendingLanguage, savePendingLanguage } from '../utils/pendingLanguage'
import type { AppDispatch } from '../redux/store'

export function useAuthLanguage(initial?: string) {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedLanguage, setSelectedLanguage] = useState(
    initial ?? loadPendingLanguage() ?? 'en-US',
  )

  function handleLanguageChange(code: string) {
    setSelectedLanguage(code)
    savePendingLanguage(code)
    dispatch(setLanguage(code))
    i18n.changeLanguage(resolveTranslationLocale(code))
  }

  return { selectedLanguage, handleLanguageChange }
}
