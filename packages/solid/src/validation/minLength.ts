/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The minimum string or array length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minLength(
  requirement: number,
  error: string
): (fieldValue: string | string[] | number[] | null | undefined) => string {
  return (fieldValue: string | string[] | number[] | null | undefined) =>
    (fieldValue?.length || 0) < requirement ? error : '';
}
