import type { QRL } from '@builder.io/qwik';
import type { Maybe, MaybeValue, TransformField } from '../types';
import { toCustom$, type TransformOptions } from './toCustom$';

/**
 * Creates a transformation functions that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @param options The transform options.
 *
 * @returns A transformation functions.
 */
export function toLowerCase<TValue extends MaybeValue<string>>(
  options: TransformOptions
): QRL<TransformField<TValue>> {
  return toCustom$<TValue>(
    (value) => value && (value.toLowerCase() as Maybe<TValue>),
    options
  );
}
