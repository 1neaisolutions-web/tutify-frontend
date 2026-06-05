#!/usr/bin/env node
/**
 * Sync missing keys from en-US into other locale files (copies en-US string as placeholder).
 * Usage: node scripts/i18n-sync-locales.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const TARGETS = ['es-ES', 'fr-FR', 'pt-BR', 'de-DE']

function setNested(obj, keyPath, value) {
  const parts = keyPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (cur[p] === undefined || typeof cur[p] !== 'object') cur[p] = {}
    cur = cur[p]
  }
  cur[parts[parts.length - 1]] = value
}

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

const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const enFlat = flatten(en)

for (const locale of TARGETS) {
  const file = path.join(localesDir, `${locale}.json`)
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  const flat = flatten(data)
  let added = 0
  for (const [key, value] of Object.entries(enFlat)) {
    if (flat[key] === undefined) {
      setNested(data, key, value)
      added++
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log(`${locale}: added ${added} keys`)
}

console.log('Done.')
