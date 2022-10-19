/**
 * Creates a validation functions that validates the file size.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minSize(
  requirement: number,
  error: string
): (fieldValue: File | FileList | null | undefined) => string {
  return (fieldValue: File | FileList | null | undefined) =>
    !!fieldValue &&
    (fieldValue instanceof FileList
      ? [...fieldValue].some((file) => file.size < requirement)
      : fieldValue.size < requirement)
      ? error
      : '';
}
