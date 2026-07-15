import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { Key } from 'lucide-react'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import { getAdminSubscriptions, type AdminSubscription } from '@/api/admin'

export default function AdminSubscriptionsList() {
  const [subs, setSubs] = useState<AdminSubscription[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminSubscriptions({ page: pagination.page + 1, page_size: pagination.pageSize })
      setSubs(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => { load() }, [load])

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'User', flex: 1.5, minWidth: 200 },
    { field: 'tier', headerName: 'Tier', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'current_period_end', headerName: 'Renewal', width: 130,
      valueFormatter: (v) => v ? new Date(v as string).toLocaleDateString() : '—',
    },
    { field: 'is_trial', headerName: 'Trial', width: 80, valueFormatter: (v) => v ? 'Yes' : 'No' },
    { field: 'is_manually_granted', headerName: 'Manual', width: 90, valueFormatter: (v) => v ? 'Yes' : 'No' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm text-gray-500">Platform subscription directory</p>
        </div>
        <Link to="/admin/access-codes" className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700">
          <Key className="h-4 w-4" /> Access Codes
        </Link>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid rows={subs} columns={columns} getRowId={(r) => r.user_id} loading={loading}
          rowCount={total} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} />
      </div>
    </div>
  )
}
