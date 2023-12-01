import type { QRL } from '@builder.io/qwik';
import type { Maybe, MaybeValue, TransformField } from '../types';
import { toCustom$, type TransformOptions } from './toCustom$';

/**
 * Creates a transformation functions that converts all the alphabetic
 * characters in a string to uppercase.
 *
 * @param options The transform options.
 *
 * @returns A transformation functions.
 */
export function toUpperCase<TValue extends MaybeValue<string>>(
  options: TransformOptions
): QRL<TransformField<TValue>> {
  return toCustom$<TValue>(
    (value) => value && (value.toUpperCase() as Maybe<TValue>),
    options
  );
}
