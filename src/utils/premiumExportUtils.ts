import { ExportFormat } from '../types/premium'
import { Message } from '../pages/features/GeneralTeachingAssistantChat'

export const exportToPDF = async (
  messages: Message[],
  options: ExportFormat
): Promise<void> => {
  // Simulate PDF export - in production, use jsPDF or similar library
  const content = formatMessagesForExport(messages, options)
  
  // Create a blob and download
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gpt4-conversation-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportToMarkdown = (
  messages: Message[],
  options: ExportFormat
): string => {
  let markdown = '# GPT-4 Teaching Assistant Conversation\n\n'
  
  if (options.includeMetadata) {
    markdown += `**Exported:** ${new Date().toLocaleString()}\n\n`
  }
  
  markdown += '---\n\n'
  
  messages.forEach((message) => {
    markdown += `## ${message.role === 'user' ? 'User' : 'GPT-4 Assistant'}\n\n`
    markdown += `${message.content}\n\n`
    if (options.includeMetadata) {
      markdown += `*${message.timestamp.toLocaleString()}*\n\n`
    }
    markdown += '---\n\n'
  })
  
  return markdown
}

export const exportToHTML = (
  messages: Message[],
  options: ExportFormat
): string => {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GPT-4 Teaching Assistant Conversation</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .user { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .assistant { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .metadata { font-size: 12px; color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>GPT-4 Teaching Assistant Conversation</h1>
`
  
  if (options.includeMetadata) {
    html += `<p><strong>Exported:</strong> ${new Date().toLocaleString()}</p>`
  }
  
  messages.forEach((message) => {
    const className = message.role === 'user' ? 'user' : 'assistant'
    html += `<div class="${className}">`
    html += `<strong>${message.role === 'user' ? 'User' : 'GPT-4 Assistant'}</strong><br>`
    html += `<div>${message.content.replace(/\n/g, '<br>')}</div>`
    if (options.includeMetadata) {
      html += `<div class="metadata">${message.timestamp.toLocaleString()}</div>`
    }
    html += `</div>`
  })
  
  html += `</body></html>`
  return html
}

const formatMessagesForExport = (
  messages: Message[],
  options: ExportFormat
): string => {
  let content = 'GPT-4 Teaching Assistant Conversation\n'
  content += '='.repeat(50) + '\n\n'
  
  if (options.includeMetadata) {
    content += `Exported: ${new Date().toLocaleString()}\n\n`
  }
  
  messages.forEach((message) => {
    content += `${message.role === 'user' ? 'USER' : 'GPT-4 ASSISTANT'}\n`
    content += '-'.repeat(30) + '\n'
    content += `${message.content}\n\n`
    if (options.includeMetadata) {
      content += `Timestamp: ${message.timestamp.toLocaleString()}\n\n`
    }
  })
  
  return content
}

export const downloadExport = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

