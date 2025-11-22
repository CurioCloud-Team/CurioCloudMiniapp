import { request } from '../utils/request'
import { getEnvConfig } from '../utils/env'
import type { PPTGenerationResponse, PPTStatusResponse, PPTSlidesResponse } from './teaching'
import type { PPTProjectInfo } from '../types/ppt'

export { generatePPTFromLessonPlanAPI, getPPTStatusAPI, getPPTSlidesAPI, exportPPTFileAPI } from './teaching'

const landpptBaseUrl = () => getEnvConfig().LANDPPT_API_BASE_URL

export interface ProjectListResponse {
  projects: PPTProjectInfo[]
  total: number
  page: number
  page_size: number
}

export const getPPTProjectsAPI = async (
  page = 1,
  pageSize = 10,
  status?: string
): Promise<ProjectListResponse> => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  if (status) {
    params.append('status', status)
  }
  const { data } = await request<ProjectListResponse>({
    url: `${landpptBaseUrl()}/api/projects?${params.toString()}`
  })
  return data
}

export const getPPTProjectAPI = async (projectId: string): Promise<PPTProjectInfo> => {
  const { data } = await request<PPTProjectInfo>({
    url: `${landpptBaseUrl()}/api/projects/${projectId}`,
    showLoading: true,
    loadingText: '加载项目'
  })
  return data
}

export const deletePPTProjectAPI = async (projectId: string): Promise<void> => {
  await request({
    url: `${landpptBaseUrl()}/api/projects/${projectId}`,
    method: 'DELETE',
    showLoading: true,
    loadingText: '删除PPT'
  })
}

export type { PPTGenerationResponse, PPTStatusResponse, PPTSlidesResponse }
