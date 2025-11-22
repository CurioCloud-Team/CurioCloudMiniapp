import { exerciseStore } from '../../../store/exerciseStore'

Page({
  data: {
    questions: [] as any[]
  },

  onShow() {
    const { questions } = exerciseStore.state
    const formatted = (questions || []).map((question: any) => ({
      ...question,
      choices: Array.isArray(question.choices)
        ? question.choices.map((choice: any, idx: number) => ({
            ...choice,
            label: String.fromCharCode(65 + idx)
          }))
        : null
    }))
    ;(this as any).setData({ questions: formatted })
  },

  backToAssistant() {
    wx.navigateBack({ delta: 1 })
  }
})
