/**
 * Safe i18n for src/pages/features/*.tsx (root only).
 * Only replaces: JSX text nodes, toast strings, placeholder/title/aria-label, label: '...'
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const featuresDir = path.join(__dirname, '../src/pages/features')
const localesDir = path.join(__dirname, '../src/locales')

const SKIP = new Set(['LearningHubLegacyRedirect.tsx'])
const SKIP_I18N = new Set(['GeneralTeachingAssistantChat.tsx', 'History.tsx'])

const EXISTING_NS = new Set([
  'analyticsPage',
  'youtubeQuizPage',
  'historyPage',
  'exploreUseCases',
  'learningHubSections',
  'admin',
  'claude',
  'premium',
  'content',
  'dashboard',
  'nav',
  'common',
  'status',
  'snackbar',
])

function namespaceForFile(file) {
  const base = file.replace(/\.tsx$/, '')
  const map = {
    Assessment: 'assessmentPage',
    Analytics: 'analyticsPage',
    Reporting: 'reportingPage',
    Personalization: 'personalizationPage',
    HistoryPersonalization: 'historyPersonalizationPage',
    SpecializedChatbots: 'specializedChatbots',
    TemplatesLibrary: 'templatesLibrary',
    TemplateRunner: 'templateRunner',
    DocumentUpload: 'documentUploadPage',
    DocumentsList: 'documentsListPage',
    DocumentDetails: 'documentDetailsPage',
    ContentPacksManagement: 'contentPacksPage',
    ContentPackDetail: 'contentPackDetailPage',
    QuizResults: 'quizResultsPage',
    YouTubeQuizGenerator: 'youtubeQuizPage',
    PixGen: 'pixGenPage',
    ProfessionalLearningHub: 'professionalLearningHub',
    WorksheetGenerator: 'worksheetGeneratorPage',
    WorksheetViewer: 'worksheetViewerPage',
  }
  return map[base] ?? base.charAt(0).toLowerCase() + base.slice(1)
}

function toKeySlug(text, used) {
  let base = text
    .replace(/\{\{[^}]+\}\}/g, 'var')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 10)
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '',
    )
    .join('')
    .replace(/^[^a-z]/, 'k')
    .slice(0, 55)
  if (!base) base = 'text'
  let slug = base
  let n = 2
  while (used.has(slug)) slug = `${base}${n++}`
  used.add(slug)
  return slug
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shouldSkipString(s) {
  if (!s || s.length < 2 || s.length > 400) return true
  if (!/[a-zA-Z]/.test(s)) return true
  if (/[{}\[\]();=]/.test(s)) return true
  if (/^https?:\/\//.test(s)) return true
  if (/^\/[a-z]/.test(s)) return true
  if (/^[a-z]+(-[a-z0-9]+)+$/.test(s) && !s.includes(' ')) return true
  if (/^(bg-|text-|border-|flex|grid|px-|py-|from-|to-|hover:)/.test(s)) return true
  return false
}

function findImportBlockEnd(source) {
  const re = /^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm
  let end = 0
  let m
  while ((m = re.exec(source))) {
    end = m.index + m[0].length
  }
  return end
}

function ensureUseTranslation(source) {
  if (source.includes('useTranslation')) return source
  let out = source
  const end = findImportBlockEnd(out)
  if (end > 0) {
    out =
      out.slice(0, end) +
      "\nimport { useTranslation } from 'react-i18next'" +
      out.slice(end)
  } else {
    out = `import { useTranslation } from 'react-i18next'\n` + out
  }
  const patterns = [
    /const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*\{/,
    /const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(\)\s*=>\s*\{/,
    /function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{/,
  ]
  for (const re of patterns) {
    const m = out.match(re)
    if (m && !out.slice(m.index, m.index + 200).includes('const { t }')) {
      out = out.replace(m[0], `${m[0]}\n  const { t } = useTranslation()`)
      break
    }
  }
  return out
}

function collectStrings(source) {
  const found = new Set()
  const patterns = [
    /toast\.(?:success|error|info|warning)\(\s*['"]([^'"]+)['"]/g,
    /placeholder=["']([^"']+)["']/g,
    /title=["']([^"']+)["']/g,
    /aria-label=["']([^"']+)["']/g,
    />\s*([^<{][^<]{1,300}?)\s*</g,
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(source))) {
      const s = m[1].trim()
      if (!shouldSkipString(s)) found.add(s)
    }
  }
  return [...found].sort((a, b) => b.length - a.length)
}

function applySafe(source, ns, keyByText) {
  let out = source
  for (const [text, key] of keyByText) {
    const tCall = `{t('${ns}.${key}')}`
    const tCallPlain = `t('${ns}.${key}')`

    out = out.replace(new RegExp(`>\\s*${escapeRegExp(text)}\\s*<`, 'g'), `>${tCall}<`)

    out = out.replace(
      new RegExp(`toast\\.(success|error|info|warning)\\(\\s*['"]${escapeRegExp(text)}['"]`, 'g'),
      `toast.$1(${tCallPlain}`,
    )

    out = out.replace(
      new RegExp(`placeholder=["']${escapeRegExp(text)}["']`, 'g'),
      `placeholder={${tCallPlain}}`,
    )
    out = out.replace(
      new RegExp(`title=["']${escapeRegExp(text)}["']`, 'g'),
      `title={${tCallPlain}}`,
    )
    out = out.replace(
      new RegExp(`aria-label=["']${escapeRegExp(text)}["']`, 'g'),
      `aria-label={${tCallPlain}}`,
    )
  }

  out = out.replace(
    /toast\.info\(\s*['"]Upgrade to Premium to use this feature['"]/g,
    "toast.info(t('chatbot.common.upgradePremium')",
  )
  out = out.replace(
    /<Lock className="inline h-3 w-3 mr-1" \/>\s*Premium/g,
    "<Lock className=\"inline h-3 w-3 mr-1\" /> {t('chatbot.common.premium')}",
  )

  return out
}

function deepSet(obj, parts, value) {
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ?? {}
    cur = cur[parts[i]]
  }
  if (cur[parts[parts.length - 1]] === undefined) cur[parts[parts.length - 1]] = value
}

function deepMerge(target, source) {
  const out = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], value)
    } else if (target[key] === undefined) {
      out[key] = value
    }
  }
  return out
}

const WORD_MAPS = {
  'es-ES': {
    Assessment: 'Evaluación', Students: 'Estudiantes', Completed: 'Completado', Progress: 'Progreso',
    Filter: 'Filtrar', Export: 'Exportar', Generate: 'Generar', Loading: 'Cargando', Search: 'Buscar',
    All: 'Todos', Status: 'Estado', Draft: 'Borrador', Published: 'Publicado', View: 'Ver',
    Create: 'Crear', Save: 'Guardar', Cancel: 'Cancelar', Delete: 'Eliminar', Download: 'Descargar',
    Upload: 'Subir', Premium: 'Premium', Teacher: 'Docente', Lesson: 'Lección', Course: 'Curso',
    Module: 'Módulo', Research: 'Investigación', Tutorial: 'Tutorial', minutes: 'minutos', days: 'días',
    students: 'estudiantes', month: 'mes', year: 'año', vs: 'vs',
  },
  'fr-FR': {
    Assessment: 'Évaluation', Students: 'Élèves', Completed: 'Terminé', Progress: 'Progression',
    Filter: 'Filtrer', Export: 'Exporter', Generate: 'Générer', Loading: 'Chargement', Search: 'Rechercher',
    All: 'Tous', Status: 'Statut', Draft: 'Brouillon', Published: 'Publié', View: 'Voir',
    Create: 'Créer', Save: 'Enregistrer', Cancel: 'Annuler', Delete: 'Supprimer', Download: 'Télécharger',
    Upload: 'Téléverser', Premium: 'Premium', Teacher: 'Enseignant', Lesson: 'Leçon', Course: 'Cours',
    Module: 'Module', Research: 'Recherche', Tutorial: 'Tutoriel', minutes: 'minutes', days: 'jours',
    students: 'élèves', month: 'mois', year: 'an', vs: 'vs',
  },
  'pt-BR': {
    Assessment: 'Avaliação', Students: 'Estudantes', Completed: 'Concluído', Progress: 'Progresso',
    Filter: 'Filtrar', Export: 'Exportar', Generate: 'Gerar', Loading: 'Carregando', Search: 'Buscar',
    All: 'Todos', Status: 'Status', Draft: 'Rascunho', Published: 'Publicado', View: 'Ver',
    Create: 'Criar', Save: 'Salvar', Cancel: 'Cancelar', Delete: 'Excluir', Download: 'Baixar',
    Upload: 'Enviar', Premium: 'Premium', Teacher: 'Professor', Lesson: 'Aula', Course: 'Curso',
    Module: 'Módulo', Research: 'Pesquisa', Tutorial: 'Tutorial', minutes: 'minutos', days: 'dias',
    students: 'estudantes', month: 'mês', year: 'ano', vs: 'vs',
  },
  'de-DE': {
    Assessment: 'Bewertung', Students: 'Schüler', Completed: 'Abgeschlossen', Progress: 'Fortschritt',
    Filter: 'Filtern', Export: 'Exportieren', Generate: 'Generieren', Loading: 'Laden', Search: 'Suchen',
    All: 'Alle', Status: 'Status', Draft: 'Entwurf', Published: 'Veröffentlicht', View: 'Ansehen',
    Create: 'Erstellen', Save: 'Speichern', Cancel: 'Abbrechen', Delete: 'Löschen', Download: 'Herunterladen',
    Upload: 'Hochladen', Premium: 'Premium', Teacher: 'Lehrkraft', Lesson: 'Unterricht', Course: 'Kurs',
    Module: 'Modul', Research: 'Forschung', Tutorial: 'Tutorial', minutes: 'Minuten', days: 'Tage',
    students: 'Schüler', month: 'Monat', year: 'Jahr', vs: 'vs',
  },
}

function translateText(text, locale) {
  const map = WORD_MAPS[locale]
  if (!map) return text
  let out = text
  for (const en of Object.keys(map).sort((a, b) => b.length - a.length)) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, 'g'), map[en])
  }
  return out
}

function translateTree(node, locale) {
  if (typeof node === 'string') return translateText(node, locale)
  if (Array.isArray(node)) return node.map((v) => translateTree(v, locale))
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = translateTree(v, locale)
    return out
  }
  return node
}

const enAdditions = {
  chatbot: {
    common: {
      premium: 'Premium',
      upgradePremium: 'Upgrade to Premium to use this feature',
      restoreHistoryFailed: 'Could not restore saved output from History.',
      generating: 'Generating…',
      export: 'Export',
      download: 'Download',
      regenerate: 'Regenerate',
      copy: 'Copy',
      gradeLevel: 'Grade Level',
      subject: 'Subject',
      topic: 'Topic',
      generate: 'Generate',
    },
  },
}

const modified = []

for (const file of fs.readdirSync(featuresDir).filter((f) => f.endsWith('.tsx') && !SKIP.has(f)).sort()) {
  const filePath = path.join(featuresDir, file)
  let source = fs.readFileSync(filePath, 'utf8')
  const ns = namespaceForFile(file)

  if (!SKIP_I18N.has(file)) source = ensureUseTranslation(source)

  if (EXISTING_NS.has(ns)) {
    fs.writeFileSync(filePath, source, 'utf8')
    modified.push(file)
    continue
  }

  const strings = collectStrings(source)
  const used = new Set()
  const flat = {}
  const keyByText = new Map()
  for (const text of strings) {
    const key = toKeySlug(text, used)
    flat[key] = text
    keyByText.set(text, key)
  }

  if (Object.keys(flat).length) enAdditions[ns] = { ...(enAdditions[ns] ?? {}), ...flat }

  if (!SKIP_I18N.has(file)) source = applySafe(source, ns, keyByText)

  fs.writeFileSync(filePath, source, 'utf8')
  modified.push(file)
}

for (const locale of ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE']) {
  const filePath = path.join(localesDir, `${locale}.json`)
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const toMerge = locale === 'en-US' ? enAdditions : translateTree(enAdditions, locale)
  fs.writeFileSync(filePath, JSON.stringify(deepMerge(existing, toMerge), null, 2) + '\n', 'utf8')
}

console.log('modified', modified.length)
