/**
 * Creates a validation functions that validates the range of a string.
 *
 * @param requirement The minimum string range.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minRange(
  requirement: string,
  error: string
): (value: string | null | undefined) => string {
  return (value: string | null | undefined) =>
    value && value < requirement ? error : '';
}
