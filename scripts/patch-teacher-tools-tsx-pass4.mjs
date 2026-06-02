/**
 * Pass 4: Safe i18n for files that already have useTranslation but still contain English.
 * Only replaces toast.*, JSX text nodes, and title/placeholder/aria-label attributes.
 * Does NOT replace bare quoted strings (avoids breaking types/switch cases).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ttRoot = path.join(__dirname, '../src/pages/features/teacher-tools')
const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'teacher-tools-en.json'), 'utf8'))

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') Object.assign(out, flatten(v, key))
    else if (typeof v === 'string' && v.length > 1) out[v] = key
  }
  return out
}

const valueToKey = flatten(en)

function walk(d, acc = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p, acc)
    else if (f.endsWith('.tsx')) acc.push(p)
  }
  return acc
}

const SKIP = new Set([
  'TeacherToolsDemoProvider.tsx',
  'TeacherToolsCharts.tsx',
  'TeacherToolsConfigureNav.tsx',
  'TeacherToolsCreateLayout.tsx',
  'TeacherToolsFieldErrors.tsx',
  'TeacherToolsPageHeader.tsx',
  'TeacherToolsPanelHeader.tsx',
  'TeacherToolsSkeletons.tsx',
  'TeacherToolsWizardStepper.tsx',
  'ExamNumberedSectionHeader.tsx',
  'ExamPaperStructureReviewCard.tsx',
])

/** Explicit toast mappings (longest first) */
const TOAST_REPS = Object.entries(valueToKey)
  .sort((a, b) => b[0].length - a[0].length)
  .flatMap(([val, key]) => {
    const esc = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    return [
      [`toast.success('${esc}')`, `toast.success(t('${key}'))`],
      [`toast.error('${esc}')`, `toast.error(t('${key}'))`],
      [`toast.info('${esc}')`, `toast.info(t('${key}'))`],
    ]
  })

/** Safe JSX / attribute replacements */
const JSX_REPS = Object.entries(valueToKey)
  .sort((a, b) => b[0].length - a[0].length)
  .flatMap(([val, key]) => {
    if (val.includes('{{') || val.includes('\n')) return []
    const escD = val.replace(/"/g, '&quot;')
    return [
      [`>${val}<`, `>{t('${key}')}<`],
      [`title="${escD}"`, `title={t('${key}')}`],
      [`placeholder="${escD}"`, `placeholder={t('${key}')}`],
      [`aria-label="${escD}"`, `aria-label={t('${key}')}`],
      [`label: '${val.replace(/'/g, "\\'")}'`, `label: t('${key}')`],
    ]
  })

const ALL_REPS = [...TOAST_REPS, ...JSX_REPS]

let modified = 0
for (const fp of walk(ttRoot)) {
  const base = path.basename(fp)
  if (SKIP.has(base)) continue
  let c = fs.readFileSync(fp, 'utf8')
  if (!c.includes('useTranslation') || !c.includes('const { t } = useTranslation()')) continue

  const orig = c
  for (const [from, to] of ALL_REPS) {
    if (c.includes(from)) c = c.split(from).join(to)
  }

  if (c !== orig) {
    fs.writeFileSync(fp, c)
    modified++
    console.log('Pass4 patched', path.relative(ttRoot, fp))
  }
}

console.log('Pass4 total modified:', modified)
