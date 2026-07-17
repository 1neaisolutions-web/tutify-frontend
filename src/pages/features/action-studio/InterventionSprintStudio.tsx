import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Rocket,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Download,
  Printer,
  Save,
  Wand2,
  TrendingUp,
  Languages,
  Clock,
} from 'lucide-react'
import { GradeSelect } from '@/components/shared/GradeSelect'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import type {
  DurationDays,
  GroupType,
  MinutesPerDay,
  SprintContext,
  SprintPlan,
  SprintPlanSections,
  SupportNeed,
} from './interventionSprintTypes'
import { SECTION_LABELS, SECTION_ORDER } from './interventionSprintTypes'
import { adjustSprintPlan, changeDailyTime, generateSprintPlan, regenerateSection } from './interventionSprintMockEngine'
import { getSavedSprint, saveSprint } from './interventionSprintStorage'
import { exportPlanAsDocx, planToPlainText, printPlan, sectionToPlainText } from './interventionSprintExport'

type Step = 'select' | 'context' | 'generating' | 'review'

const GROUP_TYPE_OPTIONS: { value: GroupType; label: string }[] = [
  { value: 'one_on_one', label: '1:1' },
  { value: 'small_group', label: 'Small group (3–6)' },
  { value: 'whole_class_subgroup', label: 'Whole-class subgroup' },
]

const MINUTES_OPTIONS: MinutesPerDay[] = [10, 15, 20, 30]
const DURATION_OPTIONS: DurationDays[] = [5, 10, 15, 20]

const SUPPORT_NEED_OPTIONS: { value: SupportNeed; label: string }[] = [
  { value: 'el_support', label: 'EL support' },
  { value: 'iep_504', label: 'IEP / 504 accommodations' },
  { value: 'behavior_support', label: 'Behavior support' },
  { value: 'gifted_extension', label: 'Gifted extension' },
]

const EMPTY_CONTEXT: SprintContext = {
  grade: '',
  subject: '',
  topicOrSkill: '',
  groupType: 'small_group',
  mainConcern: '',
  evidence: '',
  minutesPerDay: 15,
  durationDays: 10,
  supportNeeds: [],
  expectedGoal: '',
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      return false
    }
  }
}

function GeneratingState() {
  const [progress, setProgress] = useState(0.12)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(0.94, p + 0.08 + Math.random() * 0.08))
    }, 220)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white p-12 shadow-sm">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
          <Sparkles className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Building your intervention plan…</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connecting the problem summary, daily actions, differentiation, and monitoring into one plan.
        </p>
        <div className="mt-6 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-600" />
            <span>Assembling sections</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  sectionKey,
  plan,
  onRegenerate,
}: {
  sectionKey: keyof SprintPlanSections
  plan: SprintPlan
  onRegenerate: (key: keyof SprintPlanSections) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await copyText(sectionToPlainText(plan, sectionKey))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">{SECTION_LABELS[sectionKey]}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
            aria-label="Copy section"
            title="Copy section"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => onRegenerate(sectionKey)}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
            aria-label="Regenerate this section"
            title="Regenerate this section"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-gray-700">
        {sectionKey === 'problemSummary' && <p>{plan.sections.problemSummary}</p>}
        {sectionKey === 'interventionGoal' && (
          <p className="rounded-xl bg-primary-50 p-4 text-primary-900">{plan.sections.interventionGoal}</p>
        )}
        {sectionKey === 'dailyActionPlan' && (
          <div className="space-y-2">
            {plan.sections.dailyActionPlan.map((d) => (
              <details key={d.day} className="group rounded-xl border border-gray-100 bg-gray-50/60 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-800">
                  <span>
                    Day {d.day} · {d.phase}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-normal text-gray-400">
                    <Clock className="h-3 w-3" /> {d.minutes} min
                  </span>
                </summary>
                <div className="space-y-1 px-4 pb-3 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Activity: </span>
                    {d.activity}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Teacher move: </span>
                    {d.teacherMove}
                  </p>
                </div>
              </details>
            ))}
          </div>
        )}
        {sectionKey === 'differentiation' && (
          <ul className="space-y-2">
            {plan.sections.differentiation.map((d, idx) => (
              <li key={idx} className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-800">{d.label}: </span>
                {d.adjustment}
              </li>
            ))}
          </ul>
        )}
        {sectionKey === 'progressMonitoring' && (
          <ul className="space-y-2">
            {plan.sections.progressMonitoring.map((p, idx) => (
              <li key={idx} className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-800">Day {p.day} — {p.method}: </span>
                {p.lookFor}
              </li>
            ))}
          </ul>
        )}
        {sectionKey === 'teacherGuidance' && (
          <ul className="list-disc space-y-1.5 pl-5">
            {plan.sections.teacherGuidance.map((g, idx) => (
              <li key={idx}>{g}</li>
            ))}
          </ul>
        )}
        {sectionKey === 'familyCommunication' && (
          <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4">{plan.sections.familyCommunication}</p>
        )}
        {sectionKey === 'adminSummary' && (
          <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-700">
            {plan.sections.adminSummary}
          </p>
        )}
      </div>
    </div>
  )
}

