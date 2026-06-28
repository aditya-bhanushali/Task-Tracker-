import { PRIORITY_STYLES } from '../constants'
import { formatDueLabel, isPastDate } from '../utils/date'
import { EditIcon, TrashIcon, CalendarIcon, AlertIcon } from './icons'

/**
 * Card used inside a Kanban column. Supports native HTML5 drag-and-drop so
 * dragging a card to another column changes its status — the board's
 * primary interaction model, distinct from the list view's checkbox toggle.
 */
export default function TaskCard({ task, onEdit, onDelete, onDragStart, isRemoving }) {
  const style = PRIORITY_STYLES[task.priority]
  const overdue = task.status !== 'Completed' && isPastDate(task.dueDate)

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`task-transition group relative bg-surface border border-surface-border rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-surface-borderLight ${
        isRemoving ? 'opacity-0 scale-95' : 'animate-scaleIn'
      }`}
    >
      <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${style.rail}`} aria-hidden="true" />

      <div className="pl-2.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium text-ink-primary leading-snug break-words">{task.title}</h4>
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-surface-hover transition-colors"
            >
              <EditIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              aria-label="Delete task"
              className="p-1.5 rounded-md text-ink-muted hover:text-red-400 hover:bg-priority-highSoft transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {task.description && <p className="text-xs text-ink-secondary line-clamp-2 mb-3">{task.description}</p>}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full text-[11px] font-medium px-1.5 py-0.5 ${style.bg} ${style.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
            {task.priority}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full text-[11px] font-medium px-1.5 py-0.5 ${
              overdue ? 'bg-priority-highSoft text-red-400' : 'text-ink-muted'
            }`}
          >
            {overdue ? <AlertIcon className="w-3 h-3" /> : <CalendarIcon className="w-3 h-3" />}
            {formatDueLabel(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  )
}
