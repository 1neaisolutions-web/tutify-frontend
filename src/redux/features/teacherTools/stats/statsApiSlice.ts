import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { ApiError, apiRequest } from '../../../../api/client'

type BaseQueryArgs = {
  path: string
  options?: Parameters<typeof apiRequest>[1]
}
type BaseQueryError = { status: number; data: unknown; message: string }

async function baseQuery({ path, options }: BaseQueryArgs): Promise<{ data?: unknown; error?: BaseQueryError }> {
  try {
    const data = await apiRequest(path, options)
    return { data }
  } catch (e) {
    if (e instanceof ApiError) return { error: { status: e.status, data: e.payload, message: e.message } }
    return { error: { status: 0, data: null, message: e instanceof Error ? e.message : String(e) } }
  }
}

export interface ToolCounts {
  total: number
  draft: number
  published: number
  scheduled?: number
  completed?: number
  archived: number
}

export interface TeacherToolsStats {
  quizzes: ToolCounts
  assignments: ToolCounts
  worksheets: ToolCounts
  exams: ToolCounts
  summary: {
    total_active: number
    total_draft: number
    total_published: number
    scheduled_this_week: number
    published_last_30d: number
  }
}

export const statsApiSlice = createApi({
  reducerPath: 'teacherStatsApi',
  baseQuery: baseQuery as BaseQueryFn<BaseQueryArgs, unknown, BaseQueryError>,
  tagTypes: ['Stats'],
  endpoints: (builder) => ({
    getStats: builder.query<TeacherToolsStats, void>({
      query: () => ({ path: '/v1/teacher-tools/stats' }),
      providesTags: [{ type: 'Stats', id: 'GLOBAL' }],
    }),
  }),
})

export const { useGetStatsQuery } = statsApiSlice
