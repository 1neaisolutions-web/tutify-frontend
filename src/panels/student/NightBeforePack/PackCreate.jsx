import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import GenerationProgress from './components/GenerationProgress'
import { createPackFromInput, shouldFailGeneration } from './nightBeforePackMockEngine'
import { upsertPack } from './nightBeforePackStorage'

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Simulate Error']

const defaultExamLocal = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const PackCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [subject, setSubject] = useState('Science')
  const [title, setTitle] = useState('')
  const [examLocal, setExamLocal] = useState(defaultExamLocal)
  const [topicsRaw, setTopicsRaw] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState('form') // form | generating
  const [pendingInput, setPendingInput] = useState(null)
  const [storageWarning, setStorageWarning] = useState(false)

  const parseTopics = (raw) =>
    raw
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)

  const validate = () => {
    const next = {}
    if (!title.trim()) next.title = t('studentPanel.nightBefore.create.errors.title')
    if (!examLocal) next.examAt = t('studentPanel.nightBefore.create.errors.examAt')
    const topics = parseTopics(topicsRaw)
    if (topics.length === 0) next.topics = t('studentPanel.nightBefore.create.errors.topics')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const startGenerate = (e) => {
    e.preventDefault()
    if (!validate()) return
    const input = {
      subject,
      title: title.trim(),
      examAt: new Date(examLocal).toISOString(),
      topics: parseTopics(topicsRaw),
      notes: notes.trim() || undefined,
    }
    setPendingInput(input)
    setPhase('generating')
  }

  const handleGenerationComplete = useCallback(() => {
    if (!pendingInput) return
    // After a forced-fail retry, GenerationProgress disarms fail and succeeds here.
    const input = shouldFailGeneration(pendingInput.subject)
      ? { ...pendingInput, subject: 'Science' }
      : pendingInput
    const pack = createPackFromInput(input, { source: 'self-created' })
    const saved = upsertPack(pack)
    if (!saved.ok) setStorageWarning(true)
    navigate(`/student/night-before/${pack.id}`)
  }, [pendingInput, navigate])

  if (phase === 'generating' && pendingInput) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.create.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{pendingInput.title}</p>
        </div>
        <div className="px-6 py-6 max-w-xl">
          <GenerationProgress
            forceFail={shouldFailGeneration(pendingInput.subject)}
            onCancel={() => {
              setPhase('form')
              setPendingInput(null)
            }}
            onComplete={handleGenerationComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.create.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.nightBefore.create.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/night-before')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          {t('studentPanel.common.cancel')}
        </button>
      </div>

      <form onSubmit={startGenerate} className="px-6 py-6 max-w-xl space-y-4">
        {storageWarning ? (
          <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {t('studentPanel.nightBefore.storageWarning')}
          </div>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.nightBefore.create.fields.subject')}</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s === 'Simulate Error' ? t('studentPanel.nightBefore.create.simulateError') : s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.nightBefore.create.fields.title')}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('studentPanel.nightBefore.create.placeholders.title')}
          />
          {errors.title ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p> : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.nightBefore.create.fields.examAt')}</span>
          <input
            type="datetime-local"
            value={examLocal}
            onChange={(e) => setExamLocal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          />
          {errors.examAt ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.examAt}</p> : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.nightBefore.create.fields.topics')}</span>
          <textarea
            value={topicsRaw}
            onChange={(e) => setTopicsRaw(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('studentPanel.nightBefore.create.placeholders.topics')}
          />
          {errors.topics ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.topics}</p> : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.nightBefore.create.fields.notes')}</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('studentPanel.nightBefore.create.placeholders.notes')}
          />
        </label>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/student/night-before')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.cancel')}
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
            {t('studentPanel.nightBefore.create.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PackCreate
