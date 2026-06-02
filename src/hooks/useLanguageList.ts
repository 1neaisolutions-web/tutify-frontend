import { useState, useEffect } from 'react'
import { apiRequest } from '../api/client'
import { FALLBACK_LANGUAGE_LIST, type LanguageOption } from '../constants/languageData'

interface UseLanguageListReturn {
  languages: LanguageOption[]
  isLoading: boolean
}

export function useLanguageList(): UseLanguageListReturn {
  const [languages, setLanguages] = useState<LanguageOption[]>(FALLBACK_LANGUAGE_LIST)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    apiRequest<LanguageOption[]>('/v1/languages')
      .then((data) => {
        if (!cancelled && data && data.length > 0) setLanguages(data)
      })
      .catch(() => {
        // keep fallback list
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { languages, isLoading }
}
