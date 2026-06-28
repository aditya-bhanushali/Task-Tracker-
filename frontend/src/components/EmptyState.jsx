import { ClipboardIcon, PlusIcon, XIcon } from './icons'

/**
 * Two distinct empty states share this component:
 * - No tasks at all → encourages creating the first one.
 * - Filters hide everything → encourages clearing filters instead of
 *   implying the tracker itself is empty.
 */
export default function EmptyState({ hasActiveFilters, onCreateTask, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fadeIn">
      <div className="w-20 h-20 rounded-2xl bg-surface border border-surface-border flex items-center justify-center mb-5 text-ink-muted">
        <ClipboardIcon className="w-9 h-9" />
      </div>

      {hasActiveFilters ? (
        <>
          <h3 className="text-lg font-semibold text-ink-primary mb-1.5">No tasks match these filters</h3>
          <p className="text-sm text-ink-secondary mb-6 max-w-sm">
            Try widening your search, switching priority or status filters, or clear them to see everything again.
          </p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-border text-sm font-medium text-ink-primary hover:bg-surface-hover transition-colors"
          >
            <XIcon className="w-4 h-4" />
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-ink-primary mb-1.5">Start your first task</h3>
          <p className="text-sm text-ink-secondary mb-6 max-w-sm">
            Your tracker is empty. Add a task to start planning your work and tracking progress.
          </p>
          <button
            onClick={onCreateTask}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20"
          >
            <PlusIcon className="w-4 h-4" />
            Create task
          </button>
        </>
      )}
    </div>
  )
}
