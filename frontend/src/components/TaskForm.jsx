import { useEffect, useRef, useState } from 'react'
import { PRIORITY, PRIORITY_ORDER, STATUS, STATUS_ORDER } from '../constants'
import { validateField, validateForm, TITLE_MAX, DESCRIPTION_MAX } from '../utils/validation'
import { todayISO, cleanDateStr } from '../utils/date'
import { XIcon, AlertIcon } from './icons'

const EMPTY_FORM = {
  title: '',
  description: '',
  dueDate: '',
  priority: PRIORITY.MEDIUM,
  status: STATUS.TODO,
}

/**
 * Slide-up panel used for both Create and Edit. `editingTask` being null
 * means create mode; passing a task pre-fills every field for editing.
 *
 * Validation strategy: each field validates on blur AND on change once it
 * has been "touched" once, so errors clear the instant the user fixes them
 * rather than waiting for another blur. Submit re-validates everything so
 * a user tabbing past required fields without ever blurring still gets
 * caught.
 */
export default function TaskForm({ isOpen, onClose, onSubmit, editingTask }) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [shake, setShake] = useState(false)
  const titleInputRef = useRef(null)
  const isEditMode = Boolean(editingTask)

  // Re-seed form state every time the panel opens, or when switching which
  // task is being edited. Resetting on close too avoids a stale flash of
  // old data the next time it opens.
  useEffect(() => {
    if (isOpen) {
      setValues(
        editingTask
          ? {
              title: editingTask.title,
              description: editingTask.description || '',
              dueDate: cleanDateStr(editingTask.dueDate),
              priority: editingTask.priority,
              status: editingTask.status,
            }
          : EMPTY_FORM
      )
      setErrors({})
      setTouched({})
      // Focus the title field after the slide-in transition starts so
      // keyboard users land directly in the form.
      const timer = setTimeout(() => titleInputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, editingTask])

  // Close on Escape for fast keyboard dismissal.
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field]) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formErrors = validateForm(values)
    setErrors(formErrors)
    setTouched({ title: true, description: true, dueDate: true, priority: true, status: true })

    if (Object.keys(formErrors).length > 0) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
      status: values.status,
    })
  }

  if (!isOpen) return null

  const titleLength = values.title.length
  const descLength = values.description.length

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-fadeIn" onClick={onClose} />

      {/* Slide-in panel — full screen on mobile, fixed width on desktop */}
      <div
        className={`relative w-full sm:w-[480px] h-full bg-canvas-raised border-l border-surface-border flex flex-col animate-panelIn ${shake ? 'animate-shake' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border shrink-0">
          <h2 id="task-form-title" className="text-lg font-semibold text-ink-primary">
            {isEditMode ? 'Edit task' : 'Create task'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface-hover transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form body — scrolls independently of header/footer */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5" noValidate>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink-primary mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="title"
              type="text"
              value={values.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              maxLength={TITLE_MAX + 20}
              placeholder="e.g. Finalize Q3 budget review"
              aria-invalid={Boolean(errors.title)}
              aria-describedby="title-error title-count"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-surface border text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-colors ${
                errors.title
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-surface-border focus:border-accent'
              }`}
            />
            <div className="flex justify-between items-start mt-1.5 min-h-[18px]">
              <p id="title-error" className="text-xs text-red-400">
                {errors.title}
              </p>
              <p
                id="title-count"
                className={`text-xs tabular-nums shrink-0 ml-2 ${titleLength > TITLE_MAX ? 'text-red-400' : 'text-ink-muted'}`}
              >
                {titleLength}/{TITLE_MAX}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ink-primary mb-1.5">
              Description <span className="text-ink-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              maxLength={DESCRIPTION_MAX + 20}
              rows={4}
              placeholder="Add more context, links, or sub-tasks..."
              aria-invalid={Boolean(errors.description)}
              aria-describedby="description-error description-count"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-surface border text-sm text-ink-primary placeholder:text-ink-muted outline-none resize-none transition-colors ${
                errors.description
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-surface-border focus:border-accent'
              }`}
            />
            <div className="flex justify-between items-start mt-1.5 min-h-[18px]">
              <p id="description-error" className="text-xs text-red-400">
                {errors.description}
              </p>
              <p
                id="description-count"
                className={`text-xs tabular-nums shrink-0 ml-2 ${descLength > DESCRIPTION_MAX ? 'text-red-400' : 'text-ink-muted'}`}
              >
                {descLength}/{DESCRIPTION_MAX}
              </p>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-ink-primary mb-1.5">
              Due date <span className="text-red-400">*</span>
            </label>
            <input
              id="dueDate"
              type="date"
              value={values.dueDate}
              min={todayISO()}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              onBlur={() => handleBlur('dueDate')}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby="dueDate-error"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-surface border text-sm text-ink-primary outline-none transition-colors [color-scheme:dark] ${
                errors.dueDate
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-surface-border focus:border-accent'
              }`}
            />
            <p id="dueDate-error" className="text-xs text-red-400 mt-1.5 min-h-[18px]">
              {errors.dueDate}
            </p>
          </div>

          {/* Priority + Status side by side on larger screens */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-ink-primary mb-1.5">
                Priority
              </label>
              <select
                id="priority"
                value={values.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                onBlur={() => handleBlur('priority')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-surface-border text-sm text-ink-primary outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-ink-primary mb-1.5">
                Status
              </label>
              <select
                id="status"
                value={values.status}
                onChange={(e) => handleChange('status', e.target.value)}
                onBlur={() => handleBlur('status')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-surface-border text-sm text-ink-primary outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {Object.keys(errors).some((k) => errors[k]) && touched.title && (
            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-priority-highSoft border border-red-500/30 text-red-400 text-xs">
              <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Please fix the highlighted fields before saving.</span>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-surface-border shrink-0 bg-canvas-raised">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-surface-border text-sm font-medium text-ink-primary hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20"
          >
            {isEditMode ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </div>
  )
}
