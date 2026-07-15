import { useCallback, useEffect, useState } from 'react'
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import AdminDataGrid from '@/components/admin/AdminDataGrid'
import { getAdminSchools, type AdminSchool } from '@/api/admin'

export default function AdminSchoolsList() {
  const [schools, setSchools] = useState<AdminSchool[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminSchools({ page: pagination.page + 1, page_size: pagination.pageSize })
      setSchools(res.items)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => { load() }, [load])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'School', flex: 1.5, minWidth: 180 },
    { field: 'org_name', headerName: 'Organization', flex: 1, minWidth: 140 },
    { field: 'institution_type', headerName: 'Type', width: 120 },
    { field: 'user_count', headerName: 'Users', type: 'number', width: 90 },
    { field: 'is_active', headerName: 'Status', width: 100, valueFormatter: (v) => v ? 'Active' : 'Inactive' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schools</h1>
        <p className="text-sm text-gray-500">Cross-tenant schools directory</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <AdminDataGrid rows={schools} columns={columns} getRowId={(r) => r.id} loading={loading}
          rowCount={total} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} />
      </div>
    </div>
  )
}
