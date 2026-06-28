import { useEffect, useRef, useState } from 'react'

/**
 * Drop-in replacement for useState that mirrors its value to localStorage.
 *
 * Design notes:
 * - Reads synchronously on mount (lazy initializer) so there's no flash of
 *   empty state before the stored value loads.
 * - Wraps JSON parse/stringify in try/catch — a corrupted or hand-edited
 *   localStorage value falls back to the provided default instead of
 *   crashing the app.
 * - Listens for the "storage" event so multiple tabs of the app stay in
 *   sync with each other (e.g. deleting a task in one tab updates another).
 * - Skips the very first write-through (the value we just read) to avoid
 *   an unnecessary redundant write on mount.
 */
export function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch (err) {
      console.warn(`useLocalStorageState: failed to read "${key}", using default.`, err)
      return defaultValue
    }
  })

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`useLocalStorageState: failed to write "${key}".`, err)
    }
  }, [key, value])

  // Cross-tab sync: another tab changed this key, adopt its value here too.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== key || event.newValue === null) return
      try {
        setValue(JSON.parse(event.newValue))
      } catch {
        // ignore malformed external write
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [value, setValue]
}
