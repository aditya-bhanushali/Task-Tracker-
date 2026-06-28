import { useCallback, useRef, useState } from 'react'

let toastCounter = 0

/**
 * Minimal toast manager. Each toast is { id, message, actionLabel, onAction, tone }.
 * Auto-dismisses after `duration` ms unless the user hovers/interacts —
 * callers can also dismiss manually (e.g. after the Undo action fires).
 */
export function useToasts() {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    ({ message, actionLabel, onAction, tone = 'default', duration = 5000 }) => {
      const id = ++toastCounter
      setToasts((prev) => [...prev, { id, message, actionLabel, onAction, tone }])
      timers.current[id] = setTimeout(() => dismissToast(id), duration)
      return id
    },
    [dismissToast]
  )

  return { toasts, showToast, dismissToast }
}
