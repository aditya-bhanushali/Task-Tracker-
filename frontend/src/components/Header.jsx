import { MenuIcon, PlusIcon } from './icons'

/**
 * Top bar — sits above the filters/content. On mobile, the stat summary
 * collapses behind a hamburger that opens a slide-out drawer (see
 * StatsDrawer) so the main content gets full width on small screens.
 */
export default function Header({ stats, onOpenDrawer, onCreateTask }) {
  return (
    <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-sm border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            aria-label="Open menu"
            className="sm:hidden p-2 -ml-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface-hover transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-ink-primary leading-none">Tracker</h1>
            <p className="text-xs text-ink-muted mt-0.5 hidden sm:block">
              {stats.total} tasks · {stats.completed} completed
            </p>
          </div>
        </div>

        <button
          onClick={onCreateTask}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20 shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden xs:inline">New task</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>
    </header>
  )
}
