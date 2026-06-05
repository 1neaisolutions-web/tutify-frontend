#!/usr/bin/env node
/**
 * Report translation keys present in en-US but missing in other locale files.
 * Usage: node scripts/i18n-locale-diff.mjs [locale]
 *   locale optional — e.g. es-ES (default: all non-en locales)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')

const LOCALES = ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE']
const targetArg = process.argv[2]

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key))
    } else {
      out[key] = v
    }
  }
  return out
}

function loadLocale(code) {
  const file = path.join(localesDir, `${code}.json`)
  return flatten(JSON.parse(fs.readFileSync(file, 'utf8')))
}

const en = loadLocale('en-US')
const targets = targetArg ? [targetArg] : LOCALES.filter((l) => l !== 'en-US')

let totalMissing = 0
for (const locale of targets) {
  const other = loadLocale(locale)
  const missing = Object.keys(en).filter((k) => other[k] === undefined)
  totalMissing += missing.length
  console.log(`\n=== ${locale}: ${missing.length} missing keys ===`)
  if (missing.length > 0) {
    missing.slice(0, 50).forEach((k) => console.log(`  ${k}`))
    if (missing.length > 50) console.log(`  ... and ${missing.length - 50} more`)
  }
}

console.log(`\nTotal missing across checked locales: ${totalMissing}`)
process.exit(totalMissing > 0 ? 1 : 0)
