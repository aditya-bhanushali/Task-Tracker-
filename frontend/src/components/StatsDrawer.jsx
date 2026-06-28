import { XIcon } from './icons'
import { PRIORITY_STYLES } from '../constants'

/**
 * On mobile, the dashboard's summary stats (which sit inline on desktop —
 * see StatsBar) move into this drawer behind the hamburger icon, keeping
 * the small-screen task list uncluttered and full-width as required.
 */
export default function StatsDrawer({ isOpen, onClose, stats }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={onClose} />
      <div className="absolute top-0 left-0 h-full w-72 bg-canvas-raised border-r border-surface-border animate-panelIn p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-ink-primary">Overview</h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface-hover transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <StatRow label="Total tasks" value={stats.total} />
          <StatRow label="Completed" value={stats.completed} accent="text-emerald-400" />
          <StatRow label="Overdue" value={stats.overdue} accent="text-red-400" />

          <div className="pt-3 border-t border-surface-border">
            <p className="text-xs text-ink-muted mb-2.5">By priority</p>
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between py-1.5">
                <span className={`text-sm flex items-center gap-2 ${PRIORITY_STYLES[priority].text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_STYLES[priority].dot}`} />
                  {priority}
                </span>
                <span className="text-sm text-ink-secondary tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between bg-surface rounded-lg px-3.5 py-2.5">
      <span className="text-sm text-ink-secondary">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${accent || 'text-ink-primary'}`}>{value}</span>
    </div>
  )
}
