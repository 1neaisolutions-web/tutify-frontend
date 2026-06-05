import { History, Settings, Clock, TrendingUp } from 'lucide-react'

import { useTranslation } from 'react-i18next'
const HistoryPersonalization = () => {
  const { t } = useTranslation()
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <History className="w-6 h-6" />
              <span>{t('historyPersonalizationPage.historyPersonalization')}</span>
            </h1>
            <p className="text-gray-600 mt-1">{t('historyPersonalizationPage.viewYourActivityHistoryAndCustomizeYourExperience')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t('historyPersonalizationPage.recentActivity')}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('historyPersonalizationPage.viewYourRecentTemplatesQuizzesAndAiInteractions')}</p>
          <div className="text-sm text-gray-500 italic">{t('historyPersonalizationPage.noRecentActivity')}</div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t('historyPersonalizationPage.usageStatistics')}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('historyPersonalizationPage.trackYourUsagePatternsAndProductivityMetrics')}</p>
          <div className="text-sm text-gray-500 italic">{t('historyPersonalizationPage.statisticsWillAppearHere')}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900">{t('historyPersonalizationPage.personalizationSettings')}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">{t('historyPersonalizationPage.customizeYourPreferencesTeachingSubjectsAndAiAssistantB')}</p>
        <button className="btn-secondary">{t('historyPersonalizationPage.openSettings')}</button>
      </div>

      <div className="card mt-6">
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('historyPersonalizationPage.historyPersonalizationComingSoon')}</h3>
          <p className="text-gray-600">{t('historyPersonalizationPage.thisFeatureWillTrackYourActivityHistoryAndAllowYou')}</p>
        </div>
      </div>
    </div>
  )
}

export default HistoryPersonalization



