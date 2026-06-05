/**
 * Merges teacher-tools i18n namespaces into all locale JSON files.
 * Run: node scripts/merge-teacher-tools-i18n.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')

const namespaces = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'teacher-tools-i18n-data.json'), 'utf8'),
)

for (const locale of ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE']) {
  const filePath = path.join(localesDir, `${locale}.json`)
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const data = namespaces[locale]
  if (!data) throw new Error(`Missing locale data: ${locale}`)
  for (const [ns, content] of Object.entries(data)) {
    existing[ns] = { ...(existing[ns] || {}), ...content }
  }
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n')
  console.log(`Updated ${locale}.json`)
}
