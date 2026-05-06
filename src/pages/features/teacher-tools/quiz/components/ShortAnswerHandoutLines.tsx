import { clampResponseLines } from '../../demo/generationFromSources'

type LineStyle = 'print' | 'review'

export type ShortAnswerHandoutLinesProps = {
  responseLines?: number
  ruledLineSpacingPx: number
  /**
   * `print` — matches quiz print preview (`border-gray-500`).
   * `review` — matches quiz review dashed card (`border-gray-400`).
   */
  lineStyle?: LineStyle
  className?: string
}

/** Ruled handwriting rows — same geometry as quiz review / print preview. */
export function ShortAnswerHandoutLines({
  responseLines,
  ruledLineSpacingPx,
  lineStyle = 'print',
  className = 'mt-3 flex flex-col',
}: ShortAnswerHandoutLinesProps) {
  const n = clampResponseLines(responseLines)
  const borderClass = lineStyle === 'print' ? 'border-b border-gray-500' : 'border-b border-gray-400'

  return (
    <div className={className}>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          className={borderClass}
          style={{
            minHeight: ruledLineSpacingPx,
            marginTop: i === 0 ? 4 : 10,
          }}
        />
      ))}
    </div>
  )
}

export type ShortAnswerStudentResponsePreviewProps = {
  responseLines?: number
  ruledLineSpacingPx: number
}

/** Caption + dashed pad + ruled lines (quiz “review” handout preview). */
export function ShortAnswerStudentResponsePreview({
  responseLines,
  ruledLineSpacingPx,
}: ShortAnswerStudentResponsePreviewProps) {
  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <p className="text-xs font-medium text-gray-500">Student response (handout preview)</p>
      <div className="mt-2 flex flex-col rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-3 py-3">
        <ShortAnswerHandoutLines
          responseLines={responseLines}
          ruledLineSpacingPx={ruledLineSpacingPx}
          lineStyle="review"
          className="flex flex-col"
        />
      </div>
    </div>
  )
}
