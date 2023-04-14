import { $, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/core';
import { maxLength as validate } from '@modular-forms/core';

type Value = MaybeValue<
  string | string[] | number[] | NoSerialize<Blob[]> | NoSerialize<File[]>
>;

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The maximum string or array length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxLength(
  requirement: number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => validate(requirement, error)(value));
}
