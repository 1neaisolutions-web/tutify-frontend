/** Canonical codes are alphanumeric (no hyphens). Format like admin generator for display/input UX. */
export function formatAccessCodeInput(raw: string): string {
  const clean = raw.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 24)
  if (clean.startsWith('STAFF')) {
    const rest = clean.slice(5)
    if (!rest) return 'STAFF'
    const a = rest.slice(0, 4)
    const b = rest.slice(4, 8)
    return b ? `STAFF-${a}-${b}` : `STAFF-${a}`
  }
  if (clean.startsWith('BETA')) {
    const rest = clean.slice(4)
    if (!rest) return 'BETA'
    const a = rest.slice(0, 4)
    const b = rest.slice(4, 8)
    return b ? `BETA-${a}-${b}` : `BETA-${a}`
  }
  return clean.match(/.{1,4}/g)?.join('-') ?? clean
}

/** Format stored canonical code for tables / copy (matches AccessCodesAdmin generator shape). */
export function formatAccessCodeDisplay(canonical: string): string {
  const c = canonical.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  return formatAccessCodeInput(c)
}
