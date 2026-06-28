import { isPastDate } from '../utils/date'

export const TITLE_MIN = 3
export const TITLE_MAX = 50
export const DESCRIPTION_MAX = 300

/**
 * Validates a single field. Returns an error string, or '' if valid.
 * Kept field-by-field (rather than one big validateAll) so TaskForm can
 * call this on every keystroke/blur for immediate inline feedback, and
 * also call it across all fields on submit.
 */
export function validateField(name, value) {
  switch (name) {
    case 'title': {
      const trimmed = (value || '').trim()
      if (!trimmed) return 'Title is required.'
      if (trimmed.length < TITLE_MIN) return `Title must be at least ${TITLE_MIN} characters.`
      if (trimmed.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer.`
      return ''
    }
    case 'description': {
      if (value && value.length > DESCRIPTION_MAX) {
        return `Description must be ${DESCRIPTION_MAX} characters or fewer.`
      }
      return ''
    }
    case 'dueDate': {
      if (!value) return 'Due date is required.'
      if (isPastDate(value)) return "Due date can't be in the past."
      return ''
    }
    case 'priority': {
      if (!value) return 'Select a priority.'
      return ''
    }
    case 'status': {
      if (!value) return 'Select a status.'
      return ''
    }
    default:
      return ''
  }
}

/** Validates the whole form object at once. Returns { field: errorString }. */
export function validateForm(values) {
  const errors = {}
  for (const field of ['title', 'description', 'dueDate', 'priority', 'status']) {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
  }
  return errors
}

export function isFormValid(values) {
  const errors = validateForm(values)
  return Object.keys(errors).length === 0
}
