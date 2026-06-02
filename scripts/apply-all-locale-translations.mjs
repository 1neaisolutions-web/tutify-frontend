import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const additionsPath = path.join(__dirname, 'i18n-additions.json')

const enAdditions = JSON.parse(fs.readFileSync(additionsPath, 'utf8'))['en-US']

/** @type {Record<string, Record<string, string>>} */
const flatTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'i18n-flat-translations.json'), 'utf8')
)

function flatten(obj, prefix = '') {
  /** @type {Record<string, string | string[]>} */
  const out = {}
  for (const [key, value] of Object.entries(obj)) {
    const pathKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      out[pathKey] = value
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        out[`${pathKey}[${i}]`] = item
      })
    } else if (value && typeof value === 'object') {
      Object.assign(out, flatten(value, pathKey))
    }
  }
  return out
}

function unflatten(flat) {
  /** @type {Record<string, unknown>} */
  const root = {}
  for (const [pathKey, value] of Object.entries(flat)) {
    const arrayMatch = pathKey.match(/^(.+)\[(\d+)\]$/)
    if (arrayMatch) {
      const [, base, index] = arrayMatch
      const parts = base.split('.')
      let cur = root
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = cur[parts[i]] ?? {}
        cur = cur[parts[i]]
      }
      const last = parts[parts.length - 1]
      cur[last] = Array.isArray(cur[last]) ? cur[last] : []
      cur[last][Number(index)] = value
      continue
    }
    const parts = pathKey.split('.')
    let cur = root
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] ?? {}
      cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = value
  }
  return root
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
    } else {
      out[key] = value
    }
  }
  return out
}

const enFlat = flatten(enAdditions)

for (const locale of ['es-ES', 'fr-FR', 'pt-BR', 'de-DE']) {
  /** @type {Record<string, string | string[]>} */
  const translatedFlat = {}
  for (const [pathKey, enValue] of Object.entries(enFlat)) {
    const map = flatTranslations[pathKey]
    translatedFlat[pathKey] = map?.[locale] ?? enValue
  }
  const translatedTree = unflatten(translatedFlat)
  const filePath = path.join(localesDir, `${locale}.json`)
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const merged = deepMerge(existing, translatedTree)
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log(`Updated ${locale}`)
}
