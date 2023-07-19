import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '../types';

type Value = MaybeValue<
  | NoSerialize<Blob>
  | NoSerialize<Blob>[]
  | NoSerialize<File>
  | NoSerialize<File>[]
>;

/**
 * Creates a validation functions that validates the file size.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxSize(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) =>
    value &&
    (Array.isArray(value)
      ? [...value].some((file) => file!.size > requirement)
      : value.size > requirement)
      ? error
      : ''
  );
}
