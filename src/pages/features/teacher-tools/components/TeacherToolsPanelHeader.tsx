/** Slim in-card header (sub-step breadcrumb already shows step number). */
export function TeacherToolsPanelHeader({
  kicker,
  title,
  subtitle,
  tone = 'indigo',
}: {
  kicker: string
  title: string
  subtitle?: string
  tone?: 'indigo' | 'emerald' | 'violet' | 'sky' | 'gray' | 'amber'
}) {
  const kickerClass =
    tone === 'emerald'
      ? 'text-emerald-700'
      : tone === 'violet'
        ? 'text-violet-700'
        : tone === 'sky'
          ? 'text-sky-700'
          : tone === 'amber'
            ? 'text-amber-800'
          : tone === 'gray'
            ? 'text-gray-600'
            : 'text-indigo-600'

  return (
    <div className="border-b border-gray-100 px-5 py-3">
      <p className={`text-[10px] font-bold uppercase tracking-wide ${kickerClass}`}>{kicker}</p>
      <h2 className="mt-0.5 text-base font-semibold tracking-tight text-gray-900">{title}</h2>
      {subtitle ? <p className="mt-0.5 text-xs leading-snug text-gray-600">{subtitle}</p> : null}
    </div>
  )
}
