import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { STORAGE_KEY, PRIORITY, STATUS } from '../constants'
import { toISODate } from '../utils/date'

function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

// Seed data gives the app something to show on first load instead of a
// totally blank slate, while still demonstrating every priority/status
// combination and the empty-state path (delete them all to see it).
const SEED_TASKS = [
  {
    id: generateId(),
    title: 'Design onboarding flow wireframes',
    description: 'Sketch the first-run experience for new users, focusing on the empty-state screens.',
    dueDate: daysFromNow(2),
    priority: PRIORITY.HIGH,
    status: STATUS.IN_PROGRESS,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: generateId(),
    title: 'Fix WhatsApp webhook timeout',
    description: 'Calls are timing out after 10s under load. Check the connection pool size.',
    dueDate: daysFromNow(0),
    priority: PRIORITY.HIGH,
    status: STATUS.TODO,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: generateId(),
    title: 'Write API docs for v1 endpoints',
    description: '',
    dueDate: daysFromNow(5),
    priority: PRIORITY.MEDIUM,
    status: STATUS.TODO,
    createdAt: Date.now() - 86400000,
  },
  {
    id: generateId(),
    title: 'Refactor TaskCard component',
    description: 'Split inline edit logic out into a separate hook for reuse in the board view.',
    dueDate: daysFromNow(-1),
    priority: PRIORITY.MEDIUM,
    status: STATUS.IN_PROGRESS,
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: generateId(),
    title: 'Update dependencies',
    description: '',
    dueDate: daysFromNow(7),
    priority: PRIORITY.LOW,
    status: STATUS.COMPLETED,
    createdAt: Date.now() - 3600000 * 30,
  },
]

/**
 * Owns the task list and every mutation against it. Components never touch
 * localStorage directly — they call these functions and re-render off the
 * returned `tasks` array. Keeping this separate from UI makes it trivial to
 * later swap the underlying persistence for a real API (same call shapes).
 */
export function useTasks() {
  const [tasks, setTasks] = useLocalStorageState(STORAGE_KEY, SEED_TASKS)

  const addTask = useCallback(
    (taskData) => {
      const newTask = {
        id: generateId(),
        createdAt: Date.now(),
        ...taskData,
      }
      setTasks((prev) => [newTask, ...prev])
      return newTask
    },
    [setTasks]
  )

  const updateTask = useCallback(
    (id, updates) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    },
    [setTasks]
  )

  const deleteTask = useCallback(
    (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks]
  )

  // Used by the Undo toast action — re-inserts a previously deleted task
  // at its original position rather than just at the top of the list.
  const restoreTask = useCallback(
    (task, originalIndex) => {
      setTasks((prev) => {
        const next = [...prev]
        const safeIndex = Math.min(originalIndex, next.length)
        next.splice(safeIndex, 0, task)
        return next
      })
    },
    [setTasks]
  )

  const toggleStatus = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t
          return { ...t, status: t.status === STATUS.COMPLETED ? STATUS.TODO : STATUS.COMPLETED }
        })
      )
    },
    [setTasks]
  )

  const setPriority = useCallback(
    (id, priority) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)))
    },
    [setTasks]
  )

  const setStatus = useCallback(
    (id, status) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    },
    [setTasks]
  )

  return { tasks, addTask, updateTask, deleteTask, restoreTask, toggleStatus, setPriority, setStatus }
}
