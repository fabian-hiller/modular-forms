import type { FieldEvent, FieldValue, Maybe, TransformField } from '../types';

/**
 * Value type of the transform mode.
 */
export type TransformMode = 'input' | 'change' | 'blur';

/**
 * Value type of the transform options.
 */
export type TransformOptions = {
  on: TransformMode;
};

/**
 * Creates a custom transformation functions.
 *
 * @param action The transform action.
 * @param options The transform options.
 *
 * @returns A transformation functions.
 */
export function toCustom<TFieldValue extends FieldValue>(
  action: TransformField<TFieldValue>,
  { on: mode }: TransformOptions
): TransformField<TFieldValue> {
  return (value: Maybe<TFieldValue>, event: FieldEvent) =>
    event.type === mode ? action(value, event) : value;
}
