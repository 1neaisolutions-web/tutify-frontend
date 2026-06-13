import { saveRouteScroll } from './dashboardScrollState'

type ActiveScrollTarget = {
  container: HTMLDivElement
  historyKey: string
  pathname: string
}

let activeTarget: ActiveScrollTarget | null = null

export function getActiveDashboardScrollContainer(): HTMLDivElement | null {
  return activeTarget?.container ?? null
}

export function persistActiveDashboardScroll() {
  if (!activeTarget) return
  saveRouteScroll(
    activeTarget.historyKey,
    activeTarget.pathname,
    activeTarget.container.scrollTop,
  )
}

export function registerDashboardScrollContainer(
  container: HTMLDivElement | null,
  historyKey: string,
  pathname: string,
) {
  if (container) {
    activeTarget = { container, historyKey, pathname }
    return
  }

  // On unmount, location.key from the unmounting component may already be the
  // destination route — always persist the active target we were tracking.
  if (activeTarget) {
    persistActiveDashboardScroll()
    activeTarget = null
  }
}
