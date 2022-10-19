/**
 * Creates a validation functions that validates a URL.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url(
  error: string
): (fieldValue: string | null | undefined) => string {
  return (fieldValue: string | null | undefined) => {
    try {
      new URL(fieldValue || '');
      return '';
    } catch (_) {
      return error;
    }
  };
}
