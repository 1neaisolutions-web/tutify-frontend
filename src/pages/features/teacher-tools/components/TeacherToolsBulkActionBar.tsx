interface Props {
  selectedCount: number
  onClear: () => void
  children?: React.ReactNode
}

export function TeacherToolsBulkActionBar({ selectedCount, onClear, children }: Props) {
  if (selectedCount < 1) return null
  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-primary-900">
        {selectedCount} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-semibold text-primary-700 hover:text-primary-900"
      >
        Clear
      </button>
    </div>
  )
}
