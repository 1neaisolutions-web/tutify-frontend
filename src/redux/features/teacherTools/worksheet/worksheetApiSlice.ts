import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { ApiError, apiRequest } from '../../../../api/client'
import type {
  BlockReorderItem,
  DuplicateResponse,
  SessionReorderItem,
  WorksheetApiItem,
  WorksheetBlockCreatePayload,
  WorksheetBlockPatchPayload,
  WorksheetCreatePayload,
  WorksheetGeneratePayload,
  WorksheetGenerateResponse,
  WorksheetListParams,
  WorksheetListResponse,
  WorksheetPatchPayload,
  WorksheetSessionCreatePayload,
  WorksheetSessionPatchPayload,
} from '../../../../api/worksheetApi'

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

const BASE = '/v1/teacher-tools/worksheets'

export const worksheetApiSlice = createApi({
  reducerPath: 'worksheetApi',
  baseQuery: baseQuery as BaseQueryFn<BaseQueryArgs, unknown, BaseQueryError>,
  tagTypes: ['Worksheet', 'WorksheetList'],
  endpoints: (builder) => ({
    listWorksheets: builder.query<WorksheetListResponse, WorksheetListParams | void>({
      query: (params) => ({
        path: BASE,
        options: { query: (params ?? {}) as Record<string, string | number | boolean | undefined> },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'WorksheetList' as const, id: 'LIST' },
              ...result.items.map((w) => ({ type: 'Worksheet' as const, id: w.id })),
            ]
          : [{ type: 'WorksheetList' as const, id: 'LIST' }],
    }),

    getWorksheet: builder.query<WorksheetApiItem, string>({
      query: (id) => ({ path: `${BASE}/${id}` }),
      providesTags: (_res, _err, id) => [{ type: 'Worksheet', id }],
    }),

    createWorksheet: builder.mutation<WorksheetApiItem, WorksheetCreatePayload>({
      query: (payload) => ({ path: BASE, options: { method: 'POST', body: payload } }),
      invalidatesTags: [{ type: 'WorksheetList', id: 'LIST' }],
    }),

    patchWorksheet: builder.mutation<WorksheetApiItem, { id: string; patch: WorksheetPatchPayload }>({
      query: ({ id, patch }) => ({ path: `${BASE}/${id}`, options: { method: 'PATCH', body: patch } }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Worksheet', id: arg.id },
        { type: 'WorksheetList', id: 'LIST' },
      ],
    }),

    deleteWorksheet: builder.mutation<void, string>({
      query: (id) => ({ path: `${BASE}/${id}`, options: { method: 'DELETE' } }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Worksheet', id },
        { type: 'WorksheetList', id: 'LIST' },
      ],
    }),

    duplicateWorksheet: builder.mutation<DuplicateResponse, string>({
      query: (id) => ({ path: `${BASE}/${id}/duplicate`, options: { method: 'POST' } }),
      invalidatesTags: [{ type: 'WorksheetList', id: 'LIST' }],
    }),

    generateWorksheet: builder.mutation<
      WorksheetGenerateResponse,
      { id: string; payload: WorksheetGeneratePayload; idempotencyKey: string }
    >({
      query: ({ id, payload, idempotencyKey }) => ({
        path: `${BASE}/${id}/generate`,
        options: { method: 'POST', body: payload, headers: { 'Idempotency-Key': idempotencyKey } },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Worksheet', id: arg.id },
        { type: 'WorksheetList', id: 'LIST' },
      ],
    }),

    addWorksheetSession: builder.mutation<WorksheetApiItem, { worksheetId: string; payload: WorksheetSessionCreatePayload }>({
      query: ({ worksheetId, payload }) => ({
        path: `${BASE}/${worksheetId}/sessions`,
        options: { method: 'POST', body: payload },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    patchWorksheetSession: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; sessionId: string; patch: WorksheetSessionPatchPayload }
    >({
      query: ({ worksheetId, sessionId, patch }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}`,
        options: { method: 'PATCH', body: patch },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    deleteWorksheetSession: builder.mutation<WorksheetApiItem, { worksheetId: string; sessionId: string }>({
      query: ({ worksheetId, sessionId }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}`,
        options: { method: 'DELETE' },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    reorderWorksheetSessions: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; order: SessionReorderItem[] }
    >({
      query: ({ worksheetId, order }) => ({
        path: `${BASE}/${worksheetId}/sessions/reorder`,
        options: { method: 'PATCH', body: { order } },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    addWorksheetBlock: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; sessionId: string; block: WorksheetBlockCreatePayload }
    >({
      query: ({ worksheetId, sessionId, block }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}/blocks`,
        options: { method: 'POST', body: block },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    patchWorksheetBlock: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; sessionId: string; blockId: string; patch: WorksheetBlockPatchPayload }
    >({
      query: ({ worksheetId, sessionId, blockId, patch }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}/blocks/${blockId}`,
        options: { method: 'PATCH', body: patch },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    deleteWorksheetBlock: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; sessionId: string; blockId: string }
    >({
      query: ({ worksheetId, sessionId, blockId }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}/blocks/${blockId}`,
        options: { method: 'DELETE' },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    reorderWorksheetBlocks: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; sessionId: string; order: BlockReorderItem[] }
    >({
      query: ({ worksheetId, sessionId, order }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}/blocks/reorder`,
        options: { method: 'PATCH', body: { order } },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),

    regenerateWorksheetBlock: builder.mutation<
      WorksheetApiItem,
      { worksheetId: string; sessionId: string; blockId: string }
    >({
      query: ({ worksheetId, sessionId, blockId }) => ({
        path: `${BASE}/${worksheetId}/sessions/${sessionId}/blocks/${blockId}/regenerate`,
        options: { method: 'POST' },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Worksheet', id: arg.worksheetId }],
    }),
  }),
})

export const {
  useListWorksheetsQuery,
  useLazyListWorksheetsQuery,
  useGetWorksheetQuery,
  useLazyGetWorksheetQuery,
  useCreateWorksheetMutation,
  usePatchWorksheetMutation,
  useDeleteWorksheetMutation,
  useDuplicateWorksheetMutation,
  useGenerateWorksheetMutation,
  useAddWorksheetSessionMutation,
  usePatchWorksheetSessionMutation,
  useDeleteWorksheetSessionMutation,
  useReorderWorksheetSessionsMutation,
  useAddWorksheetBlockMutation,
  usePatchWorksheetBlockMutation,
  useDeleteWorksheetBlockMutation,
  useReorderWorksheetBlocksMutation,
  useRegenerateWorksheetBlockMutation,
} = worksheetApiSlice
