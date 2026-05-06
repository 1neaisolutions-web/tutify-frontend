import { History, Settings, Clock, TrendingUp } from 'lucide-react'

const HistoryPersonalization = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <History className="w-6 h-6" />
              <span>History & Personalization</span>
            </h1>
            <p className="text-gray-600 mt-1">
              View your activity history and customize your experience
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View your recent templates, quizzes, and AI interactions
          </p>
          <div className="text-sm text-gray-500 italic">No recent activity</div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Usage Statistics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Track your usage patterns and productivity metrics
          </p>
          <div className="text-sm text-gray-500 italic">Statistics will appear here</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Personalization Settings</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Customize your preferences, teaching subjects, and AI assistant behavior
        </p>
        <button className="btn-secondary">Open Settings</button>
      </div>

      <div className="card mt-6">
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            History & Personalization Coming Soon
          </h3>
          <p className="text-gray-600">
            This feature will track your activity history and allow you to personalize your
            teaching assistant experience.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HistoryPersonalization



