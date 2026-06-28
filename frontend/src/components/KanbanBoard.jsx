import { useState } from 'react'
import { STATUS_ORDER, STATUS_STYLES } from '../constants'
import TaskCard from './TaskCard'

/**
 * Three-column board grouped by status. Drag-and-drop uses the native
 * HTML5 DnD API (no extra dependency) — dropping a card on a column fires
 * onMoveTask with the new status, mutating the same underlying task state
 * the list view reads from.
 */
export default function KanbanBoard({ tasks, onMoveTask, onEdit, onDelete, removingIds }) {
  const [dragOverStatus, setDragOverStatus] = useState(null)

  function handleDragStart(e, taskId) {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDrop(e, status) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) onMoveTask(taskId, status)
    setDragOverStatus(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {STATUS_ORDER.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status)
        const style = STATUS_STYLES[status]
        const isDragTarget = dragOverStatus === status

        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverStatus(status)
            }}
            onDragLeave={() => setDragOverStatus(null)}
            onDrop={(e) => handleDrop(e, status)}
            className={`rounded-xl border transition-colors ${
              isDragTarget ? 'border-accent bg-accent-soft/40' : 'border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 px-1 mb-3">
              <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden="true" />
              <h3 className="text-sm font-semibold text-ink-primary">{status}</h3>
              <span className="text-xs text-ink-muted tabular-nums">{columnTasks.length}</span>
            </div>

            <div className="space-y-3 min-h-[80px]">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  isRemoving={removingIds.has(task.id)}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="border border-dashed border-surface-border rounded-xl py-8 flex items-center justify-center">
                  <p className="text-xs text-ink-muted">Drop a task here</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
