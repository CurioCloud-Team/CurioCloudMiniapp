import { request } from '../utils/request'
import type { AnalysisUploadRequest, AnalysisReport, SavedReportSummary } from '../types/analysis'

export const uploadAnalysisDataAPI = async (payload: AnalysisUploadRequest): Promise<AnalysisReport> => {
  const { data } = await request<AnalysisReport>({
    url: '/api/analysis/upload',
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '生成报告'
  })
  return data
}

export const getSavedReportsAPI = async (): Promise<SavedReportSummary[]> => {
  const { data } = await request<SavedReportSummary[]>({
    url: '/api/analysis/reports'
  })
  return data
}

export const getAnalysisReportAPI = async (reportId: string): Promise<AnalysisReport> => {
  const { data } = await request<AnalysisReport>({
    url: `/api/analysis/reports/${reportId}`,
    showLoading: true,
    loadingText: '加载报告'
  })
  return data
}
