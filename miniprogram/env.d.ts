/// <reference path="../node_modules/miniprogram-api-typings/index.d.ts" />

declare interface IAppOption {
  globalData: {
    token: string | null
    userProfile: import('./types/auth').UserProfileResponse | null
    lessonPlansCache: import('./types/teaching').LessonPlan[]
    currentSessionId: string | null
    envConfig?: import('./utils/env').EnvConfig
  }
  setToken(token: string | null): void
  clearSession(): void
}
