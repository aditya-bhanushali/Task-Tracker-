import { useMemo, useState, useCallback } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useToasts } from '../hooks/useToasts'
import { PRIORITY, PRIORITY_ORDER, STATUS, VIEW_MODE } from '../constants'
import Header from './Header'
import StatsBar from './StatsBar'
import StatsDrawer from './StatsDrawer'
import TaskFilters from './TaskFilters'
import TaskRow from './TaskRow'
import KanbanBoard from './KanbanBoard'
import TaskForm from './TaskForm'
import EmptyState from './EmptyState'
import ToastContainer from './ToastContainer'

/**
 * Owns all UI state (filters, sort, view mode, which task is being edited,
 * which tasks are mid-delete-animation) and wires it to the useTasks data
 * hook. This is the single place that knows how a "delete" turns into a
 * toast-with-undo, and how a "create/edit" turns into opening TaskForm.
 */
export default function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask, restoreTask, toggleStatus, setPriority, setStatus } = useTasks()
  const { toasts, showToast, dismissToast } = useToasts()

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [sortBy, setSortBy] = useState('dueDate-asc')
  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Tasks currently animating out after a delete, kept separate from the
  // real data so the fade/scale-out transition can play before the row
  // actually disappears from the array.
  const [removingIds, setRemovingIds] = useState(new Set())

  function handleOpenCreate() {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  function handleOpenEdit(task) {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  function handleFormSubmit(values) {
    if (editingTask) {
      updateTask(editingTask.id, values)
      showToast({ message: 'Task updated', tone: 'success' })
    } else {
      addTask(values)
      showToast({ message: 'Task created', tone: 'success' })
    }
    handleCloseForm()
  }

  // Delete is "soft" from the user's perspective: it plays an exit
  // animation, then removes the task, and offers a 5s Undo window via the
  // toast queue. restoreTask puts it back at its original index so undo
  // doesn't reshuffle the list.
  const handleDelete = useCallback(
    (task) => {
      const originalIndex = tasks.findIndex((t) => t.id === task.id)
      setRemovingIds((prev) => new Set(prev).add(task.id))

      setTimeout(() => {
        deleteTask(task.id)
        setRemovingIds((prev) => {
          const next = new Set(prev)
          next.delete(task.id)
          return next
        })
      }, 220)

      showToast({
        message: `Deleted "${task.title.length > 28 ? task.title.slice(0, 28) + '…' : task.title}"`,
        tone: 'delete',
        actionLabel: 'Undo',
        onAction: () => restoreTask(task, originalIndex),
      })
    },
    [tasks, deleteTask, restoreTask, showToast]
  )

  function handleCyclePriority(taskId) {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const currentIndex = PRIORITY_ORDER.indexOf(task.priority)
    const nextPriority = PRIORITY_ORDER[(currentIndex + 1) % PRIORITY_ORDER.length]
    setPriority(taskId, nextPriority)
  }

  function handleMoveTask(taskId, newStatus) {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return
    setStatus(taskId, newStatus)
  }

  function handleClearFilters() {
    setSearch('')
    setPriorityFilter(null)
    setStatusFilter(null)
  }

  const hasActiveFilters = Boolean(search || priorityFilter || statusFilter)

  // Derived stats for the header/drawer — recomputed only when tasks change.
  const stats = useMemo(() => {
    const byPriority = { [PRIORITY.HIGH]: 0, [PRIORITY.MEDIUM]: 0, [PRIORITY.LOW]: 0 }
    let completed = 0
    let inProgress = 0
    let overdue = 0
    const todayStr = new Date().toISOString().slice(0, 10)

    for (const t of tasks) {
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1
      if (t.status === STATUS.COMPLETED) completed++
      if (t.status === STATUS.IN_PROGRESS) inProgress++
      if (t.status !== STATUS.COMPLETED && t.dueDate < todayStr) overdue++
    }

    return { total: tasks.length, completed, inProgress, overdue, byPriority }
  }, [tasks])

  // Filter -> search -> sort pipeline. Recomputed on any input change;
  // cheap enough at task-tracker scale to not need further memo splitting.
  const visibleTasks = useMemo(() => {
    let result = tasks

    if (priorityFilter) result = result.filter((t) => t.priority === priorityFilter)
    if (statusFilter) result = result.filter((t) => t.status === statusFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
      )
    }

    const [field, direction] = sortBy.split('-')
    const dir = direction === 'asc' ? 1 : -1

    result = [...result].sort((a, b) => {
      if (field === 'priority') {
        return (PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)) * dir * -1
      }
      if (field === 'title') {
        return a.title.localeCompare(b.title) * dir
      }
      if (field === 'createdAt') {
        return (a.createdAt - b.createdAt) * dir
      }
      // dueDate
      return (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0) * dir
    })

    return result
  }, [tasks, priorityFilter, statusFilter, search, sortBy])

  return (
    <div className="min-h-screen bg-canvas">
      <Header stats={stats} onOpenDrawer={() => setDrawerOpen(true)} onCreateTask={handleOpenCreate} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <StatsBar stats={stats} />

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-5">
          {visibleTasks.length === 0 ? (
            <EmptyState
              hasActiveFilters={hasActiveFilters}
              onCreateTask={handleOpenCreate}
              onClearFilters={handleClearFilters}
            />
          ) : viewMode === VIEW_MODE.LIST ? (
            <div className="space-y-2.5">
              {visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleStatus}
                  onCyclePriority={handleCyclePriority}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  isRemoving={removingIds.has(task.id)}
                />
              ))}
            </div>
          ) : (
            <KanbanBoard
              tasks={visibleTasks}
              onMoveTask={handleMoveTask}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              removingIds={removingIds}
            />
          )}
        </div>
      </main>

      <TaskForm isOpen={isFormOpen} onClose={handleCloseForm} onSubmit={handleFormSubmit} editingTask={editingTask} />

      <StatsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} stats={stats} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} onAction={dismissToast} />
    </div>
  )
}
