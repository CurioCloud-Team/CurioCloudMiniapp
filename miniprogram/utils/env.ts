export interface EnvConfig {
  API_BASE_URL: string
  LANDPPT_API_BASE_URL: string
}

type EnvVersion = 'develop' | 'trial' | 'release'

const DEFAULT_CONFIG: Record<EnvVersion, EnvConfig> = {
  develop: {
    API_BASE_URL: 'http://localhost:8000',
    LANDPPT_API_BASE_URL: 'http://localhost:8001'
  },
  trial: {
    API_BASE_URL: 'https://api-staging.curiocloud.cn',
    LANDPPT_API_BASE_URL: 'https://ppt-staging.curiocloud.cn'
  },
  release: {
    API_BASE_URL: 'https://api.curiocloud.cn',
    LANDPPT_API_BASE_URL: 'https://ppt.curiocloud.cn'
  }
}

export const getEnvVersion = (): EnvVersion => {
  const info = wx.getAccountInfoSync?.()
  return (info?.miniProgram?.envVersion as EnvVersion) || 'develop'
}

export const getCustomConfig = (): Partial<EnvConfig> => {
  try {
  const { customConfig } = (wx.getEnterOptionsSync?.() as any) || {}
    if (customConfig) {
      return customConfig as EnvConfig
    }
  } catch (error) {
    console.warn('get custom config failed', error)
  }
  return {}
}

export const getEnvConfig = (): EnvConfig => {
  const envVersion = getEnvVersion()
  const fallback = DEFAULT_CONFIG[envVersion]
  const custom = getCustomConfig()
  return {
    API_BASE_URL: custom.API_BASE_URL || fallback.API_BASE_URL,
    LANDPPT_API_BASE_URL: custom.LANDPPT_API_BASE_URL || fallback.LANDPPT_API_BASE_URL
  }
}
