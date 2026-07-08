import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getAdminOrganization } from '@/api/admin'

export default function AdminOrganizationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<{ organization: unknown; schools: { id: string; name: string }[] } | null>(null)

  useEffect(() => {
    if (id) getAdminOrganization(id).then(setData)
  }, [id])

  const org = data?.organization as { name?: string; user_count?: number; school_count?: number; memory_total_balance?: number; is_active?: boolean } | undefined

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-2xl font-bold">{org?.name ?? 'Organization'}</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4"><p className="text-sm text-gray-500">Users</p><p className="text-2xl font-bold">{org?.user_count}</p></div>
        <div className="rounded-xl border p-4"><p className="text-sm text-gray-500">Schools</p><p className="text-2xl font-bold">{org?.school_count}</p></div>
        <div className="rounded-xl border p-4"><p className="text-sm text-gray-500">Memory</p><p className="text-2xl font-bold">{org?.memory_total_balance?.toLocaleString()}</p></div>
        <div className="rounded-xl border p-4"><p className="text-sm text-gray-500">Status</p><p className="text-2xl font-bold">{org?.is_active ? 'Active' : 'Suspended'}</p></div>
      </div>
      <div className="rounded-xl border p-4">
        <h3 className="font-semibold mb-3">Schools</h3>
        <ul className="divide-y">
          {(data?.schools ?? []).map((s) => (
            <li key={s.id} className="py-2 text-sm">{s.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
