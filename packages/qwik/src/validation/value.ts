import { $, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/core';
import { value as validate } from '@modular-forms/core';

type Value = MaybeValue<string | number>;

/**
 * Creates a validation function that checks the value of an input for equality.
 *
 * @param requirement The value to be checked.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value(
  requirement: string | number,
  error: string
): QRL<(value: Value) => string> {
  return $((value: Value) => validate(requirement, error)(value));
}
