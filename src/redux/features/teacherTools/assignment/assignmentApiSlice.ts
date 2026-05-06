import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { ApiError, apiRequest } from '../../../../api/client'
import type {
  AssignmentApiItem,
  AssignmentCreatePayload,
  AssignmentDuplicateResponse,
  AssignmentGeneratePayload,
  AssignmentGenerateResponse,
  AssignmentListParams,
  AssignmentListResponse,
  AssignmentPatchPayload,
  RegeneratedLineResponse,
  RegeneratedTopicResponse,
} from '../../../../api/assignmentApi'

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

const BASE = '/v1/teacher-tools/assignments'

export const assignmentApiSlice = createApi({
  reducerPath: 'assignmentApi',
  baseQuery: baseQuery as BaseQueryFn<BaseQueryArgs, unknown, BaseQueryError>,
  tagTypes: ['Assignment', 'AssignmentList'],
  endpoints: (builder) => ({
    listAssignments: builder.query<AssignmentListResponse, AssignmentListParams | void>({
      query: (params) => ({
        path: BASE,
        options: { query: (params ?? {}) as Record<string, string | number | boolean | undefined> },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'AssignmentList' as const, id: 'LIST' },
              ...result.items.map((a) => ({ type: 'Assignment' as const, id: a.id })),
            ]
          : [{ type: 'AssignmentList' as const, id: 'LIST' }],
    }),

    getAssignment: builder.query<AssignmentApiItem, string>({
      query: (id) => ({ path: `${BASE}/${id}` }),
      providesTags: (_res, _err, id) => [{ type: 'Assignment', id }],
    }),

    createAssignment: builder.mutation<AssignmentApiItem, AssignmentCreatePayload>({
      query: (payload) => ({ path: BASE, options: { method: 'POST', body: payload } }),
      invalidatesTags: [{ type: 'AssignmentList', id: 'LIST' }],
    }),

    patchAssignment: builder.mutation<AssignmentApiItem, { id: string; patch: AssignmentPatchPayload }>({
      query: ({ id, patch }) => ({
        path: `${BASE}/${id}`,
        options: { method: 'PATCH', body: patch },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Assignment', id: arg.id },
        { type: 'AssignmentList', id: 'LIST' },
      ],
    }),

    deleteAssignment: builder.mutation<void, string>({
      query: (id) => ({ path: `${BASE}/${id}`, options: { method: 'DELETE' } }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Assignment', id },
        { type: 'AssignmentList', id: 'LIST' },
      ],
    }),

    duplicateAssignment: builder.mutation<AssignmentDuplicateResponse, string>({
      query: (id) => ({ path: `${BASE}/${id}/duplicate`, options: { method: 'POST' } }),
      invalidatesTags: [{ type: 'AssignmentList', id: 'LIST' }],
    }),

    generateAssignment: builder.mutation<
      AssignmentGenerateResponse,
      { id: string; payload: AssignmentGeneratePayload; idempotencyKey: string }
    >({
      query: ({ id, payload, idempotencyKey }) => ({
        path: `${BASE}/${id}/generate`,
        options: { method: 'POST', body: payload, headers: { 'Idempotency-Key': idempotencyKey } },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Assignment', id: arg.id },
        { type: 'AssignmentList', id: 'LIST' },
      ],
    }),

    regenerateTopic: builder.mutation<
      RegeneratedTopicResponse,
      { assignmentId: string; topicId: string; topicTitle: string }
    >({
      query: ({ assignmentId, topicId, topicTitle }) => ({
        path: `${BASE}/${assignmentId}/topics/regenerate`,
        options: { method: 'POST', body: { topicId, topicTitle } },
      }),
    }),

    regenerateLine: builder.mutation<
      RegeneratedLineResponse,
      { assignmentId: string; topicId: string; topicTitle: string; lineIndex: number }
    >({
      query: ({ assignmentId, topicId, topicTitle, lineIndex }) => ({
        path: `${BASE}/${assignmentId}/lines/regenerate`,
        options: { method: 'POST', body: { topicId, topicTitle, lineIndex } },
      }),
    }),
  }),
})

export const {
  useListAssignmentsQuery,
  useLazyListAssignmentsQuery,
  useGetAssignmentQuery,
  useLazyGetAssignmentQuery,
  useCreateAssignmentMutation,
  usePatchAssignmentMutation,
  useDeleteAssignmentMutation,
  useDuplicateAssignmentMutation,
  useGenerateAssignmentMutation,
  useRegenerateTopicMutation,
  useRegenerateLineMutation,
} = assignmentApiSlice
