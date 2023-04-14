import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/core';
import { mimeType as validate } from '@modular-forms/core';

type Value = MaybeValue<
  | NoSerialize<Blob>
  | NoSerialize<Blob[]>
  | NoSerialize<File>
  | NoSerialize<File[]>
>;

/**
 * Creates a validation functions that validates the file type.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function mimeType(
  requirement: string | string[],
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => validate(requirement, error)(value));
}
