#!/usr/bin/env node
/**
 * Find t('key') usages in src/ that are missing from en-US.json
 * Usage: node scripts/i18n-missing-keys.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.join(__dirname, '../src')
const enPath = path.join(__dirname, '../src/locales/en-US.json')

function flatten(obj, prefix = '') {
  const out = new Set()
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key).forEach((x) => out.add(x))
    } else {
      out.add(key)
    }
  }
  return out
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) {
      if (!name.includes('node_modules')) walk(p, files)
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      files.push(p)
    }
  }
  return files
}

const enKeys = flatten(JSON.parse(fs.readFileSync(enPath, 'utf8')))
const used = new Set()

const patterns = [
  /\bt\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
  /i18nKey:\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
  /labelKey:\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
]

for (const file of walk(srcDir)) {
  const content = fs.readFileSync(file, 'utf8')
  for (const re of patterns) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(content)) !== null) {
      used.add(m[1])
    }
  }
}

const missing = [...used].filter((k) => !enKeys.has(k)).sort()
console.log(`Used keys: ${used.size}`)
console.log(`en-US keys: ${enKeys.size}`)
console.log(`Missing from en-US: ${missing.length}\n`)
missing.forEach((k) => console.log(k))
