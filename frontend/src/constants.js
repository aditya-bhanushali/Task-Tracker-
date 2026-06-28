// Centralized constants so every component (form, badges, filters, board)
// derives from one source of truth instead of re-declaring magic strings.

export const STORAGE_KEY = 'task-tracker:v1'

export const PRIORITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const PRIORITY_ORDER = [PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW]

export const STATUS = {
  TODO: 'To-Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const STATUS_ORDER = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.COMPLETED]

// Visual tokens per priority — text / dot / soft background / border.
// Kept in one map so TaskCard, TaskForm, and Filters render identical colors.
export const PRIORITY_STYLES = {
  [PRIORITY.HIGH]: {
    text: 'text-red-400',
    dot: 'bg-red-500',
    bg: 'bg-priority-highSoft',
    border: 'border-red-500/30',
    rail: 'bg-priority-high',
  },
  [PRIORITY.MEDIUM]: {
    text: 'text-amber-400',
    dot: 'bg-amber-500',
    bg: 'bg-priority-mediumSoft',
    border: 'border-amber-500/30',
    rail: 'bg-priority-medium',
  },
  [PRIORITY.LOW]: {
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    bg: 'bg-priority-lowSoft',
    border: 'border-emerald-500/30',
    rail: 'bg-priority-low',
  },
}

export const STATUS_STYLES = {
  [STATUS.TODO]: { text: 'text-ink-secondary', dot: 'bg-slate-500', label: 'To-Do' },
  [STATUS.IN_PROGRESS]: { text: 'text-blue-400', dot: 'bg-blue-500', label: 'In Progress' },
  [STATUS.COMPLETED]: { text: 'text-emerald-400', dot: 'bg-emerald-500', label: 'Completed' },
}

export const VIEW_MODE = {
  LIST: 'list',
  BOARD: 'board',
}

export const SORT_OPTIONS = [
  { value: 'dueDate-asc', label: 'Due date (soonest)' },
  { value: 'dueDate-desc', label: 'Due date (latest)' },
  { value: 'priority-desc', label: 'Priority (high first)' },
  { value: 'priority-asc', label: 'Priority (low first)' },
  { value: 'createdAt-desc', label: 'Recently added' },
  { value: 'title-asc', label: 'Title (A–Z)' },
]
