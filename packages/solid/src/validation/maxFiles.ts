/**
 * Creates a validation functions that validates the size of a file list.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxFiles(
  requirement: number,
  error: string
): (fieldValue: FileList | null | undefined) => string {
  return (fieldValue: FileList | null | undefined) =>
    (fieldValue?.length || 0) > requirement ? error : '';
}
