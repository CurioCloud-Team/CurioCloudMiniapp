import { exerciseStore } from '../../../store/exerciseStore'

Page({
  data: {
    questions: [] as any[],
    typeLabel: ''
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
    
    // 根据第一道题推断题型
    let typeLabel = '习题'
    if (formatted.length > 0) {
      const first = formatted[0]
      if (first.choices && first.choices.length > 0) {
        typeLabel = '选择题'
      } else if (first.blank_count || first.blanks) {
        typeLabel = '填空题'
      } else {
        typeLabel = '简答题'
      }
    }
    
    ;(this as any).setData({ 
      questions: formatted,
      typeLabel
    })
  },

  goBack() {
    wx.navigateBack()
  },

  backToAssistant() {
    wx.navigateBack({ delta: 1 })
  }
})
