/**
 * ProfileCompletionGate
 *
 * Shown when the backend reports the teacher's profile is insufficient to
 * start personalization (score < 0.45 or no identity records).
 *
 * Fetches /api/v1/learning-hub/profile-completion-status and renders:
 *  - Overall progress bar
 *  - Section checklist (teaching context + identity sections)
 *  - CTA buttons that route to the correct profile tab
 *  - Guidance message from the backend
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  User,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  FileText,
  Globe,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { apiRequest } from '../../api/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileSectionStatus {
  key: string
  label: string
  complete: boolean
  count: number
  route: string
  description: string
}

interface ProfileCompletionStatusResponse {
  score: number
  is_sufficient: boolean
  missing_count: number
  sections: ProfileSectionStatus[]
  teaching_context_complete: boolean
  has_identity_record: boolean
  guidance_message: string
}

// ─── Section icon map ─────────────────────────────────────────────────────────

const SECTION_ICONS: Record<string, React.FC<{ className?: string }>> = {
  country: Globe,
  region: Globe,
  subjects: BookOpen,
  grade_band: GraduationCap,
  school_type: Briefcase,
  language_preference: Globe,
  years_experience: Star,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  achievements: Star,
  documents: FileText,
}

const SECTION_GROUPS = {
  'Teaching Context': [
    'country', 'region', 'subjects', 'grade_band',
    'school_type', 'language_preference', 'years_experience',
  ],
  'Professional Identity': [
    'experience', 'education', 'certifications', 'achievements', 'documents',
  ],
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileCompletionGate() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<ProfileCompletionStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest<ProfileCompletionStatusResponse>(
        '/api/v1/learning-hub/profile-completion-status'
      )
      setStatus(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load profile status.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-gray-100 bg-white p-12">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        <span className="ml-3 text-sm text-gray-500">Loading profile status…</span>
      </div>
    )
  }

  if (error || !status) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-center">
        <AlertCircle className="mx-auto mb-2 h-6 w-6 text-rose-500" />
        <p className="text-sm text-rose-700">{error || 'Unable to load profile status.'}</p>
        <button
          onClick={fetchStatus}
          className="mt-4 rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
        >
          Retry
        </button>
      </div>
    )
  }

  const pct = Math.round(status.score * 100)
  const sectionMap = Object.fromEntries(status.sections.map((s) => [s.key, s]))

  return (
    <div className="space-y-6">
      {/* ── Header card ─────────────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300">
              <User className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Complete your teaching profile
              </h2>
              <p className="text-sm text-gray-600">
                {status.missing_count > 0
                  ? `${status.missing_count} section${status.missing_count !== 1 ? 's' : ''} still needed`
                  : 'Your profile is ready!'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-700">{pct}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-700"
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
        </div>

        {/* Guidance message */}
        {status.guidance_message && (
          <p className="mt-3 text-sm text-amber-800">{status.guidance_message}</p>
        )}

        <button
          onClick={() => navigate('/profile')}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          Go to profile <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      {/* ── Section checklists ──────────────────────────────────────────────── */}
      {Object.entries(SECTION_GROUPS).map(([groupLabel, keys]) => {
        const groupSections = keys
          .map((k) => sectionMap[k])
          .filter(Boolean)
        if (groupSections.length === 0) return null
        const groupComplete = groupSections.filter((s) => s.complete).length
        const groupTotal = groupSections.length

        return (
          <section
            key={groupLabel}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">{groupLabel}</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {groupComplete}/{groupTotal}
              </span>
            </div>

            <div className="space-y-2">
              {groupSections.map((section) => {
                const Icon = SECTION_ICONS[section.key] ?? Circle
                return (
                  <div
                    key={section.key}
                    className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${
                      section.complete
                        ? 'bg-green-50'
                        : 'bg-gray-50 hover:bg-amber-50 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!section.complete && section.route) {
                        navigate(section.route)
                      }
                    }}
                    role={!section.complete ? 'button' : undefined}
                    tabIndex={!section.complete ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (!section.complete && (e.key === 'Enter' || e.key === ' ')) {
                        navigate(section.route)
                      }
                    }}
                  >
                    {/* Status icon */}
                    {section.complete ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 flex-shrink-0 text-gray-300" />
                    )}

                    {/* Section icon */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                        section.complete ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          section.complete ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                    </div>

                    {/* Label + description */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          section.complete ? 'text-gray-700' : 'text-gray-900'
                        }`}
                      >
                        {section.label}
                        {section.count > 0 && (
                          <span className="ml-1.5 rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                            {section.count}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{section.description}</p>
                    </div>

                    {/* CTA arrow for incomplete */}
                    {!section.complete && (
                      <div className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-600">
                        Add <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* ── Why this matters ────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-purple-100 bg-purple-50 p-5">
        <h3 className="text-sm font-semibold text-purple-900">Why this matters</h3>
        <p className="mt-1 text-sm text-purple-700">
          Your teaching profile drives the AI personalization engine — subjects, grade band,
          experience, and certifications determine which micro-courses, growth paths, and tutorials
          are generated specifically for you. A richer profile means more relevant content.
        </p>
      </section>
    </div>
  )
}
