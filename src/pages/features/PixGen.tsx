import { useEffect, useState } from 'react'
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

const stylePresets = ['Watercolour storybook', 'Photo-real science lab', 'Flat infographic', 'Pixel art mini-game']
const aspectRatios = ['1:1 Square', '3:2 Landscape', '9:16 Vertical', '2:3 Portrait']
const inspirationBoards = [
  {
    title: 'Interactive slide deck backgrounds',
    notes: 'Create cohesive cover slides, section dividers, and icon suites with one prompt bundle.',
  },
  {
    title: 'STEM lab signage pack',
    notes: 'Generate safety reminders, lab station cues, and process diagrams in matching styles.',
  },
  {
    title: 'Read aloud visual supports',
    notes: 'Produce scene illustrations, character cards, and vocabulary visuals for literacy blocks.',
  },
]

const automationTracks = [
  {
    label: 'Batch lesson art',
    description:
      'Upload your weekly planner and let PixGen suggest visual assets for hooks, anchor charts, and small-group centres.',
  },
  {
    label: 'Curriculum-aligned remix',
    description:
      'Search district-approved themes. PixGen automatically swaps mascots, colours, and iconography to match your brand.',
  },
  {
    label: 'Student co-creation mode',
    description:
      'Enable moderated prompts so learners storyboard, illustrate, and reflect while you monitor review queues.',
  },
]

const roadmap = [
  {
    heading: 'Video overlays',
    description: 'Auto-generate lower-thirds, animated captions, and thumbnail sets for your classroom recordings.',
    owner: 'Beta • Q1 2026',
  },
  {
    heading: '3D asset export',
    description: 'Export STL files and AR markers for makerspaces and tactile learning labs.',
    owner: 'Research • Q2 2026',
  },
  {
    heading: 'Brand kit sync',
    description: 'Connect Google Slides and Canva brand kits to maintain typography, colours, and logos automatically.',
    owner: 'Planned • Q3 2026',
  },
]

const preFilledPrompts = [
  {
    title: 'Water Cycle Diagram',
    prompt: 'Illustrate the water cycle for grade 5 students with annotated arrows showing evaporation, condensation, precipitation, and collection. Use playful cloud characters and bright, educational colors.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    style: 'Watercolour storybook',
    ratio: '3:2 Landscape',
  },
  {
    title: 'Photosynthesis Process',
    prompt: 'Create a detailed diagram of photosynthesis for middle school science class. Show sunlight, water, carbon dioxide entering a plant leaf, and oxygen and glucose being produced. Use clear labels and vibrant green colors.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    style: 'Photo-real science lab',
    ratio: '1:1 Square',
  },
  {
    title: 'Math Fractions Visual',
    prompt: 'Design an engaging visual aid for teaching fractions to elementary students. Show pizza slices, pie charts, and number lines with colorful, friendly illustrations that make fractions easy to understand.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop',
    style: 'Flat infographic',
    ratio: '1:1 Square',
  },
  {
    title: 'World Map with Continents',
    prompt: 'Generate a colorful world map poster for geography class showing all seven continents with clear labels, ocean names, and fun facts. Use bright, kid-friendly colors and simple iconography.',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop',
    style: 'Flat infographic',
    ratio: '3:2 Landscape',
  },
  {
    title: 'Periodic Table Elements',
    prompt: 'Create a modern, colorful periodic table poster for chemistry class. Use distinct colors for different element groups, clear atomic numbers, and symbols. Make it visually appealing and easy to read.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
    style: 'Photo-real science lab',
    ratio: '2:3 Portrait',
  },
  {
    title: 'Solar System Diagram',
    prompt: 'Illustrate the solar system for elementary astronomy lesson. Show all eight planets in order from the sun with accurate relative sizes and colors. Include asteroid belt and make it engaging for young learners.',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    style: 'Watercolour storybook',
    ratio: '3:2 Landscape',
  },
  {
    title: 'Human Body Systems',
    prompt: 'Design an educational poster showing major human body systems (circulatory, respiratory, digestive) for biology class. Use clear diagrams, color coding, and simple labels suitable for middle school students.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    style: 'Photo-real science lab',
    ratio: '2:3 Portrait',
  },
  {
    title: 'Ancient Civilizations Timeline',
    prompt: 'Create a visual timeline poster showing major ancient civilizations (Egypt, Greece, Rome, China) with key dates, achievements, and cultural icons. Use an engaging, educational design for history class.',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
    style: 'Flat infographic',
    ratio: '9:16 Vertical',
  },
]

