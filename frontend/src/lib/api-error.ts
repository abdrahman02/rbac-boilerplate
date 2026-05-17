import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  error?: string
  message?: string
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  const axiosError = error as AxiosError<ApiErrorResponse>
  if (axiosError?.response?.data?.error) {
    return axiosError.response.data.error
  }

  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message
  }

  if (axiosError?.message) {
    return axiosError.message
  }

  return 'An unexpected error occurred'
}
