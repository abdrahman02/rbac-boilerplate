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
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10)
      const timeStr = now.toISOString().slice(11, 19).replace(/:/g, '-')
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `rbac-report-${dateStr}-${timeStr}.xlsx`
      anchor.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return { exportDashboard, isExporting }
}
