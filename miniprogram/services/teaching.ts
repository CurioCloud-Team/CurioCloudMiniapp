import { request } from '../utils/request'
import type {
  StartConversationRequest,
  StartConversationResponse,
  ProcessAnswerRequest,
  ProcessAnswerResponse,
  LessonPlan,
  LessonPlanListResponse,
  SessionInfo
} from '../types/teaching'
import type { PPTGenerationResponse, PPTStatusResponse, PPTSlidesResponse } from '../types/ppt'
import type { LessonPlanActivity } from '../types/teaching'

export type {
  StartConversationRequest,
  StartConversationResponse,
  ProcessAnswerRequest,
  ProcessAnswerResponse,
  LessonPlan,
  LessonPlanListResponse,
  SessionInfo,
  LessonPlanActivity
}
export type { PPTGenerationResponse, PPTStatusResponse, PPTSlidesResponse }

export const startConversationAPI = async (
  payload: StartConversationRequest = { use_dynamic_mode: true }
): Promise<StartConversationResponse> => {
  const { data } = await request<StartConversationResponse>({
    url: '/api/teaching/conversational/start',
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '创建会话'
  })
  return data
}

export const processAnswerAPI = async (payload: ProcessAnswerRequest): Promise<ProcessAnswerResponse> => {
  const { data } = await request<ProcessAnswerResponse>({
    url: '/api/teaching/conversational/next',
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '生成下一步'
  })
  return data
}

export const getLessonPlansAPI = async (): Promise<LessonPlanListResponse[]> => {
  const { data } = await request<LessonPlanListResponse[]>({
    url: '/api/teaching/lesson-plans'
  })
  return data
}

export const getLessonPlanAPI = async (planId: number): Promise<LessonPlan> => {
  const { data } = await request<LessonPlan>({
    url: `/api/teaching/lesson-plans/${planId}`,
    showLoading: true,
    loadingText: '加载教案'
  })
  return data
}

export const deleteLessonPlanAPI = async (planId: number): Promise<void> => {
  await request({
    url: `/api/teaching/lesson-plans/${planId}`,
    method: 'DELETE',
    showLoading: true,
    loadingText: '删除中'
  })
}

export interface LessonPlanPayload {
  title: string
  subject: string
  grade: string
  teaching_objective: string
  teaching_outline: string
  activities: LessonPlanActivity[]
}

export const createLessonPlanAPI = async (payload: LessonPlanPayload): Promise<LessonPlan> => {
  const { data } = await request<LessonPlan>({
    url: '/api/teaching/lesson-plans',
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '保存教案'
  })
  return data
}

export const updateLessonPlanAPI = async (planId: number, payload: LessonPlanPayload): Promise<LessonPlan> => {
  const { data } = await request<LessonPlan>({
    url: `/api/teaching/lesson-plans/${planId}`,
    method: 'PUT',
    data: payload,
    showLoading: true,
    loadingText: '更新教案'
  })
  return data
}

export const generatePPTFromLessonPlanAPI = async (planId: number): Promise<PPTGenerationResponse> => {
  const { data } = await request<PPTGenerationResponse>({
    url: `/api/teaching/lesson-plans/${planId}/generate-ppt`,
    method: 'POST',
    showLoading: true,
    loadingText: '生成PPT'
  })
  return data
}

export const getPPTStatusAPI = async (pptProjectId: string): Promise<PPTStatusResponse> => {
  const { data } = await request<PPTStatusResponse>({
    url: `/api/teaching/ppt/${pptProjectId}/status`
  })
  return data
}

export const getPPTSlidesAPI = async (pptProjectId: string): Promise<PPTSlidesResponse> => {
  const { data } = await request<PPTSlidesResponse>({
    url: `/api/teaching/ppt/${pptProjectId}/slides`,
    showLoading: true,
    loadingText: '加载PPT'
  })
  return data
}

export const exportPPTFileAPI = async (pptProjectId: string, exportFormat: 'pdf' | 'pptx'): Promise<ArrayBuffer> => {
  const { data } = await request<ArrayBuffer>({
    url: `/api/teaching/ppt/${pptProjectId}/export/${exportFormat}`,
    method: 'GET',
    header: {
      Accept: 'application/octet-stream'
    },
    showLoading: true,
    loadingText: '导出中'
  })
  return data
}

export const getActiveSessionsAPI = async (): Promise<SessionInfo[]> => {
  const { data } = await request<SessionInfo[]>({
    url: '/api/sessions/active'
  })
  return data
}

export const getSessionInfoAPI = async (sessionId: string): Promise<SessionInfo> => {
  const { data } = await request<SessionInfo>({
    url: `/api/sessions/${sessionId}`
  })
  return data
}

export const deleteSessionAPI = async (sessionId: string): Promise<void> => {
  await request({
    url: `/api/sessions/${sessionId}`,
    method: 'DELETE'
  })
}
