import { useState } from 'react'
import { BookOpen, Check, ChevronRight, Layers, Search, X } from 'lucide-react'
import type { ContentSourcesFormModel } from '../hooks/useContentSourcesForm'
import { getBookById, getChapters, getExcerptsForSelection } from '../demo/demoContentLibrary'
// @ts-expect-error — JS module
import { NoDataFound } from '../../../../components/shared/NoDataFound'

export interface ContentSourcesPanelProps {
  subject: string
  grade: string
  model: ContentSourcesFormModel
}

export function ContentSourcesPanel({ subject, grade, model }: ContentSourcesPanelProps) {
  const [showExcerpts, setShowExcerpts] = useState(false)
  const [topicQuery, setTopicQuery] = useState('')
  const topicOnlyMode = model.materialMode === 'none' || !model.groundingEnabled

  const selectedBook = model.selectedBookId ? getBookById(model.selectedBookId, model.catalog) : undefined
  const chapters = model.selectedBookId ? getChapters(model.selectedBookId, model.catalog) : []
  const excerpts = selectedBook ? getExcerptsForSelection(selectedBook, model.chapterIds) : []
  const availableTopics = chapters.length > 0
    ? chapters.map((c) => ({ id: c.id, label: c.title }))
    : model.topicsForSubject.map((t) => ({ id: `topic-${t}`, label: t }))
  const filteredTopics = availableTopics.filter((t) => t.label.toLowerCase().includes(topicQuery.trim().toLowerCase()))

  return (
    <div
      className="space-y-5 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-5 shadow-sm"
      aria-label={`Content sources for ${subject}, ${grade}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Layers className="h-4 w-4 text-indigo-600" aria-hidden />
            Content sources
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Select topic and catalog materials. Your organization can add proprietary titles from the admin library later;
            generation can use retrieval over approved content when connected.
          </p>
        </div>
        <label className="inline-flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={model.groundingEnabled}
            onChange={(e) => model.setGroundingEnabled(e.target.checked)}
            className="mt-0.5 rounded border-gray-300"
          />
          <span>
            <span className="block font-semibold text-gray-900">Use selected materials for generation</span>
            <span className="mt-0.5 block text-xs text-gray-600">
              Topic-only mode skips retrieval and only uses your scope prompt.
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            model.setMaterialMode('none')
            model.setGroundingEnabled(false)
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            topicOnlyMode ? 'bg-indigo-600 text-white' : 'border border-gray-200 bg-white text-gray-700'
          }`}
        >
          Generate topic-only
        </button>
        <button
          type="button"
          onClick={() => {
            model.setMaterialMode('system')
            model.setGroundingEnabled(true)
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            !topicOnlyMode ? 'bg-indigo-600 text-white' : 'border border-gray-200 bg-white text-gray-700'
          }`}
        >
          Generate with selected materials
        </button>
      </div>

      {model.materialMode === 'system' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={model.bookSearchQuery}
              onChange={(e) => model.setBookSearchQuery(e.target.value)}
              placeholder="Search title, author, ISBN, or topic strand…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {model.filteredBooks.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <NoDataFound />
              <p className="mt-2 text-xs text-gray-600">No books match this search.</p>
              <button
                type="button"
                onClick={() => model.setBookSearchQuery('')}
                className="mt-3 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-500"
              >
                Clear search
              </button>
            </div>
          )}

          <div className="grid max-h-72 gap-3 overflow-y-auto md:grid-cols-2">
            {model.filteredBooks.map((b) => {
              const on = model.selectedBookId === b.id
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => model.setSelectedBookId(b.id)}
                  className={`rounded-xl border p-4 text-left text-sm transition ${
                    on
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/25'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <BookOpen className={`h-5 w-5 shrink-0 ${on ? 'text-emerald-700' : 'text-gray-400'}`} />
                      <span className="truncate text-sm font-semibold text-gray-900">{b.title}</span>
                    </div>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-200 bg-white text-gray-300'}`}>
                      {on ? <Check className="h-4 w-4" /> : null}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-600">{b.authors}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 ring-1 ring-gray-200">
                      {b.indexedSections} sections indexed
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-gray-900">Search & select topic strands</p>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={topicQuery}
                onChange={(e) => setTopicQuery(e.target.value)}
                placeholder="Type to filter (e.g. fraction, word problem…) "
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 p-2">
              <div className="flex flex-wrap gap-2">
                {filteredTopics.map((t) => {
                  const active = model.chapterIds.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        model.toggleChapter(t.id)
                        model.setTopicPreset(t.label)
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active ? 'border-violet-500 bg-violet-600 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {active ? <Check className="h-3 w-3" /> : <ChevronRight className="h-3 w-3 opacity-40" />}
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>
            {model.chapterIds.length > 0 && (
              <div className="mt-3">
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.chapterIds.map((id) => {
                    const topic = availableTopics.find((t) => t.id === id)
                    if (!topic) return null
                    return (
                      <span key={id} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900 ring-1 ring-violet-200">
                        {topic.label}
                        <button type="button" onClick={() => model.toggleChapter(id)} className="rounded-full p-0.5 hover:bg-violet-100">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
            <label className="mt-3 block text-sm font-medium text-gray-700">
              Scope refinement (optional)
              <textarea
                rows={2}
                value={model.topicRefinement}
                onChange={(e) => model.setTopicRefinement(e.target.value)}
                placeholder="Focus on word problems, exam-style reasoning, and common misconceptions"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </label>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-600">
        <span className="font-semibold text-gray-800">Generation scope:</span>{' '}
        {topicOnlyMode
          ? `Topic-only mode (${model.topicPreset}${model.topicRefinement ? ` — ${model.topicRefinement}` : ''})`
          : `${selectedBook ? selectedBook.title : 'No specific book selected'}${model.chapterIds.length > 0 ? ` · ${model.chapterIds.length} chapter(s)` : ''}`}
      </div>

      {selectedBook && model.chapterIds.length > 0 && excerpts.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowExcerpts((s) => !s)}
            className="text-sm font-semibold text-primary-600 hover:text-primary-500"
          >
            {showExcerpts ? 'Hide' : 'Show'} excerpt preview
          </button>
          {showExcerpts && (
            <ul className="mt-2 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
              {excerpts.slice(0, 3).map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
