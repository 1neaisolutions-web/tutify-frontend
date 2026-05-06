import React from 'react'
import { ListTree } from 'lucide-react'
import { TOC_JSON_EXAMPLE } from './tocChapterMapParse'

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Collapsible optional TOC JSON for document upload (matches backend chapter_map).
 */
export function TocJsonOptionalSection({ value, onChange, disabled }: Props) {
  return (
    <details className="group rounded-lg border border-indigo-100 bg-indigo-50/40 open:bg-indigo-50/60">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-950 [&::-webkit-details-marker]:hidden">
        <ListTree className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
        <span>Optional: table of contents (JSON)</span>
        <span className="ml-auto text-xs font-normal text-indigo-700/80 group-open:hidden">Show</span>
        <span className="ml-auto hidden text-xs font-normal text-indigo-700/80 group-open:inline">Hide</span>
      </summary>
      <div className="space-y-3 border-t border-indigo-100/80 px-4 pb-4 pt-2">
        <p className="text-xs leading-relaxed text-indigo-900/85">
          Paste a JSON array of chapters. Each entry needs <code className="rounded bg-white/80 px-1">title</code>,{' '}
          <code className="rounded bg-white/80 px-1">start_page_pdf</code>, and{' '}
          <code className="rounded bg-white/80 px-1">end_page_pdf</code> (1-based PDF page indices). Optional:{' '}
          <code className="rounded bg-white/80 px-1">id</code>, <code className="rounded bg-white/80 px-1">level</code>,{' '}
          <code className="rounded bg-white/80 px-1">parent_id</code>, <code className="rounded bg-white/80 px-1">keywords</code>.
          If you leave this empty, the system will try PDF bookmarks or Word headings automatically.
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          rows={8}
          placeholder="Paste TOC JSON here, or leave empty for auto-detection…"
          className="w-full rounded-md border border-indigo-200 bg-white px-3 py-2 font-mono text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          aria-label="Optional table of contents JSON"
        />
        <details className="rounded border border-indigo-100 bg-white/80 text-xs">
          <summary className="cursor-pointer px-3 py-2 font-medium text-indigo-900">Example format</summary>
          <pre className="max-h-40 overflow-auto border-t border-indigo-50 p-3 text-[11px] leading-relaxed text-gray-700">
            {TOC_JSON_EXAMPLE}
          </pre>
        </details>
      </div>
    </details>
  )
}
