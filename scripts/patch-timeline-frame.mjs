/**
 * Patch Remotion scene files to use shared timeline frame hooks (V9 scaling support).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'src', 'remotion')

const TARGET_DIRS = [
  path.join(root, 'v6'),
  path.join(root, 'compositions', 'TeachersOverwhelmedSlide'),
]

const TIMELINE_IMPORT = `@/remotion/shared/timelineFrame`

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  if (!content.includes('useCurrentFrame') && !content.includes('useVideoConfig')) return false
  if (content.includes(TIMELINE_IMPORT)) return false

  const usesFrame = /\buseCurrentFrame\b/.test(content)
  const usesVideoConfig = /\buseVideoConfig\b/.test(content)
  if (!usesFrame && !usesVideoConfig) return false

  // Remove useCurrentFrame / useVideoConfig from remotion import
  content = content.replace(
    /import\s+\{([^}]+)\}\s+from\s+['"]remotion['"]/g,
    (match, imports) => {
      const parts = imports
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => p !== 'useCurrentFrame' && p !== 'useVideoConfig')
      if (parts.length === 0) return ''
      return `import { ${parts.join(', ')} } from 'remotion'`
    },
  )

  const timelineImports = []
  if (usesFrame) timelineImports.push('useCurrentFrame')
  if (usesVideoConfig) timelineImports.push('useVideoConfig')

  const importLine = `import { ${timelineImports.join(', ')} } from '${TIMELINE_IMPORT}'\n`

  // Insert after first remotion import or at top after first import block
  const remotionImportMatch = content.match(/^import .+ from 'remotion'/m)
  if (remotionImportMatch) {
    const idx = content.indexOf(remotionImportMatch[0]) + remotionImportMatch[0].length + 1
    content = content.slice(0, idx) + importLine + content.slice(idx)
  } else {
    content = importLine + content
  }

  // Clean double newlines from empty import removal
  content = content.replace(/\n{3,}/g, '\n\n')

  fs.writeFileSync(filePath, content)
  return true
}

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.tsx?$/.test(entry.name)) patchFile(full)
  }
}

let count = 0
for (const dir of TARGET_DIRS) {
  walk(dir)
}

// Re-count patched
function countPatched(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) countPatched(full)
    else if (/\.tsx?$/.test(entry.name)) {
      const c = fs.readFileSync(full, 'utf8')
      if (c.includes(TIMELINE_IMPORT)) count++
    }
  }
}
countPatched(TARGET_DIRS[0])
countPatched(TARGET_DIRS[1])
console.log(`Patched files using timeline import: ${count}`)
