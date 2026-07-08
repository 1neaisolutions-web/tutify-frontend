import { useCallback, useEffect, useState } from 'react'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { Brain, Plus, Minus, AlertTriangle } from 'lucide-react'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import ConfirmActionModal from '@/components/admin/ConfirmActionModal'
import KpiCard from '@/components/admin/KpiCard'
import {
  getMemoryOverview, getMemoryUsers, getMemoryAlerts,
  grantMemory, deductMemory, type MemoryUser, type MemoryOverview,
} from '@/api/admin'
import { CustomButton } from '@/components/shared'

export default function MemoryManagement() {
  const [overview, setOverview] = useState<MemoryOverview | null>(null)
  const [users, setUsers] = useState<MemoryUser[]>([])
  const [total, setTotal] = useState(0)
  const [alerts, setAlerts] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })
  const [selectedUser, setSelectedUser] = useState<MemoryUser | null>(null)
  const [modal, setModal] = useState<'grant' | 'deduct' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [amount, setAmount] = useState('1000')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [ov, us, al] = await Promise.all([
        getMemoryOverview(),
        getMemoryUsers({ page: pagination.page + 1, page_size: pagination.pageSize }),
        getMemoryAlerts(),
      ])
      setOverview(ov)
      setUsers(us.items)
      setTotal(us.total)
      setAlerts(al.items)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => { load() }, [load])

  const handleAction = async (reason: string) => {
    if (!selectedUser || !modal) return
    setActionLoading(true)
    try {
      const amt = parseInt(amount, 10)
      if (modal === 'grant') await grantMemory(selectedUser.user_id, amt, reason)
      else await deductMemory(selectedUser.user_id, amt, reason)
      setModal(null)
      setSelectedUser(null)
      load()
    } finally {
      setActionLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'User', flex: 1.5, minWidth: 200 },
    { field: 'tenant_name', headerName: 'Tenant', flex: 1, minWidth: 140 },
    { field: 'balance', headerName: 'Balance', type: 'number', width: 110 },
    { field: 'total_allocated', headerName: 'Allocated', type: 'number', width: 110 },
    { field: 'balance_pct', headerName: '% Left', width: 90, valueFormatter: (v) => v != null ? `${v}%` : '—' },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1">
          <button
            className="rounded px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50"
            onClick={() => { setSelectedUser(params.row); setModal('grant') }}
          >
            Grant
          </button>
          <button
            className="rounded px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
            onClick={() => { setSelectedUser(params.row); setModal('deduct') }}
          >
            Deduct
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Memory Management</h1>
        <p className="text-sm text-gray-500">Platform credit balances and allocations</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="Total Balance" value={(overview?.total_balance ?? 0).toLocaleString()} icon={<Brain className="h-5 w-5" />} />
        <KpiCard title="Daily Burn" value={(overview?.daily_burn_rate ?? 0).toLocaleString()} accent="amber" icon={<Minus className="h-5 w-5" />} />
        <KpiCard title="Runway" value={overview?.estimated_runway_days != null ? `${overview.estimated_runway_days}d` : '—'} accent="violet" />
        <KpiCard title="Alerts" value={alerts.length} accent="rose" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid
          rows={users}
          columns={columns}
          getRowId={(r) => r.user_id}
          loading={loading}
          rowCount={total}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
        />
      </div>

      {modal && selectedUser && (
        <>
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
              <p className="mb-2 text-sm">Amount for {selectedUser.email}</p>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
          <ConfirmActionModal
            open
            title={modal === 'grant' ? 'Grant Memory' : 'Deduct Memory'}
            description={`${modal === 'grant' ? 'Grant' : 'Deduct'} ${amount} credits for ${selectedUser.email}`}
            confirmLabel={modal === 'grant' ? 'Grant' : 'Deduct'}
            confirmVariant={modal === 'grant' ? 'primary' : 'danger'}
            loading={actionLoading}
            onConfirm={handleAction}
            onCancel={() => { setModal(null); setSelectedUser(null) }}
          />
        </>
      )}
    </div>
  )
}
