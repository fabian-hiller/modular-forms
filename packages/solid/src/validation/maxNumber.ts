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
): (fieldValue: number | null | undefined) => string {
  return (fieldValue: number | null | undefined) =>
    (fieldValue || 0) > requirement ? error : '';
}
