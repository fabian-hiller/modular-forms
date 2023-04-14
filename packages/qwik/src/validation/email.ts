import { $, type QRL } from '@builder.io/qwik';
import type { MaybeValue } from '@modular-forms/shared';
import { email as validate } from '@modular-forms/shared';

type Value = MaybeValue<string>;

/**
 * Creates a validation functions that validates a email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email(error: string): QRL<(value: Value) => string> {
  return $((value: Value) => validate(error)(value));
}
