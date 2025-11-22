import { request } from '../utils/request'
import type {
  Question,
  GenerateMCQRequest,
  GenerateFITBRequest,
  GenerateSAQRequest
} from '../types/exercise'

export type { Question, GenerateMCQRequest, GenerateFITBRequest, GenerateSAQRequest }

export const generateMultipleChoiceQuestionsAPI = async (
  planId: number,
  payload: GenerateMCQRequest = { num_questions: 5, difficulty: 'medium' }
): Promise<Question[]> => {
  const { data } = await request<Question[]>({
    url: `/api/exercises/lesson-plan/${planId}/generate-multiple-choice`,
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '生成选择题'
  })
  return data
}

export const generateFillInTheBlankQuestionsAPI = async (
  planId: number,
  payload: GenerateFITBRequest = { num_questions: 5, difficulty: 'medium' }
): Promise<Question[]> => {
  const { data } = await request<Question[]>({
    url: `/api/exercises/lesson-plan/${planId}/generate-fill-in-the-blank`,
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '生成填空题'
  })
  return data
}

export const generateShortAnswerQuestionsAPI = async (
  planId: number,
  payload: GenerateSAQRequest = { num_questions: 5, difficulty: 'medium' }
): Promise<Question[]> => {
  const { data } = await request<Question[]>({
    url: `/api/exercises/lesson-plan/${planId}/generate-short-answer`,
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '生成简答题'
  })
  return data
}

export const getExercisesForLessonPlanAPI = async (planId: number): Promise<Question[]> => {
  const { data } = await request<Question[]>({
    url: `/api/exercises/lesson-plan/${planId}`,
    showLoading: true,
    loadingText: '加载习题'
  })
  return data
}

export const deleteExercisesForLessonPlanAPI = async (planId: number): Promise<void> => {
  await request({
    url: `/api/exercises/lesson-plan/${planId}`,
    method: 'DELETE',
    showLoading: true,
    loadingText: '清空习题'
  })
}
