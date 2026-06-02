import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Image,
  Upload,
  Sparkles,
  Palette,
  Layers,
  SlidersHorizontal,
  Camera,
  Video,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { ApiError } from '../../api/client'
import { fetchPixGenGeneration, generatePixGenImage } from '../../api/pixgen'
import { parseCreditError, type ParsedCreditError } from '../../utils/creditErrors'
import NoCreditsCard from '../../components/NoCreditsCard'
import { useRefreshCreditBalance } from '../../hooks/useRefreshCreditBalance'

import { useTranslation } from 'react-i18next'

type PreFilledPromptMeta = {
  id: string
  image: string
  style: string
  ratio: string
}

const preFilledPromptMeta: PreFilledPromptMeta[] = [
  {
    id: 'waterCycle',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    style: 'Watercolour storybook',
    ratio: '3:2 Landscape',
  },
  {
    id: 'photosynthesis',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    style: 'Photo-real science lab',
    ratio: '1:1 Square',
  },
  {
    id: 'fractions',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop',
    style: 'Flat infographic',
    ratio: '1:1 Square',
  },
  {
    id: 'worldMap',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop',
    style: 'Flat infographic',
    ratio: '3:2 Landscape',
  },
  {
    id: 'periodicTable',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
    style: 'Photo-real science lab',
    ratio: '2:3 Portrait',
  },
  {
    id: 'solarSystem',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    style: 'Watercolour storybook',
    ratio: '3:2 Landscape',
  },
  {
    id: 'humanBody',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    style: 'Photo-real science lab',
    ratio: '2:3 Portrait',
  },
  {
    id: 'ancientCivilizations',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
    style: 'Flat infographic',
    ratio: '9:16 Vertical',
  },
]

const BATCH_SIZE = 4
const BATCH_CONCURRENCY = 2

