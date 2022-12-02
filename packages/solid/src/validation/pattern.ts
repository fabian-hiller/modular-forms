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
): (value: string | null | undefined) => string {
  return (value: string | null | undefined) =>
    value && !requirement.test(value) ? error : '';
}
