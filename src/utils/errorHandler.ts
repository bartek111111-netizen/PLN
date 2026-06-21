import { ZodError } from 'zod'
import { useToastStore } from '../stores/toastStore'
import { ERROR_UNKNOWN } from '../constants'

/**
 * Handles validation errors from Zod or generic errors.
 * Returns the error message to display to the user.
 */
export function handleValidationError(
  err: unknown,
  toastStore: ReturnType<typeof useToastStore>,
): string {
  if (err instanceof ZodError) {
    const message = err.issues[0].message
    toastStore.error(message)
    return message
  }
  if (err instanceof Error) {
    toastStore.error(err.message)
    return err.message
  }
  toastStore.error(ERROR_UNKNOWN)
  return ERROR_UNKNOWN
}
