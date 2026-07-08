import { useCallback, useEffect, useState } from 'react'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import ConfirmActionModal from '@/components/admin/ConfirmActionModal'
import { getComplianceRequests, createComplianceRequest, type ComplianceRequest } from '@/api/admin'
import { CustomButton } from '@/components/shared'

export default function AdminComplianceRequests() {
  const [requests, setRequests] = useState<ComplianceRequest[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })
  const [showCreate, setShowCreate] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getComplianceRequests({ page: pagination.page + 1, page_size: pagination.pageSize })
      setRequests(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => { load() }, [load])

  const handleCreate = async (reason: string) => {
    setActionLoading(true)
    try {
      await createComplianceRequest({ reason, request_type: 'data_export' })
      setShowCreate(false)
      load()
    } finally {
      setActionLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'created_at', headerName: 'Created', width: 170, valueFormatter: (v) => new Date(v as string).toLocaleString() },
    { field: 'request_type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 110 },
    { field: 'reason', headerName: 'Reason', flex: 2, minWidth: 200 },
    { field: 'notes', headerName: 'Notes', flex: 1, minWidth: 120 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Requests</h1>
          <p className="text-sm text-gray-500">Internal tracking only — not a full DSR workflow</p>
        </div>
        <CustomButton onClick={() => setShowCreate(true)}>New Request</CustomButton>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid rows={requests} columns={columns} getRowId={(r) => r.id} loading={loading}
          rowCount={total} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} />
      </div>
      {showCreate && (
        <ConfirmActionModal open title="New Compliance Export Request"
          description="Create an internal tracking request for a data export."
          confirmLabel="Submit" confirmVariant="primary" loading={actionLoading}
          onConfirm={handleCreate} onCancel={() => setShowCreate(false)} />
      )}
    </div>
  )
}
