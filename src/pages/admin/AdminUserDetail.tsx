import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getAdminUser } from '@/api/admin'
import type { AdminUser, MemoryUser } from '@/api/admin'

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [memory, setMemory] = useState<MemoryUser | null>(null)
  const [sub, setSub] = useState<{ tier?: string; status?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getAdminUser(id).then((res) => {
      setUser(res.user)
      setMemory(res.memory ?? null)
      setSub({ tier: res.subscription_tier, status: res.subscription_status })
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="animate-pulse h-64 rounded-xl bg-gray-100" />
  if (!user) return <p>User not found</p>

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Profile</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd>{user.status}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Tenant</dt><dd>{user.tenant_name}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Roles</dt><dd>{user.roles?.join(', ')}</dd></div>
          </dl>
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Memory</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Balance</dt><dd>{memory?.balance ?? user.balance ?? 0}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Allocated</dt><dd>{memory?.total_allocated ?? '—'}</dd></div>
          </dl>
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Subscription</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Tier</dt><dd>{sub.tier}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd>{sub.status}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  )
}
