/**
 * patch-loanword-nav.mjs — fix nav.dashboard where Google returned the English loanword "Dashboard".
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')

const NAV_DASHBOARD = {
  'da-DK': 'Oversigt',
  'nb-NO': 'Oversikt',
  'cs-CZ': 'Přehled',
  'sk-SK': 'Prehľad',
  'af-ZA': 'Kontroleskerm',
  'sq-AL': 'Paneli',
  'sr-RS': 'Kontrolna tabla',
  'tl-PH': 'Dashboard', // Filipino often uses English — use Tagalog
  'uz-UZ': 'Boshqaruv paneli',
  'zu-ZA': 'Ibhodi lokulawula',
  'cy-GB': 'Dangosfwrdd',
  'mt-MT': 'Dashboard', // will patch below
  'ga-IE': 'Deais',
}

// Tagalog / Maltese alternatives
NAV_DASHBOARD['tl-PH'] = 'Tablero'
NAV_DASHBOARD['mt-MT'] = 'Dashboard tal-kontroll'

for (const [code, label] of Object.entries(NAV_DASHBOARD)) {
  const filePath = path.join(LOCALES_DIR, `${code}.json`)
  if (!fs.existsSync(filePath)) continue
  const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  if (locale.nav) {
    locale.nav.dashboard = label
    fs.writeFileSync(filePath, JSON.stringify(locale, null, 2), 'utf8')
    console.log(`  ✅ ${code}: nav.dashboard → ${label}`)
  }
}

console.log('Done')
