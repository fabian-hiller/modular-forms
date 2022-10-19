/**
 * Creates a validation functions that validates the file type.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function mimeType(
  requirement: string | string[],
  error: string
): (fieldValue: File | FileList | null | undefined) => string {
  const mimeTypes =
    typeof requirement === 'string' ? [requirement] : requirement;
  return (fieldValue: File | FileList | null | undefined) =>
    !!fieldValue &&
    (fieldValue instanceof FileList
      ? [...fieldValue].some((file) => !mimeTypes.includes(file.type))
      : !mimeTypes.includes(fieldValue.type))
      ? error
      : '';
}
