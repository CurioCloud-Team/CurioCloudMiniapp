export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type QuestionType = 'multiple_choice' | 'fill_in_the_blank' | 'short_answer'

export interface Choice {
  content: string
  is_correct: boolean
  id: number
  question_id: number
}

export interface Question {
  lesson_plan_id: number
  question_type: QuestionType
  difficulty: DifficultyLevel
  content: string
  answer?: string | null
  id: number
  choices?: Choice[]
}

export interface GenerateMCQRequest {
  num_questions?: number
  difficulty?: DifficultyLevel
}

export interface GenerateFITBRequest {
  num_questions?: number
  difficulty?: DifficultyLevel
}

export interface GenerateSAQRequest {
  num_questions?: number
  difficulty?: DifficultyLevel
}

export interface SavedExerciseResult {
  id: string
  outline_id: number
  outline_title: string
  exercises: Question[]
  saved_at: string
  created_at?: string
  total_count: number
}
