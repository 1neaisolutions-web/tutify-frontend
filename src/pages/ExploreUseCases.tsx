import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock, Layers, Search, Sparkles } from 'lucide-react'

import {
  useListItemsQuery,
  type ContentRegistryItem,
} from '../redux/features/contentRegistry/contentRegistryApiSlice'
import { useTeacherToolsDemo } from './features/teacher-tools/TeacherToolsDemoProvider'

const CONTENT_TYPE_PATHS: Record<string, string> = {
  quiz: '/teacher-tools/quiz/create',
  assignment: '/teacher-tools/assignment/create',
  worksheet: '/teacher-tools/worksheet/create',
  exam: '/teacher-tools/exams/create',
}

function ctaPath(contentType: string): string {
  return CONTENT_TYPE_PATHS[contentType.toLowerCase()] ?? '/teacher-tools'
}

const DIFFICULTY_COLOURS: Record<string, string> = {
  foundation: 'bg-green-100 text-green-700',
  standard: 'bg-blue-100  text-blue-700',
  challenge: 'bg-red-100   text-red-700',
}

function TemplateCard({ item }: { item: ContentRegistryItem }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary-200 hover:shadow-md transition">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            {item.category ?? item.content_type}
          </span>
          {item.estimated_duration_min && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {item.estimated_duration_min} min
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 leading-snug">{item.title}</h3>
        {item.difficulty && (
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              DIFFICULTY_COLOURS[item.difficulty] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {item.difficulty}
          </span>
        )}
      </div>
      <Link to={ctaPath(item.content_type)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-500">
        Use this template <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function TemplateSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse space-y-3">
      <div className="h-3 w-20 bg-gray-200 rounded-full" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  )
}

const ExploreUseCases = () => {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategory] = useState('')
  const [typeFilter, setType] = useState('')

  const { data: allTemplates = [], isLoading } = useListItemsQuery({
    status: 'published',
    limit: 100,
  })

  const { allQuizzes, allAssignments, allWorksheets } = useTeacherToolsDemo()
  const myPatterns = useMemo(
    () => [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(allQuizzes as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((q: any) => q.status === 'published')
        .slice(0, 3)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((q: any) => ({
          id: q.id,
          title: q.title,
          subject: q.subject,
          grade: q.grade,
          tool: 'quiz' as const,
          path: `/teacher-tools/quiz/${q.id}`,
        })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(allAssignments as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((a: any) => ['active', 'published'].includes(a.status))
        .slice(0, 3)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          subject: a.subject,
          grade: a.grade,
          tool: 'assignment' as const,
          path: `/teacher-tools/assignment/${a.id}`,
        })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(allWorksheets as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((w: any) => w.status === 'published')
        .slice(0, 3)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((w: any) => ({
          id: w.id,
          title: w.title,
          subject: w.subject,
          grade: w.grade,
          tool: 'worksheet' as const,
          path: `/teacher-tools/worksheet/${w.id}`,
        })),
    ],
    [allQuizzes, allAssignments, allWorksheets],
  )

  const categories = useMemo(
    () => [...new Set(allTemplates.map((t) => t.category).filter(Boolean))] as string[],
    [allTemplates],
  )
  const contentTypes = useMemo(
    () => [...new Set(allTemplates.map((t) => t.content_type).filter(Boolean))] as string[],
    [allTemplates],
  )

  const filtered = useMemo(
    () =>
      allTemplates.filter((t) => {
        if (categoryFilter && t.category !== categoryFilter) return false
        if (typeFilter && t.content_type !== typeFilter) return false
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
      }),
    [allTemplates, categoryFilter, typeFilter, search],
  )

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-500 px-8 py-10 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            <Sparkles className="h-4 w-4" /> Explore use cases
          </div>
          <h1 className="text-3xl font-semibold lg:text-4xl">Real templates, ready to use.</h1>
          <p className="text-white/80">
            {isLoading
              ? 'Loading templates…'
              : allTemplates.length > 0
                ? `${allTemplates.length} published template${allTemplates.length > 1 ? 's' : ''} across ${categories.length} category${categories.length !== 1 ? 'ies' : ''}.`
                : 'Browse how teachers apply AI tools across the learning journey.'}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm outline-none focus:border-primary-400"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {contentTypes.length > 0 && (
          <select
            value={typeFilter}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm outline-none focus:border-primary-400"
          >
            <option value="">All types</option>
            {contentTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        )}

        {(search || categoryFilter || typeFilter) && (
          <button
            onClick={() => {
              setSearch('')
              setCategory('')
              setType('')
            }}
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {filtered.length > 0 || isLoading ? `Platform templates${categoryFilter ? ` · ${categoryFilter}` : ''}` : 'No templates match your filters'}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <TemplateSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <Layers className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">
              {allTemplates.length === 0
                ? 'Templates are coming soon. Check back after an admin publishes content.'
                : 'No templates match your current filters.'}
            </p>
            {allTemplates.length > 0 && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('')
                  setType('')
                }}
                className="mt-3 text-sm font-semibold text-primary-600 hover:text-primary-500"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <TemplateCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {myPatterns.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Your proven patterns</h2>
          <p className="text-sm text-gray-500 mb-4">Content you've published — duplicate and adapt for new classes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myPatterns.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary-200 hover:shadow-md transition"
              >
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 ${
                    item.tool === 'quiz'
                      ? 'bg-blue-100 text-blue-700'
                      : item.tool === 'assignment'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {item.tool.charAt(0).toUpperCase() + item.tool.slice(1)}
                </span>
                <h3 className="font-semibold text-gray-900 leading-snug">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.subject} · {item.grade}
                </p>
                <p className="mt-3 text-sm font-semibold text-primary-600">Duplicate & adapt →</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ExploreUseCases

