import { describe, expect, it } from 'vitest'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import enUS from '../locales/en-US.json'
import esES from '../locales/es-ES.json'
import frFR from '../locales/fr-FR.json'
import ptBR from '../locales/pt-BR.json'
import deDE from '../locales/de-DE.json'
import urPK from '../locales/ur-PK.json'
import hiIN from '../locales/hi-IN.json'

import { FALLBACK_LANGUAGE_LIST } from '../constants/languageData'
import {
  FULL_LOCALE_CODES,
  FULLY_TRANSLATED_LOCALES,
  SHELL_TRANSLATION_KEYS,
  getLanguageExpectation,
  hasUiTranslation,
  isResolvedTranslation,
  PREFIX_BUNDLE,
  resolveTranslationLocale,
} from './languageConfig'

const __testDir = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__testDir, '../locales')

const SKIP_LOCALE_FILES = new Set([
  'locale-manifest.json',
  'dashboard-by-prefix.json',
  'shell-critical-overrides.json',
])

const dynamicResources = Object.fromEntries(
  fs
    .readdirSync(localesDir)
    .filter(
      (f) =>
        f.endsWith('.json') &&
        !SKIP_LOCALE_FILES.has(f) &&
        !f.endsWith('-shell.json'),
    )
    .map((f) => {
      const code = f.replace('.json', '')
      const translation = JSON.parse(fs.readFileSync(path.join(localesDir, f), 'utf8'))
      return [code, { translation }]
    }),
)

const RESOURCES: Record<string, { translation: Record<string, unknown> }> = {
  'en-US': { translation: enUS },
  'es-ES': { translation: esES },
  'fr-FR': { translation: frFR },
  'pt-BR': { translation: ptBR },
  'de-DE': { translation: deDE },
  'ur-PK': { translation: urPK },
  'hi-IN': { translation: hiIN },
  ...dynamicResources,
}

for (const [prefix, fullCode] of Object.entries(PREFIX_BUNDLE)) {
  if (RESOURCES[fullCode]) {
    RESOURCES[prefix] = RESOURCES[fullCode]
  }
}
for (const code of Object.keys(RESOURCES)) {
  const lang = code.split('-')[0]?.toLowerCase()
  if (lang && !RESOURCES[lang]) {
    RESOURCES[lang] = RESOURCES[code]
  }
}

function createTestI18n() {
  const instance = i18n.createInstance()
  instance.use(initReactI18next).init({
    lng: 'en-US',
    fallbackLng: 'en-US',
    resources: RESOURCES,
    interpolation: { escapeValue: false },
    initImmediate: false,
  })
  return instance
}

function tForLocale(instance: typeof i18n, locale: string, key: string): string {
  instance.changeLanguage(locale)
  return instance.t(key)
}

describe('locale resource loading', () => {
  it('loads tl-PH with translated nav.dashboard', () => {
    expect(RESOURCES['tl-PH']).toBeDefined()
    expect(RESOURCES['tl-PH'].translation.nav.dashboard).toBe('Tablero')
    expect(RESOURCES['tl-PH'].translation.settings.general.title).toBe(
      'Pangkalahatang kagustuhan',
    )
  })

  it('i18n instance resolves tl-PH nav.dashboard', () => {
    const instance = createTestI18n()
    expect(tForLocale(instance, 'tl-PH', 'nav.dashboard')).toBe('Tablero')
    expect(tForLocale(instance, 'tl-PH', 'settings.general.title')).toBe(
      'Pangkalahatang kagustuhan',
    )
  })
})

