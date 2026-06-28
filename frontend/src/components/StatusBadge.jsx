import { STATUS_STYLES } from '../constants'

export default function StatusBadge({ status, size = 'md' }) {
  const style = STATUS_STYLES[status]
  if (!style) return null

  const sizeClasses = size === 'sm' ? 'text-[11px] px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-surface border border-surface-border ${style.text} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status}
    </span>
  )
}
