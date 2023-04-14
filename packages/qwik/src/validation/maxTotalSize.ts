import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/core';
import { maxTotalSize as validate } from '@modular-forms/core';

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
  return $((value: Value) => validate(requirement, error)(value));
}