describe('resolveTranslationLocale — every dropdown language', () => {
  it.each(FALLBACK_LANGUAGE_LIST.map((l) => [l.code, l.name] as const))(
    '%s (%s) resolves to a registered bundle',
    (code) => {
      const bundle = resolveTranslationLocale(code)
      expect(
        FULLY_TRANSLATED_LOCALES.includes(bundle as (typeof FULLY_TRANSLATED_LOCALES)[number]),
      ).toBe(true)
    },
  )

  it.each([
    ['en-US', 'en-US'],
    ['en-GB', 'en-US'],
    ['es-MX', 'es-ES'],
    ['fr-CA', 'fr-FR'],
    ['pt-PT', 'pt-BR'],
    ['de-AT', 'de-DE'],
    ['ur-PK', 'ur-PK'],
    ['hi-IN', 'hi-IN'],
    ['he-IL', 'he-IL'],
    ['ar-SA', 'ar-SA'],
    ['zh-CN', 'zh-CN'],
    ['ja-JP', 'ja-JP'],
  ] as const)('maps %s → %s', (code, expected) => {
    expect(resolveTranslationLocale(code)).toBe(expected)
  })
})

describe('hasUiTranslation — every dropdown language', () => {
  it.each(FALLBACK_LANGUAGE_LIST.map((l) => l.code))('%s has UI translation', (code) => {
    expect(hasUiTranslation(code)).toBe(true)
  })
})

describe('shell keys — no raw key paths in any UI bundle', () => {
  const instance = createTestI18n()

  it.each(FULL_LOCALE_CODES.filter((code) => code !== 'en-US'))(
    'locale %s resolves all shell keys',
    (locale) => {
      for (const key of SHELL_TRANSLATION_KEYS) {
        const value = tForLocale(instance, locale, key)
        expect(isResolvedTranslation(key, value), `${locale} ${key} → "${value}"`).toBe(true)
      }
    },
  )
})

describe('shell locales translate nav (not English duplicate)', () => {
  const instance = createTestI18n()
  const enDashboard = tForLocale(instance, 'en-US', 'nav.dashboard')

  it('Hindi dashboard label differs from English', () => {
    const hi = tForLocale(instance, 'hi-IN', 'nav.dashboard')
    expect(hi).not.toBe(enDashboard)
    expect(hi).toBe('डैशबोर्ड')
  })

  it('Urdu dashboard label differs from English', () => {
    const ur = tForLocale(instance, 'ur-PK', 'nav.dashboard')
    expect(ur).not.toBe(enDashboard)
    expect(ur).toBe('ڈیش بورڈ')
  })

  it('German dashboard label is translated', () => {
    const de = tForLocale(instance, 'de-DE', 'nav.dashboard')
    expect(de).toBe('Übersicht')
    expect(de).not.toBe(enDashboard)
  })

  it('German header activate credits is translated', () => {
    const en = tForLocale(instance, 'en-US', 'layout.activateCredits')
    const de = tForLocale(instance, 'de-DE', 'layout.activateCredits')
    expect(de).not.toBe(en)
    expect(de).toBe('Guthaben aktivieren')
  })

  it.each([
    ['he-IL', 'Hebrew'],
    ['ar-SA', 'Arabic'],
    ['ja-JP', 'Japanese'],
    ['ru-RU', 'Russian'],
    ['zh-HK', 'Chinese HK'],
    ['ko-KR', 'Korean'],
  ] as const)('%s (%s) dashboard differs from English', (code) => {
    const bundle = resolveTranslationLocale(code)
    const value = tForLocale(instance, bundle, 'nav.dashboard')
    expect(value).not.toBe(enDashboard)
    expect(isResolvedTranslation('nav.dashboard', value)).toBe(true)
  })
})

describe('all dropdown languages — nav.dashboard is NOT English', () => {
  const instance = createTestI18n()
  const enDashboard = tForLocale(instance, 'en-US', 'nav.dashboard')
  const nonEnglishCodes = FALLBACK_LANGUAGE_LIST.map((l) => l.code).filter(
    (code) => !code.startsWith('en'),
  )

  it.each(nonEnglishCodes)(
    '%s nav.dashboard is translated (not English)',
    (code) => {
      const bundle = resolveTranslationLocale(code)
      const value = tForLocale(instance, bundle, 'nav.dashboard')
      expect(value, `${code} shows English nav.dashboard`).not.toBe(enDashboard)
      expect(isResolvedTranslation('nav.dashboard', value)).toBe(true)
    },
  )
})

describe('all dropdown languages — settings.general.title is NOT English', () => {
  const instance = createTestI18n()
  const enSettingsTitle = tForLocale(instance, 'en-US', 'settings.general.title')
  const nonEnglishCodes = FALLBACK_LANGUAGE_LIST.map((l) => l.code).filter(
    (code) => !code.startsWith('en'),
  )

  it.each(nonEnglishCodes)(
    '%s settings.general.title is translated',
    (code) => {
      const bundle = resolveTranslationLocale(code)
      const value = tForLocale(instance, bundle, 'settings.general.title')
      expect(value, `${code} shows English settings.general.title`).not.toBe(enSettingsTitle)
    },
  )
})

const DASHBOARD_HOME_KEYS = [
  'dashboard.greetingMorning',
  'dashboard.createFirstQuiz',
  'dashboard.totalContent',
  'dashboard.thisWeek',
  'dashboard.workspaceReady',
] as const

describe('dashboard home — translated locales', () => {
  const instance = createTestI18n()
  const enGreeting = tForLocale(instance, 'en-US', 'dashboard.greetingMorning')

  it.each([
    'ur-PK',
    'hi-IN',
    'de-DE',
    'es-ES',
    'fr-FR',
    'pt-BR',
    'ar-SA',
    'he-IL',
    'zh-CN',
    'ko-KR',
    'ja-JP',
    'ru-RU',
  ] as const)('%s dashboard home strings are translated', (code) => {
    const bundle = resolveTranslationLocale(code)
    for (const key of DASHBOARD_HOME_KEYS) {
      const value = tForLocale(instance, bundle, key)
      expect(isResolvedTranslation(key, value), `${code} ${key} → "${value}"`).toBe(true)
      expect(value, `${code} ${key}`).not.toBe(tForLocale(instance, 'en-US', key))
    }
    expect(tForLocale(instance, bundle, 'dashboard.greetingMorning')).not.toBe(enGreeting)
  })
})

describe('full locales have distinct translations from English', () => {
  const instance = createTestI18n()
  const enSettingsTitle = tForLocale(instance, 'en-US', 'settings.general.title')

  it.each(['de-DE'] as const)('%s settings title is translated', (locale) => {
    const value = tForLocale(instance, locale, 'settings.general.title')
    expect(value).not.toBe(enSettingsTitle)
    expect(isResolvedTranslation('settings.general.title', value)).toBe(true)
  })
})

describe('every full locale has a resource file', () => {
  it('manifest full count matches loaded locale resources', () => {
    expect(FULL_LOCALE_CODES.length).toBeGreaterThan(70)
    for (const code of FULL_LOCALE_CODES) {
      expect(RESOURCES[code], `missing resource for ${code}`).toBeDefined()
    }
  })
})

describe('getLanguageExpectation', () => {
  it('returns full uiMode for non-English bundles', () => {
    expect(getLanguageExpectation('zh-HK').uiMode).toBe('full')
    expect(getLanguageExpectation('ja-JP').uiMode).toBe('full')
  })
})

const TEACHER_ROUTE_SPOT_KEYS = [
  'nav.dashboard',
  'teacherTools.createQuiz',
  'templatesLibrary.templates',
  'templateRunner.generate',
  'teacherTools.overview.heroTitle',
  'quiz.title',
  'quiz.listSubtitle',
  'nav.exams',
  'nav.assignment',
  'personalizationPage.performanceTracker',
  'personalizationPage.focusAreasTitle',
] as const

const REPRESENTATIVE_TEACHER_LOCALES = ['de-DE', 'fr-FR', 'is-IS', 'ja-JP', 'ar-SA'] as const

