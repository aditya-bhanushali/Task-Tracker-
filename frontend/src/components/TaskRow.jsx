import { PRIORITY_STYLES, STATUS } from '../constants'
import { formatDueLabel, isPastDate } from '../utils/date'
import { CheckIcon, EditIcon, TrashIcon, CalendarIcon, AlertIcon } from './icons'

/**
 * One row in the list view. Built so the most common actions — toggling
 * complete and bumping priority — never require opening the edit form.
 * The colored left rail mirrors priority at a glance down a long list
 * without needing to read every badge individually.
 */
export default function TaskRow({ task, onToggleStatus, onCyclePriority, onEdit, onDelete, isRemoving }) {
  const style = PRIORITY_STYLES[task.priority]
  const isCompleted = task.status === STATUS.COMPLETED
  const overdue = !isCompleted && isPastDate(task.dueDate)

  return (
    <div
      className={`task-transition group relative flex items-start gap-3 sm:gap-4 bg-surface border border-surface-border rounded-xl pl-4 pr-3 sm:pr-4 py-3.5 hover:border-surface-borderLight ${
        isRemoving ? 'opacity-0 scale-95' : 'animate-scaleIn'
      }`}
    >
      {/* Priority rail */}
      <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${style.rail}`} aria-hidden="true" />

      {/* Complete toggle */}
      <button
        onClick={() => onToggleStatus(task.id)}
        aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isCompleted
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-surface-borderLight hover:border-accent'
        }`}
      >
        {isCompleted && <CheckIcon className="w-3 h-3 text-white" />}
      </button>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-medium leading-snug break-words ${
              isCompleted ? 'text-ink-muted line-through' : 'text-ink-primary'
            }`}
          >
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className={`text-xs mt-1 line-clamp-2 ${isCompleted ? 'text-ink-muted' : 'text-ink-secondary'}`}>
            {task.description}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-2 mt-2.5">
          {/* Priority — click cycles High -> Medium -> Low */}
          <button
            onClick={() => onCyclePriority(task.id)}
            title="Click to change priority"
            className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2 py-1 transition-opacity hover:opacity-80 ${style.bg} ${style.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
            {task.priority}
          </button>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2 py-1 ${
              overdue ? 'bg-priority-highSoft text-red-400' : 'bg-canvas-raised text-ink-secondary'
            }`}
          >
            {overdue ? <AlertIcon className="w-3 h-3" /> : <CalendarIcon className="w-3 h-3" />}
            {formatDueLabel(task.dueDate)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="p-2 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <EditIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="p-2 rounded-lg text-ink-muted hover:text-red-400 hover:bg-priority-highSoft transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
