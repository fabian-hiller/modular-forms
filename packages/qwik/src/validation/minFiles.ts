import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/shared';

type Value = MaybeValue<NoSerialize<Blob[]> | NoSerialize<File[]>>;

/**
 * Creates a validation functions that validates the size of a file list.
 *
 * @deprecated Please use `minLength` instead.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minFiles(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    value?.length && value.length < requirement ? error : ''
  );
}
