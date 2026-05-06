import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { ApiError, apiRequest } from '../../../api/client'
import type {
  FeedbackUpsertRequest,
  HistoryListParams,
  HistoryListResponse,
  HistoryQuotaResponse,
  HistoryStatsResponse,
  PinToggleRequest,
} from '../../../api/historyApi'
import { fetchHistoryQuota, getHistoryStats, listHistory, togglePin, upsertFeedback } from '../../../api/historyApi'

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
    if (e instanceof ApiError) {
      return { error: { status: e.status, data: e.payload, message: e.message } }
    }
    const msg = e instanceof Error ? e.message : String(e)
    return { error: { status: 0, data: null, message: msg } }
  }
}

export const historyApiSlice = createApi({
  reducerPath: 'historyApi',
  baseQuery: baseQuery as BaseQueryFn<BaseQueryArgs, unknown, BaseQueryError>,
  tagTypes: ['HistoryList', 'HistoryStats', 'HistoryQuota'],
  endpoints: (builder) => ({
    listHistory: builder.query<HistoryListResponse, HistoryListParams>({
      queryFn: async (params) => {
        try {
          const data = await listHistory(params)
          return { data }
        } catch (e) {
          return { error: { status: 'CUSTOM_ERROR', error: String(e) } as any }
        }
      },
      providesTags: (res) =>
        res ? [{ type: 'HistoryList', id: 'LIST' }] : [{ type: 'HistoryList', id: 'LIST' }],
    }),

    getHistoryStats: builder.query<HistoryStatsResponse, void>({
      queryFn: async () => {
        try {
          const data = await getHistoryStats()
          return { data }
        } catch (e) {
          return { error: { status: 'CUSTOM_ERROR', error: String(e) } as any }
        }
      },
      providesTags: [{ type: 'HistoryStats', id: 'STATS' }],
    }),

    togglePin: builder.mutation<void, PinToggleRequest & { listParams?: HistoryListParams }>({
      queryFn: async ({ listParams, ...req }) => {
        try {
          await togglePin(req)
          return { data: undefined }
        } catch (e) {
          return { error: { status: 'CUSTOM_ERROR', error: String(e) } as any }
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        if (!arg.listParams) return
        const patch = dispatch(
          historyApiSlice.util.updateQueryData('listHistory', arg.listParams, (draft) => {
            const item = draft.items.find((x) => x.id === arg.sourceId && x.sourceType === arg.sourceType)
            if (item) item.pinned = arg.pinned
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: [{ type: 'HistoryStats', id: 'STATS' }, { type: 'HistoryQuota', id: 'QUOTA' }],
    }),

    upsertFeedback: builder.mutation<void, FeedbackUpsertRequest>({
      queryFn: async (req) => {
        try {
          await upsertFeedback(req)
          return { data: undefined }
        } catch (e) {
          return { error: { status: 'CUSTOM_ERROR', error: String(e) } as any }
        }
      },
      invalidatesTags: [{ type: 'HistoryStats', id: 'STATS' }],
    }),

    getHistoryQuota: builder.query<HistoryQuotaResponse, void>({
      queryFn: async () => {
        try {
          const data = await fetchHistoryQuota()
          return { data }
        } catch (e) {
          return { error: { status: 'CUSTOM_ERROR', error: String(e) } as any }
        }
      },
      providesTags: [{ type: 'HistoryQuota', id: 'QUOTA' }],
    }),
  }),
})

export const {
  useListHistoryQuery,
  useGetHistoryStatsQuery,
  useTogglePinMutation,
  useUpsertFeedbackMutation,
  useGetHistoryQuotaQuery,
} = historyApiSlice

