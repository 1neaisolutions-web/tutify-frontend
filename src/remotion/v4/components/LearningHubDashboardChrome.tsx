/**
 * Dashboard shell for Remotion — mirrors DashboardLayout sidebar + top bar.
 */
import React from 'react'
import { AbsoluteFill, Img } from 'remotion'
import { LOGO_SRC } from '../assets'

export const SIDEBAR_WIDTH = 256
export const HEADER_HEIGHT = 64
export const CONTENT_PADDING = 24

const PRIMARY = '#0284c7'
const PRIMARY_50 = '#f0f9ff'
const PRIMARY_100 = '#e0f2fe'

type MenuItem = {
  label: string
  active?: boolean
  iconColor: string
  iconBg: string
  icon: React.ReactNode
}

const IconGrid: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconBook: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 004 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
)

const IconMessage: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const IconYoutube: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="currentColor" stroke="none" />
  </svg>
)

const IconImage: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

const IconFile: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
)

const IconWrench: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
)

const IconSettings: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

const IconHistory: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const IconChart: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
)

const IconBulb: React.FC = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
  </svg>
)

const TEACHER_NAV: MenuItem[] = [
  { label: 'Dashboard', icon: <IconGrid />, iconColor: '#0284c7', iconBg: '#f0f9ff' },
  { label: 'Teacher Tools', icon: <IconWrench />, iconColor: '#2563eb', iconBg: '#eff6ff' },
  { label: 'Templates Library', icon: <IconFile />, iconColor: '#059669', iconBg: '#ecfdf5' },
  { label: 'Specialized Chatbots', icon: <IconMessage />, iconColor: '#e11d48', iconBg: '#fff1f2' },
  { label: 'YouTube Quiz Generator', icon: <IconYoutube />, iconColor: '#7c3aed', iconBg: '#f5f3ff' },
  { label: 'PixGen (AI Media Studio)', icon: <IconImage />, iconColor: '#d97706', iconBg: '#fffbeb' },
  {
    label: 'Professional Learning Hub',
    active: true,
    icon: <IconBook />,
    iconColor: '#0284c7',
    iconBg: '#e0f2fe',
  },
  { label: 'Personalization', icon: <IconSettings />, iconColor: '#4f46e5', iconBg: '#eef2ff' },
  { label: 'History', icon: <IconHistory />, iconColor: '#64748b', iconBg: '#f1f5f9' },
  { label: 'Analytics', icon: <IconChart />, iconColor: '#0284c7', iconBg: '#f0f9ff' },
  { label: 'Explore Use Cases', icon: <IconBulb />, iconColor: '#d97706', iconBg: '#fffbeb' },
]

const NavItem: React.FC<{ item: MenuItem; fontFamily: string }> = ({ item, fontFamily }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px',
      borderRadius: 10,
      marginBottom: 2,
      fontFamily,
      fontSize: 13,
      fontWeight: item.active ? 600 : 500,
      color: item.active ? '#0369a1' : '#374151',
      background: item.active ? PRIMARY_50 : 'transparent',
      boxShadow: item.active ? '0 1px 2px rgba(2,132,199,0.08)' : undefined,
    }}
  >
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: item.active ? PRIMARY_100 : item.iconBg,
        color: item.active ? PRIMARY : item.iconColor,
        flexShrink: 0,
      }}
    >
      {item.icon}
    </span>
    <span style={{ lineHeight: 1.25 }}>{item.label}</span>
  </div>
)

const motion = 'div' as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>

interface LearningHubDashboardChromeProps {
  children: React.ReactNode
  fontFamily: string
  pageTitle?: string
}

export const LearningHubDashboardChrome: React.FC<LearningHubDashboardChromeProps> = ({
  children,
  fontFamily,
  pageTitle = 'Professional Learning Hub',
}) => (
  <AbsoluteFill style={{ background: '#F9FAFB', fontFamily }}>
    <aside
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: SIDEBAR_WIDTH,
        height: '100%',
        background: '#fff',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: HEADER_HEIGHT,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid #E5E7EB',
          flexShrink: 0,
        }}
      >
        <Img
          src={LOGO_SRC}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(2,132,199,0.2)',
          }}
        />
        <span style={{ fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
          Tutify
        </span>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', overflow: 'hidden' }}>
        {TEACHER_NAV.map((item) => (
          <NavItem key={item.label} item={item} fontFamily={fontFamily} />
        ))}
      </nav>
    </aside>

    <header
      style={{
        position: 'absolute',
        left: SIDEBAR_WIDTH,
        top: 0,
        right: 0,
        height: HEADER_HEIGHT,
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 9,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#9CA3AF',
          }}
        >
          Workspace
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Mathematics · IB</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '1px solid #A7F3D0',
            fontSize: 13,
            fontWeight: 600,
            color: '#047857',
          }}
        >
          <span>⚡</span> 2,450 credits
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${PRIMARY} 0%, #0369a1 100%)`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          SJ
        </div>
      </div>
    </header>

    <main
      style={{
        position: 'absolute',
        left: SIDEBAR_WIDTH,
        top: HEADER_HEIGHT,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        padding: CONTENT_PADDING,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', marginBottom: 8, textTransform: 'uppercase' }}>
        {pageTitle}
      </div>
      {children}
    </main>
  </AbsoluteFill>
)

/** Cursor target: center of featured course "Start" button (1920×1080 layout). */
export const FEATURED_COURSE_CLICK = { x: 1195, y: 548 }
