export type PPTExportFormat = 'pdf' | 'pptx'

export interface PPTExportRequest {
  ppt_project_id: string
  export_format: PPTExportFormat
}

export interface PPTProjectInfo {
  project_id: string
  title: string
  scenario?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at?: string
}

export interface PPTGenerationResponse {
  success: boolean
  ppt_project_id: string | null
  ppt_title: string | null
  ppt_scenario: string | null
  message: string
}

export interface PPTStatusResponse {
  ppt_project_id: string
  status: Record<string, any>
}

export interface PPTSlidesResponse {
  project_id: string
  title: string
  slides_html: string | null
  slides_data: object[]
  slides_count: number
}
