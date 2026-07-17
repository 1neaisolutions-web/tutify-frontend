import { useTranslation } from 'react-i18next'

const PackSourceBadge = ({ source }) => {
  const { t } = useTranslation()
  const isTeacher = source === 'teacher-linked'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isTeacher
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-200'
          : 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-200'
      }`}
    >
      {isTeacher ? t('studentPanel.nightBefore.source.teacher') : t('studentPanel.nightBefore.source.self')}
    </span>
  )
}

export default PackSourceBadge
