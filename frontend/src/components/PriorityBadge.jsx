import { PRIORITY_STYLES } from '../constants'

/**
 * Small color-coded pill for priority. Pulled into its own component so the
 * exact same visual representation appears in the list, board, and filters.
 */
export default function PriorityBadge({ priority, size = 'md' }) {
  const style = PRIORITY_STYLES[priority]
  if (!style) return null

  const sizeClasses = size === 'sm' ? 'text-[11px] px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${style.bg} ${style.text} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {priority}
    </span>
  )
}
