import { useEffect, useState } from 'react'

/** After hydrate (and URL template prefill on create), allow dirty baseline capture. */
export function useTeacherToolsFormBaselineReady(hydrateReady: boolean, isEdit: boolean) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hydrateReady) {
      setReady(false)
      return
    }
    if (isEdit) {
      setReady(true)
      return
    }
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [hydrateReady, isEdit])

  return ready
}
