import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { AiDocument } from '../../lib/aiDocument'

const SECTION_MARKER_REGEX = /\[\[SECTION:[^\]]*\]\]/g

function stripMarkers(text: string): string {
  if (!text || !text.includes('[[SECTION:')) return text
  return text.replace(SECTION_MARKER_REGEX, '').trim()
}

interface AiDocumentRendererProps {
  document: AiDocument
  isStreaming?: boolean
  lastSectionKey?: string | null
  className?: string
}

/**
 * Renders the canonical AI document: one clean reading surface,
 * section = heading + body (markdown). No cards, no chrome.
 * GPT/Gemini-style.
 */
export function AiDocumentRenderer({
  document: doc,
  isStreaming = false,
  lastSectionKey = null,
  className = '',
}: AiDocumentRendererProps) {
  if (!doc.sections.length) {
    return (
      <div className={`max-w-[800px] mx-auto text-gray-500 text-[15px] ${className}`}>
        {isStreaming ? 'Generating...' : '\u00a0'}
      </div>
    )
  }

  return (
    <article
      id="ai-output-content"
      className={`max-w-[800px] mx-auto text-gray-900 ${className}`}
      style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}
    >
      <div className="space-y-8">
        {doc.sections.map((sec) => {
          const content = stripMarkers(sec.content || '').trim()
          const isLastAndStreaming = isStreaming && lastSectionKey === sec.key

          return (
            <section key={sec.key} className="scroll-mt-6">
              {sec.heading && (
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-3">
                  {sec.heading}
                </h2>
              )}
              <div className="text-[15px] leading-[1.75] text-gray-800">
                {content ? (
                  <div className="prose prose-gray max-w-none prose-p:my-2.5 prose-p:leading-[1.75] prose-ul:my-3 prose-ol:my-3 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-4 prose-table:text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-gray-400">{isStreaming ? '...' : '\u00a0'}</span>
                )}
                {isLastAndStreaming && (
                  <span className="inline-block w-2 h-4 ml-0.5 bg-indigo-500 animate-pulse align-middle" aria-hidden />
                )}
              </div>
            </section>
          )
        })}
      </div>
      {isStreaming && doc.sections.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-6 pt-2">
          <span className="inline-block w-1 h-3 bg-indigo-400 rounded-full animate-pulse" />
          <span>Writing...</span>
        </div>
      )}
    </article>
  )
}
