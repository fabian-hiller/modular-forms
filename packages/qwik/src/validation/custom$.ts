import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type { FieldValue, Maybe, MaybePromise } from '@modular-forms/shared';

/**
 * See {@link custom$}
 */
export function customQrl<TFieldValue extends FieldValue>(
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

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export const custom$ = implicit$FirstArg(customQrl);
