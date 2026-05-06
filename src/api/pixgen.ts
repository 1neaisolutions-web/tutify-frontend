import { apiRequest } from './client'

export interface PixGenGenerateRequest {
  prompt: string
  stylePreset: string
  aspectRatio: string
}

export interface PixGenGenerateBatchRequest extends PixGenGenerateRequest {
  batchSize: number
}

export interface PixGenGenerationResponse {
  id: string
  imageUrl: string | null
  status: string
  createdAt: string
}

/** GET /v1/pixgen/generations/:id — restore saved generation */
export interface PixGenGenerationDetailResponse extends PixGenGenerationResponse {
  prompt: string
  stylePreset: string
  aspectRatio: string
}

export interface PixGenBatchResponse {
  items: PixGenGenerationResponse[]
}

export async function generatePixGenImage(
  payload: PixGenGenerateRequest
): Promise<PixGenGenerationResponse> {
  return apiRequest<PixGenGenerationResponse>('v1/generate', {
    method: 'POST',
    body: payload,
    timeout: 120000,
  })
}

export async function generatePixGenBatch(
  payload: PixGenGenerateBatchRequest
): Promise<PixGenBatchResponse> {
  return apiRequest<PixGenBatchResponse>('v1/generate-batch', {
    method: 'POST',
    body: payload,
    timeout: 120000,
  })
}

export async function fetchPixGenGeneration(generationId: string): Promise<PixGenGenerationDetailResponse> {
  return apiRequest<PixGenGenerationDetailResponse>(`v1/pixgen/generations/${generationId}`)
}
