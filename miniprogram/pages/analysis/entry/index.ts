import { uploadAnalysisDataAPI } from '../../../services/analysis'

interface ParsedEntries {
  students: string[]
  scores: number[]
}

Page({
  data: {
    examName: '',
    subject: '',
    rawEntries: '',
    loading: false
  },

  onExamNameInput(event: any): void {
    ;(this as any).setData({ examName: event.detail.value })
  },

  onSubjectInput(event: any): void {
    ;(this as any).setData({ subject: event.detail.value })
  },

  onEntriesInput(event: any): void {
    ;(this as any).setData({ rawEntries: event.detail.value })
  },

  parseEntries(): ParsedEntries {
    const lines = this.data.rawEntries
      .split(/\n|\r/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (!lines.length) {
      throw new Error('请输入至少一条成绩记录')
    }

    const students: string[] = []
    const scores: number[] = []

    lines.forEach((line, index) => {
      const pieces = line.split(/[，,]/).map((item) => item.trim()).filter(Boolean)
      if (pieces.length < 2) {
        throw new Error(`第 ${index + 1} 行格式错误，示例：张三,90`)
      }
      const scoreRaw = pieces.pop()!
      const score = Number(scoreRaw)
      if (Number.isNaN(score)) {
        throw new Error(`第 ${index + 1} 行分数无法识别`)
      }
      const name = pieces.join(' ')
      if (!name) {
        throw new Error(`第 ${index + 1} 行缺少姓名`)
      }
      students.push(name)
      scores.push(score)
    })

    return { students, scores }
  },

  async submit() {
    try {
      const { students, scores } = this.parseEntries()
      ;(this as any).setData({ loading: true })
      const report = await uploadAnalysisDataAPI({
        students,
        scores,
        exam_name: this.data.examName || undefined,
        subject: this.data.subject || undefined
      })
      wx.navigateTo({
        url: `/pages/analysis/result/index?reportId=${report.id}`,
        success: (res: any) => {
          res.eventChannel.emit('report:payload', report)
        }
      })
      ;(this as any).setData({ rawEntries: '', examName: '', subject: '' })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '生成失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  goSavedReports() {
    if (this.data.loading) return
    wx.navigateTo({ url: '/pages/analysis/saved-reports/index' })
  }
})
