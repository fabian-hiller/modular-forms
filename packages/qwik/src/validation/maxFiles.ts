import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '../types';

type Value = MaybeValue<NoSerialize<Blob[]> | NoSerialize<File[]>>;

/**
 * Creates a validation functions that validates the size of a file list.
 *
 * @deprecated Please use `maxLength` instead.
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
