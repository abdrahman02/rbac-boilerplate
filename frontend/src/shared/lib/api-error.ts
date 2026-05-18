import axios, { type AxiosError } from 'axios'

interface ApiErrorResponse {
  error?: string
  message?: string
}

// AxiosError extends Error, so must check isAxiosError first
// to extract the API response body instead of the generic Axios message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    return (
      axiosError.response?.data?.message ??
      axiosError.response?.data?.error ??
      axiosError.message
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
