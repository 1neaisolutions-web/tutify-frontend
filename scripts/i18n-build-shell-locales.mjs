#!/usr/bin/env node
/**
 * Build locale JSON files from en-US base + *-shell.json overrides.
 * Usage: node scripts/i18n-build-shell-locales.mjs [locale ...]
 * Default: ur-PK hi-IN
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')

function deepMerge(base, override) {
  const out = { ...base }
  for (const [k, v] of Object.entries(override)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = deepMerge(base[k] && typeof base[k] === 'object' ? base[k] : {}, v)
    } else {
      out[k] = v
    }
  }
  return out
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['ur-PK', 'hi-IN', 'de-DE', 'es-ES', 'fr-FR', 'pt-BR']
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))

for (const locale of targets) {
  const shellPath = path.join(localesDir, `${locale}-shell.json`)
  if (!fs.existsSync(shellPath)) {
    console.error(`Missing ${shellPath}`)
    process.exit(1)
  }
  const shell = JSON.parse(fs.readFileSync(shellPath, 'utf8'))
  const merged = deepMerge(en, shell)
  fs.writeFileSync(path.join(localesDir, `${locale}.json`), JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log(`Built ${locale}.json`)
}
