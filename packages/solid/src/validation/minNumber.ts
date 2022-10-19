/**
 * Creates a validation functions that validates a number.
 *
 * @param requirement The minimum number.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minNumber(
  requirement: number,
  error: string
): (fieldValue: number | null | undefined) => string {
  return (fieldValue: number | null | undefined) =>
    (fieldValue || 0) < requirement ? error : '';
}
