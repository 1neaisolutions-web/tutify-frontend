import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ttRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/pages/features/teacher-tools')

function walk(d, a = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p, a)
    else if (f.endsWith('.tsx')) a.push(p)
  }
  return a
}

const files = walk(ttRoot)
const withT = files.filter((f) => fs.readFileSync(f, 'utf8').includes('useTranslation'))
const toasts = files.filter((f) => /toast\.(success|error)\(['"]/.test(fs.readFileSync(f, 'utf8')))
const jsxEn = files.filter((f) => />[A-Za-z][^<{]{4,}</.test(fs.readFileSync(f, 'utf8')))

console.log('total', files.length)
console.log('with useTranslation', withT.length)
console.log('hardcoded toasts', toasts.length, toasts.map((f) => path.relative(ttRoot, f)))
console.log('files with JSX English', jsxEn.length)
