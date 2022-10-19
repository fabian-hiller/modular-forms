/**
 * Creates a validation functions that validates the pattern of a string.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function pattern(
  requirement: RegExp,
  error: string
): (fieldValue: string | null | undefined) => string {
  return (fieldValue: string | null | undefined) =>
    !requirement.test(fieldValue || '') ? error : '';
}
