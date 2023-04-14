import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/shared';
import { minTotalSize as validate } from '@modular-forms/shared';

type Value = MaybeValue<NoSerialize<Blob[]> | NoSerialize<File[]>>;

/**
 * Creates a validation functions that validates total file size of a file list.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minTotalSize(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => validate(requirement, error)(value));
}
