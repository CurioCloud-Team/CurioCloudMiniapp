import type { QuestionCard } from './teaching'

export interface TeachingPlanChatMessage {
  type: 'ai' | 'user' | 'question'
  content?: string
  questionCard?: QuestionCard
}
