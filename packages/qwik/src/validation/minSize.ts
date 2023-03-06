import { $, type QRL } from '@builder.io/qwik';

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
): QRL<(value: File | FileList | null | undefined) => string> {
  return $((value: File | FileList | null | undefined) =>
    value &&
    (value instanceof FileList
      ? [...value].some((file) => file.size < requirement)
      : value.size < requirement)
      ? error
      : ''
  );
}
