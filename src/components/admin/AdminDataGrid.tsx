import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/material'

interface AdminDataGridProps extends Omit<DataGridProps, 'columns'> {
  columns: GridColDef[]
  loading?: boolean
  emptyMessage?: string
}

export default function AdminDataGrid({
  columns,
  loading = false,
  emptyMessage = 'No records found',
  ...props
}: AdminDataGridProps) {
  return (
    <Box sx={{ width: '100%', minHeight: 400 }}>
      <DataGrid
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(14, 165, 233, 0.08)',
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': { fontSize: '0.875rem' },
        }}
        localeText={{
          noRowsLabel: emptyMessage,
        }}
        {...props}
      />
    </Box>
  )
}
