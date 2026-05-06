import { formatDate, formatRelative } from '../../../lib/i18n/format'

export function formatRelativeDate(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return iso
  const diff = Date.now() - t
  const days = Math.floor(diff / 86_400_000)
  if (days >= 365) return formatDate(iso, { month: 'short', day: 'numeric', year: 'numeric' })
  return formatRelative(iso)
}
