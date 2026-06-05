#!/usr/bin/env node
/**
 * Fails CI when locale files contain known bad translation artifacts under strict prefixes.
 *
 * Usage: node scripts/audit-locale-quality.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'locales')
const MANIFEST = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'locale-manifest.json'), 'utf8'))

const SKIP = new Set(['locale-manifest.json', 'dashboard-by-prefix.json', 'shell-critical-overrides.json'])

/** Broken encoding / failed machine-translation markers (not i18next {{placeholders}}). */
const ARTIFACT_RE = /\?\?\?|\[ترجمة/

const STRICT_PREFIXES = [
  'nav.',
  'common.',
  'layout.',
  'settings.',
  'analyticsPage.',
  'history.',
  'assessmentPage.',
  'contentPacksPage.',
  'exploreUseCases.',
  'chatbotsPage.',
  'chatbot.',
  'grammarWritingMentor.',
  'literatureAnalysisExpert.',
  'literacyLabCoach.',
  'sTEMInquiryMentor.',
  'problemSolvingCoach.',
  'adaptiveMathStrategist.',
  'algebraGeometryTutor.',
  'advancedKnowledgeSkillsCoach.',
]

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key))
    } else if (typeof v === 'string') {
      out[key] = v
    }
  }
  return out
}

function isStrictKey(key) {
  return STRICT_PREFIXES.some((p) => key === p.slice(0, -1) || key.startsWith(p))
}

const locales = (MANIFEST.fullLocales ?? []).filter((c) => c !== 'en-US')
let failures = 0

for (const code of locales) {
  const filePath = path.join(LOCALES_DIR, `${code}.json`)
  if (!fs.existsSync(filePath)) continue
  const flat = flatten(JSON.parse(fs.readFileSync(filePath, 'utf8')))
  for (const [key, value] of Object.entries(flat)) {
    if (!isStrictKey(key)) continue
    if (ARTIFACT_RE.test(value)) {
      console.error(`[${code}] ${key}: ${JSON.stringify(value).slice(0, 80)}`)
      failures++
    }
  }
}

if (failures > 0) {
  console.error(`\n❌ ${failures} locale quality issue(s)`)
  process.exit(1)
}
console.log(`✅ Locale quality OK (${locales.length} locales checked)`)
