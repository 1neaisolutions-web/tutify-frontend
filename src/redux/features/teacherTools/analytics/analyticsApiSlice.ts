import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { ApiError, apiRequest } from '../../../../api/client'

type BQArgs = { path: string; options?: Parameters<typeof apiRequest>[1] }
type BQError = { status: number; data: unknown; message: string }

async function baseQuery({ path, options }: BQArgs): Promise<{ data?: unknown; error?: BQError }> {
  try {
    return { data: await apiRequest(path, options) }
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: { status: e.status, data: e.payload, message: e.message } }
    }
    return { error: { status: 0, data: null, message: e instanceof Error ? e.message : String(e) } }
  }
}

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '365d'

export interface TrendPoint {
  date: string
  quiz: number
  assignment: number
  worksheet: number
  exam: number
  total: number
}

export interface BreakdownItem {
  label: string
  count: number
}

export interface AnalyticsVelocity {
  this_period: number
  prev_period: number
  change_pct: number
}

export interface TeacherToolsAnalytics {
  period: string
  bucket_size: 'day' | 'week'
  trend: TrendPoint[]
  by_subject: BreakdownItem[]
  by_grade: BreakdownItem[]
  velocity: AnalyticsVelocity
  total_draft: number
  total_published: number
  total_archived: number
  active_class_keys: number
  avg_quiz_score: number | null
}

export const analyticsApiSlice = createApi({
  reducerPath: 'teacherAnalyticsApi',
  baseQuery: baseQuery as BaseQueryFn<BQArgs, unknown, BQError>,
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getAnalytics: builder.query<TeacherToolsAnalytics, AnalyticsPeriod>({
      query: (period) => ({ path: `/v1/teacher-tools/analytics?period=${period}` }),
      providesTags: (_r, _e, period) => [{ type: 'Analytics', id: period }],
    }),
  }),
})

export const { useGetAnalyticsQuery } = analyticsApiSlice

