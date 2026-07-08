import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import ConfirmActionModal from '@/components/admin/ConfirmActionModal'
import { getAdminUsers, suspendUser, reactivateUser, forcePasswordReset, type AdminUser } from '@/api/admin'
import { CustomInput } from '@/components/shared'

export default function AdminUsersList() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })
  const [action, setAction] = useState<{ type: string; user: AdminUser } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminUsers({
        page: pagination.page + 1,
        page_size: pagination.pageSize,
        search: search || undefined,
      })
      setUsers(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [pagination, search])

  useEffect(() => { load() }, [load])

  const handleAction = async (reason: string) => {
    if (!action) return
    setActionLoading(true)
    try {
      if (action.type === 'suspend') await suspendUser(action.user.id, reason)
      else if (action.type === 'reactivate') await reactivateUser(action.user.id, reason)
      else await forcePasswordReset(action.user.id, reason)
      setAction(null)
      load()
    } finally {
      setActionLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    { field: 'tenant_name', headerName: 'Tenant', flex: 1, minWidth: 130 },
    {
      field: 'roles', headerName: 'Roles', flex: 1, minWidth: 120,
      valueGetter: (_, row) => (row.roles ?? []).join(', '),
    },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'balance', headerName: 'Memory', type: 'number', width: 90 },
    { field: 'subscription_tier', headerName: 'Tier', width: 90 },
    {
      field: 'actions', headerName: 'Actions', width: 220, sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1">
          <button className="text-xs text-sky-600 hover:underline" onClick={() => navigate(`/administration/users/${params.row.id}`)}>View</button>
          {params.row.status === 'active' ? (
            <button className="text-xs text-rose-600 hover:underline" onClick={() => setAction({ type: 'suspend', user: params.row })}>Suspend</button>
          ) : (
            <button className="text-xs text-emerald-600 hover:underline" onClick={() => setAction({ type: 'reactivate', user: params.row })}>Reactivate</button>
          )}
          <button className="text-xs text-amber-600 hover:underline" onClick={() => setAction({ type: 'reset', user: params.row })}>Reset PW</button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500">Cross-tenant user directory</p>
        </div>
        <CustomInput
          placeholder="Search users..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid
          rows={users}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          rowCount={total}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
        />
      </div>

      {action && (
        <ConfirmActionModal
          open
          title={action.type === 'suspend' ? 'Suspend User' : action.type === 'reactivate' ? 'Reactivate User' : 'Force Password Reset'}
          description={`Action for ${action.user.email}`}
          confirmLabel="Confirm"
          confirmVariant={action.type === 'reactivate' ? 'primary' : 'danger'}
          loading={actionLoading}
          onConfirm={handleAction}
          onCancel={() => setAction(null)}
        />
      )}
    </div>
  )
}
