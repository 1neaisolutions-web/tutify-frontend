import { apiRequest } from './client'

export interface VideoLibraryVideo {
  id: string
  title: string
  youtubeUrl: string
  gradeBand: string
  subject: string
  duration: string
  tags: string[]
  transcript: boolean
  bestQuizType: string
}

export interface VideoLibraryChannel {
  id: string
  name: string
  focus: string
  gradeBand: string
  videos: VideoLibraryVideo[]
}

export interface VideoRecommendationsResponse {
  channels: VideoLibraryChannel[]
}

export interface VideoDetailResponse extends VideoLibraryVideo {
  channelId: string
  channelName: string
  librarySubjectKey: string
}

export const getVideoRecommendations = () => {
  return apiRequest<VideoRecommendationsResponse>('/v1/videos/recommendations', {
    method: 'GET',
  })
}

export const getVideoById = (videoId: string) => {
  return apiRequest<VideoDetailResponse>(`/v1/videos/${encodeURIComponent(videoId)}`, {
    method: 'GET',
  })
}
