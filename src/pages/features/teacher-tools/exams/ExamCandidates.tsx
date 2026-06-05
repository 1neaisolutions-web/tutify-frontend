import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge, Phase2Section } from '../components'
import { demoStudents } from '../demo/teacherToolsDemoData'
import * as examApi from '../../../../api/examApi'

export default function ExamCandidates() {
  const { t } = useTranslation()
  const { examId } = useParams()
  const [exam, setExam] = useState<examApi.ExamApiItem | null>(null)

  useEffect(() => {
    if (!examId) return
    let c = false
    ;(async () => {
      try {
        const ex = await examApi.fetchExam(examId)
        if (!c) setExam(ex)
      } catch {
        if (!c) setExam(null)
      }
    })()
    return () => {
      c = true
    }
  }, [examId])

  const e = exam

  if (!e) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('exam.detail.notFound')}</p>
        <Link to="/teacher-tools/exams" className="text-sm font-semibold text-primary-600">
          ← Back to exams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`${t('exam.candidates.titlePrefix')} ${e.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('exam.breadcrumb'), to: '/teacher-tools/exams' },
          { label: e.title, to: `/teacher-tools/exams/${e.id}` },
          { label: t('exam.detail.tabs.candidates') },
        ]}
      />
      <Phase2Section title={t('exam.candidates.phase2Title')} footnote={t('exam.candidates.phase2Footnote')}>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left">{t('quiz.submissions.colStudent')}</th>
              <th className="px-3 py-3 text-left">{t('teacherTools.status')}</th>
              <th className="px-3 py-3 text-left">{t('exam.candidates.colTimeSpent')}</th>
            </tr>
          </thead>
          <tbody>
            {demoStudents.map((s, i) => (
              <tr key={s.id} className="border-t border-gray-100">
                <td className="px-3 py-3">{s.name}</td>
                <td className="px-3 py-3">
                  <TeacherToolsStatusBadge
                    kind="submission"
                    value={i % 5 === 0 ? 'missed' : i % 5 === 1 ? 'in_progress' : 'submitted'}
                  />
                </td>
                <td className="px-3 py-3">{t('exam.candidates.durationMinutes', { count: e.durationMinutes - 10 - i })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Phase2Section>
      <Link to={`/teacher-tools/exams/${e.id}`} className="text-sm font-semibold text-primary-600">
        {t('teacherTools.back')}
      </Link>
    </div>
  )
}
