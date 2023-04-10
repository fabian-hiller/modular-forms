import { $, type QRL } from '@builder.io/qwik';
import type { Maybe, MaybePromise } from '@modular-forms/shared';
import type { FieldValue } from '../types';

/**
 * Creates a custom validation function.
 *
 * @deprecated Please use `custom$` instead.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TFieldValue extends FieldValue>(
  requirement: QRL<(value: Maybe<TFieldValue>) => MaybePromise<boolean>>,
  error: string
): QRL<(value: Maybe<TFieldValue>) => Promise<string>> {
  return $(async (value: Maybe<TFieldValue>) =>
    (Array.isArray(value) ? value.length : value || value === 0) &&
    !(await requirement(value))
      ? error
      : ''
  );
}
