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

const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const shell = JSON.parse(fs.readFileSync(path.join(localesDir, 'ur-PK-shell.json'), 'utf8'))
const ur = deepMerge(en, shell)

fs.writeFileSync(path.join(localesDir, 'ur-PK.json'), JSON.stringify(ur, null, 2) + '\n', 'utf8')
console.log('Built ur-PK.json with Urdu shell overrides on en-US base.')
