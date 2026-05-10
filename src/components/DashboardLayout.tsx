import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useStoreData } from '../hooks/useStoreData'
import { logoutUser, logoutUserAPI, getProfileDetails } from '../redux/features/auth/authSlice'
import { CustomAvatar } from './shared'
import { baseURL } from '../redux/constant'
import { setAuthToken } from '../redux/http'

// Click outside handler hook
const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
import { sideMenuRoutes } from '../routes/sideMenuConfig'
import { TeacherToolsDemoProvider } from '../pages/features/teacher-tools/TeacherToolsDemoProvider'
import WorkspaceSwitcher from './workspace/WorkspaceSwitcher'
import ActiveWorkspaceIndicator from './workspace/ActiveWorkspaceIndicator'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Youtube,
  Image,
  BookOpen,
  History,
  Menu,
  X,
  LogOut,
  GraduationCap,
  User,
  Settings,
  ChevronDown,
  Lightbulb,
  Bell,
  Mail,
  Shield,
  BarChart3,
  ClipboardCheck,
  ChevronRight,
  Coins,
  Zap,
} from 'lucide-react'
import { fetchCreditBalance } from '../redux/features/subscription/subscriptionSlice'
import ActivateCreditsModal from './ActivateCreditsModal'
import { creditBalanceUiPercents } from '../utils/creditBalanceUi'
import { formatDate, formatNumber } from '../lib/i18n/format'
import { useTranslation } from 'react-i18next'

