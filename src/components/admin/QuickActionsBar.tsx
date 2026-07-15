import { Link } from 'react-router-dom'
import { Brain, Building2, Users, BarChart3, Shield, Key, BookOpen, FileText } from 'lucide-react'

const actions = [
  { label: 'Memory', path: '/administration/memory', icon: Brain, color: 'text-violet-600 bg-violet-100' },
  { label: 'Users', path: '/administration/users', icon: Users, color: 'text-sky-600 bg-sky-100' },
  { label: 'Organizations', path: '/administration/organizations', icon: Building2, color: 'text-emerald-600 bg-emerald-100' },
  { label: 'Analytics', path: '/administration/analytics', icon: BarChart3, color: 'text-amber-600 bg-amber-100' },
  { label: 'Audit Log', path: '/administration/security/audit', icon: Shield, color: 'text-rose-600 bg-rose-100' },
  { label: 'Access Codes', path: '/admin/access-codes', icon: Key, color: 'text-indigo-600 bg-indigo-100' },
  { label: 'Content Packs', path: '/admin/content-packs', icon: BookOpen, color: 'text-teal-600 bg-teal-100' },
  { label: 'Documents', path: '/admin/documents', icon: FileText, color: 'text-orange-600 bg-orange-100' },
]

export default function QuickActionsBar() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ label, path, icon: Icon, color }) => (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-3 text-center transition hover:border-sky-200 hover:bg-sky-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <div className={`rounded-lg p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
