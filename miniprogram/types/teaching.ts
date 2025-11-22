export interface StartConversationRequest {
  use_dynamic_mode?: boolean | null
}

export interface StartConversationResponse {
  session_id: string
  question_card: QuestionCard
  is_dynamic_mode: boolean
}

export interface ProcessAnswerRequest {
  session_id: string
  answer: string
}

export interface ProcessAnswerResponse {
  session_id: string
  status: string
  is_dynamic_mode: boolean
  question_card?: QuestionCard | null
  lesson_plan?: LessonPlan | null
}

export interface SessionInfo {
  session_id: string
  status: string
  is_dynamic_mode: boolean
  question_count: number
  max_questions: number
  current_step?: string | null
  collected_data: Record<string, any>
  created_at: string
}

export interface QuestionCard {
  step_key: string
  question: string
  options: string[]
  allows_free_text: boolean
}

export interface LessonPlan {
  id: number
  title: string
  subject: string
  grade: string
  teaching_objective: string
  teaching_outline: string
  activities: LessonPlanActivity[]
  created_at: string | null
  web_search_info?: Record<string, any> | null
}

export interface LessonPlanActivity {
  activity_name: string
  description: string
  duration: number
  order_index: number
}

export interface LessonPlanListResponse {
  id: number
  title: string
  subject: string
  grade: string
  created_at: string
}
