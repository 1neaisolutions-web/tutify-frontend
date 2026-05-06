import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { ApiError, apiRequest } from '../../../../api/client'
import type {
  DuplicateResponse,
  GenerateResponse,
  QuizApiItem,
  QuizCreatePayload,
  QuizGeneratePayload,
  QuizListParams,
  QuizListResponse,
  QuizPatchPayload,
  QuizQuestionCreatePayload,
  QuizQuestionPatchPayload,
  QuizReorderItem,
} from '../../../../api/quizApi'

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

const BASE = '/v1/teacher-tools/quizzes'

export const quizApiSlice = createApi({
  reducerPath: 'quizApi',
  baseQuery: baseQuery as BaseQueryFn<BaseQueryArgs, unknown, BaseQueryError>,
  tagTypes: ['Quiz', 'QuizList'],
  endpoints: (builder) => ({
    listQuizzes: builder.query<QuizListResponse, QuizListParams | void>({
      query: (params) => ({
        path: BASE,
        options: { query: (params ?? {}) as Record<string, string | number | boolean | undefined> },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'QuizList', id: 'LIST' },
              ...result.items.map((q) => ({ type: 'Quiz' as const, id: q.id })),
            ]
          : [{ type: 'QuizList', id: 'LIST' }],
    }),

    getQuiz: builder.query<QuizApiItem, string>({
      query: (id) => ({ path: `${BASE}/${id}` }),
      providesTags: (_res, _err, id) => [{ type: 'Quiz', id }],
    }),

    createQuiz: builder.mutation<QuizApiItem, QuizCreatePayload>({
      query: (payload) => ({ path: BASE, options: { method: 'POST', body: payload } }),
      invalidatesTags: [{ type: 'QuizList', id: 'LIST' }],
    }),

    patchQuiz: builder.mutation<QuizApiItem, { id: string; patch: QuizPatchPayload }>({
      query: ({ id, patch }) => ({ path: `${BASE}/${id}`, options: { method: 'PATCH', body: patch } }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Quiz', id: arg.id },
        { type: 'QuizList', id: 'LIST' },
      ],
    }),

    deleteQuiz: builder.mutation<void, string>({
      query: (id) => ({ path: `${BASE}/${id}`, options: { method: 'DELETE' } }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Quiz', id },
        { type: 'QuizList', id: 'LIST' },
      ],
    }),

    duplicateQuiz: builder.mutation<DuplicateResponse, string>({
      query: (id) => ({ path: `${BASE}/${id}/duplicate`, options: { method: 'POST' } }),
      invalidatesTags: [{ type: 'QuizList', id: 'LIST' }],
    }),

    generateQuiz: builder.mutation<
      GenerateResponse,
      { id: string; payload: QuizGeneratePayload; idempotencyKey: string }
    >({
      query: ({ id, payload, idempotencyKey }) => ({
        path: `${BASE}/${id}/generate`,
        options: { method: 'POST', body: payload, headers: { 'Idempotency-Key': idempotencyKey } },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Quiz', id: arg.id },
        { type: 'QuizList', id: 'LIST' },
      ],
    }),

    // ─── Per-question ops ────────────────────────────────────────────────────

    addQuestion: builder.mutation<QuizApiItem, { quizId: string; q: QuizQuestionCreatePayload }>({
      query: ({ quizId, q }) => ({
        path: `${BASE}/${quizId}/questions`,
        options: { method: 'POST', body: q },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Quiz', id: arg.quizId }],
    }),

    patchQuestion: builder.mutation<
      QuizApiItem,
      { quizId: string; questionId: string; patch: QuizQuestionPatchPayload }
    >({
      query: ({ quizId, questionId, patch }) => ({
        path: `${BASE}/${quizId}/questions/${questionId}`,
        options: { method: 'PATCH', body: patch },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Quiz', id: arg.quizId }],
    }),

    deleteQuestion: builder.mutation<QuizApiItem, { quizId: string; questionId: string }>({
      query: ({ quizId, questionId }) => ({
        path: `${BASE}/${quizId}/questions/${questionId}`,
        options: { method: 'DELETE' },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Quiz', id: arg.quizId }],
    }),

    reorderQuestions: builder.mutation<QuizApiItem, { quizId: string; order: QuizReorderItem[] }>({
      query: ({ quizId, order }) => ({
        path: `${BASE}/${quizId}/questions/reorder`,
        options: { method: 'PATCH', body: { order } },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Quiz', id: arg.quizId }],
    }),

    regenerateQuestion: builder.mutation<QuizApiItem, { quizId: string; questionId: string }>({
      query: ({ quizId, questionId }) => ({
        path: `${BASE}/${quizId}/questions/${questionId}/regenerate`,
        options: { method: 'POST' },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Quiz', id: arg.quizId }],
    }),
  }),
})

export const {
  useListQuizzesQuery,
  useLazyListQuizzesQuery,
  useGetQuizQuery,
  useLazyGetQuizQuery,
  useCreateQuizMutation,
  usePatchQuizMutation,
  useDeleteQuizMutation,
  useDuplicateQuizMutation,
  useGenerateQuizMutation,
  useAddQuestionMutation,
  usePatchQuestionMutation,
  useDeleteQuestionMutation,
  useReorderQuestionsMutation,
  useRegenerateQuestionMutation,
} = quizApiSlice

