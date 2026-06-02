/**
 * fix-ph-placeholders.mjs — restore broken __ PH0 __ placeholders to {{interpolation}}.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')
const EN_US = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8'))

function flattenObject(obj, prefix = '') {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}

function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

const enFlat = flattenObject(EN_US)
const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json') && f !== 'locale-manifest.json' && !f.endsWith('-shell.json') && f !== 'dashboard-by-prefix.json' && f !== 'shell-critical-overrides.json')

let totalFixed = 0

for (const file of files) {
  const filePath = path.join(LOCALES_DIR, file)
  const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const flat = flattenObject(locale)
  let fixed = 0

  for (const [key, value] of Object.entries(flat)) {
    if (typeof value !== 'string' || !value.includes('__ PH')) continue
    const enValue = enFlat[key]
    if (typeof enValue === 'string' && enValue.includes('{{')) {
      setNestedValue(locale, key, enValue)
      fixed++
    } else {
      const restored = value.replace(/__\s*PH(\d+)\s*__/g, (_, i) => {
        const enStr = String(enFlat[key] ?? '')
        const matches = [...enStr.matchAll(/\{\{[^}]+\}\}/g)]
        return matches[Number(i)]?.[0] ?? '{{value}}'
      })
      setNestedValue(locale, key, restored)
      fixed++
    }
  }

  if (fixed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(locale, null, 2), 'utf8')
    console.log(`  ✅ ${file}: ${fixed} placeholders fixed`)
    totalFixed += fixed
  }
}

console.log(`\n✅ Fixed ${totalFixed} placeholder artifacts across ${files.length} files`)
