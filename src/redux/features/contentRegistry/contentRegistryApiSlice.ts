import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { ApiError, apiRequest } from '../../../api/client'

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

export interface ContentRegistryItem {
  id: string
  content_id: string
  content_type: string
  locale: string
  status: string
  title: string
  category: string | null
  estimated_duration_min: number | null
  difficulty: string | null
  source_type: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ContentRegistryParams {
  content_type?: string
  status?: string
  category?: string
  difficulty?: string
  source_type?: string
  skip?: number
  limit?: number
}

function buildQS(params: ContentRegistryParams): string {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') p.set(k, String(v))
  })
  const s = p.toString()
  return s ? `?${s}` : ''
}

export const contentRegistryApiSlice = createApi({
  reducerPath: 'contentRegistryApi',
  baseQuery: baseQuery as BaseQueryFn<BQArgs, unknown, BQError>,
  tagTypes: ['ContentRegistry'],
  endpoints: (builder) => ({
    listItems: builder.query<ContentRegistryItem[], ContentRegistryParams>({
      query: (params) => ({ path: `/v1/content-registry/items${buildQS(params)}` }),
      providesTags: ['ContentRegistry'],
    }),
  }),
})

export const { useListItemsQuery } = contentRegistryApiSlice

