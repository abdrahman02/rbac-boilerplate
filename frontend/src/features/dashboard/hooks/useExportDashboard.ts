'use client'

import { useState } from 'react'
import { apiClient } from '@/shared/lib/api-client'

export function useExportDashboard(): {
  exportDashboard: () => Promise<void>
  isExporting: boolean
} {
  const [isExporting, setIsExporting] = useState(false)

  async function exportDashboard(): Promise<void> {
    setIsExporting(true)
    try {
      const res = await apiClient.get<Blob>('/dashboard/export', { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const date = new Date().toISOString().slice(0, 10)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `rbac-report-${date}.xlsx`
      anchor.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return { exportDashboard, isExporting }
}
