import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as subscriptionApi from '../api/subscriptions'
// @ts-ignore - useSnackbar is a JS file
import { useSnackbar } from '../hooks/useSnackbar'
import {
  Crown,
  Check,
  X,
  Zap,
  Globe,
  Mic,
  Paperclip,
  Sparkles,
  BarChart3,
  RefreshCw,
  Loader2,
  ArrowRight,
  TrendingUp,
  Calendar,
  CreditCard,
} from 'lucide-react'

interface SubscriptionFeatures {
  [key: string]: {
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
  }
}

const FEATURES: SubscriptionFeatures = {
  chat_messages: {
    name: 'Chat Messages',
    description: 'Send messages to AI chatbots',
    icon: Sparkles,
  },
  web_search: {
    name: 'Web Search',
    description: 'Real-time web search integration',
    icon: Globe,
  },
  audio_transcription: {
    name: 'Voice Input/Output',
    description: 'Audio transcription and voice responses',
    icon: Mic,
  },
  file_attachments: {
    name: 'File Attachments',
    description: 'Upload and process files (PDFs, images, etc.)',
    icon: Paperclip,
  },
  analytics: {
    name: 'Advanced Analytics',
    description: 'Detailed usage analytics and insights',
    icon: BarChart3,
  },
}

const Subscription = () => {
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<subscriptionApi.Subscription | null>(null)
  const [features, setFeatures] = useState<subscriptionApi.UserFeatures | null>(null)
  const [quota, setQuota] = useState<subscriptionApi.QuotaSummary | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  // Load subscription data
  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    setLoading(true)
    try {
      const [subscriptionData, featuresData, quotaData] = await Promise.all([
        subscriptionApi.getMySubscription().catch(() => null),
        subscriptionApi.getMyFeatures().catch(() => null),
        subscriptionApi.getQuotaSummary().catch(() => null),
      ])

      if (subscriptionData) {
        setSubscription(subscriptionData)
      }

      if (featuresData) {
        setFeatures(featuresData)
      }

      if (quotaData) {
        setQuota(quotaData)
      }
    } catch (error) {
      console.error('Error loading subscription data:', error)
      toast.error('Failed to load subscription information')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    // TODO: Implement upgrade flow (Stripe/payment integration)
    setUpgrading(true)
    try {
      // For now, this is a placeholder - will be implemented when payment is integrated
      toast.info('Upgrade flow will be implemented with payment integration')
      
      // Simulate upgrade (in production, this would call payment API)
      setTimeout(() => {
        setUpgrading(false)
        // Reload subscription data after upgrade
        loadSubscriptionData()
      }, 2000)
    } catch (error) {
      console.error('Error upgrading:', error)
      toast.error('Failed to upgrade subscription')
      setUpgrading(false)
    }
  }

  const getTierDisplayName = (tier: string) => {
    const tierMap: Record<string, string> = {
      free: 'Free',
      premium: 'Premium',
      enterprise: 'Enterprise',
    }
    return tierMap[tier] || tier
  }

  const getTierColor = (tier: string) => {
    const colorMap: Record<string, string> = {
      free: 'bg-gray-100 text-gray-700 border-gray-300',
      premium: 'bg-purple-100 text-purple-700 border-purple-300',
      enterprise: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600',
    }
    return colorMap[tier] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getTierBadgeColor = (tier: string) => {
    const colorMap: Record<string, string> = {
      free: 'bg-gray-500',
      premium: 'bg-purple-500',
      enterprise: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    }
    return colorMap[tier] || 'bg-gray-500'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const getFeatureAccess = (featureKey: string): boolean => {
    if (!features) return false
    const feature = features.features.find((f) => f.feature_key === featureKey)
    return feature?.is_enabled || false
  }

  const getFeatureLimit = (featureKey: string): { used: number; limit: number | null } | null => {
    if (!features) return null
    const feature = features.features.find((f) => f.feature_key === featureKey)
    if (!feature) return null
    return {
      used: feature.usage_count || 0,
      limit: feature.usage_limit || feature.limit_value || null,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    )
  }

  const currentTier = subscription?.tier || 'free'
  const isPremium = currentTier === 'premium' || currentTier === 'enterprise'
  const isFree = currentTier === 'free'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-gray-600">Manage your subscription, view usage, and upgrade your plan</p>
        </div>

        {/* Current Subscription Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTierBadgeColor(currentTier)}`}>
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                <p className={`text-sm font-medium ${getTierColor(currentTier).split(' ')[1]}`}>
                  {getTierDisplayName(currentTier)} Plan
                </p>
              </div>
            </div>
            {isFree && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {upgrading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Upgrading...</span>
                  </>
                ) : (
                  <>
                    <span>Upgrade to Premium</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className={`text-sm font-medium ${
                subscription?.status === 'active' ? 'text-green-600' : 'text-gray-900'
              }`}>
                {subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'Active'}
              </p>
            </div>
            {subscription?.is_trial && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Trial Ends</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(subscription.trial_ends_at)}
                </p>
              </div>
            )}
            {subscription?.current_period_end && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Usage & Quotas */}
        {quota && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Usage & Quotas</h2>
              <button
                onClick={loadSubscriptionData}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Messages */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Daily Messages</p>
                  <p className="text-sm text-gray-600">
                    {quota.daily_messages_used} / {quota.daily_messages_limit === -1 ? '∞' : quota.daily_messages_limit}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (quota.daily_messages_used / (quota.daily_messages_limit === -1 ? quota.daily_messages_used + 1 : quota.daily_messages_limit)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Monthly Messages */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Monthly Messages</p>
                  <p className="text-sm text-gray-600">
                    {quota.monthly_messages_used} / {quota.monthly_messages_limit === -1 ? '∞' : quota.monthly_messages_limit}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (quota.monthly_messages_used / (quota.monthly_messages_limit === -1 ? quota.monthly_messages_used + 1 : quota.monthly_messages_limit)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Access</h2>
          <div className="space-y-4">
            {Object.entries(FEATURES).map(([key, feature]) => {
              const Icon = feature.icon
              const hasAccess = getFeatureAccess(key)
              const limit = getFeatureLimit(key)

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${hasAccess ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${hasAccess ? 'text-purple-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{feature.name}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                      {limit && limit.limit !== null && (
                        <p className="text-xs text-gray-500 mt-1">
                          {limit.used} / {limit.limit} used
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasAccess ? (
                      <>
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Enabled</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-400 font-medium">Locked</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upgrade CTA for Free Users */}
        {isFree && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Unlock Premium Features</h2>
                <p className="text-purple-100 mb-4">
                  Upgrade to Premium and get access to web search, voice input, file attachments, and more.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Web Search Integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Voice Input & Output</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>File Attachments (PDFs, Images)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Advanced Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Higher Usage Limits</span>
                  </li>
                </ul>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {upgrading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Upgrading...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
              <div className="hidden md:block">
                <Zap className="h-32 w-32 text-purple-200" />
              </div>
            </div>
          </div>
        )}

        {/* Payment Method (for Premium users - placeholder for future) */}
        {isPremium && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              <button
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                onClick={() => toast.info('Payment management will be implemented with payment integration')}
              >
                Update
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Payment management will be available once payment integration is implemented.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscription
