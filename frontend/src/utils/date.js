// Date helpers centralized here so validation (TaskForm) and display
// (TaskCard/TaskRow) always agree on what "today" and "overdue" mean.

/** Returns today's date as YYYY-MM-DD, suitable for <input type="date" min="">. */
export function todayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return toISODate(d)
}

export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** True if the given YYYY-MM-DD string is strictly before today (local time). */
export function isPastDate(isoDate) {
  if (!isoDate) return false
  return isoDate < todayISO()
}

/** True if the given YYYY-MM-DD string is today. */
export function isToday(isoDate) {
  return isoDate === todayISO()
}

/** Human-friendly relative label: "Today", "Tomorrow", "In 3 days", "3 days overdue". */
export function formatDueLabel(isoDate) {
  if (!isoDate) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(isoDate + 'T00:00:00')
  const diffDays = Math.round((due - today) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days overdue`

  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatFullDate(isoDate) {
  if (!isoDate) return ''
  const due = new Date(isoDate + 'T00:00:00')
  return due.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
