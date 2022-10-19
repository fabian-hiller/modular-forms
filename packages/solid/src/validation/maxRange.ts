/**
 * Creates a validation functions that validates the range of a string.
 *
 * @param requirement The maximum string range.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxRange(
  requirement: string,
  error: string
): (fieldValue: string | null | undefined) => string {
  return (fieldValue: string | null | undefined) =>
    fieldValue || '' > requirement ? error : '';
}
