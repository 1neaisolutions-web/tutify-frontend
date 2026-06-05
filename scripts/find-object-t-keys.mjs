/**
 * Find t('key') usages where key resolves to a nested object (crash risk in React).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/locales/en-US.json'), 'utf8'))

function isObjectAt(obj, key) {
  const parts = key.split('.')
  let cur = obj
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return false
    cur = cur[p]
  }
  return cur != null && typeof cur === 'object' && !Array.isArray(cur)
}

function walkDir(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (!['node_modules', 'dist', 'locales'].includes(ent.name)) walkDir(full, files)
    } else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) files.push(full)
  }
  return files
}

const keyRe = /\bt\(\s*['"]([a-zA-Z0-9_.]+)['"]/g
const keys = new Set()
for (const file of walkDir(path.join(ROOT, 'src'))) {
  const src = fs.readFileSync(file, 'utf8')
  let m
  while ((m = keyRe.exec(src))) keys.add(m[1])
}

const bad = [...keys].filter((k) => isObjectAt(en, k)).sort()
console.log(`t() calls on object keys: ${bad.length}`)
for (const k of bad) console.log(' ', k)
