import { $, type QRL } from '@builder.io/qwik';

/**
 * Creates a validation functions that validates total file size of a file list.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxTotalSize(
  requirement: number,
  error: string
): QRL<(value: FileList | null | undefined) => string> {
  return $((value: FileList | null | undefined) =>
    value?.length &&
    [...value].reduce((size, file) => size + file.size, 0) > requirement
      ? error
      : ''
  );
}
