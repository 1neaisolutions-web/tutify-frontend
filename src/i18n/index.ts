import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from '../locales/en-US.json'
import esES from '../locales/es-ES.json'
import frFR from '../locales/fr-FR.json'
import ptBR from '../locales/pt-BR.json'
import deDE from '../locales/de-DE.json'
import urPK from '../locales/ur-PK.json'
import hiIN from '../locales/hi-IN.json'

import {
  FULLY_TRANSLATED_LOCALES,
  PARTIAL_LOCALES,
  PREFIX_BUNDLE,
  resolveTranslationLocale,
  hasUiTranslation,
} from './languageConfig'

export {
  FULLY_TRANSLATED_LOCALES,
  FULL_LOCALE_CODES,
  SHELL_MERGED_LOCALES,
  PARTIAL_LOCALES,
  resolveTranslationLocale,
  hasUiTranslation,
} from './languageConfig'
export type { FullyTranslatedLocale, LanguageExpectation, LanguageUiMode } from './languageConfig'
export {
  SHELL_TRANSLATION_KEYS,
  getLanguageExpectation,
  isResolvedTranslation,
  PREFIX_BUNDLE,
} from './languageConfig'
export { tText } from './tText'

/** @deprecated Use FULLY_TRANSLATED_LOCALES */
export const SUPPORTED_LOCALES = FULLY_TRANSLATED_LOCALES

const allLocaleModules = import.meta.glob('../locales/*.json', { eager: true })

const dynamicResources = Object.fromEntries(
  Object.entries(allLocaleModules)
    .map(([filePath, mod]) => {
      const normalized = filePath.replace(/\\/g, '/')
      const code = normalized.match(/\/([^/]+)\.json$/)?.[1] ?? ''
      return [code, { translation: (mod as { default: Record<string, unknown> }).default }]
    })
    .filter(
      ([code]) =>
        code &&
        code !== 'locale-manifest' &&
        code !== 'dashboard-by-prefix' &&
        code !== 'shell-critical-overrides' &&
        !code.endsWith('-shell'),
    ),
)


// Spread glob first, then pin static imports so HMR updates to core locales
// are never overwritten by a stale eager-glob snapshot.
const baseResources = {
  ...dynamicResources,
  'en-US': { translation: enUS },
  'es-ES': { translation: esES },
  'fr-FR': { translation: frFR },
  'pt-BR': { translation: ptBR },
  'de-DE': { translation: deDE },
  'ur-PK': { translation: urPK },
  'hi-IN': { translation: hiIN },
}

/** Map language-only codes (e.g. ar → ar-SA) using locale-manifest canonical bundles. */
const resources = { ...baseResources }
for (const [prefix, fullCode] of Object.entries(PREFIX_BUNDLE)) {
  if (baseResources[fullCode]) {
    resources[prefix] = baseResources[fullCode]
  }
}
for (const code of Object.keys(baseResources)) {
  const lang = code.split('-')[0]?.toLowerCase()
  if (lang && !resources[lang] && baseResources[code]) {
    resources[lang] = baseResources[code]
  }
}

const fallbackLng: Record<string, string[]> = { default: ['en-US'] }
for (const [prefix, fullCode] of Object.entries(PREFIX_BUNDLE)) {
  if (fullCode !== 'en-US' && baseResources[fullCode]) {
    fallbackLng[prefix] = [fullCode, 'en-US']
    fallbackLng[fullCode] = ['en-US']
  }
}

i18n.use(initReactI18next).init({
  lng: 'en-US',
  fallbackLng,
  resources,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  returnNull: false,
  returnEmptyString: false,
  returnObjects: false,
  ...(import.meta.env.DEV
    ? {
        saveMissing: true,
        missingKeyHandler: (_lngs: string[], _ns: string, key: string) => {
          console.warn(`[i18n] MISSING KEY (will show English): "${key}"`)
        },
      }
    : {}),
})

export default i18n
