import type { Components } from 'react-markdown'

/** Markdown table components for lesson_flow sections (5E / lesson phases). */
export const lessonPhasesMarkdownComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
      <table className="ai-lesson-phases-table w-full min-w-[36rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900 align-top">
      {children}
    </th>
  ),
  tr: ({ children }) => <tr className="last:[&>td]:border-b-0">{children}</tr>,
  td: ({ children }) => (
    <td className="border-b border-gray-100 px-4 py-3 text-gray-800 align-top break-words">
      {children}
    </td>
  ),
}
