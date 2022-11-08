/**
 * Creates a validation functions that validates a number.
 *
 * @param requirement The maximum number.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxNumber(
  requirement: number,
  error: string
): (value: number | null | undefined) => string {
  return (value: number | null | undefined) =>
    (value || 0) > requirement ? error : '';
}
