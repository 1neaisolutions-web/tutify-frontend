import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type SectionType = 'text' | 'markdown' | 'bullet_list' | 'numbered_list' | 'table'

export interface SectionSchema {
  key: string
  label: string
  type: SectionType
}

export interface SectionRendererOptions {
  isStreaming?: boolean
  isComplete?: boolean
}

interface SectionRendererProps {
  type: SectionType
  content: string
  isStreaming?: boolean
  isComplete?: boolean
}

/** Strip section markers so they never render. Backend should not send them; this is a safety net. */
function stripSectionMarkers(text: string): string {
  if (!text || !text.includes('[[SECTION:')) return text
  return text.replace(/\[\[SECTION:[^\]]*\]\]/g, '').trim()
}

export function isLikelyJsonObject(text: string): boolean {
  if (!text || text.length < 4) return false
  const s = text.trim()
  if (s.startsWith('{') && (s.includes('}') || s.includes('"') || s.includes(':'))) return true
  if (s.includes('"') && s.includes(':') && (s.includes('{') || /^\s*"/.test(s))) return true
  return false
}

export function isLikelyArray(text: string): boolean {
  if (!text || text.length < 2) return false
  const s = text.trim()
  return s.startsWith('[') && (s.includes(']') || s.includes('"'))
}

export function isLikelyMarkdownTable(text: string): boolean {
  if (!text || !text.includes('|')) return false
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return false
  const first = lines[0]
  if (!first.includes('|')) return false
  return true
}

/** True if content looks like a complete markdown table (header + separator + at least one row). */
export function isTableComplete(raw: string): boolean {
  const lines = raw.trim().split('\n').filter(Boolean)
  if (lines.length < 3) return false
  const [header, sep, ...rest] = lines
  if (!header?.includes('|') || !sep || !/^[-|\s]+$/.test(sep)) return false
  return rest.some((line) => line.includes('|'))
}

/**
 * Convert JSON/object-like content into readable text for streaming-safe display.
 * Only normalizes when content clearly looks structured; leaves prose unchanged.
 */
export function normalizeStreamingContent(text: string): string {
  if (!text || (!isLikelyJsonObject(text) && !isLikelyArray(text))) return text
  const s = text.trim()
  try {
    const parsed = JSON.parse(s)
    if (Array.isArray(parsed)) {
      return parsed.map((item) => `- ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n')
    }
    if (parsed && typeof parsed === 'object') {
      const lines: string[] = []
      for (const [k, v] of Object.entries(parsed)) {
        const label = k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        if (Array.isArray(v)) {
          lines.push(`${label}:`)
          v.forEach((item) => lines.push(`- ${typeof item === 'string' ? item : JSON.stringify(item)}`))
        } else if (v !== null && typeof v === 'object') {
          lines.push(`${label}: ${JSON.stringify(v)}`)
        } else {
          lines.push(`${label}: ${v}`)
        }
      }
      return lines.join('\n')
    }
  } catch {
    // incomplete or invalid JSON - return as-is so we don't break mid-stream
  }
  return text
}

function parseBulletList(raw: string): string[] {
  return raw
    .split(/\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(Boolean)
}

function parseNumberedList(raw: string): string[] {
  return raw
    .split(/\n/)
    .map((l) => l.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
}

function parseTable(raw: string): { headers: string[]; rows: string[][] } {
  const lines = raw.trim().split('\n').filter(Boolean)
  if (lines.length === 0) return { headers: [], rows: [] }
  const headerLine = lines[0]
  const headers = headerLine.split('|').map((c) => c.trim()).filter(Boolean)
  const rows: string[][] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (/^[-|\s]+$/.test(line)) continue
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
    if (cells.length) rows.push(cells)
  }
  return { headers, rows }
}

/**
 * Render section content. When isStreaming and content looks like JSON/object or partial table,
 * use streaming-safe rendering (readable text) to avoid broken UI. After isComplete, use full
 * structured rendering for table/bullet/numbered.
 */
export function SectionRenderer({ type, content, isStreaming, isComplete = false }: SectionRendererProps) {
  let raw = stripSectionMarkers((content || '').trim())

  const complete = isComplete || !isStreaming
  const useStreamingSafe =
    isStreaming && !complete && (isLikelyJsonObject(raw) || isLikelyArray(raw) || (type === 'table' && !isTableComplete(raw)))

  if (useStreamingSafe && (isLikelyJsonObject(raw) || isLikelyArray(raw))) {
    raw = normalizeStreamingContent(raw)
  }

  if (type === 'text') {
    return <p className="text-[15px] leading-[1.8] text-gray-800 whitespace-pre-wrap">{raw || '\u00a0'}</p>
  }

  if (type === 'markdown') {
    if (!raw) return <span className="text-gray-400">{isStreaming ? '...' : '\u00a0'}</span>
    return (
      <div className="prose prose-gray max-w-none prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-gray-800 prose-ul:my-3 prose-li:my-0.5">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{raw}</ReactMarkdown>
      </div>
    )
  }

  if (type === 'bullet_list') {
    const items = parseBulletList(raw)
    if (items.length === 0 && !raw) return <span className="text-gray-400">{isStreaming ? '...' : '\u00a0'}</span>
    if (items.length === 0) return <div className="prose prose-gray max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{raw}</ReactMarkdown></div>
    return (
      <ul className="space-y-2 list-none pl-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[15px] leading-[1.7] text-gray-800">
            <span className="text-indigo-500 mt-1.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (type === 'numbered_list') {
    const items = parseNumberedList(raw)
    if (items.length === 0 && !raw) return <span className="text-gray-400">{isStreaming ? '...' : '\u00a0'}</span>
    if (items.length === 0) return <div className="prose prose-gray max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{raw}</ReactMarkdown></div>
    return (
      <ol className="space-y-3 list-decimal pl-6">
        {items.map((item, i) => (
          <li key={i} className="text-[15px] leading-[1.7] text-gray-800 pl-1">{item}</li>
        ))}
      </ol>
    )
  }

  if (type === 'table') {
    const { headers, rows } = parseTable(raw)
    if (headers.length === 0 && rows.length === 0 && !raw) return <span className="text-gray-400">{isStreaming ? '...' : '\u00a0'}</span>
    const tableValid = complete && headers.length > 0 && (rows.length > 0 || isTableComplete(raw))
    if (!tableValid) {
      return (
        <div className="prose prose-gray max-w-none prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{raw || ''}</ReactMarkdown>
        </div>
      )
    }
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-semibold text-gray-900">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <div className="prose prose-gray max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{raw || ''}</ReactMarkdown></div>
}
