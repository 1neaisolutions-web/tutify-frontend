/**
 * sync-content-catalog-i18n.mjs
 *
 * Seeds en-US.json catalog keys for API templates and static learning-hub content.
 * After running, translate with: node scripts/translate-priority-namespaces.mjs zh-CN ...
 *
 * Usage:
 *   node scripts/sync-content-catalog-i18n.mjs
 *   BACKEND_URL=http://127.0.0.1:8000 node scripts/sync-content-catalog-i18n.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCALES_DIR = path.join(ROOT, 'src', 'locales')
const EN_US_PATH = path.join(LOCALES_DIR, 'en-US.json')

const BACKEND_URL = (process.env.BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
)

function normalizeCatalogId(id) {
  return String(id || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function setNested(obj, keyPath, value) {
  const parts = keyPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {}
    cur = cur[p]
  }
  cur[parts[parts.length - 1]] = value
}

async function fetchTemplates() {
  const url = `${BACKEND_URL}/api/v1/templates`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`⚠ Templates API returned ${res.status} — skipping template catalog seed`)
      return []
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn(`⚠ Could not fetch templates (${e.message}) — skipping template catalog seed`)
    return []
  }
}

async function fetchTemplateDetail(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/templates/${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function extractFieldsFromSchema(schema) {
  if (!schema) return []
  if (schema.fields && Array.isArray(schema.fields)) {
    return schema.fields
      .filter((f) => f?.name && f?.type)
      .map((f) => ({
        name: f.name,
        label: f.label || f.name,
        placeholder: f.placeholder || null,
        options: Array.isArray(f.options) ? f.options : null,
      }))
  }
  if (schema.type === 'object' && schema.properties) {
    return Object.entries(schema.properties).map(([name, prop]) => {
      const label =
        prop.title ||
        prop.description ||
        name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      return {
        name,
        label,
        placeholder: prop.description || null,
        options: prop.enum || (prop.type === 'boolean' ? ['true', 'false'] : null),
      }
    })
  }
  return []
}

function buildTemplateFieldKeys(slug, schema) {
  const out = {}
  const base = `templatesLibrary.catalog.${normalizeCatalogId(slug)}.fields`
  for (const field of extractFieldsFromSchema(schema)) {
    if (field.label) setNested(out, `${base}.${field.name}.label`, field.label)
    if (field.placeholder && field.placeholder !== field.label) {
      setNested(out, `${base}.${field.name}.placeholder`, field.placeholder)
    }
    if (field.options) {
      for (const opt of field.options) {
        setNested(out, `${base}.${field.name}.options.${normalizeCatalogId(opt)}`, opt)
      }
    }
  }
  return out
}

async function mapPool(items, limit, fn) {
  const results = []
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function loadLearningHubData() {
  const server = await createServer({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.ts'),
    server: { middlewareMode: true },
    logLevel: 'error',
  })
  try {
    const mod = await server.ssrLoadModule('/src/features/learningHub/learningHubData.ts')
    return mod.learningHubData ?? []
  } finally {
    await server.close()
  }
}

function buildMicroCourseCourseKeys(item) {
  const slug = normalizeCatalogId(item.slug)
  const content = item.personalizedMicroCourseContent
  if (!content) return {}

  const out = {}
  const base = `learningHubContent.courses.${slug}`
  if (content.description) setNested(out, `${base}.description`, content.description)
  content.learningObjectives?.forEach((obj, i) => {
    setNested(out, `${base}.objectives.${i}`, obj)
  })
  content.lessons?.forEach((lesson) => {
    setNested(out, `${base}.lessons.${lesson.id}.title`, lesson.title)
    lesson.contentBlocks?.forEach((block, bi) => {
      if (block.heading) {
        setNested(out, `${base}.lessons.${lesson.id}.blocks.${bi}.heading`, block.heading)
      }
      block.paragraphs?.forEach((p, pi) => {
        setNested(out, `${base}.lessons.${lesson.id}.blocks.${bi}.paragraphs.${pi}`, p)
      })
    })
  })
  return out
}

function buildHubCatalogEntry(item) {
  const slug = normalizeCatalogId(item.slug)
  const out = {}
  const base = `learningHubContent.catalog.${slug}`
  if (item.title) setNested(out, `${base}.title`, item.title)
  const desc = item.shortDescription ?? item.personalizedMicroCourseContent?.description
  if (desc) setNested(out, `${base}.description`, desc)
  const subtitle = item.subtitle
  if (subtitle) setNested(out, `${base}.subtitle`, subtitle)
  return out
}

function mergeDeep(target, source) {
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (!target[k] || typeof target[k] !== 'object') target[k] = {}
      mergeDeep(target[k], v)
    } else if (target[k] === undefined) {
      target[k] = v
    }
  }
}

async function main() {
  console.log('\n--- Sync content catalog i18n keys ---\n')

  const enUs = JSON.parse(fs.readFileSync(EN_US_PATH, 'utf8'))
  const patch = {}

  // Templates from API
  const templates = await fetchTemplates()
  console.log(`Templates from API: ${templates.length}`)
  for (const tpl of templates) {
    const slug = normalizeCatalogId(tpl.slug)
    if (!slug) continue
    const base = `templatesLibrary.catalog.${slug}`
    const exploreBase = `exploreUseCases.catalog.${slug}`
    const title = tpl.title || tpl.name
    if (title) {
      setNested(patch, `${base}.title`, title)
      setNested(patch, `${exploreBase}.title`, title)
    }
    if (tpl.description) {
      setNested(patch, `${base}.description`, tpl.description)
      setNested(patch, `${exploreBase}.description`, tpl.description)
    }
  }

  // Template form fields from detail API (labels, placeholders, select options)
  console.log('Fetching template field schemas…')
  let fieldSeedCount = 0
  await mapPool(templates, 6, async (tpl) => {
    const slug = tpl.slug
    if (!slug) return
    const detail = await fetchTemplateDetail(slug)
    const schema = detail?.latest_version?.input_schema
    if (!schema) return
    mergeDeep(patch, buildTemplateFieldKeys(slug, schema))
    fieldSeedCount++
  })
  console.log(`Template field schemas seeded: ${fieldSeedCount}`)

  let hubItems = []
  try {
    hubItems = await loadLearningHubData()
    console.log(`Learning hub items: ${hubItems.length}`)
  } catch (e) {
    console.warn(`⚠ Could not load learningHubData (${e.message})`)
  }

  for (const item of hubItems) {
    mergeDeep(patch, buildHubCatalogEntry(item))
    if (item.personalizedMicroCourseContent) {
      mergeDeep(patch, buildMicroCourseCourseKeys(item))
    }
  }

  // Ensure shell keys exist
  setNested(patch, 'personalizationPage.focusAreasTitle', 'Focus Areas')
  setNested(patch, 'literacyLabCoach.tabs.analyze', 'Text Analysis')
  setNested(patch, 'literacyLabCoach.tabs.guided', 'Guided Reading')
  setNested(patch, 'literacyLabCoach.tabs.writing', 'Writing Feedback')
  setNested(patch, 'literacyLabCoach.tabs.prompts', 'Writing Prompts')
  setNested(patch, 'literacyLabCoach.tabs.vocabulary', 'Vocabulary Builder')
  setNested(
    patch,
    'youtubeQuizPage.errors.profileSubjectsRequired',
    'Teaching profile subjects are required for video recommendations. Complete your profile subjects in Settings.',
  )
  setNested(patch, 'youtubeQuizPage.errors.recommendationsFailed', 'Could not load video recommendations.')
  setNested(patch, 'learningHubContent.difficulty.beginner', 'Beginner')
  setNested(patch, 'learningHubContent.difficulty.intermediate', 'Intermediate')
  setNested(patch, 'learningHubContent.difficulty.advanced', 'Advanced')
  setNested(patch, 'templateRunner.selectField', 'Select {{label}}')
  setNested(patch, 'templateRunner.fillRequiredFields', 'Please fill in: {{fields}}')
  setNested(patch, 'common.yes', 'Yes')
  setNested(patch, 'common.no', 'No')

  if (!enUs.learningHubContent) enUs.learningHubContent = {}
  if (!enUs.templatesLibrary) enUs.templatesLibrary = {}
  if (!enUs.exploreUseCases) enUs.exploreUseCases = {}
  if (!enUs.exploreUseCases.catalog) enUs.exploreUseCases.catalog = {}

  mergeDeep(enUs, patch)

  // Backfill template titles when catalog was previously seeded without them
  for (const tpl of templates) {
    const slug = normalizeCatalogId(tpl.slug)
    const title = tpl.title || tpl.name
    if (!slug || !title) continue
    if (!enUs.templatesLibrary.catalog) enUs.templatesLibrary.catalog = {}
    if (!enUs.templatesLibrary.catalog[slug]) enUs.templatesLibrary.catalog[slug] = {}
    if (!enUs.templatesLibrary.catalog[slug].title) {
      enUs.templatesLibrary.catalog[slug].title = title
    }
  }

  fs.writeFileSync(EN_US_PATH, `${JSON.stringify(enUs, null, 2)}\n`, 'utf8')

  const templateCount = Object.keys(enUs.templatesLibrary?.catalog ?? {}).length
  const hubCatalogCount = Object.keys(enUs.learningHubContent?.catalog ?? {}).length
  const courseCount = Object.keys(enUs.learningHubContent?.courses ?? {}).length

  console.log(`✓ Updated ${EN_US_PATH}`)
  console.log(`  templatesLibrary.catalog: ${templateCount} entries`)
  console.log(`  learningHubContent.catalog: ${hubCatalogCount} entries`)
  console.log(`  learningHubContent.courses: ${courseCount} entries`)
  console.log('\nNext: npm run i18n:merge-all && npm run i18n:translate-priority-all\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
