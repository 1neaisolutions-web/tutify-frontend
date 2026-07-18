/**
 * Pass 3: apply remaining en.json string→key replacements to ALL tsx files (including those already using t()).
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

const AUTO_REPS = Object.entries(valueToKey)
  .sort((a, b) => b[0].length - a[0].length)
  .flatMap(([val, key]) => [
    [`toast.success('${val}')`, `toast.success(t('${key}'))`],
    [`toast.error('${val}')`, `toast.error(t('${key}'))`],
    [`title="${val}"`, `title={t('${key}')}`],
    [`subtitle="${val}"`, `subtitle={t('${key}')}`],
    [`placeholder="${val}"`, `placeholder={t('${key}')}`],
    [`'${val}'`, `t('${key}')`],
    [`"${val}"`, `{t('${key}')}`],
    [`>${val}<`, `>{t('${key}')}<`],
  ])

function ensureImport(c) {
  if (c.includes("from 'react-i18next'")) return c
  const idx = c.indexOf('import ')
  const end = c.indexOf('\n', idx)
  return c.slice(0, end + 1) + "import { useTranslation } from 'react-i18next'\n" + c.slice(end + 1)
}

function ensureHook(c) {
  if (c.includes('const { t } = useTranslation()')) return c
  const patterns = [/export default function \w+\([^)]*\)\s*\{/, /export function \w+\([^)]*\)\s*\{/]
  for (const pat of patterns) {
    const m = c.match(pat)
    if (m) {
      const pos = c.indexOf(m[0]) + m[0].length
      const nl = c.indexOf('\n', pos)
      const indent = c.slice(nl + 1).match(/^(\s*)/)?.[1] ?? '  '
      return c.slice(0, nl + 1) + `${indent}const { t } = useTranslation()\n` + c.slice(nl + 1)
    }
  }
  return c
}

let modified = 0
for (const fp of walk(ttRoot)) {
  if (SKIP.has(path.basename(fp))) continue
  let c = fs.readFileSync(fp, 'utf8')
  const orig = c
  for (const [from, to] of AUTO_REPS) {
    if (c.includes(from)) c = c.split(from).join(to)
  }
  if (c !== orig) {
    c = ensureImport(c)
    c = ensureHook(c)
    fs.writeFileSync(fp, c)
    modified++
    console.log('Pass3', path.relative(ttRoot, fp))
  }
}
console.log('Pass3 modified:', modified)
