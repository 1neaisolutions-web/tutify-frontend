import { useCallback, useState } from 'react'

/** Tracks frontend-only exemplar preview — never persisted as a draft. */
export function useTeacherToolsExemplarPreview() {
  const [isExemplarPreview, setIsExemplarPreview] = useState(false)

  const enterExemplarPreview = useCallback(() => {
    setIsExemplarPreview(true)
  }, [])

  const exitExemplarPreview = useCallback(() => {
    setIsExemplarPreview(false)
  }, [])

  return {
    isExemplarPreview,
    enterExemplarPreview,
    exitExemplarPreview,
  }
}
