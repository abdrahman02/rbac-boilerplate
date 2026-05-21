'use client'

import { useState } from 'react'
import { useAuditLogs } from '@/features/audit-logs/hooks/useAuditLogs'
import { Button, Input } from '@/shared/components/ui'

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [action, setAction] = useState('')
  const [resourceType, setResourceType] = useState('')

  const { data, isLoading } = useAuditLogs({
    page,
    limit: 20,
    action: action || undefined,
    resourceType: resourceType || undefined,
  })

  const logs = data?.data ?? []
  const meta = data?.meta

  const handleFilterChange = () => setPage(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">
          {meta ? `${meta.total} total entries` : ''}
        </p>
      </div>

      <div className="flex gap-3 rounded-lg border bg-white p-4 shadow-sm">
        <Input
          placeholder="Filter by action (e.g. create_user)"
          value={action}
          onChange={(e) => {
            setAction(e.target.value)
            handleFilterChange()
          }}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by resource (e.g. user)"
          value={resourceType}
          onChange={(e) => {
            setResourceType(e.target.value)
            handleFilterChange()
          }}
          className="max-w-xs"
        />
        {(action || resourceType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAction('')
              setResourceType('')
              setPage(1)
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Action', 'Resource', 'Resource ID', 'IP Address', 'When'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.resourceType}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.resourceId ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.ipAddress ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.total > meta.limit && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Page {meta.page} of {Math.ceil(meta.total / meta.limit)}</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
