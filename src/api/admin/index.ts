import { apiRequest } from '../client'

// apiRequest buildUrl already prefixes with API_URL (.../api), so paths start at /v1
const BASE = '/v1/admin'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  total_users: number
  users_by_role: Record<string, number>
  dau: number
  wau: number
  mau: number
  total_organizations: number
  total_schools: number
  tier_breakdown: Record<string, number>
  memory_total_balance: number
  memory_total_allocated: number
  memory_total_spent: number
  alert_count: number
  health_status: string
  queue_pending: number
  queue_in_progress: number
  error_rate_24h: number
}

export interface AdminAlert {
  id: string
  severity: string
  title: string
  message: string
  created_at: string
  link?: string
}

export interface MemoryOverview {
  total_balance: number
  total_allocated: number
  total_spent: number
  active_users_with_balance: number
  daily_burn_rate: number
  monthly_burn_rate: number
  estimated_runway_days: number | null
}

export interface MemoryUser {
  user_id: string
  email: string
  full_name?: string
  tenant_id: string
  tenant_name?: string
  balance: number
  total_allocated: number
  total_spent: number
  expires_at?: string
  balance_pct?: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  status: string
  tenant_id: string
  tenant_name?: string
  roles: string[]
  last_login_at?: string
  created_at: string
  balance?: number
  subscription_tier?: string
}

export interface AdminOrg {
  id: string
  name: string
  slug: string
  type: string
  is_active: boolean
  user_count: number
  school_count: number
  memory_total_balance: number
  created_at: string
}

export interface AdminSchool {
  id: string
  name: string
  institution_type?: string
  tenant_id: string
  tenant_name?: string
  org_tenant_id?: string
  org_name?: string
  is_active: boolean
  user_count: number
  created_at?: string
}

export interface AdminSubscription {
  user_id: string
  email: string
  full_name?: string
  tier: string
  status: string
  current_period_end?: string
  is_trial: boolean
  is_manually_granted: boolean
}

export interface AuditLogEntry {
  id: string
  event_type: string
  description: string
  actor_user_id?: string
  target_user_id?: string
  tenant_id?: string
  event_metadata?: Record<string, unknown>
  ip_address?: string
  created_at: string
}

export interface ComplianceRequest {
  id: string
  request_type: string
  status: string
  reason: string
  notes?: string
  requester_user_id?: string
  subject_user_id?: string
  organization_id?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface GrowthAnalytics {
  data: { date: string; new_users: number; active_users: number }[]
  total_users: number
  growth_rate_30d: number
}

export interface LlmCostAnalytics {
  data: { date: string; model?: string; total_usd: number; total_credits: number; transaction_count: number }[]
  total_usd_30d: number
  by_model: Record<string, number>
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboardOverview = () =>
  apiRequest<DashboardOverview>(`${BASE}/dashboard/overview`)

export const getAdminAlerts = () =>
  apiRequest<{ items: AdminAlert[]; total: number }>(`${BASE}/alerts`)

// ─── Memory ───────────────────────────────────────────────────────────────────

export const getMemoryOverview = () =>
  apiRequest<MemoryOverview>(`${BASE}/memory/overview`)

export const getMemoryUsers = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<MemoryUser>>(`${BASE}/memory/users`, { query: params })

export const getMemoryUserDetail = (userId: string) =>
  apiRequest<{ user: MemoryUser; recent_transactions: unknown[] }>(`${BASE}/memory/users/${userId}`)

export const getMemoryAlerts = () =>
  apiRequest<{ items: unknown[]; total: number }>(`${BASE}/memory/alerts`)

export const grantMemory = (userId: string, amount: number, reason: string) =>
  apiRequest(`${BASE}/memory/users/${userId}/grant`, { method: 'POST', body: { amount, reason } })

export const deductMemory = (userId: string, amount: number, reason: string) =>
  apiRequest(`${BASE}/memory/users/${userId}/deduct`, { method: 'POST', body: { amount, reason } })

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAdminUsers = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<AdminUser>>(`${BASE}/users`, { query: params })

export const getAdminUser = (userId: string) =>
  apiRequest<{ user: AdminUser; memory?: MemoryUser; subscription_tier?: string; subscription_status?: string }>(
    `${BASE}/users/${userId}`,
  )

export const suspendUser = (userId: string, reason: string) =>
  apiRequest(`${BASE}/users/${userId}/suspend`, { method: 'POST', body: { reason } })

export const reactivateUser = (userId: string, reason: string) =>
  apiRequest(`${BASE}/users/${userId}/reactivate`, { method: 'POST', body: { reason } })

export const forcePasswordReset = (userId: string, reason: string) =>
  apiRequest(`${BASE}/users/${userId}/force-password-reset`, { method: 'POST', body: { reason } })

// ─── Organizations ──────────────────────────────────────────────────────────

export const getAdminOrganizations = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<AdminOrg>>(`${BASE}/organizations`, { query: params })

export const getAdminOrganization = (orgId: string) =>
  apiRequest<{ organization: AdminOrg; schools: { id: string; name: string }[] }>(
    `${BASE}/organizations/${orgId}`,
  )

export const suspendOrganization = (orgId: string, reason: string) =>
  apiRequest(`${BASE}/organizations/${orgId}/suspend`, { method: 'POST', body: { reason } })

export const reactivateOrganization = (orgId: string, reason: string) =>
  apiRequest(`${BASE}/organizations/${orgId}/reactivate`, { method: 'POST', body: { reason } })

// ─── Schools ──────────────────────────────────────────────────────────────────

export const getAdminSchools = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<AdminSchool>>(`${BASE}/institutions`, { query: params })

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const getAdminSubscriptions = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<AdminSubscription>>(`${BASE}/subscriptions`, { query: params })

// ─── Audit ────────────────────────────────────────────────────────────────────

export const getAuditLogs = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<AuditLogEntry>>(`${BASE}/audit-logs`, { query: params })

// ─── Compliance ───────────────────────────────────────────────────────────────

export const getComplianceRequests = (params?: Record<string, string | number | boolean>) =>
  apiRequest<Paginated<ComplianceRequest>>(`${BASE}/compliance/export-requests`, { query: params })

export const createComplianceRequest = (body: {
  subject_user_id?: string
  organization_id?: string
  request_type?: string
  reason: string
  notes?: string
}) => apiRequest<ComplianceRequest>(`${BASE}/compliance/export-requests`, { method: 'POST', body })

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getGrowthAnalytics = (days = 30) =>
  apiRequest<GrowthAnalytics>(`${BASE}/analytics/growth`, { query: { days } })

export const getLlmCostAnalytics = (days = 30) =>
  apiRequest<LlmCostAnalytics>(`${BASE}/analytics/llm-cost`, { query: { days } })

// ─── MFA ──────────────────────────────────────────────────────────────────────

export const mfaEnroll = (loginToken: string) =>
  apiRequest<{ secret: string; otpauth_url: string }>('/v1/auth/mfa/enroll', {
    method: 'POST',
    body: { login_token: loginToken },
  })

export const mfaVerify = (loginToken: string, code: string) =>
  apiRequest('/v1/auth/mfa/verify', {
    method: 'POST',
    body: { login_token: loginToken, code },
  })
