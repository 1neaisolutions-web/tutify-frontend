/**
 * Subscription & Credits API client
 */
import { apiRequest } from './client'

// ── Legacy types (kept for backwards compat) ──────────────────────────────────

export interface Subscription {
  tier: 'free' | 'premium' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due'
  is_trial: boolean
  is_manually_granted: boolean
  current_period_end: string | null
  trial_ends_at: string | null
}

export interface FeatureAccess {
  feature_key: string
  is_enabled: boolean
  limit_value: number | null
  limit_period: string | null
  usage_count: number | null
  usage_limit: number | null
}

export interface UserFeatures {
  tier: string
  features: FeatureAccess[]
}

export interface QuotaSummary {
  daily_messages_limit: number
  daily_messages_used: number
  monthly_messages_limit: number
  monthly_messages_used: number
  requests_per_minute: number
  requests_per_hour: number
  features: Record<string, any>
}

// ── Credit system types ───────────────────────────────────────────────────────

export interface CreditBalance {
  balance: number
  total_allocated: number
  total_spent: number
  expires_at: string | null
  auto_renew: boolean
  subscription_started_at: string | null
  has_active_credits: boolean
}

export interface CreditTransaction {
  id: string
  type: 'debit' | 'credit' | 'renewal' | 'expiry_adjustment'
  amount: number
  balance_after: number
  feature_key: string | null
  description: string | null
  model_used: string | null
  input_tokens: number | null
  output_tokens: number | null
  created_at: string
}

export interface CreditTransactionList {
  total: number
  page: number
  page_size: number
  items: CreditTransaction[]
}

export interface UsageBreakdownItem {
  feature_key: string
  display_name: string
  module_name: string
  credits: number
  call_count: number
  pct_of_total: number
}

export interface UsageBreakdown {
  period_days: number
  total_credits: number
  breakdown: UsageBreakdownItem[]
}

export interface UsageSummary {
  balance: number
  total_allocated: number
  total_spent: number
  expires_at: string | null
  auto_renew: boolean
  subscription_started_at: string | null
  monthly_spent: number
  top_module: string | null
}

export interface RedeemCodeResult {
  success: boolean
  credits_added: number
  balance: number
  expires_at: string | null
  auto_renew: boolean
  error: string | null
  error_code: string | null
}

// ── Legacy API functions ──────────────────────────────────────────────────────

export async function getMySubscription(): Promise<Subscription> {
  return apiRequest<Subscription>('v1/subscriptions/me')
}

export async function getMyFeatures(): Promise<UserFeatures> {
  return apiRequest<UserFeatures>('v1/subscriptions/me/features')
}

export async function checkFeatureAccess(featureKey: string): Promise<FeatureAccess> {
  return apiRequest<FeatureAccess>(`v1/subscriptions/me/features/${featureKey}`)
}

export async function getQuotaSummary(): Promise<QuotaSummary> {
  return apiRequest<QuotaSummary>('v1/subscriptions/me/quota')
}

// ── Credit API functions ──────────────────────────────────────────────────────

export async function getCreditBalance(): Promise<CreditBalance> {
  return apiRequest<CreditBalance>('v1/subscriptions/me/balance')
}

export async function getTransactionHistory(
  page = 1,
  pageSize = 20,
  featureKey?: string
): Promise<CreditTransactionList> {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  if (featureKey) params.set('feature_key', featureKey)
  return apiRequest<CreditTransactionList>(`v1/subscriptions/me/transactions?${params}`)
}

export async function getUsageBreakdown(days = 30): Promise<UsageBreakdown> {
  return apiRequest<UsageBreakdown>(`v1/subscriptions/me/usage-breakdown?days=${days}`)
}

export async function getUsageSummary(): Promise<UsageSummary> {
  return apiRequest<UsageSummary>('v1/subscriptions/me/usage-summary')
}

export async function redeemCode(code: string): Promise<RedeemCodeResult> {
  return apiRequest<RedeemCodeResult>('v1/subscriptions/redeem-code', {
    method: 'POST',
    body: { code },
  })
}

// ── Admin API types & functions ───────────────────────────────────────────────

export interface AdminCode {
  id: string
  code: string
  code_type: 'beta' | 'staff'
  credit_allocation: number
  validity_days: number
  max_uses: number | null
  times_used: number
  is_active: boolean
  auto_renew: boolean
  auto_renew_threshold_pct: number
  description: string | null
  created_at: string
}

export interface CreateCodePayload {
  code: string
  code_type: 'beta' | 'staff'
  credit_allocation: number
  validity_days: number
  max_uses: number | null
  auto_renew: boolean
  auto_renew_threshold_pct: number
  description: string
}

export async function listAdminCodes(): Promise<AdminCode[]> {
  return apiRequest<AdminCode[]>('v1/subscriptions/admin/codes')
}

export async function createAdminCode(payload: CreateCodePayload): Promise<AdminCode> {
  return apiRequest<AdminCode>('v1/subscriptions/admin/codes', {
    method: 'POST',
    body: payload,
  })
}

export async function toggleAdminCode(id: string, is_active: boolean): Promise<AdminCode> {
  return apiRequest<AdminCode>(`v1/subscriptions/admin/codes/${id}`, {
    method: 'PATCH',
    body: { is_active },
  })
}
