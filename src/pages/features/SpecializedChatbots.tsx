import { useEffect, useState } from 'react'
import {
  Bot,
  Filter,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Atom,
  Beaker,
  Palette,
  Star,
  Brain,
  Code,
  Briefcase,
  Music,
  Camera,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { listChatbots, Chatbot } from '../../api/chatbots'

const generalBot = {
  slug: 'general-teaching-assistant',
  icon: Bot,
  rating: '4.8',
}

type CatalogBotMeta = {
  slug: string
  icon: React.ElementType
  rating: string
}

const subjectCatalog: Record<string, CatalogBotMeta[]> = {
  english: [
    { slug: 'literacy-lab-coach', icon: BookOpen, rating: '4.9' },
    { slug: 'grammar-writing-mentor', icon: BookOpen, rating: '4.8' },
    { slug: 'literature-analysis-expert', icon: BookOpen, rating: '4.7' },
    { slug: 'advanced-knowledge-skills-coach', icon: BookOpen, rating: '4.9' },
    { slug: 'unec-academic-development', icon: BookOpen, rating: '5.0' },
  ],
  mathematics: [
    { slug: 'adaptive-math-strategist', icon: Atom, rating: '4.9' },
    { slug: 'problem-solving-coach', icon: Atom, rating: '4.8' },
    { slug: 'algebra-geometry-tutor', icon: Atom, rating: '4.7' },
  ],
  sciences: [
    { slug: 'stem-inquiry-mentor', icon: Beaker, rating: '4.9' },
    { slug: 'lab-safety-protocol-advisor', icon: Beaker, rating: '4.8' },
    { slug: 'environmental-science-guide', icon: Beaker, rating: '4.7' },
  ],
  business: [
    { slug: 'business-studies-mentor', icon: Briefcase, rating: '4.8' },
    { slug: 'career-readiness-coach', icon: Briefcase, rating: '4.7' },
    { slug: 'marketing-branding-strategist', icon: Briefcase, rating: '4.8' },
  ],
  arts: [
    { slug: 'visual-arts-studio-assistant', icon: Palette, rating: '4.8' },
    { slug: 'music-performance-coach', icon: Music, rating: '4.7' },
    { slug: 'drama-theater-director', icon: Camera, rating: '4.6' },
  ],
  technology: [
    { slug: 'coding-programming-tutor', icon: Code, rating: '4.9' },
    { slug: 'digital-literacy-advisor', icon: Code, rating: '4.8' },
    { slug: 'ai-machine-learning-educator', icon: Brain, rating: '4.7' },
  ],
}

const categoryOrder = ['english', 'mathematics', 'sciences', 'business', 'arts', 'technology'] as const

const subjectIcons: Record<string, React.ElementType> = {
  english: BookOpen,
  mathematics: Atom,
  sciences: Beaker,
  business: Briefcase,
  arts: Palette,
  technology: Code,
}

const subjectColors: Record<string, string> = {
  english: 'bg-blue-50 text-blue-600 border-blue-200',
  mathematics: 'bg-green-50 text-green-600 border-green-200',
  sciences: 'bg-purple-50 text-purple-600 border-purple-200',
  business: 'bg-amber-50 text-amber-600 border-amber-200',
  arts: 'bg-pink-50 text-pink-600 border-pink-200',
  technology: 'bg-indigo-50 text-indigo-600 border-indigo-200',
}

const generalFeatureKeys = [
  'lessonPlanning',
  'assessmentIdeas',
  'classroomManagement',
  'quickQa',
] as const

const SpecializedChatbots = () => {
  const { t } = useTranslation()
  const [businessBotNames, setBusinessBotNames] = useState<Record<string, string>>({})
  const [chatbotAvailability, setChatbotAvailability] = useState<Record<string, boolean> | null>(null)

  const formatRating = (value: string) => t('chatbotsPage.rating', { value })

  useEffect(() => {
    let isMounted = true

    const syncFromBackend = async () => {
      try {
        const chatbots = await listChatbots()
        const avail: Record<string, boolean> = {}
        const names: Record<string, string> = {}
        chatbots.forEach((b) => {
          avail[b.slug] = b.is_active
          if (b.name) names[b.slug] = b.name
        })
        if (isMounted) {
          setChatbotAvailability(avail)
          setBusinessBotNames(names)
        }
      } catch (err) {
        console.warn('Failed to load chatbot availability from API', err)
        if (isMounted) setChatbotAvailability(null)
      }
    }

    syncFromBackend()
    return () => {
      isMounted = false
    }
  }, [])

  const getBotName = (slug: string) => {
    const apiName = businessBotNames[slug]
    if (apiName) return apiName
    return t(`chatbotsPage.catalog.${slug}.name`)
  }

  const getBotDescription = (slug: string) => t(`chatbotsPage.catalog.${slug}.description`)

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-500 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Sparkles className="h-4 w-4" />
              {t('chatbotsPage.hero.badge')}
            </div>
            <h1 className="text-3xl font-semibold lg:text-4xl">{t('chatbotsPage.hero.title')}</h1>
            <p className="text-white/80">{t('chatbotsPage.hero.description')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/chatbots/general-teaching-assistant"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm transition hover:bg-primary-50"
              >
                <Plus className="h-4 w-4" />
                {t('chatbotsPage.hero.startNewChat')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            placeholder={t('chatbotsPage.search.placeholder')}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
            <Filter className="h-4 w-4" />
            {t('chatbotsPage.filter.allBots')}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
            <Star className="h-4 w-4 text-amber-500" />
            {t('chatbotsPage.filter.favorites')}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{t('chatbotsPage.general.sectionTitle')}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{t('chatbotsPage.general.sectionSubtitle')}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <generalBot.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">{t('chatbotsPage.general.name')}</h3>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3" /> {formatRating(generalBot.rating)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{t('chatbotsPage.general.description')}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {generalFeatureKeys.map((featureKey) => (
                  <div key={featureKey} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" />
                    {t(`chatbotsPage.general.features.${featureKey}`)}
                  </div>
                ))}
              </div>
              <Link
                to="/chatbots/general-teaching-assistant"
                className="mt-6 inline-block rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-500"
              >
                {t('chatbotsPage.general.startChatting')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t('chatbotsPage.subjects.title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('chatbotsPage.subjects.description')}</p>
        </div>

        {categoryOrder.map((categoryKey) => {
          const bots = subjectCatalog[categoryKey]
          const SubjectIcon = subjectIcons[categoryKey] ?? Bot

          return (
            <div
              key={categoryKey}
              className="rounded-3xl border border-gray-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 shadow-md"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${subjectColors[categoryKey]}`}>
                  <SubjectIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t(`chatbotsPage.categories.${categoryKey}`)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('chatbotsPage.subjects.botCount', { count: bots.length })}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bots.map((bot) => {
                  const Icon = bot.icon
                  const isAvailable =
                    chatbotAvailability === null || chatbotAvailability[bot.slug] !== false
                  return (
                    <div
                      key={bot.slug}
                      className={`rounded-2xl border border-gray-100 bg-white p-5 ${isAvailable ? '' : 'opacity-70'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isAvailable ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-semibold ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>
                              {getBotName(bot.slug)}
                            </p>
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              {formatRating(bot.rating)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{getBotDescription(bot.slug)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        {isAvailable ? (
                          <Link
                            to={`/chatbots/${bot.slug}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-500"
                          >
                            {t('chatbotsPage.actions.startChat')}
                          </Link>
                        ) : (
                          <span className="text-xs font-medium text-gray-500">
                            {t('chatbotsPage.actions.temporarilyUnavailable')}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 shrink-0">
                          {t('chatbotsPage.actions.creditsApply')}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default SpecializedChatbots
