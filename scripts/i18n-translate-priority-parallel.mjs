#!/usr/bin/env node
/**
 * Run translate-priority-namespaces.mjs in parallel shards for faster completion.
 * Usage: node scripts/i18n-translate-priority-parallel.mjs [--shards=4]
 */
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')
const MANIFEST = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'locale-manifest.json'), 'utf8'))
const CHECKPOINT = path.join(LOCALES_DIR, '.translate-priority-checkpoint.json')

function mergeAllCheckpoints() {
  const merged = new Set()
  for (const f of fs.readdirSync(LOCALES_DIR)) {
    if (!f.startsWith('.translate-priority-checkpoint')) continue
    try {
      const data = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, f), 'utf8'))
      for (const c of data.completed ?? []) merged.add(c)
    } catch {
      // ignore
    }
  }
  if (merged.size > 0) {
    fs.writeFileSync(
      CHECKPOINT,
      JSON.stringify({ completed: [...merged], updatedAt: new Date().toISOString() }, null, 2) + '\n',
    )
  }
  return merged
}

const completed = mergeAllCheckpoints()

const shardsArg = parseInt(process.argv.find((a) => a.startsWith('--shards='))?.split('=')[1] ?? '4', 10)
const SHARDS = Math.max(1, Math.min(8, shardsArg))

const remaining = (MANIFEST.fullLocales ?? []).filter((c) => c !== 'en-US' && !completed.has(c))
if (remaining.length === 0) {
  console.log('All locales already translated (checkpoint).')
  process.exit(0)
}

const groups = Array.from({ length: SHARDS }, () => [])
remaining.forEach((code, i) => groups[i % SHARDS].push(code))

console.log(`Parallel translate: ${remaining.length} locales across ${SHARDS} shards`)
groups.forEach((g, i) => console.log(`  shard ${i}: ${g.length} locales — ${g.slice(0, 4).join(', ')}${g.length > 4 ? '…' : ''}`))

const script = path.join(__dirname, 'translate-priority-namespaces.mjs')
const children = groups
  .filter((g) => g.length > 0)
  .map((locales, shard) => {
    const cp = path.join(LOCALES_DIR, `.translate-priority-checkpoint-shard-${shard}.json`)
    const child = spawn(
      process.execPath,
      [script, ...locales],
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          I18N_CHECKPOINT_PATH: cp,
          I18N_MT_CONCURRENCY: '3',
        },
      },
    )
    return new Promise((resolve, reject) => {
      child.on('exit', (code) => (code === 0 ? resolve(shard) : reject(new Error(`shard ${shard} exit ${code}`))))
    })
  })

Promise.all(children)
  .then(() => {
    const merged = new Set(completed)
    for (let i = 0; i < SHARDS; i++) {
      const cp = path.join(LOCALES_DIR, `.translate-priority-checkpoint-shard-${i}.json`)
      if (!fs.existsSync(cp)) continue
      const data = JSON.parse(fs.readFileSync(cp, 'utf8'))
      for (const c of data.completed ?? []) merged.add(c)
      fs.unlinkSync(cp)
    }
    fs.writeFileSync(
      CHECKPOINT,
      JSON.stringify({ completed: [...merged], updatedAt: new Date().toISOString() }, null, 2) + '\n',
    )
    const total = (MANIFEST.fullLocales ?? []).filter((c) => c !== 'en-US').length
    if (merged.size >= total) fs.unlinkSync(CHECKPOINT)
    console.log(`Merged checkpoint: ${merged.size}/${total} locales done.`)
  })
  .catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