const BATCH_SIZE = 4
const BATCH_CONCURRENCY = 2

const PixGen = () => {
  const [searchParams] = useSearchParams()
  const generationId = searchParams.get('generation')
  const refreshCreditBalance = useRefreshCreditBalance()
  const [selectedStyle, setSelectedStyle] = useState(stylePresets[0])
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[1])
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [batchImages, setBatchImages] = useState<string[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<typeof preFilledPrompts[0] | null>(null)
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
        return 'Your session expired. Please log in again and retry.'
      }
      if (error.status === 422) {
        return 'Please check your prompt and selected options, then try again.'
      }
      if (error.status >= 500) {
        return 'Image service is currently unavailable. Please try again in a moment.'
      }
      return error.message || fallback
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      if (message.includes('timeout')) {
        return 'Generation is taking too long. Please retry with a shorter prompt or single image.'
      }
      if (message.includes('network') || message.includes('failed to fetch') || message.includes('connect')) {
        return 'Network issue detected. Please check your connection and backend server.'
      }
      return error.message || fallback
    }

    return fallback
  }

  const handleUsePrompt = (promptData: typeof preFilledPrompts[0]) => {
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
        setErrorMessage('Batch completed but no image previews were returned.')
      } else if (failedCount > 0) {
        setErrorMessage(`${failedCount} image(s) failed to generate. Showing successful results.`)
      }
    } catch (error) {
      const p = parseCreditError(error)
      if (p) {
        setCreditGate(p)
        return
      }
      setErrorMessage(getFriendlyErrorMessage(error, 'Batch generation failed.'))
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
        setErrorMessage('Generation completed but no image URL was returned.')
      }
    } catch (error) {
      const p = parseCreditError(error)
      if (p) {
        setCreditGate(p)
        setPreviewImage(null)
        return
      }
      setErrorMessage(getFriendlyErrorMessage(error, 'Image generation failed.'))
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
      setErrorMessage('Unable to download image. Please try again.')
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
              <Sparkles className="h-4 w-4" /> AI Media Studio
            </div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Design classroom visuals, motion snippets, and printables in minutes.
            </h1>
            <p className="text-sm text-white/80">
              PixGen layers prompt engineering, brand kits, and curriculum metadata so every image or clip feels bespoke
              to your classroom. Start with a story prompt, remix existing assets, or batch-generate an entire lesson’s
              visuals.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-full bg-white/15 px-3 py-1">Curriculum aligned</span>
              <span className="rounded-full bg-white/15 px-3 py-1">Safe for classrooms</span>
              <span className="rounded-full bg-white/15 px-3 py-1">Multimodal output</span>
            </div>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">This week</p>
              <p className="mt-2 text-3xl font-semibold">428 visuals</p>
              <p className="text-xs text-white/70">Teachers generated imagery directly from their lesson builders.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Average turnaround</p>
              <p className="mt-2 text-3xl font-semibold">28 sec</p>
              <p className="text-xs text-white/70">From prompt to export-ready PNG or transparent asset.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Collaboration packs</p>
              <p className="mt-2 text-3xl font-semibold">67 teams</p>
              <p className="text-xs text-white/70">PLCs sharing brand kits and asset templates.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Image className="h-5 w-5 text-violet-500" /> Generative canvas
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Craft a prompt, pick a style, and preview variations live before exporting to your favourite tools.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGenerateSingle}
                disabled={isGenerating || (!prompt.trim() && !selectedPrompt)}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" /> Generate
              </button>
              <button
                onClick={handleGenerateBatch}
                disabled={isGenerating || (!prompt.trim() && !selectedPrompt)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-violet-600 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-violet-600 shadow-sm transition hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4" /> Generate batch
              </button>
            </div>
          </header>

          <div className="mt-6 space-y-6">
            {/* Pre-filled Prompts */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quick start prompts</label>
                <span className="text-xs text-gray-500">{preFilledPrompts.length} templates</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {preFilledPrompts.map((promptData, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUsePrompt(promptData)}
                    className={`group flex items-start gap-3 rounded-xl border-2 p-3 text-left transition ${
                      selectedPrompt?.title === promptData.title
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
                      {selectedPrompt?.title === promptData.title && (
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
                          {promptData.style}
                        </span>
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                          {promptData.ratio}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                placeholder="Illustrate the water cycle for grade 5 students with annotated arrows and playful cloud characters."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Style presets</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stylePresets.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedStyle === style
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Aspect ratio</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedRatio === ratio
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Colour palette</span>
                  <Palette className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-gray-600">Friendly, calm, bold, monochrome</p>
                <button className="text-xs font-semibold text-violet-600">Set palette</button>
              </div>
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Layer controls</span>
                  <Layers className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-gray-600">Separate background, subject, and typography layers for editing.</p>
                <button className="text-xs font-semibold text-violet-600">View layers</button>
              </div>
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Advanced controls</span>
                  <SlidersHorizontal className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-sm text-gray-600">Adjust lighting, texture, render passes, and negative prompts.</p>
                <button className="text-xs font-semibold text-violet-600">Open panel</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Live preview</h3>
            {errorMessage && (
              <p className="text-xs rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700">{errorMessage}</p>
            )}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 relative">
              {isGenerating ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 animate-pulse text-violet-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600">Generating image...</p>
                  </div>
                </div>
              ) : previewImage && !imageError ? (
                <div className="relative h-full w-full">
                  <img
                    src={previewImage}
                    alt={selectedPrompt?.title || 'Generated preview'}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{selectedStyle}</p>
                        <p className="text-xs text-white/70">{selectedRatio}</p>
                      </div>
                      <button
                        onClick={handleDownloadPreview}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                      >
                        Download PNG
                      </button>
                    </div>
                  </div>
                </div>
              ) : previewImage && imageError ? (
                <div className="flex h-full items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">{selectedStyle}</p>
                    <h4 className="mt-2 text-lg font-semibold text-gray-900">{selectedPrompt?.title || 'Preview'}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedPrompt?.prompt.substring(0, 100) || 'Generated image preview'}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">Image failed to load</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between p-4 text-gray-700">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">{selectedStyle}</p>
                    <h4 className="text-lg font-semibold">Select a prompt to preview</h4>
                    <p className="text-sm text-gray-600">
                      Choose a quick start prompt above or enter your own to see the generated image here.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{selectedRatio}</span>
                    <button className="rounded-full bg-gray-200 px-3 py-1 font-semibold text-gray-500" disabled>
                      Download PNG
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Preview Grid */}
            {batchImages.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Batch preview ({batchImages.length} variations)
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
                        alt={`Variation ${idx + 1}`}
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
            <h4 className="text-sm font-semibold text-gray-900">Upload & remix</h4>
            <p className="mt-2 text-sm">
              Drop in an existing poster or slide to instantly create variants and alternate aspect ratios.
            </p>
            <button className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-violet-200 hover:text-violet-600">
              <Upload className="h-4 w-4" /> Upload asset
            </button>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <h4 className="text-sm font-semibold text-gray-900">Quick export presets</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>• Google Slides background with bleed margins</li>
              <li>• Printable PDF with CMYK conversion</li>
              <li>• Transparent PNG sticker pack</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {automationTracks.map((feature) => (
          <div key={feature.label} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">{feature.label}</p>
            <p className="mt-3 text-sm text-gray-700">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900">Inspiration boards</h2>
            <p className="text-sm text-gray-600">
              Build repeatable creation systems. Save storyboard prompts, export settings, colour palettes, and print
              specs as reusable blueprints for the next unit.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-violet-200 hover:text-violet-600">
            <Camera className="h-4 w-4" /> Create new board
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {inspirationBoards.map((board) => (
            <div key={board.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{board.title}</p>
              <p className="mt-2 text-sm text-gray-600">{board.notes}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Coming soon</p>
            <h2 className="text-2xl font-semibold">Roadmap highlights</h2>
            <p className="text-sm text-white/75">
              PixGen evolves with educator feedback. Join early access cohorts to shape the next release cycle.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10">
            <Video className="h-4 w-4" /> Join next showcase
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {roadmap.map((item) => (
            <div key={item.heading} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
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


