import { userStore } from '../../../store/userStore'

const formFields = [
  { field: 'username', label: '用户名', placeholder: '请输入用户名' },
  { field: 'email', label: '邮箱', placeholder: '请输入邮箱' },
  { field: 'full_name', label: '姓名', placeholder: '请输入真实姓名' },
  { field: 'password', label: '密码', placeholder: '设置密码', password: true },
  { field: 'confirm_password', label: '确认密码', placeholder: '再次输入密码', password: true }
]

Page({
  data: {
    form: {
      username: '',
      email: '',
      full_name: '',
      password: '',
      confirm_password: ''
    },
    fields: formFields,
    loading: false
  },

  onInput(event: any) {
    const field = event.currentTarget.dataset.field
    ;(this as any).setData({ [`form.${field}`]: event.detail.value })
  },

  async handleSubmit() {
    if (this.data.loading) return
    const { username, email, password, confirm_password } = this.data.form
    if (!username || !email || !password || !confirm_password) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    if (password !== confirm_password) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }

    ;(this as any).setData({ loading: true })
    try {
      await userStore.register(this.data.form as any)
      wx.showToast({ title: '注册成功', icon: 'success' })
      wx.reLaunch({ url: '/pages/dashboard/home/index' })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '注册失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  gotoLogin() {
    wx.navigateBack({ delta: 1 })
  }
})
