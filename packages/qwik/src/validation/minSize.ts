import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/shared';
import { minSize as validate } from '@modular-forms/shared';

type Value = MaybeValue<
  | NoSerialize<Blob>
  | NoSerialize<Blob[]>
  | NoSerialize<File>
  | NoSerialize<File[]>
>;

/**
 * Creates a validation functions that validates the file size.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minSize(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => validate(requirement, error)(value));
}
