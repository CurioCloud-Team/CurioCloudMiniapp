import { exerciseStore } from '../../../store/exerciseStore'
import { teachingStore } from '../../../store/teachingStore'

const questionTypes = [
  { label: '选择题', value: 'mcq' },
  { label: '填空题', value: 'fitb' },
  { label: '简答题', value: 'saq' }
]
const difficulties = ['easy', 'medium', 'hard']
const difficultyLabels = ['简单', '中等', '困难']

Page({
  data: {
    plans: [] as any[],
    planTitles: ['加载中'],
    planIndex: 0,
    questionTypes,
    typeIndex: 0,
    difficulties,
    difficultyLabels,
    difficultyIndex: 1,
    questionCount: 5,
    loading: false
  },

  async onShow() {
    const plans = await teachingStore.fetchLessonPlans()
    ;(this as any).setData({
      plans,
      planTitles: plans.length ? plans.map((p) => p.title) : ['暂无教案'],
      planIndex: 0
    })
  },

  onPlanChange(event: any) {
    ;(this as any).setData({ planIndex: Number(event.detail.value) })
  },

  onTypeSelect(event: any) {
    ;(this as any).setData({ typeIndex: Number(event.currentTarget.dataset.index) })
  },

  onTypeChange(event: any) {
    ;(this as any).setData({ typeIndex: Number(event.detail.value) })
  },

  onDifficultySelect(event: any) {
    ;(this as any).setData({ difficultyIndex: Number(event.currentTarget.dataset.index) })
  },

  onDifficultyChange(event: any) {
    ;(this as any).setData({ difficultyIndex: Number(event.detail.value) })
  },

  onCountChange(event: any) {
    ;(this as any).setData({ questionCount: Number(event.detail.value) })
  },

  async generate() {
    if (!this.data.plans.length) {
      wx.showToast({ title: '暂无教案', icon: 'none' })
      return
    }
    const planId = this.data.plans[this.data.planIndex].id
    const type = this.data.questionTypes[this.data.typeIndex].value as 'mcq' | 'fitb' | 'saq'
    const payload = { num_questions: this.data.questionCount, difficulty: this.data.difficulties[this.data.difficultyIndex] }
    ;(this as any).setData({ loading: true })
    try {
      await exerciseStore.generate(planId, type, payload as any)
      wx.navigateTo({ url: '/pages/exercise/result/index' })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '生成失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  }
})
