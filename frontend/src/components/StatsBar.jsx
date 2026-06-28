/**
 * Desktop equivalent of StatsDrawer — shown inline since there's room.
 * Hidden below sm breakpoint where StatsDrawer takes over instead.
 */
export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total, accent: 'text-ink-primary' },
    { label: 'Completed', value: stats.completed, accent: 'text-emerald-400' },
    { label: 'In progress', value: stats.inProgress, accent: 'text-blue-400' },
    { label: 'Overdue', value: stats.overdue, accent: 'text-red-400' },
  ]

  return (
    <div className="hidden sm:grid grid-cols-4 gap-3 mb-5">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface border border-surface-border rounded-xl px-4 py-3">
          <p className="text-xs text-ink-muted mb-1">{card.label}</p>
          <p className={`text-2xl font-semibold tabular-nums ${card.accent}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
