import { $, type QRL } from '@builder.io/qwik';
import type { FieldValue, Maybe } from '../types';

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
  return $((value: Maybe<TFieldValue> | number[]) =>
    (!value && value !== 0) || (Array.isArray(value) && !value.length)
      ? error
      : ''
  );
}
