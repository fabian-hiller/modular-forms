import type { MaybeValue } from '../types/index.js';

type Value = MaybeValue<File[]>;

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
): (value: Value) => string {
  return (value: Value) =>
    value?.length &&
    [...value].reduce((size, file) => size + file.size, 0) > requirement
      ? error
      : '';
}
