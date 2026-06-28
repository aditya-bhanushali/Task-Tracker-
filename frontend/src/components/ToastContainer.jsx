import { CheckIcon, TrashIcon, UndoIcon, XIcon } from './icons'

const TONE_ICON = {
  delete: TrashIcon,
  success: CheckIcon,
  default: CheckIcon,
}

export default function ToastContainer({ toasts, onDismiss, onAction }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-auto max-w-sm">
      {toasts.map((toast) => {
        const Icon = TONE_ICON[toast.tone] || TONE_ICON.default
        return (
          <div
            key={toast.id}
            className="animate-toastIn flex items-center gap-3 bg-canvas-raised border border-surface-borderLight rounded-xl pl-3.5 pr-2 py-3 shadow-2xl shadow-black/40"
          >
            <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-ink-secondary shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm text-ink-primary flex-1">{toast.message}</p>

            {toast.actionLabel && (
              <button
                onClick={() => {
                  toast.onAction?.()
                  onAction(toast.id)
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover px-2 py-1 rounded-md transition-colors shrink-0"
              >
                <UndoIcon className="w-3.5 h-3.5" />
                {toast.actionLabel}
              </button>
            )}

            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-surface-hover transition-colors shrink-0"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
