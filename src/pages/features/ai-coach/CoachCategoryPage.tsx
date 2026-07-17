import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Wrench } from 'lucide-react'
import { listChatbots } from '../../../api/chatbots'
import { capabilityWorkspacePath, findCategory } from '../../../data/coachCatalog'

const CoachCategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = categorySlug ? findCategory(categorySlug) : undefined
  const [availability, setAvailability] = useState<Record<string, boolean> | null>(null)

  useEffect(() => {
    let mounted = true
    listChatbots()
      .then((bots) => {
        if (!mounted) return
        const avail: Record<string, boolean> = {}
        bots.forEach((b) => {
          avail[b.slug] = b.is_active
        })
        setAvailability(avail)
      })
      .catch(() => setAvailability(null))
    return () => {
      mounted = false
    }
  }, [])

  if (!category) {
    return (
      <div className="space-y-4">
        <Link to="/chatbots" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> AI Coach Desk
        </Link>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Category not found.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/chatbots" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> AI Coach Desk
      </Link>

      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${category.colorClasses}`}>
          <category.icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{category.label}</h1>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.capabilities.map((cap) => {
          const isAvailable = availability === null || availability[cap.toolSlug] !== false
          return (
            <Link
              key={`${cap.toolSlug}-${cap.id}`}
              to={isAvailable ? capabilityWorkspacePath(cap) : '#'}
              aria-disabled={!isAvailable}
              className={`rounded-2xl border border-gray-200 bg-white p-5 transition ${
                isAvailable ? 'hover:border-primary-300 hover:shadow-md' : 'pointer-events-none opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-400" />
                <p className="font-semibold text-gray-900">{cap.label}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">{cap.description}</p>
              <div className="mt-4 space-y-1 text-xs text-gray-500">
                {cap.inputHint && <p>Input: {cap.inputHint}</p>}
                {cap.resultHint && <p>Result: {cap.resultHint}</p>}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-primary-600">
                  {isAvailable ? 'Open workspace →' : 'Temporarily unavailable'}
                </span>
                <span className="text-gray-400">Guided tool · Credits apply</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CoachCategoryPage
