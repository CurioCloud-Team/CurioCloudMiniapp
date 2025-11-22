import { tokenStorage, userProfileStorage } from './utils/storage'
import { getEnvConfig } from './utils/env'
import type { UserProfileResponse } from './types/auth'

App<IAppOption>({
  globalData: {
    token: null,
    userProfile: null,
    lessonPlansCache: [],
    currentSessionId: null,
    envConfig: undefined
  },

  onLaunch() {
    const envConfig = getEnvConfig()
    this.globalData.envConfig = envConfig

    const token = tokenStorage.get()
    if (token) {
      this.globalData.token = token
    }

    const profile = userProfileStorage.get<UserProfileResponse>()
    if (profile) {
      this.globalData.userProfile = profile
    }
  },

  setToken(token: string | null) {
    this.globalData.token = token
    if (token) {
      tokenStorage.set(token)
    } else {
      tokenStorage.clear()
    }
  },

  clearSession() {
    this.globalData.currentSessionId = null
  }
})
