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
): (value: File | FileList | null | undefined) => string {
  const mimeTypes = Array.isArray(requirement) ? requirement : [requirement];
  return (value: File | FileList | null | undefined) =>
    value &&
    (value instanceof FileList
      ? [...value].some((file) => !mimeTypes.includes(file.type))
      : !mimeTypes.includes(value.type))
      ? error
      : '';
}