type MenuItem = {
  path: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  iconColor: string
  iconBg: string
  subItems?: {
    path: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Helper function to format role name professionally
const formatRoleName = (role: string | null | undefined): string => {
  if (!role) return '';
  
  const roleStr = typeof role === 'string' ? role : role.toString();
  
  // Map role names to display format
  const roleMap: Record<string, string> = {
    'super_admin': 'Super Admin',
    'org_admin': 'Organization Admin',
    'organization_admin': 'Organization Admin',
    'school_admin': 'School Admin',
    'institution_admin': 'Institution Admin',
    'teacher': 'Teacher',
    'student': 'Student',
    'parent': 'Parent',
  };
  
  return roleMap[roleStr.toLowerCase()] || roleStr
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get role badge color
const getRoleBadgeColor = (role: string | null | undefined): string => {
  if (!role) return 'bg-gray-100 text-gray-700';
  
  const roleStr = typeof role === 'string' ? role : role.toString().toLowerCase();
  
  const colorMap: Record<string, string> = {
    'super_admin': 'bg-purple-100 text-purple-700',
    'org_admin': 'bg-blue-100 text-blue-700',
    'organization_admin': 'bg-blue-100 text-blue-700',
    'school_admin': 'bg-indigo-100 text-indigo-700',
    'institution_admin': 'bg-indigo-100 text-indigo-700',
    'teacher': 'bg-green-100 text-green-700',
    'student': 'bg-amber-100 text-amber-700',
    'parent': 'bg-teal-100 text-teal-700',
  };
  
  return colorMap[roleStr] || 'bg-gray-100 text-gray-700';
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [messagesDropdownOpen, setMessagesDropdownOpen] = useState(false)
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false)
  const messagesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const notificationsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const location = useLocation()
  const { user, role } = useStoreData()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})
  const { profileDetails } = useSelector((state: any) => state.auth)
  const subscription = useSelector((state: any) => state.subscription)
  const language = useSelector((state: any) => state.preferences?.language)
  void language
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const [activateModalOpen, setActivateModalOpen] = useState(false)
  
  // Get user role from profileDetails or user state - handle enum format
  const getUserRole = (): string | null => {
    try {
      // Try profileDetails roles first
      if (profileDetails?.roles && Array.isArray(profileDetails.roles) && profileDetails.roles.length > 0) {
        const firstRole = profileDetails.roles[0];
        if (firstRole?.name) {
          // Handle enum format: role.name.value or role.name directly
          if (typeof firstRole.name === 'string') {
            return firstRole.name;
          }
          const roleValue = firstRole.name?.value || firstRole.name?.toString() || '';
          return roleValue || null;
        }
      }
      // Fallback to user.role or role from useStoreData
      return user?.role || role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };
  
  // Safely get formatted role and badge color
  let formattedRole = '';
  let roleBadgeColor = 'bg-gray-100 text-gray-700';
  try {
    const userRole = getUserRole();
    if (userRole) {
      formattedRole = formatRoleName(userRole);
      roleBadgeColor = getRoleBadgeColor(userRole);
    }
  } catch (error) {
    console.error('Error formatting role:', error);
  }

  const appName =
    String(getUserRole() || '').toLowerCase() === 'student'
      ? t('app.studentName', 'Student Assistant')
      : t('app.name')
  
  // Load profile details and credit balance on mount
  useEffect(() => {
    if (user?.token) {
      dispatch(getProfileDetails())
      dispatch(fetchCreditBalance() as any)
    }
  }, [user?.token, user?.id, dispatch])

  // Close dropdown when clicking outside
  // Delay to allow Link navigation to happen first
  useClickOutside(profileDropdownRef, (event) => {
    // Don't close if clicking on a Link inside the dropdown
    const target = event.target as HTMLElement;
    if (target.closest('a') && target.closest('[class*="z-[100]"]')) {
      return;
    }
    if (profileDropdownOpen) {
      // Small delay to allow navigation to complete
      setTimeout(() => {
        setProfileDropdownOpen(false);
      }, 150);
    }
  })

  // Prevent multiple logout attempts
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    // CRITICAL: Prevent multiple clicks - only process if not already logging out
    if (isLoggingOut) {
      return
    }
    
    setIsLoggingOut(true)
    setProfileDropdownOpen(false) // Close dropdown immediately
    
    try {
      // Try to logout via API (non-blocking)
      if (user?.refresh_token) {
        try {
          await dispatch(logoutUserAPI(user.refresh_token)).unwrap()
        } catch (apiError) {
          // Ignore API errors - always clear local state
          console.warn('Logout API failed, clearing local state:', apiError)
        }
      }
      
      // Always clear local state (even if API fails)
      dispatch(logoutUser())
      
      // Clear localStorage to ensure clean logout
      try {
        // Route guards fallback to this token; it MUST be cleared or PrivateRoutes will still render.
        localStorage.removeItem('access_token')
        localStorage.removeItem('persist:root')
        setAuthToken(null)
      } catch (e) {
        console.warn('Failed to clear localStorage:', e)
      }
      
      // Navigate to login
      navigate('/login', { replace: true }) // Use replace to prevent back navigation
    } catch (err) {
      // Even if everything fails, clear local state and navigate
      console.error('Logout error:', err)
      dispatch(logoutUser())
      try {
        localStorage.removeItem('access_token')
        localStorage.removeItem('persist:root')
        setAuthToken(null)
      } catch (e) {
        // Ignore localStorage errors
      }
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Icon color mapping function
  const getIconColor = (index: number) => {
    const colors = [
      { color: 'text-primary-600', bg: 'bg-primary-50' },
      { color: 'text-blue-600', bg: 'bg-blue-50' },
      { color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { color: 'text-rose-600', bg: 'bg-rose-50' },
      { color: 'text-violet-600', bg: 'bg-violet-50' },
      { color: 'text-amber-600', bg: 'bg-amber-50' },
      { color: 'text-purple-600', bg: 'bg-purple-50' },
      { color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { color: 'text-slate-600', bg: 'bg-slate-50' },
      { color: 'text-pink-500', bg: 'bg-pink-50' },
      { color: 'text-gray-600', bg: 'bg-gray-100' },
    ]
    return colors[index % colors.length]
  }

  // Transform sideMenuConfig to MenuItem structure
  // Default to 'teacher' role if role is null but user is authenticated
  // This handles cases where backend returns roles: null
  const effectiveRole = role || (user?.token ? 'teacher' : '')
  const sideMenuConfig = sideMenuRoutes(effectiveRole)
  const menuItems: MenuItem[] = sideMenuConfig.map((item, index) => {
    const iconColors = getIconColor(index)
    return {
      path: item.path,
      icon: item.icon,
      label: item.i18nKey ? t(item.i18nKey) : item.text,
      iconColor: iconColors.color,
      iconBg: iconColors.bg,
      subItems: item.child?.map((childItem) => ({
        path: childItem.path,
        label: childItem.i18nKey ? t(childItem.i18nKey) : childItem.text,
        icon: childItem.icon,
      })),
    }
  })

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  const toggleSubMenu = (path: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  // Auto-expand menu if on a sub-page
  useEffect(() => {
    const expanded: Record<string, boolean> = {}
    menuItems.forEach((item) => {
      if (item.subItems) {
        const isOnSubPage = item.subItems.some((subItem) => location.pathname.startsWith(subItem.path))
        if (isOnSubPage) {
          expanded[item.path] = true
        }
      }
    })
    setExpandedMenus((prev) => ({ ...prev, ...expanded }))
  }, [location.pathname])

  // Pages like chat UIs manage their own internal scroll (WhatsApp/ChatGPT style).
  // For everything else, the main content pane should be scrollable.
  // Only General Teaching Assistant currently manages its own internal scroll.
  // Specialized chatbot pages still rely on the dashboard content pane scrolling.
  const isChatPage = location.pathname === '/chatbots/general-teaching-assistant'

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg text-gray-900">{appName}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 bg-white border-r border-gray-200
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 hidden lg:block">
                {appName}
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isExpanded = expandedMenus[item.path] || false

              if (hasSubItems) {
                return (
                  <div key={item.path}>
                    <button
                      onClick={() => toggleSubMenu(item.path)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          active
                            ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 ${
                            active ? 'bg-primary-100 text-primary-600' : `${item.iconBg} ${item.iconColor}`
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                        {item.subItems?.map((subItem) => {
                          const SubIcon = subItem.icon
                          const subActive = isActive(subItem.path)
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`
                                flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200
                                ${
                                  subActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                              `}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm">{subItem.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      active
                        ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 ${
                      active ? 'bg-primary-100 text-primary-600' : `${item.iconBg} ${item.iconColor}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 h-full min-h-0 flex flex-col">
        {/* Top Header Bar with Profile Dropdown */}
        <div className="hidden lg:block fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Left side - Workspace indicator and switcher */}
            <div className="flex items-center gap-4">
              <ActiveWorkspaceIndicator />
              <WorkspaceSwitcher />
            </div>

            {/* Right side - Token counter, messages, notifications, profile */}
            <div className="flex items-center gap-4">
            {/* Credit Balance */}
            {(() => {
              const bal = subscription.balance ?? 0
              const total = subscription.totalAllocated ?? 0
              const { ratio, barWidthPct, labelPct } = creditBalanceUiPercents(bal, total)
              const hasCredits = subscription.hasActiveCredits

              const barColor = ratio > 0.5
                ? 'from-emerald-400 to-teal-500'
                : ratio > 0.2
                ? 'from-amber-400 to-orange-500'
                : 'from-red-400 to-rose-500'

              const bgColor = ratio > 0.5
                ? 'from-emerald-50 to-teal-50'
                : ratio > 0.2
                ? 'from-amber-50 to-orange-50'
                : 'from-red-50 to-rose-50'

              const iconColor = ratio > 0.5
                ? 'bg-emerald-100 text-emerald-600'
                : ratio > 0.2
                ? 'bg-amber-100 text-amber-600'
                : 'bg-red-100 text-red-600'

              if (!hasCredits && !subscription.loading) {
                return (
                  <button
                    onClick={() => setActivateModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 hover:border-primary-300 hover:text-primary-600 transition"
                  >
                    <Coins className="h-4 w-4" />
                    {t('layout.activateCredits')}
                  </button>
                )
              }

              return (
                <button
                  onClick={() => navigate('/settings?tab=plan')}
                  title={subscription.expiresAt
                    ? `Expires ${formatDate(subscription.expiresAt, { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : subscription.autoRenew ? 'Auto-renewing' : undefined}
                  className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-gradient-to-r ${bgColor} px-4 py-2 transition hover:shadow-sm`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconColor}`}>
                    <Coins className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-600">{t('layout.credits')}</span>
                      <Zap className="h-3 w-3 text-amber-500" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">{formatNumber(bal)}</span>
                      {total > 0 && (
                        <span className="text-xs text-gray-500">/ {formatNumber(total)}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-300 mx-1" />
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, barWidthPct)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{labelPct}%</span>
                  </div>
                </button>
              )
            })()}

            {/* Messages Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (messagesTimeoutRef.current) {
                  clearTimeout(messagesTimeoutRef.current)
                }
                messagesTimeoutRef.current = setTimeout(() => {
                  setMessagesDropdownOpen(true)
                }, 200)
              }}
              onMouseLeave={() => {
                if (messagesTimeoutRef.current) {
                  clearTimeout(messagesTimeoutRef.current)
                }
                messagesTimeoutRef.current = setTimeout(() => {
                  setMessagesDropdownOpen(false)
                }, 300)
              }}
            >
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Mail className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white">
                  3
                </span>
              </button>

              {/* Messages Dropdown Menu */}
              {messagesDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">{t('layout.messages')}</h3>
                      <span className="text-xs text-gray-500">{t('layout.newCount', { count: 3 })}</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        id: 1,
                        sender: 'Sarah Johnson',
                        preview: 'Thanks for sharing the lesson plan template!',
                        time: '2 min ago',
                        unread: true,
                      },
                      {
                        id: 2,
                        sender: 'Michael Chen',
                        preview: 'Can we schedule a meeting to discuss the assessment?',
                        time: '1 hour ago',
                        unread: true,
                      },
                      {
                        id: 3,
                        sender: 'Emily Davis',
                        preview: 'The new chatbot feature looks great!',
                        time: '3 hours ago',
                        unread: true,
                      },
                    ].map((message) => (
                      <button
                        key={message.id}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <span className="text-xs font-semibold">
                              {message.sender.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {message.sender}
                              </p>
                              {message.unread && (
                                <span className="flex h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1">{message.preview}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-500">
                      {t('layout.viewAllMessages')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (notificationsTimeoutRef.current) {
                  clearTimeout(notificationsTimeoutRef.current)
                }
                notificationsTimeoutRef.current = setTimeout(() => {
                  setNotificationsDropdownOpen(true)
                }, 200)
              }}
              onMouseLeave={() => {
                if (notificationsTimeoutRef.current) {
                  clearTimeout(notificationsTimeoutRef.current)
                }
                notificationsTimeoutRef.current = setTimeout(() => {
                  setNotificationsDropdownOpen(false)
                }, 300)
              }}
            >
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                  5
                </span>
              </button>

              {/* Notifications Dropdown Menu */}
              {notificationsDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">{t('layout.notifications')}</h3>
                      <span className="text-xs text-gray-500">{t('layout.newCount', { count: 5 })}</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        id: 1,
                        type: 'success',
                        title: 'Quiz Generated Successfully',
                        message: 'Your YouTube quiz has been generated and is ready to use.',
                        time: '5 min ago',
                        unread: true,
                      },
                      {
                        id: 2,
                        type: 'info',
                        title: 'New Template Available',
                        message: 'A new STEM activity template has been added to the library.',
                        time: '1 hour ago',
                        unread: true,
                      },
                      {
                        id: 3,
                        type: 'warning',
                        title: 'Token Usage Alert',
                        message: 'You have used 80% of your monthly token allocation.',
                        time: '2 hours ago',
                        unread: true,
                      },
                      {
                        id: 4,
                        type: 'info',
                        title: 'Assessment Completed',
                        message: 'Quarterly Performance Review has been completed by all students.',
                        time: '3 hours ago',
                        unread: true,
                      },
                      {
                        id: 5,
                        type: 'success',
                        title: 'Report Generated',
                        message: 'Your monthly usage report is ready for download.',
                        time: '1 day ago',
                        unread: true,
                      },
                    ].map((notification) => (
                      <button
                        key={notification.id}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                              notification.type === 'success'
                                ? 'bg-green-100 text-green-600'
                                : notification.type === 'warning'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                              {notification.unread && (
                                <span className="flex h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-500">
                      {t('layout.viewAllNotifications')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                className="flex items-center space-x-3 rounded-xl px-3 py-2 transition hover:bg-primary-50/40 cursor-pointer"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                  {(() => {
                    // Construct profile picture URL - only use if it's a valid URL
                    let profilePictureUrl = null;
                    if (profileDetails?.profile_picture_url) {
                      const urlValue = profileDetails.profile_picture_url;
                      if (urlValue && urlValue.trim() !== '') {
                        if (urlValue.startsWith('http')) {
                          profilePictureUrl = urlValue;
                        } else if (urlValue.startsWith('/')) {
                          profilePictureUrl = `${baseURL}${urlValue}`;
                        } else {
                          profilePictureUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
                        }
                      }
                    } else if (user?.profile_picture_url) {
                      const urlValue = user.profile_picture_url;
                      if (urlValue && urlValue.trim() !== '') {
                        if (urlValue.startsWith('http')) {
                          profilePictureUrl = urlValue;
                        } else if (urlValue.startsWith('/')) {
                          profilePictureUrl = `${baseURL}${urlValue}`;
                        } else {
                          profilePictureUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
                        }
                      }
                    }
                    
                    // Get full name for avatar initials
                    const fullNameForInitials = profileDetails?.full_name 
                      || (profileDetails?.first_name || profileDetails?.last_name 
                        ? `${profileDetails.first_name || ''} ${profileDetails.last_name || ''}`.trim()
                        : null)
                      || profileDetails?.username
                      || user?.full_name
                      || (user?.first_name || user?.last_name
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : null)
                      || user?.username
                      || profileDetails?.email?.split('@')[0]
                      || user?.email?.split('@')[0]
                      || 'User';
                    
                    return (
                      <CustomAvatar
                        userName={fullNameForInitials}
                        url={profilePictureUrl}
                        avatarClass="w-10 h-10"
                        noUrlNameClass="text-base font-semibold"
                        hideUsername={true}
                      />
                    );
                  })()}
                </div>
                <ChevronDown className="w-4 h-4 text-primary-500" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {(() => {
                        // Priority: username > full_name > first_name + last_name (NOT email)
                        const displayName = profileDetails?.username 
                          || profileDetails?.full_name
                          || (profileDetails?.first_name || profileDetails?.last_name 
                            ? `${profileDetails.first_name || ''} ${profileDetails.last_name || ''}`.trim() 
                            : null)
                          || user?.username
                          || user?.full_name
                          || (user?.first_name || user?.last_name
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                            : null);
                        
                        // Only fallback to email if no name is available
                        return displayName || profileDetails?.email || user?.email || 'User';
                      })()}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {profileDetails?.email || user?.email || ''}
                    </p>
                    {formattedRole && formattedRole.trim() && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleBadgeColor || 'bg-gray-100 text-gray-700'}`}>
                          {formattedRole}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/profile"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate immediately, close dropdown after
                      setTimeout(() => {
                        setProfileDropdownOpen(false);
                      }, 100);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex w-full items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer no-underline"
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{t('nav.profile')}</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate immediately, close dropdown after
                      setTimeout(() => {
                        setProfileDropdownOpen(false);
                      }, 100);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex w-full items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer no-underline"
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{t('nav.settings')}</span>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout(); // Dropdown closing is handled in handleLogout
                    }}
                    onMouseDown={(e) => {
                      // Prevent dropdown from closing on mousedown
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer z-[101] relative disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{isLoggingOut ? t('layout.signingOut') : t('layout.signOut')}</span>
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Mobile Profile Button */}
        <div className="lg:hidden fixed top-3 right-4 z-50" ref={profileDropdownRef}>
          <div className="relative">
            <div className="mb-3 flex items-center justify-end gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Mail className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600">
                <Bell className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="h-11 w-11 overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0"
            >
              {(() => {
                // Construct profile picture URL - only use if it's a valid URL
                let profilePictureUrl = null;
                if (profileDetails?.profile_picture_url) {
                  const urlValue = profileDetails.profile_picture_url;
                  if (urlValue && urlValue.trim() !== '') {
                    if (urlValue.startsWith('http')) {
                      profilePictureUrl = urlValue;
                    } else if (urlValue.startsWith('/')) {
                      profilePictureUrl = `${baseURL}${urlValue}`;
                    } else {
                      profilePictureUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
                    }
                  }
                } else if (user?.profile_picture_url) {
                  // Fallback to user state if profileDetails not loaded yet
                  const urlValue = user.profile_picture_url;
                  if (urlValue && urlValue.trim() !== '') {
                    if (urlValue.startsWith('http')) {
                      profilePictureUrl = urlValue;
                    } else if (urlValue.startsWith('/')) {
                      profilePictureUrl = `${baseURL}${urlValue}`;
                    } else {
                      profilePictureUrl = `${baseURL}/static/profile_pictures/${urlValue}`;
                    }
                  }
                }
                
                // Get full name for avatar initials - prioritize actual name fields
                const fullNameForInitials = profileDetails?.full_name 
                  || (profileDetails?.first_name || profileDetails?.last_name 
                    ? `${profileDetails.first_name || ''} ${profileDetails.last_name || ''}`.trim()
                    : null)
                  || profileDetails?.username
                  || user?.full_name
                  || (user?.first_name || user?.last_name
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : null)
                  || user?.username
                  || profileDetails?.email?.split('@')[0]
                  || user?.email?.split('@')[0]
                  || 'User';
                
                return (
                  <CustomAvatar
                    userName={fullNameForInitials}
                    url={profilePictureUrl}
                    avatarClass="w-11 h-11"
                    noUrlNameClass="text-lg font-semibold"
                    hideUsername={true}
                  />
                );
              })()}
            </button>

            {/* Mobile Dropdown Menu */}
            {profileDropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {(() => {
                      // Priority: username > full_name > first_name + last_name (NOT email)
                      const displayName = profileDetails?.username 
                        || profileDetails?.full_name
                        || (profileDetails?.first_name || profileDetails?.last_name 
                          ? `${profileDetails.first_name || ''} ${profileDetails.last_name || ''}`.trim() 
                          : null)
                        || user?.username
                        || user?.full_name
                        || (user?.first_name || user?.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : null);
                      
                      // Only fallback to email if no name is available
                      return displayName || profileDetails?.email || user?.email || 'User';
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {profileDetails?.email || user?.email || ''}
                  </p>
                </div>

                {/* Menu Items */}
                <Link
                  to="/profile"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate immediately, close dropdown after
                    setTimeout(() => {
                      setProfileDropdownOpen(false);
                    }, 100);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer no-underline"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate immediately, close dropdown after
                    setTimeout(() => {
                      setProfileDropdownOpen(false);
                    }, 100);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer no-underline"
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{t('nav.settings')}</span>
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setProfileDropdownOpen(false);
                    handleLogout(); // Dropdown closing is handled in handleLogout
                  }}
                  onMouseDown={(e) => {
                    // Prevent dropdown from closing on mousedown
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer z-[101] relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{isLoggingOut ? t('layout.signingOut') : t('layout.signOut')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <main className="pt-20 lg:pt-24 px-6 lg:px-8 flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className={`flex-1 min-h-0 ${isChatPage ? 'overflow-hidden' : 'overflow-auto'}`}>
            {location.pathname.startsWith('/teacher-tools') ||
            location.pathname.startsWith('/dashboard') ||
            location.pathname.startsWith('/analytics') ||
            location.pathname.startsWith('/use-cases') ? (
              <TeacherToolsDemoProvider>{children}</TeacherToolsDemoProvider>
            ) : (
              children
            )}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <ActivateCreditsModal
        open={activateModalOpen}
        onClose={() => setActivateModalOpen(false)}
      />
    </div>
  )
}

export default DashboardLayout

