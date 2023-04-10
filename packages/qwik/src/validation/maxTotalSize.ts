import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/shared';

type Value = MaybeValue<NoSerialize<Blob[]> | NoSerialize<File[]>>;

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
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    value?.length &&
    [...value].reduce((size, file) => size + file.size, 0) > requirement
      ? error
      : ''
  );
}
