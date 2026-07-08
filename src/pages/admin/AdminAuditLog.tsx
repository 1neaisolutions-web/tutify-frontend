import { useCallback, useEffect, useState } from 'react'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import { getAuditLogs, type AuditLogEntry } from '@/api/admin'

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAuditLogs({ page: pagination.page + 1, page_size: pagination.pageSize })
      setLogs(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => { load() }, [load])

  const exportCsv = () => {
    const header = 'id,event_type,description,actor_user_id,created_at\n'
    const rows = logs.map((l) => `${l.id},${l.event_type},"${l.description.replace(/"/g, '""')}",${l.actor_user_id ?? ''},${l.created_at}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit-logs.csv'
    a.click()
  }

  const columns: GridColDef[] = [
    { field: 'created_at', headerName: 'Time', width: 170, valueFormatter: (v) => new Date(v as string).toLocaleString() },
    { field: 'event_type', headerName: 'Event', width: 140 },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 250 },
    { field: 'actor_user_id', headerName: 'Actor', width: 120 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="text-sm text-gray-500">Security and compliance event history</p>
        </div>
        <button onClick={exportCsv} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Export CSV</button>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid rows={logs} columns={columns} getRowId={(r) => r.id} loading={loading}
          rowCount={total} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} />
      </div>
    </div>
  )
}
