const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  published: 'bg-emerald-100 text-emerald-700',
  active: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  archived: 'bg-slate-100 text-slate-600',
  pending_review: 'bg-amber-100 text-amber-700',
  graded: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-600',
}

export function StatusPill({ status, className = '' }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${style} ${className}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
