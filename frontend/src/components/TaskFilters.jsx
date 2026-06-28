import { PRIORITY_ORDER, PRIORITY_STYLES, STATUS_ORDER, SORT_OPTIONS } from '../constants'
import { SearchIcon, ChevronDownIcon, ListIcon, BoardIcon, XIcon } from './icons'

/**
 * All filter/sort/view controls in one bar. Kept fully controlled from
 * Dashboard's state — this component holds no state of its own, so the
 * "Clear filters" action from EmptyState can reset everything from one
 * place without reaching into child state.
 */
export default function TaskFilters({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <div className="space-y-3">
      {/* Search + view toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-1">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex items-center bg-surface border border-surface-border rounded-lg p-1 shrink-0">
          <button
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'list' ? 'bg-accent text-white' : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => onViewModeChange('board')}
            aria-label="Board view"
            aria-pressed={viewMode === 'board'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'board' ? 'bg-accent text-white' : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <BoardIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Board</span>
          </button>
        </div>
      </div>

      {/* Priority + status pills, sort dropdown */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-ink-muted mr-0.5">Priority:</span>
          {PRIORITY_ORDER.map((p) => {
            const isActive = priorityFilter === p
            const style = PRIORITY_STYLES[p]
            return (
              <button
                key={p}
                onClick={() => onPriorityFilterChange(isActive ? null : p)}
                className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2.5 py-1 border transition-colors ${
                  isActive ? `${style.bg} ${style.text} border-transparent` : 'border-surface-border text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                {p}
              </button>
            )
          })}
        </div>

        <div className="w-px h-5 bg-surface-border mx-1 hidden sm:block" aria-hidden="true" />

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-ink-muted mr-0.5">Status:</span>
          {STATUS_ORDER.map((s) => {
            const isActive = statusFilter === s
            return (
              <button
                key={s}
                onClick={() => onStatusFilterChange(isActive ? null : s)}
                className={`rounded-full text-xs font-medium px-2.5 py-1 border transition-colors ${
                  isActive ? 'bg-accent-soft text-accent border-transparent' : 'border-surface-border text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink-primary transition-colors"
            >
              <XIcon className="w-3 h-3" />
              Clear
            </button>
          )}

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-medium text-ink-primary outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
