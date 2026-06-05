/**
 * audit-route-i18n.mjs
 *
 * Audits route-mapped components for i18n coverage.
 * Parses src/routes/config.jsx for paths + component tags, resolves import paths.
 *
 * Usage:
 *   node scripts/audit-route-i18n.mjs
 *   node scripts/audit-route-i18n.mjs --group teacher
 *   node scripts/audit-route-i18n.mjs --fail-on-literals
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONFIG_PATH = path.join(ROOT, 'src', 'routes', 'config.jsx')
const SRC = path.join(ROOT, 'src')

const args = process.argv.slice(2)
const GROUP_FILTER = args.includes('--group') ? args[args.indexOf('--group') + 1] : null
const FAIL_ON_LITERALS = args.includes('--fail-on-literals')

const ROUTE_EXPORTS = [
  'commonRoutes',
  'teacherRoutes',
  'authRoutes',
  'superAdminRoutes',
  'orgAdminRoutes',
  'schoolAdminRoutes',
  'studentRoutes',
  'parentRoutes',
]

function readConfig() {
  return fs.readFileSync(CONFIG_PATH, 'utf8')
}

function buildImportMap(configText) {
  const map = new Map()
  const re = /import\s+(?:(\w+)|{([^}]+)})\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(configText)) !== null) {
    const defaultName = m[1]
    const named = m[2]
    const spec = m[3]
    const resolved = resolveImport(spec)
    if (defaultName) map.set(defaultName, resolved)
    if (named) {
      for (const part of named.split(',')) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim()
        if (name) map.set(name, resolved)
      }
    }
  }
  return map
}

function resolveImport(spec) {
  if (!spec.startsWith('.')) return null
  const base = path.normalize(path.join(path.dirname(CONFIG_PATH), spec))
  const exts = ['.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.jsx', '/index.ts', '/index.js']
  for (const ext of exts) {
    const candidate = base + ext
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

function extractRoutes(configText, exportName) {
  const start = configText.indexOf(`export const ${exportName}`)
  if (start === -1) return []
  const slice = configText.slice(start)
  const routes = []
  const pathRe = /path:\s*['"]([^'"]+)['"]/g
  const paths = [...slice.matchAll(pathRe)].map((x) => x[1])

  const componentRe = /<(\w+)[\s/>]/g
  const components = [...slice.matchAll(componentRe)]
    .map((x) => x[1])
    .filter((name) => !['DashboardLayout', 'Navigate', 'RoleBasedRedirect', 'UnknownRouteRedirect'].includes(name))

  const uniqueComponents = [...new Set(components)]
  paths.forEach((p, i) => {
    routes.push({ path: p, group: exportName, componentHint: uniqueComponents[i] ?? null })
  })

  const blockEnd = slice.indexOf('\nexport const ', 1)
  const block = blockEnd === -1 ? slice : slice.slice(0, blockEnd)
  const pairs = []
  const pairRe = /path:\s*['"]([^'"]+)['"][\s\S]*?<(\w+)\s*\/?>/g
  let pm
  while ((pm = pairRe.exec(block)) !== null) {
    const comp = pm[2]
    if (['DashboardLayout', 'Navigate'].includes(comp)) continue
    pairs.push({ path: pm[1], group: exportName, component: comp })
  }
  return pairs
}

function auditFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return { hasUseTranslation: false, literalCount: -1, tKeys: [], error: 'file not found' }
  }
  const src = fs.readFileSync(filePath, 'utf8')
  const hasUseTranslation = /useTranslation\s*\(/.test(src)
  const tKeys = [...src.matchAll(/t\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
  const tTemplateKeys = [...src.matchAll(/t\(\s*`([^`]+)`/g)].map((m) => m[1])

  const jsxLiteralRe = />([^<{][^<{}]{2,}?)<\//g
  let literalCount = 0
  let lm
  while ((lm = jsxLiteralRe.exec(src)) !== null) {
    const text = lm[1].trim()
    if (!text || /^[\d\s.%$…]+$/.test(text)) continue
    if (/^[\w.-]+@[\w.-]+$/.test(text)) continue
    literalCount++
  }

  return {
    hasUseTranslation,
    literalCount,
    tKeys: [...new Set([...tKeys, ...tTemplateKeys])],
    relPath: path.relative(ROOT, filePath).replace(/\\/g, '/'),
  }
}

const configText = readConfig()
const importMap = buildImportMap(configText)

const allRoutes = []
for (const exportName of ROUTE_EXPORTS) {
  if (GROUP_FILTER && !exportName.toLowerCase().includes(GROUP_FILTER.toLowerCase())) continue
  allRoutes.push(...extractRoutes(configText, exportName))
}

const seen = new Set()
const report = []

for (const route of allRoutes) {
  const comp = route.component
  if (!comp || seen.has(`${route.path}:${comp}`)) continue
  seen.add(`${route.path}:${comp}`)

  const filePath = importMap.get(comp)
  const audit = auditFile(filePath)
  report.push({ ...route, ...audit, component: comp })
}

report.sort((a, b) => b.literalCount - a.literalCount)

console.log('\n📋 Route i18n Audit Report')
console.log('='.repeat(90))
console.log(
  `${'Path'.padEnd(42)} ${'Component'.padEnd(28)} ${'t()'.padEnd(5)} ${'Literals'.padStart(8)}`,
)
console.log('-'.repeat(90))

let failures = 0
for (const r of report) {
  const flag = !r.hasUseTranslation ? '❌' : r.literalCount > 5 ? '⚠️ ' : '✅'
  if (!r.hasUseTranslation || (FAIL_ON_LITERALS && r.literalCount > 3)) failures++
  console.log(
    `${flag} ${r.path.padEnd(40)} ${(r.component ?? '').padEnd(26)} ${(r.hasUseTranslation ? 'yes' : 'no').padEnd(5)} ${String(r.literalCount).padStart(8)}`,
  )
  if (r.relPath) console.log(`   → ${r.relPath}`)
}

console.log('='.repeat(90))
console.log(`Routes audited: ${report.length}`)
console.log(`Missing useTranslation: ${report.filter((r) => !r.hasUseTranslation).length}`)
console.log(`High literal count (>5): ${report.filter((r) => r.literalCount > 5).length}`)

if (FAIL_ON_LITERALS && failures > 0) {
  console.log(`\n❌ Audit failed (${failures} routes need attention)`)
  process.exit(1)
}
