import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { Phase2Section, Phase2Badge } from '../components/Phase2Lock'
import { analyticsForTopic, getTopicBlueprint } from '../demo/topicAwareGenerators'
import { useGetWorksheetQuery } from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'
import { apiBlockToLocal } from './worksheetApiAdapters'

const tabs = ['Overview', 'Content', 'Responses', 'Analytics', 'Settings'] as const

const TAB_I18N: Record<(typeof tabs)[number], string> = {
  Overview: 'worksheet.detail.tabs.overview',
  Content: 'worksheet.detail.tabs.content',
  Responses: 'worksheet.detail.tabs.responses',
  Analytics: 'worksheet.detail.tabs.analytics',
  Settings: 'worksheet.detail.tabs.settings',
}

const BLOCK_LABEL_KEYS: Record<string, string> = {
  mcq: 'worksheet.detail.blockMcq',
  fill_blank: 'worksheet.detail.blockFillBlank',
  short: 'worksheet.detail.blockShort',
  match: 'worksheet.detail.blockMatch',
}

export default function WorksheetDetail() {
  const { t } = useTranslation()
  const { worksheetId } = useParams()
  const navigate = useNavigate()
  const { data: w, isLoading, isError } = useGetWorksheetQuery(worksheetId ?? '', { skip: !worksheetId })
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  const goEdit = () => {
    if (!worksheetId) return
    navigate(`/teacher-tools/worksheet/${worksheetId}/edit`)
  }

  const blocksForUi = useMemo(() => {
    if (!w?.sessions) return []
    return w.sessions.flatMap((s) => (s.blocks ?? []).map(apiBlockToLocal))
  }, [w?.sessions])

  if (isLoading && !w) {
    return <div className="p-6 text-sm text-gray-600">{t('common.loading')}</div>
  }

  if (isError || !w) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('worksheet.detail.notFound')}</p>
        <Link to="/teacher-tools/worksheet" className="text-sm font-semibold text-primary-600">
          {t('worksheet.detail.backToList')}
        </Link>
      </div>
    )
  }

  const bp = getTopicBlueprint(w.subject, w.topic)
  const an = analyticsForTopic(bp)
  const blockTypesForUi = useMemo(() => new Set(blocksForUi.map((b) => b.type)).size, [blocksForUi])
  const formatLabel =
    w.outputFormat === 'printable_pdf'
      ? t('worksheet.detail.formatPrintablePdf')
      : w.outputFormat === 'both'
        ? t('worksheet.detail.formatBoth')
        : t('worksheet.detail.formatInteractive')

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={w.title}
        subtitle={`${w.subject} · ${w.topic}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('worksheet.breadcrumb'), to: '/teacher-tools/worksheet' },
          { label: w.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <TeacherToolsStatusBadge kind="content" value={w.status} />
            <button
              type="button"
              onClick={() => goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('teacherTools.edit')}
            </button>
            <Link
              to={`/teacher-tools/worksheet/${w.id}/responses`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('worksheet.detail.tabResponses')}
              <Phase2Badge className="ml-0.5" />
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => {
              if (tabKey === 'Analytics') return
              setTab(tabKey)
            }}
            title={tabKey === 'Analytics' ? t('teacherTools.phase2Tooltip') : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
              tab === tabKey
                ? 'bg-primary-600 text-white'
                : tabKey === 'Analytics'
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(TAB_I18N[tabKey])}
            {tabKey === 'Analytics' ? <span className="ml-1.5 align-middle">• P2</span> : null}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('teacherTools.format')}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatLabel}</p>
              <p className="mt-1 text-xs text-gray-500">
                {w.outputFormat === 'printable_pdf'
                  ? t('worksheet.detail.formatHintPdf')
                  : w.outputFormat === 'both'
                    ? t('worksheet.detail.formatHintBoth')
                    : t('worksheet.detail.formatHintInteractive')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('quiz.detail.tabs.questions')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{blocksForUi.length}</p>
              <p className="mt-1 text-xs text-gray-500">
                {t('worksheet.detail.acrossTypes', { count: blockTypesForUi })}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('teacherTools.timesUsed')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{w.submissionCount}</p>
              <p className="mt-1 text-xs text-gray-500">
                {w.submissionCount === 0
                  ? t('worksheet.detail.notYetDistributed')
                  : t('worksheet.detail.studentInteractions')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('teacherTools.estMastery')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {w.submissionCount > 0 ? `${Math.round(an.masteryEstimate * 100)}%` : t('quiz.detail.na')}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {w.submissionCount > 0
                  ? t('worksheet.detail.basedOnPatterns')
                  : t('worksheet.detail.availableAfterFirstUse')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{t('quiz.detail.summary')}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('teacherTools.topic')}</dt>
                  <dd className="text-right text-gray-800">{w.topic}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.grade')}</dt>
                  <dd className="text-right text-gray-800">{w.grade}</dd>
                </div>
                {w.sourceSummary && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-500">{t('exam.detail.sourceStrategy')}</dt>
                    <dd className="text-right text-gray-800">{w.sourceSummary}</dd>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('teacherTools.created')}</dt>
                  <dd className="text-right text-gray-800">{w.createdAt}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{t('teacherTools.learningObjective')}</h3>
              <p className="mt-2 text-sm text-gray-700">{bp.objective}</p>
              {w.status === 'draft' && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {t('worksheet.detail.draftHint')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'Content' && (
        <div className="space-y-4">
          {(['mcq', 'fill_blank', 'short', 'match'] as const).map((kind) => {
            const group = blocksForUi.filter((b) => b.type === kind)
            if (group.length === 0) return null
            return (
              <section key={kind} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t(BLOCK_LABEL_KEYS[kind])}
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-gray-800">
                  {group.map((b, i) => (
                    <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      {'prompt' in b && <p>{b.prompt}</p>}
                      {'left' in b && (
                        <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                          <ul className="space-y-1">
                            {b.left.map((l, j) => (
                              <li key={j} className="font-medium">
                                {l}
                              </li>
                            ))}
                          </ul>
                          <ul className="space-y-1 text-gray-500">
                            {b.right.map((r, j) => (
                              <li key={j}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {tab === 'Responses' && (
        <Phase2Section title={t('worksheet.detail.phase2ResponsesTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('worksheet.detail.phase2ResponsesBody1')}</p>
            <p>{t('worksheet.detail.phase2ResponsesBody2')}</p>
            <Link
              to={`/teacher-tools/worksheet/${w.id}/responses`}
              className="mt-2 inline-block font-semibold text-primary-600"
            >
              {t('worksheet.detail.openResponsesPreview')}
            </Link>
          </div>
        </Phase2Section>
      )}

      {tab === 'Analytics' && (
        <Phase2Section title={t('worksheet.detail.phase2AnalyticsTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('worksheet.detail.phase2AnalyticsBody1')}</p>
            <p>{t('worksheet.detail.phase2AnalyticsBody2')}</p>
          </div>
        </Phase2Section>
      )}

      {tab === 'Settings' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">{t('worksheet.detail.settingsTitle')}</h3>
          <dl className="text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('teacherTools.format')}</dt>
              <dd className="text-gray-800">{formatLabel}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('worksheet.detail.answerKey')}</dt>
              <dd className="text-gray-800">{t('worksheet.detail.answerKeyValue')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('worksheet.detail.randomisation')}</dt>
              <dd className="text-gray-800">{t('worksheet.detail.randomisationValue')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('worksheet.detail.sharing')}</dt>
              <dd className="text-gray-800">
                {w.classes.length > 0
                  ? t('worksheet.detail.classCount', { count: w.classes.length })
                  : t('worksheet.detail.notShared')}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
