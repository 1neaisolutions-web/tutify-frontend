#!/usr/bin/env node
/** Build *-shell.json for full UI locales (de/es/fr/pt) from MyMemory translations. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')

const TARGETS = {
  'de-DE': 'de',
  'es-ES': 'es',
  'fr-FR': 'fr',
  'pt-BR': 'pt',
}

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, key))
    else out[key] = String(v)
  }
  return out
}

function unflatten(flat) {
  const out = {}
  for (const [keyPath, value] of Object.entries(flat)) {
    const parts = keyPath.split('.')
    let cur = out
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {}
      cur = cur[p]
    }
    cur[parts[parts.length - 1]] = value
  }
  return out
}

function deepPick(en, template) {
  if (template === null || typeof template !== 'object' || Array.isArray(template)) return en
  const out = {}
  for (const key of Object.keys(template)) {
    if (en && typeof en === 'object' && key in en) out[key] = deepPick(en[key], template[key])
  }
  return out
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function translateText(text, targetLang) {
  if (!text.trim()) return text
  const protectedParts = []
  let work = text.replace(/\{\{[^}]+\}\}/g, (m) => {
    const id = `__PH${protectedParts.length}__`
    protectedParts.push(m)
    return id
  })
  const url = new URL('https://api.mymemory.translated.net/get')
  url.searchParams.set('q', work.slice(0, 450))
  url.searchParams.set('langpair', `en|${targetLang}`)
  url.searchParams.set('de', 'teacher-assistant@tutify.local')
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (res.status === 429 || data.responseStatus === 429) {
        await sleep(4000 * (attempt + 1))
        continue
      }
      let translated = data.responseData?.translatedText ?? text
      for (let i = 0; i < protectedParts.length; i++) {
        translated = translated.replace(`__PH${i}__`, protectedParts[i])
      }
      return translated
    } catch {
      await sleep(2000)
    }
  }
  return text
}

const shellTemplate = JSON.parse(fs.readFileSync(path.join(localesDir, 'ur-PK-shell.json'), 'utf8'))
const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const enShellFlat = flatten(deepPick(enUS, shellTemplate))

const only = process.argv[2]

for (const [locale, lang] of Object.entries(TARGETS)) {
  if (only && only !== locale) continue
  const shellPath = path.join(localesDir, `${locale}-shell.json`)
  const existing = fs.existsSync(shellPath) ? flatten(JSON.parse(fs.readFileSync(shellPath, 'utf8'))) : {}
  const flat = { ...existing }
  console.log(`Translating ${locale} (${lang})...`)
  let n = 0
  for (const [key, enValue] of Object.entries(enShellFlat)) {
    if (flat[key] && flat[key] !== enValue && flat[key].length > 0) {
      n++
      continue
    }
    flat[key] = await translateText(enValue, lang)
    n++
    if (n % 10 === 0) console.log(`  ${n}/${Object.keys(enShellFlat).length}`)
    await sleep(300)
  }
  fs.writeFileSync(shellPath, JSON.stringify(unflatten(flat), null, 2) + '\n', 'utf8')
  console.log(`Wrote ${shellPath}`)
}
