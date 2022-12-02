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
): (value: number | null | undefined) => string {
  return (value: number | null | undefined) =>
    (value || value === 0) && value < requirement ? error : '';
}
