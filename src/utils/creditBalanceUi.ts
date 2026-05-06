/**
 * Remaining credits as ratio and UI percentages.
 * Math.round(balance/total*100) incorrectly shows 100% for values like 49,972 / 50,000 (~99.94%).
 */
export function creditBalanceUiPercents(balance: number, totalAllocated: number): {
  ratio: number
  /** Exact fill width for progress bar (0–100). */
  barWidthPct: number
  /** Whole percent for labels; 100 only when balance >= allocation. */
  labelPct: number
} {
  if (totalAllocated <= 0) {
    return { ratio: 0, barWidthPct: 0, labelPct: 0 }
  }
  const ratio = Math.min(1, Math.max(0, balance / totalAllocated))
  const barWidthPct = ratio * 100
  const labelPct = balance >= totalAllocated ? 100 : Math.floor(ratio * 100)
  return { ratio, barWidthPct, labelPct }
}
