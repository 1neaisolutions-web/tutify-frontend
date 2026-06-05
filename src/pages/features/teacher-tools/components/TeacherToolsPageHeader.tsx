import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  to?: string
}

interface Props {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
  actions?: React.ReactNode
  /** Tighter layout for create wizards — more room for the form. */
  variant?: 'default' | 'compact'
}

export function TeacherToolsPageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  variant = 'default',
}: Props) {
  const compact = variant === 'compact'

  return (
    <div
      className={`flex flex-col border-b border-gray-200 lg:flex-row lg:items-center lg:justify-between ${
        compact ? 'gap-2 pb-3' : 'gap-4 pb-6'
      }`}
    >
      <div className={compact ? 'min-w-0 space-y-1' : 'space-y-2'}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className={`flex flex-wrap items-center gap-1 font-medium text-gray-500 ${
              compact ? 'text-[11px]' : 'text-xs'
            }`}
          >
            {breadcrumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
                {c.to ? (
                  <Link to={c.to} className="text-primary-600 hover:text-primary-700">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-gray-700">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {compact ? (
          <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {subtitle ? (
              <p className="text-xs text-gray-500 sm:max-w-xl sm:truncate">{subtitle}</p>
            ) : null}
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="max-w-2xl text-sm text-gray-600">{subtitle}</p>}
          </>
        )}
      </div>
      {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
