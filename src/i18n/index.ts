import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from '../locales/en-US.json'
import esES from '../locales/es-ES.json'
import frFR from '../locales/fr-FR.json'
import ptBR from '../locales/pt-BR.json'
import deDE from '../locales/de-DE.json'

export const SUPPORTED_LOCALES = ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

i18n.use(initReactI18next).init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  resources: {
    'en-US': { translation: enUS },
    'es-ES': { translation: esES },
    'fr-FR': { translation: frFR },
    'pt-BR': { translation: ptBR },
    'de-DE': { translation: deDE },
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n

