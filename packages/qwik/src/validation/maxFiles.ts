import { $, type NoSerialize, type QRL } from '@builder.io/qwik';

type Value = NoSerialize<Blob[]> | NoSerialize<File[]> | null | undefined;

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
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    value?.length && value.length > requirement ? error : ''
  );
}
