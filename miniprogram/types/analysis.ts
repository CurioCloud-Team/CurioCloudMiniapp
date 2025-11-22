export interface AnalysisUploadRequest {
  students: string[]
  scores: number[]
  exam_name?: string
  subject?: string
}

export interface AnalysisSummary {
  average_score: number
  highest_score: number
  lowest_score: number
  pass_rate: number
  distribution: Array<{ range: string; count: number }>
}

export interface AnalysisInsight {
  title: string
  description: string
  suggestions: string[]
}

export interface AnalysisReport {
  id: string
  title: string
  created_at: string
  student_count: number
  summary: AnalysisSummary
  insights: AnalysisInsight[]
  recommended_actions: string[]
}

export interface SavedReportSummary {
  id: string
  title: string
  date: string
  student_count: number
}
