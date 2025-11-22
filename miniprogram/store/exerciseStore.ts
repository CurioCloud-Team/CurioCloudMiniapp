import {
  generateMultipleChoiceQuestionsAPI,
  generateFillInTheBlankQuestionsAPI,
  generateShortAnswerQuestionsAPI,
  getExercisesForLessonPlanAPI,
  deleteExercisesForLessonPlanAPI
} from '../services/exercise'
import type { Question, GenerateMCQRequest, GenerateFITBRequest, GenerateSAQRequest } from '../types/exercise'

export interface ExerciseState {
  planId: number | null
  questions: Question[]
}

class ExerciseStore {
  state: ExerciseState = {
    planId: null,
    questions: []
  }

  setQuestions(planId: number, questions: Question[]) {
    this.state = { planId, questions }
  }

  async generate(planId: number, type: 'mcq' | 'fitb' | 'saq', payload?: GenerateMCQRequest | GenerateFITBRequest | GenerateSAQRequest) {
    let questions: Question[] = []
    if (type === 'mcq') {
      questions = await generateMultipleChoiceQuestionsAPI(planId, payload as GenerateMCQRequest)
    } else if (type === 'fitb') {
      questions = await generateFillInTheBlankQuestionsAPI(planId, payload as GenerateFITBRequest)
    } else {
      questions = await generateShortAnswerQuestionsAPI(planId, payload as GenerateSAQRequest)
    }
    this.setQuestions(planId, questions)
    return questions
  }

  async fetch(planId: number) {
    const questions = await getExercisesForLessonPlanAPI(planId)
    this.setQuestions(planId, questions)
    return questions
  }

  async clear(planId: number) {
    await deleteExercisesForLessonPlanAPI(planId)
    if (this.state.planId === planId) {
      this.state = { planId: null, questions: [] }
    }
  }
}

export const exerciseStore = new ExerciseStore()
