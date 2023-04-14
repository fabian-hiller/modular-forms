import { $, type QRL } from '@builder.io/qwik';
import type { FieldValue, Maybe } from '@modular-forms/shared';
import { required as validate } from '@modular-forms/shared';

/**
 * Creates a validation function that checks the existence of an input.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function required<TFieldValue extends FieldValue>(
  error: string
): QRL<(value: Maybe<TFieldValue> | number[]) => string> {
  return $((value: Maybe<TFieldValue> | number[]) => validate(error)(value));
}