const InterventionSprintStudio = () => {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<Step>('select')
  const [form, setForm] = useState<SprintContext>(EMPTY_CONTEXT)
  const [plan, setPlan] = useState<SprintPlan | null>(null)
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [copiedPlan, setCopiedPlan] = useState(false)

  useEffect(() => {
    const sprintId = searchParams.get('sprintId')
    if (sprintId) {
      const existing = getSavedSprint(sprintId)
      if (existing) {
        setPlan(existing)
        setForm(existing.context)
        setStep('review')
      }
    }
  }, [searchParams])

  const canGenerate = useMemo(
    () => Boolean(form.topicOrSkill.trim() && form.mainConcern.trim() && form.grade && form.subject),
    [form],
  )

  const updateForm = <K extends keyof SprintContext>(key: K, value: SprintContext[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const toggleSupportNeed = (need: SupportNeed) => {
    setForm((f) => ({
      ...f,
      supportNeeds: f.supportNeeds.includes(need)
        ? f.supportNeeds.filter((n) => n !== need)
        : [...f.supportNeeds, need],
    }))
  }

  const handleGenerate = () => {
    setStep('generating')
    setTimeout(() => {
      setPlan(generateSprintPlan(form))
      setStep('review')
    }, 1700)
  }

  const handleRegenerateSection = (key: keyof SprintPlanSections) => {
    if (!plan) return
    setPlan(regenerateSection(plan, key))
  }

  const handleAdjust = (action: 'easier' | 'more_rigorous' | 'add_el_support') => {
    if (!plan) return
    setPlan(adjustSprintPlan(plan, action))
  }

  const handleChangeMinutes = (minutes: number) => {
    if (!plan) return
    setPlan(changeDailyTime(plan, minutes))
  }

  const handleSave = () => {
    if (!plan) return
    saveSprint(plan)
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2000)
  }

  const handleCopyPlan = async () => {
    if (!plan) return
    const ok = await copyText(planToPlainText(plan))
    if (ok) {
      setCopiedPlan(true)
      setTimeout(() => setCopiedPlan(false), 1500)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/action-studio" className="inline-flex items-center gap-1 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> Teaching Action Studio
        </Link>
        <span>/</span>
        <span className="text-gray-700">Intervention Sprint Studio</span>
      </div>

      {step === 'select' && (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Select a task</h1>
          <p className="mt-1 text-sm text-gray-600">Choose what you want to build.</p>
          <button
            type="button"
            onClick={() => setStep('context')}
            className="mt-6 flex w-full items-center gap-4 rounded-2xl border-2 border-primary-500 bg-primary-50 p-5 text-left transition hover:bg-primary-100"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Rocket className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-gray-900">Create a Student Intervention Sprint</span>
              <span className="mt-0.5 block text-sm text-gray-600">
                Convert classroom evidence into a short, practical support plan.
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-primary-600" />
          </button>
        </div>
      )}

      {step === 'context' && (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Enter classroom context</h1>
          <p className="mt-1 text-sm text-gray-600">
            Use anonymous labels like "Group 1" rather than real student names.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <GradeSelect value={form.grade} onChange={(v) => updateForm('grade', v)} required />
            <SubjectSelect value={form.subject} onChange={(v) => updateForm('subject', v)} required />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-800">
              Topic or skill <span className="text-red-500">*</span>
            </label>
            <input
              value={form.topicOrSkill}
              onChange={(e) => updateForm('topicOrSkill', e.target.value)}
              placeholder="e.g. Equivalent fractions"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="mt-5">
            <span className="block text-sm font-medium text-gray-800">Student group type</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {GROUP_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateForm('groupType', opt.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    form.groupType === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-primary-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-800">
              Main concern <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.mainConcern}
              onChange={(e) => updateForm('mainConcern', e.target.value)}
              rows={2}
              placeholder="e.g. Students can identify a fraction but struggle to find an equivalent one."
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-800">Evidence / observation data</label>
            <textarea
              value={form.evidence}
              onChange={(e) => updateForm('evidence', e.target.value)}
              rows={2}
              placeholder="e.g. Group 1 scored 40% on the equivalent-fractions exit ticket."
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <span className="block text-sm font-medium text-gray-800">Time available per day</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {MINUTES_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateForm('minutesPerDay', m)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      form.minutesPerDay === m
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-primary-200'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-800">Intervention duration</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => updateForm('durationDays', d)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      form.durationDays === d
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-primary-200'
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <span className="block text-sm font-medium text-gray-800">Support needs</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUPPORT_NEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleSupportNeed(opt.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    form.supportNeeds.includes(opt.value)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-primary-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-800">Expected goal (optional)</label>
            <input
              value={form.expectedGoal}
              onChange={(e) => updateForm('expectedGoal', e.target.value)}
              placeholder="Leave blank to generate a goal automatically"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              disabled={!canGenerate}
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" /> Generate plan
            </button>
          </div>
        </div>
      )}

      {step === 'generating' && <GeneratingState />}

      {step === 'review' && plan && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {plan.context.topicOrSkill || 'Intervention sprint'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.context.grade || 'Grade N/A'} · {plan.context.subject || 'Subject N/A'} ·{' '}
                  {plan.context.durationDays}-day sprint · {plan.context.minutesPerDay} min/day
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPlan(null)
                  setStep('context')
                }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Edit context
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => handleAdjust('easier')}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
              >
                <Wand2 className="h-3.5 w-3.5" /> Make easier
              </button>
              <button
                type="button"
                onClick={() => handleAdjust('more_rigorous')}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
              >
                <TrendingUp className="h-3.5 w-3.5" /> More rigorous
              </button>
              {!plan.elSupportAdded && (
                <button
                  type="button"
                  onClick={() => handleAdjust('add_el_support')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
                >
                  <Languages className="h-3.5 w-3.5" /> Add EL support
                </button>
              )}
              <label className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700">
                <Clock className="h-3.5 w-3.5" /> Daily time
                <select
                  value={plan.context.minutesPerDay}
                  onChange={(e) => handleChangeMinutes(Number(e.target.value))}
                  className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none"
                >
                  {MINUTES_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </label>

              <span className="ml-auto flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-500"
                >
                  {savedFeedback ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                  {savedFeedback ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => exportPlanAsDocx(plan)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
                <button
                  type="button"
                  onClick={() => printPlan(plan)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
                >
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
                >
                  {copiedPlan ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy plan
                </button>
              </span>
            </div>
          </div>

          {SECTION_ORDER.map((key) => (
            <SectionCard key={key} sectionKey={key} plan={plan} onRegenerate={handleRegenerateSection} />
          ))}
        </div>
      )}
    </div>
  )
}

export default InterventionSprintStudio
