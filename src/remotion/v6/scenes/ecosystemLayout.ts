import type { NetworkNode } from '../components/NetworkGraph'
import { theme } from '../theme'

export const ECOSYSTEM_HUB = { cx: 960, cy: 520 } as const
/** Equal radial distance for every role node */
export const ECOSYSTEM_ORBIT_RADIUS = 298

type RoleDef = {
  id: string
  label: string
  icon: string
  color: string
}

const ECOSYSTEM_ROLES: RoleDef[] = [
  { id: 'teacher', label: 'Teachers', icon: '👩‍🏫', color: theme.colors.primary },
  { id: 'admin', label: 'Administrators', icon: '🏛️', color: theme.colors.purple },
  { id: 'student', label: 'Students', icon: '👨‍🎓', color: theme.colors.secondary },
  { id: 'parent', label: 'Parents', icon: '👨‍👩‍👧', color: theme.colors.accent },
  { id: 'school', label: 'Schools', icon: '🏫', color: theme.colors.rose },
]

/** Place nodes on a regular polygon — same distance from hub for all */
export const buildEcosystemNodes = (roles: RoleDef[] = ECOSYSTEM_ROLES): NetworkNode[] => {
  const { cx, cy } = ECOSYSTEM_HUB
  const count = roles.length
  return roles.map((role, i) => {
    const angleDeg = -90 + (360 / count) * i
    const rad = (angleDeg * Math.PI) / 180
    return {
      ...role,
      x: cx + ECOSYSTEM_ORBIT_RADIUS * Math.cos(rad),
      y: cy + ECOSYSTEM_ORBIT_RADIUS * Math.sin(rad),
    }
  })
}

export const ECOSYSTEM_NODES = buildEcosystemNodes()
