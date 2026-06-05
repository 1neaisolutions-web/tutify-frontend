#!/usr/bin/env node
/**
 * Ensures every dropdown language prefix has a complete dashboard.* translation set.
 * Uses shell files + embedded + MyMemory (resumable). Then rebuilds all locale files.
 */
import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function run(cmd, args) {
  const r = spawnSync(process.execPath, [path.join(__dirname, cmd), ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

run('i18n-patch-dashboard-embedded.mjs', [])
run('i18n-seed-dashboard-by-prefix.mjs', [])
run('i18n-translate-dashboard-prefixes.mjs', ['--no-rebuild'])
run('i18n-build-shell-locales.mjs', [])
run('i18n-build-all-partials.mjs', [])