const PixGen = () => {
  const { t } = useTranslation()
  const stylePresets = useMemo(
    () => [
      { value: 'Watercolour storybook', label: t('pixGenPage.styles.watercolourStorybook') },
      { value: 'Photo-real science lab', label: t('pixGenPage.styles.photoRealScienceLab') },
      { value: 'Flat infographic', label: t('pixGenPage.styles.flatInfographic') },
      { value: 'Pixel art mini-game', label: t('pixGenPage.styles.pixelArtMiniGame') },
    ],
    [t]
  )
  const aspectRatios = useMemo(
    () => [
      { value: '1:1 Square', label: t('pixGenPage.ratios.square') },
      { value: '3:2 Landscape', label: t('pixGenPage.ratios.landscape') },
      { value: '9:16 Vertical', label: t('pixGenPage.ratios.vertical') },
      { value: '2:3 Portrait', label: t('pixGenPage.ratios.portrait') },
    ],
    [t]
  )
  const inspirationBoards = useMemo(
    () => [
      {
        id: 'slideDecks',
        title: t('pixGenPage.inspiration.slideDecks.title'),
        notes: t('pixGenPage.inspiration.slideDecks.notes'),
      },
      {
        id: 'stemSignage',
        title: t('pixGenPage.inspiration.stemSignage.title'),
        notes: t('pixGenPage.inspiration.stemSignage.notes'),
      },
      {
        id: 'readAloud',
        title: t('pixGenPage.inspiration.readAloud.title'),
        notes: t('pixGenPage.inspiration.readAloud.notes'),
      },
    ],
    [t]
  )
  const automationTracks = useMemo(
    () => [
      {
        id: 'batchLesson',
        label: t('pixGenPage.automation.batchLesson.label'),
        description: t('pixGenPage.automation.batchLesson.description'),
      },
      {
        id: 'curriculumRemix',
        label: t('pixGenPage.automation.curriculumRemix.label'),
        description: t('pixGenPage.automation.curriculumRemix.description'),
      },
      {
        id: 'studentCocreation',
        label: t('pixGenPage.automation.studentCocreation.label'),
        description: t('pixGenPage.automation.studentCocreation.description'),
      },
    ],
    [t]
  )
  const roadmap = useMemo(
    () => [
      {
        id: 'videoOverlays',
        heading: t('pixGenPage.roadmapItems.videoOverlays.heading'),
        description: t('pixGenPage.roadmapItems.videoOverlays.description'),
        owner: t('pixGenPage.roadmapItems.videoOverlays.owner'),
      },
      {
        id: 'assetExport',
        heading: t('pixGenPage.roadmapItems.assetExport.heading'),
        description: t('pixGenPage.roadmapItems.assetExport.description'),
        owner: t('pixGenPage.roadmapItems.assetExport.owner'),
      },
      {
        id: 'brandKitSync',
        heading: t('pixGenPage.roadmapItems.brandKitSync.heading'),
        description: t('pixGenPage.roadmapItems.brandKitSync.description'),
        owner: t('pixGenPage.roadmapItems.brandKitSync.owner'),
      },
    ],
    [t]
  )
  const preFilledPrompts = useMemo(
    () =>
      preFilledPromptMeta.map((meta) => ({
        ...meta,
        title: t(`pixGenPage.prompts.${meta.id}.title`),
        prompt: t(`pixGenPage.prompts.${meta.id}.prompt`),
      })),
    [t]
  )
  const styleLabel = (value: string) =>
    stylePresets.find((s) => s.value === value)?.label ?? value
  const ratioLabel = (value: string) =>
    aspectRatios.find((r) => r.value === value)?.label ?? value

  const [searchParams] = useSearchParams()
  const generationId = searchParams.get('generation')
  const refreshCreditBalance = useRefreshCreditBalance()
  const [selectedStyle, setSelectedStyle] = useState('Watercolour storybook')
  const [selectedRatio, setSelectedRatio] = useState('3:2 Landscape')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [batchImages, setBatchImages] = useState<string[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<(typeof preFilledPrompts)[number] | null>(null)
  const [imageError, setImageError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [creditGate, setCreditGate] = useState<ParsedCreditError | null>(null)

  useEffect(() => {
    if (!generationId) return
    let cancelled = false
    ;(async () => {
      try {
        const gen = await fetchPixGenGeneration(generationId)
        if (cancelled) return
        setPrompt(gen.prompt)
        setSelectedStyle(gen.stylePreset)
        setSelectedRatio(gen.aspectRatio)
        if (gen.imageUrl) {
          setPreviewImage(gen.imageUrl)
          setImageError(false)
        }
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [generationId])

  const getFriendlyErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return t('pixGenPage.errors.sessionExpired')
      }
      if (error.status === 422) {
        return t('pixGenPage.errors.invalidInput')
      }
      if (error.status >= 500) {
        return t('pixGenPage.errors.serviceUnavailable')
      }
      return error.message || fallback
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      if (message.includes('timeout')) {
        return t('pixGenPage.errors.timeout')
      }
      if (message.includes('network') || message.includes('failed to fetch') || message.includes('connect')) {
        return t('pixGenPage.errors.network')
      }
      return error.message || fallback
    }

    return fallback
  }

  const handleUsePrompt = (promptData: (typeof preFilledPrompts)[number]) => {
    setPrompt(promptData.prompt)
    setSelectedStyle(promptData.style)
    setSelectedRatio(promptData.ratio)
    setSelectedPrompt(promptData)
    setPreviewImage(promptData.image)
    setImageError(false)
    setErrorMessage(null)
  }

  const resolvePrompt = () => {
    const typedPrompt = prompt.trim()
    if (typedPrompt) return typedPrompt
    return selectedPrompt?.prompt ?? ''
  }

  const handleGenerateBatch = async () => {
    if (!prompt.trim() && !selectedPrompt) return

    setIsGenerating(true)
    setBatchImages([])
    setImageError(false)
    setErrorMessage(null)
    setCreditGate(null)

    try {
      const payload = {
        prompt: resolvePrompt(),
        stylePreset: selectedStyle,
        aspectRatio: selectedRatio,
      }

      const runNext = async () => generatePixGenImage(payload)
      const tasks = Array.from({ length: BATCH_SIZE }, () => runNext)
      const settled: PromiseSettledResult<Awaited<ReturnType<typeof generatePixGenImage>>>[] = []

      // Run batch with controlled concurrency to reduce provider overload/timeouts.
      for (let i = 0; i < tasks.length; i += BATCH_CONCURRENCY) {
        const chunk = tasks.slice(i, i + BATCH_CONCURRENCY).map((fn) => fn())
        const chunkResults = await Promise.allSettled(chunk)
        settled.push(...chunkResults)
      }

      const generatedImages = settled
        .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof generatePixGenImage>>> => result.status === 'fulfilled')
        .map((result) => result.value.imageUrl)
        .filter((url): url is string => !!url)

      const failedCount = settled.filter((result) => result.status === 'rejected').length

      setBatchImages(generatedImages)
      setPreviewImage(generatedImages[0] ?? null)
      if (generatedImages.length > 0) {
        await refreshCreditBalance()
      }
      if (!generatedImages.length) {
        setErrorMessage(t('pixGenPage.errors.batchNoImages'))
      } else if (failedCount > 0) {
        setErrorMessage(t('pixGenPage.errors.batchPartial', { count: failedCount }))
      }
    } catch (error) {
      const p = parseCreditError(error)
      if (p) {
        setCreditGate(p)
        return
      }
      setErrorMessage(getFriendlyErrorMessage(error, t('pixGenPage.errors.batchFailed')))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSingle = async () => {
    if (!prompt.trim() && !selectedPrompt) return

    setIsGenerating(true)
    setImageError(false)
    setErrorMessage(null)
    setCreditGate(null)

    try {
      const response = await generatePixGenImage({
        prompt: resolvePrompt(),
        stylePreset: selectedStyle,
        aspectRatio: selectedRatio,
      })

      if (response.imageUrl) {
        setPreviewImage(response.imageUrl)
        await refreshCreditBalance()
      } else {
        setPreviewImage(null)
        setErrorMessage(t('pixGenPage.errors.noImageUrl'))
      }
    } catch (error) {
      const p = parseCreditError(error)
      if (p) {
        setCreditGate(p)
        setPreviewImage(null)
        return
      }
      setErrorMessage(getFriendlyErrorMessage(error, t('pixGenPage.errors.generationFailed')))
      setPreviewImage(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPreview = () => {
    if (!previewImage) return
    try {
      const link = document.createElement('a')
      link.href = previewImage
      link.download = 'pixgen-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      setErrorMessage(t('pixGenPage.errors.downloadFailed'))
    }
  }

  return (
    <div className="space-y-10">
      {creditGate && (
        <NoCreditsCard
          reason={creditGate.reason}
          balance={creditGate.balance}
          required={creditGate.required}
          onActivated={() => setCreditGate(null)}
        />
      )}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#0ea5e9] px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Sparkles className="h-4 w-4" />{t('pixGenPage.aiMediaStudio')}</div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{t('pixGenPage.designClassroomVisualsMotionSnippetsAndPrintablesInMinu')}</h1>
            <p className="text-sm text-white/80">{t('pixGenPage.pixgenLayersPromptEngineeringBrandKitsAndCurriculumMeta')}</p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-full bg-white/15 px-3 py-1">{t('pixGenPage.curriculumAligned')}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">{t('pixGenPage.safeForClassrooms')}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">{t('pixGenPage.multimodalOutput')}</span>
            </div>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t('pixGenPage.thisWeek')}</p>
              <p className="mt-2 text-3xl font-semibold">{t('pixGenPage.k28Visuals')}</p>
              <p className="text-xs text-white/70">{t('pixGenPage.teachersGeneratedImageryDirectlyFromTheirLessonBuilders')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t('pixGenPage.averageTurnaround')}</p>
              <p className="mt-2 text-3xl font-semibold">{t('pixGenPage.k8Sec')}</p>
              <p className="text-xs text-white/70">{t('pixGenPage.fromPromptToExportReadyPngOrTransparentAsset')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t('pixGenPage.collaborationPacks')}</p>
              <p className="mt-2 text-3xl font-semibold">{t('pixGenPage.k7Teams')}</p>
              <p className="text-xs text-white/70">{t('pixGenPage.plcsSharingBrandKitsAndAssetTemplates')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Image className="h-5 w-5 text-violet-500" />{t('pixGenPage.generativeCanvas')}</h2>
              <p className="mt-1 text-sm text-gray-600">{t('pixGenPage.craftAPromptPickAStyleAndPreviewVariationsLive')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGenerateSingle}
                disabled={isGenerating || (!prompt.trim() && !selectedPrompt)}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />{t('pixGenPage.generate')}</button>
              <button
                onClick={handleGenerateBatch}
                disabled={isGenerating || (!prompt.trim() && !selectedPrompt)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-violet-600 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-violet-600 shadow-sm transition hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4" />{t('pixGenPage.generateBatch')}</button>
            </div>
          </header>

          <div className="mt-6 space-y-6">
            {/* Pre-filled Prompts */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('pixGenPage.quickStartPrompts')}</label>
                <span className="text-xs text-gray-500">
                  {t('pixGenPage.templatesCount', { count: preFilledPrompts.length })}
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {preFilledPrompts.map((promptData) => (
                  <button
                    key={promptData.id}
                    onClick={() => handleUsePrompt(promptData)}
                    className={`group flex items-start gap-3 rounded-xl border-2 p-3 text-left transition ${
                      selectedPrompt?.id === promptData.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50'
                    }`}
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={promptData.image}
                        alt={promptData.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.opacity = '0'
                        }}
                      />
                      {selectedPrompt?.id === promptData.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-violet-500/80">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-violet-600">
                        {promptData.title}
                      </h4>
                      <p className="mt-1 text-[10px] text-gray-600 line-clamp-2">{promptData.prompt}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                          {styleLabel(promptData.style)}
                        </span>
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                          {ratioLabel(promptData.ratio)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('pixGenPage.prompt')}</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                placeholder={t('pixGenPage.illustrateTheWaterCycleForGrade5StudentsWithAnnotated')}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('pixGenPage.stylePresets')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stylePresets.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedStyle === style.value
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('pixGenPage.aspectRatio')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setSelectedRatio(ratio.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedRatio === ratio.value
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>{t('pixGenPage.colourPalette')}</span>
                  <Palette className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-gray-600">{t('pixGenPage.friendlyCalmBoldMonochrome')}</p>
                <button className="text-xs font-semibold text-violet-600">{t('pixGenPage.setPalette')}</button>
              </div>
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>{t('pixGenPage.layerControls')}</span>
                  <Layers className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-gray-600">{t('pixGenPage.separateBackgroundSubjectAndTypographyLayersForEditing')}</p>
                <button className="text-xs font-semibold text-violet-600">{t('pixGenPage.viewLayers')}</button>
              </div>
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>{t('pixGenPage.advancedControls')}</span>
                  <SlidersHorizontal className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-gray-600">{t('pixGenPage.adjustLightingTextureRenderPassesAndNegativePrompts')}</p>
                <button className="text-xs font-semibold text-violet-600">{t('pixGenPage.openPanel')}</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{t('pixGenPage.livePreview')}</h3>
            {errorMessage && (
              <p className="text-xs rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700">{errorMessage}</p>
            )}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 relative">
              {isGenerating ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 animate-pulse text-violet-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600">{t('pixGenPage.generatingImage')}</p>
                  </div>
                </div>
              ) : previewImage && !imageError ? (
                <div className="relative h-full w-full">
                  <img
                    src={previewImage}
                    alt={selectedPrompt?.title ?? t('pixGenPage.previewAlt')}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                          {styleLabel(selectedStyle)}
                        </p>
                        <p className="text-xs text-white/70">{ratioLabel(selectedRatio)}</p>
                      </div>
                      <button
                        onClick={handleDownloadPreview}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                      >{t('pixGenPage.downloadPng')}</button>
                    </div>
                  </div>
                </div>
              ) : previewImage && imageError ? (
                <div className="flex h-full items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                      {styleLabel(selectedStyle)}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-gray-900">
                      {selectedPrompt?.title ?? t('pixGenPage.previewFallbackTitle')}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedPrompt?.prompt.substring(0, 100) ?? t('pixGenPage.previewFallbackPrompt')}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">{t('pixGenPage.imageFailedToLoad')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between p-4 text-gray-700">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                      {styleLabel(selectedStyle)}
                    </p>
                    <h4 className="text-lg font-semibold">{t('pixGenPage.selectAPromptToPreview')}</h4>
                    <p className="text-sm text-gray-600">{t('pixGenPage.chooseAQuickStartPromptAboveOrEnterYourOwn')}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{ratioLabel(selectedRatio)}</span>
                    <button className="rounded-full bg-gray-200 px-3 py-1 font-semibold text-gray-500" disabled>{t('pixGenPage.downloadPng')}</button>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Preview Grid */}
            {batchImages.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('pixGenPage.batchPreviewTitle', { count: batchImages.length })}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {batchImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPreviewImage(img)
                        setImageError(false)
                      }}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                        previewImage === img ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={t('pixGenPage.variationAlt', { index: idx + 1 })}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.opacity = '0'
                        }}
                      />
                      {previewImage === img && (
                        <div className="absolute inset-0 flex items-center justify-center bg-violet-500/20">
                          <CheckCircle2 className="h-5 w-5 text-violet-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <h4 className="text-sm font-semibold text-gray-900">{t('pixGenPage.uploadRemix')}</h4>
            <p className="mt-2 text-sm">{t('pixGenPage.dropInAnExistingPosterOrSlideToInstantlyCreate')}</p>
            <button className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-violet-200 hover:text-violet-600">
              <Upload className="h-4 w-4" />{t('pixGenPage.uploadAsset')}</button>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <h4 className="text-sm font-semibold text-gray-900">{t('pixGenPage.quickExportPresets')}</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>{t('pixGenPage.googleSlidesBackgroundWithBleedMargins')}</li>
              <li>{t('pixGenPage.printablePdfWithCmykConversion')}</li>
              <li>{t('pixGenPage.transparentPngStickerPack')}</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {automationTracks.map((feature) => (
          <div key={feature.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">{feature.label}</p>
            <p className="mt-3 text-sm text-gray-700">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">{t('pixGenPage.inspirationBoards')}</h2>
            <p className="text-sm text-gray-600">{t('pixGenPage.buildRepeatableCreationSystemsSaveStoryboardPromptsExpo')}</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-violet-200 hover:text-violet-600">
            <Camera className="h-4 w-4" />{t('pixGenPage.createNewBoard')}</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {inspirationBoards.map((board) => (
            <div key={board.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{board.title}</p>
              <p className="mt-2 text-sm text-gray-600">{board.notes}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{t('pixGenPage.comingSoon')}</p>
            <h2 className="text-2xl font-semibold">{t('pixGenPage.roadmapHighlights')}</h2>
            <p className="text-sm text-white/75">{t('pixGenPage.pixgenEvolvesWithEducatorFeedbackJoinEarlyAccessCohorts')}</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10">
            <Video className="h-4 w-4" />{t('pixGenPage.joinNextShowcase')}</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {roadmap.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{item.owner}</p>
              <p className="mt-2 text-base font-semibold text-white">{item.heading}</p>
              <p className="mt-2 text-sm text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PixGen