describe('teacher route spot checks — zh-CN differs from English', () => {
  const instance = createTestI18n()

  it.each(TEACHER_ROUTE_SPOT_KEYS)('zh-CN %s is translated', (key) => {
    const en = tForLocale(instance, 'en-US', key)
    const zh = tForLocale(instance, 'zh-CN', key)
    expect(zh, `zh-CN ${key} still English`).not.toBe(en)
    expect(isResolvedTranslation(key, zh)).toBe(true)
    expect(zh).not.toMatch(/<g id=/)
  })

  it('zh-CN nav.exams has no HTML artifacts', () => {
    const value = tForLocale(instance, 'zh-CN', 'nav.exams')
    expect(value).not.toMatch(/<[^>]+>/)
    expect(value).toBe('考试')
  })
})

describe.each(REPRESENTATIVE_TEACHER_LOCALES)(
  'teacher route spot checks — %s differs from English',
  (locale) => {
    const instance = createTestI18n()

    it.each(TEACHER_ROUTE_SPOT_KEYS)('%s is translated', (key) => {
      const en = tForLocale(instance, 'en-US', key)
      const value = tForLocale(instance, locale, key)
      expect(value, `${locale} ${key} still English`).not.toBe(en)
      expect(isResolvedTranslation(key, value)).toBe(true)
      expect(value).not.toMatch(/<g id=/)
    })
  },
)

const ROUTE_I18N_SPOT_KEYS = [
  'analyticsPage.title',
  'history.yourTeachingArchive',
  'history.dateRange.today',
  'assessmentPage.assessment',
  'contentPacksPage.title',
  'exploreUseCases.platformTemplates',
  'exploreUseCases.categories.social_studies',
  'chatbotsPage.hero.title',
  'grammarWritingMentor.grammarWritingMentor',
  'grammarWritingMentor.tabs.grammar',
  'literatureAnalysisExpert.tabs.theme',
  'literacyLabCoach.tabs.analyze',
  'sTEMInquiryMentor.tabs.investigation',
  'adaptiveMathStrategist.tabs.problems',
  'problemSolvingCoach.tabs.word-problems',
  'codingProgrammingTutor.tabs.algorithm',
  'labSafetyProtocolAdvisor.tabs.protocols',
  'advancedKnowledgeSkillsCoach.tabs.methods',
  'uNECAcademicDevelopment.tabs.pedagogy',
  'generalTeachingAssistantChat.newConversation',
  'chatbot.common.generating',
] as const

const ROUTE_I18N_LOCALES = ['ur-PK', 'de-DE', 'fr-FR', 'is-IS', 'ja-JP', 'ar-SA'] as const

describe.each(ROUTE_I18N_LOCALES)('route i18n spot checks — %s differs from English', (locale) => {
  const instance = createTestI18n()

  it.each(ROUTE_I18N_SPOT_KEYS)('%s is translated', (key) => {
    const en = tForLocale(instance, 'en-US', key)
    const value = tForLocale(instance, locale, key)
    expect(value, `${locale} ${key} still English`).not.toBe(en)
    expect(isResolvedTranslation(key, value)).toBe(true)
    expect(value).not.toMatch(/<g id=/)
  })
})

describe('language-only alias (PREFIX_BUNDLE)', () => {
  const instance = createTestI18n()

  it('changeLanguage(ar) resolves same as ar-SA for analytics title', () => {
    const arSa = tForLocale(instance, 'ar-SA', 'analyticsPage.title')
    const ar = tForLocale(instance, 'ar', 'analyticsPage.title')
    expect(ar).toBe(arSa)
    expect(ar).not.toBe('Content Analytics')
  })
})

describe('layout direction (LTR shell for all languages)', () => {
  it('documentDirectionForLocale stays ltr for RTL script locales', async () => {
    const { documentDirectionForLocale, isRtlLocale } = await import('./rtlLocales')
    expect(documentDirectionForLocale('ur-PK')).toBe('ltr')
    expect(documentDirectionForLocale('ar-SA')).toBe('ltr')
    expect(isRtlLocale('ur-PK')).toBe(true)
    expect(isRtlLocale('ar-SA')).toBe(true)
  })
})
