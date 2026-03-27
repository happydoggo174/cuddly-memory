/**
 * Format ISO date string to Vietnamese locale date
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Format ISO datetime string to Vietnamese locale date + time
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
