import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')

const additions = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'i18n-additions.json'), 'utf8')
)

for (const [locale, newKeys] of Object.entries(additions)) {
  const filePath = path.join(localesDir, `${locale}.json`)
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const merged = deepMerge(existing, newKeys)
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log(`Merged ${locale}`)
}

function deepMerge(target, source) {
  const out = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      out[key] = deepMerge(target[key], value)
    } else {
      out[key] = value
    }
  }
  return out
}
