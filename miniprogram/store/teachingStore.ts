import {
  getLessonPlansAPI,
  getLessonPlanAPI,
  startConversationAPI,
  processAnswerAPI,
  deleteLessonPlanAPI,
  generatePPTFromLessonPlanAPI
} from '../services/teaching'
import type {
  LessonPlanListResponse,
  LessonPlan,
  StartConversationResponse,
  ProcessAnswerResponse
} from '../types/teaching'

export type LessonPlanListener = (plans: LessonPlanListResponse[]) => void

class TeachingStore {
  private list: LessonPlanListResponse[] = []
  private listeners: Set<LessonPlanListener> = new Set()

  get cachedList() {
    return this.list
  }

  subscribe(listener: LessonPlanListener): () => void {
    this.listeners.add(listener)
    listener(this.list)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.list))
  }

  async fetchLessonPlans(force = false) {
    if (this.list.length && !force) {
      return this.list
    }
    const plans = await getLessonPlansAPI()
    this.list = plans
    getApp<IAppOption>().globalData.lessonPlansCache = plans as unknown as LessonPlan[]
    this.notify()
    return plans
  }

  async fetchLessonPlan(planId: number): Promise<LessonPlan> {
    return getLessonPlanAPI(planId)
  }

  async startConversation() {
    const response: StartConversationResponse = await startConversationAPI()
    getApp<IAppOption>().globalData.currentSessionId = response.session_id
    return response
  }

  async nextQuestion(payload: { session_id: string; answer: string }): Promise<ProcessAnswerResponse> {
    const response = await processAnswerAPI(payload)
    if (response.lesson_plan) {
      await this.fetchLessonPlans(true)
    }
    return response
  }

  async removeLessonPlan(planId: number) {
    await deleteLessonPlanAPI(planId)
    this.list = this.list.filter((plan) => plan.id !== planId)
    this.notify()
  }

  async generatePPT(planId: number) {
    return generatePPTFromLessonPlanAPI(planId)
  }
}

export const teachingStore = new TeachingStore()
