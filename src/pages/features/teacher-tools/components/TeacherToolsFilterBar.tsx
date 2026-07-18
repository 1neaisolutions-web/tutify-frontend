/* eslint-disable react-refresh/only-export-components -- shared FilterValues type + component */
import { Search, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StatusFilterOption } from './teacherToolsStatusFilterOptions'

export interface FilterValues {
  q: string
  subject: string
  grade: string
  classKey: string
  status: string
  dateFrom: string
  dateTo: string
}

const defaultFilters: FilterValues = {
  q: '',
  subject: '',
  grade: '',
  classKey: '',
  status: '',
  dateFrom: '',
  dateTo: '',
}

export type { StatusFilterOption }

interface Props {
  value: FilterValues
  onChange: (next: FilterValues) => void
  subjects?: string[]
  grades?: string[]
  /** Include `grade` when using `hideGrade` so class selection can sync `filters.grade`. */
  classOptions?: { key: string; label: string; grade?: string }[]
  /** Label + value pairs; empty falls back to a single “Any status” row. */
  statusOptions?: StatusFilterOption[]
  showDateRange?: boolean
  /** Hide the grade dropdown (class already implies grade). Use on Overview / analytics. */
  hideGrade?: boolean
  /** Show Phase 2 note beside class filter (default true). */
  phase2ClassHint?: boolean
}

export function TeacherToolsFilterBar({
  value,
  onChange,
  subjects = [],
  grades = [],
  classOptions = [],
  statusOptions = [],
  showDateRange = true,
  hideGrade = false,
  phase2ClassHint = true,
}: Props) {
  const { t } = useTranslation()
  const v = { ...defaultFilters, ...value }
  const set = (patch: Partial<FilterValues>) => onChange({ ...v, ...patch })

  const onClassChange = (classKey: string) => {
    if (hideGrade) {
      const row = classOptions.find((c) => c.key === classKey)
      const derivedGrade = row?.grade ?? ''
      set({ classKey, grade: classKey ? derivedGrade : '' })
      return
    }
    set({ classKey })
  }

  const statusOpts: StatusFilterOption[] =
    statusOptions.length > 0 ? statusOptions : [{ value: '', labelKey: 'teacherTools.anyStatus' }]

  const filterColClass = hideGrade
    ? 'grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    : 'grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'

  /** Same vertical slot as date labels so selects and date inputs share one baseline row. */
  const filterLabelShim = (
    <span
      className="block min-h-[1.125rem] text-xs font-medium leading-none text-transparent select-none"
      aria-hidden
    >
      &nbsp;
    </span>
  )

  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder={t('teacherTools.searchPlaceholder')}
            value={v.q}
            onChange={(e) => set({ q: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            aria-label={t('teacherTools.ariaSearch')}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <SlidersHorizontal className="h-4 w-4" />
          {t('teacherTools.filters')}
        </div>
      </div>
      <div className={filterColClass}>
        <label className="flex min-w-0 flex-col gap-1">
          {filterLabelShim}
          <select
            value={v.subject}
            onChange={(e) => set({ subject: e.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">{t('teacherTools.allSubjects')}</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {!hideGrade ? (
          <label className="flex min-w-0 flex-col gap-1">
            {filterLabelShim}
            <select
              value={v.grade}
              onChange={(e) => set({ grade: e.target.value })}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">{t('teacherTools.allGrades')}</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div
          className="flex min-w-0 flex-col gap-1"
          title={phase2ClassHint ? t('teacherTools.classPhase2Title') : undefined}
        >
          {filterLabelShim}
          <div className="relative">
            <select
              value={v.classKey}
              onChange={(e) => onClassChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              aria-label={t('teacherTools.ariaClass')}
            >
              <option value="">{t('teacherTools.allClasses')}</option>
              {classOptions.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            {phase2ClassHint ? (
              <span className="pointer-events-none absolute -right-1 -top-1 rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-700">
                P2
              </span>
            ) : null}
          </div>
        </div>
        <label className="flex min-w-0 flex-col gap-1">
          {filterLabelShim}
          <select
            value={v.status}
            onChange={(e) => set({ status: e.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            aria-label={t('teacherTools.ariaStatus')}
          >
            {statusOpts.map((s, i) => (
              <option key={`${s.value}-${i}`} value={s.value}>
                {t(s.labelKey)}
              </option>
            ))}
          </select>
        </label>
        {showDateRange && (
          <>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-gray-600">
              <span className="min-h-[1.125rem] leading-none">{t('teacherTools.dateFrom')}</span>
              <input
                type="date"
                value={v.dateFrom}
                onChange={(e) => set({ dateFrom: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-gray-600">
              <span className="min-h-[1.125rem] leading-none">{t('teacherTools.dateTo')}</span>
              <input
                type="date"
                value={v.dateTo}
                onChange={(e) => set({ dateTo: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </>
        )}
      </div>
    </div>
  )
}

export { defaultFilters as defaultTeacherToolsFilters }
