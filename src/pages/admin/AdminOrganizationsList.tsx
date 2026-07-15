import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import ConfirmActionModal from '@/components/admin/ConfirmActionModal'
import { getAdminOrganizations, suspendOrganization, reactivateOrganization, type AdminOrg } from '@/api/admin'

export default function AdminOrganizationsList() {
  const navigate = useNavigate()
  const [orgs, setOrgs] = useState<AdminOrg[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })
  const [action, setAction] = useState<{ type: string; org: AdminOrg } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminOrganizations({ page: pagination.page + 1, page_size: pagination.pageSize })
      setOrgs(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => { load() }, [load])

  const handleAction = async (reason: string) => {
    if (!action) return
    setActionLoading(true)
    try {
      if (action.type === 'suspend') await suspendOrganization(action.org.id, reason)
      else await reactivateOrganization(action.org.id, reason)
      setAction(null)
      load()
    } finally {
      setActionLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Organization', flex: 1.5, minWidth: 180 },
    { field: 'slug', headerName: 'Slug', flex: 1, minWidth: 120 },
    { field: 'user_count', headerName: 'Users', type: 'number', width: 90 },
    { field: 'school_count', headerName: 'Schools', type: 'number', width: 90 },
    { field: 'memory_total_balance', headerName: 'Memory', type: 'number', width: 100 },
    {
      field: 'is_active', headerName: 'Status', width: 100,
      valueFormatter: (v) => v ? 'Active' : 'Suspended',
    },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1">
          <button className="text-xs text-sky-600 hover:underline" onClick={() => navigate(`/administration/organizations/${params.row.id}`)}>View</button>
          {params.row.is_active ? (
            <button className="text-xs text-rose-600 hover:underline" onClick={() => setAction({ type: 'suspend', org: params.row })}>Suspend</button>
          ) : (
            <button className="text-xs text-emerald-600 hover:underline" onClick={() => setAction({ type: 'reactivate', org: params.row })}>Reactivate</button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organizations</h1>
        <p className="text-sm text-gray-500">Platform organizations directory</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid rows={orgs} columns={columns} getRowId={(r) => r.id} loading={loading}
          rowCount={total} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} />
      </div>
      {action && (
        <ConfirmActionModal open title={action.type === 'suspend' ? 'Suspend Organization' : 'Reactivate Organization'}
          description={action.org.name} confirmVariant={action.type === 'suspend' ? 'danger' : 'primary'}
          loading={actionLoading} onConfirm={handleAction} onCancel={() => setAction(null)} />
      )}
    </div>
  )
}
