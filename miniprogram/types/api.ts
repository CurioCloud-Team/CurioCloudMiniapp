export interface ApiResponse<T = any> {
  data: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  code?: string | number
  details?: any
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}
