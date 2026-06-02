import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const localesDir = join(__dirname, '../src/locales')
const batch = JSON.parse(readFileSync(join(__dirname, 'i18n-batch-locales.json'), 'utf8'))

for (const [file, patch] of Object.entries(batch)) {
  const path = join(localesDir, file)
  const data = JSON.parse(readFileSync(path, 'utf8'))
  const merged = deepMerge(data, patch)
  writeFileSync(path, JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log('Updated', file)
}

function deepMerge(target, source) {
  const out = { ...target }
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object') {
      out[k] = deepMerge(target[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}
