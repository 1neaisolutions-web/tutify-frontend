#!/usr/bin/env node
/**
 * Seed shell-critical-overrides.json and dashboard-by-prefix.json from full locale bundles.
 * Use after i18n:translate-priority-all so prefix merge picks up nav/dashboard without MyMemory.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')
const MANIFEST = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'locale-manifest.json'), 'utf8'))
const EN_US = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8'))

const shellOut = path.join(LOCALES_DIR, 'shell-critical-overrides.json')
const dashOut = path.join(LOCALES_DIR, 'dashboard-by-prefix.json')

const shellTemplate = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'ur-PK-shell.json'), 'utf8'))

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key))
    } else {
      out[key] = String(v)
    }
  }
  return out
}

function deepPick(en, template) {
  if (template === null || typeof template !== 'object' || Array.isArray(template)) {
    return en
  }
  const out = {}
  for (const key of Object.keys(template)) {
    if (en && typeof en === 'object' && key in en) {
      out[key] = deepPick(en[key], template[key])
    }
  }
  return out
}

const enShellFlat = flatten(deepPick(EN_US, shellTemplate))
const enDashFlat = flatten(EN_US.dashboard || {}, 'dashboard')
const shellKeys = Object.keys(enShellFlat)
const dashKeys = Object.keys(enDashFlat)

const prefixToFull = MANIFEST.prefixToFull ?? {}
const shellExisting = fs.existsSync(shellOut) ? JSON.parse(fs.readFileSync(shellOut, 'utf8')) : {}
const dashExisting = fs.existsSync(dashOut) ? JSON.parse(fs.readFileSync(dashOut, 'utf8')) : {}

let shellUpdated = 0
let dashUpdated = 0

for (const [prefix, fullCode] of Object.entries(prefixToFull)) {
  if (prefix === 'en') continue
  const localePath = path.join(LOCALES_DIR, `${fullCode}.json`)
  if (!fs.existsSync(localePath)) continue

  const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'))
  const flat = flatten(locale)

  const shellFlat = {}
  let shellTranslated = 0
  for (const key of shellKeys) {
    const val = flat[key]
    if (val && val !== enShellFlat[key]) {
      shellFlat[key] = val
      shellTranslated++
    }
  }
  if (shellTranslated >= shellKeys.length - 15) {
    shellExisting[prefix] = { ...(shellExisting[prefix] || {}), ...shellFlat }
    shellUpdated++
  }

  const dashFlat = {}
  let dashTranslated = 0
  for (const key of dashKeys) {
    const val = flat[key]
    if (val && val !== enDashFlat[key]) {
      dashFlat[key] = val
      dashTranslated++
    }
  }
  if (dashTranslated >= Math.min(dashKeys.length, 8)) {
    dashExisting[prefix] = { ...(dashExisting[prefix] || {}), ...dashFlat }
    dashUpdated++
  }
}

fs.writeFileSync(shellOut, JSON.stringify(shellExisting, null, 2) + '\n', 'utf8')
fs.writeFileSync(dashOut, JSON.stringify(dashExisting, null, 2) + '\n', 'utf8')
console.log(`Seeded ${shellUpdated} shell prefix(es), ${dashUpdated} dashboard prefix(es)`)
