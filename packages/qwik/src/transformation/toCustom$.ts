import { $, implicit$FirstArg, type QRL } from '@builder.io/qwik';
import type {
  FieldElement,
  FieldEvent,
  FieldValue,
  Maybe,
  TransformField,
} from '../types';

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
 * See {@link toCustom$}
 */
export function toCustomQrl<TFieldValue extends FieldValue>(
  action: QRL<TransformField<TFieldValue>>,
  { on: mode }: TransformOptions
): QRL<TransformField<TFieldValue>> {
  return $(
    (value: Maybe<TFieldValue>, event: FieldEvent, element: FieldElement) =>
      event.type === mode ? action(value, event, element) : value
  );
}

/**
 * Creates a custom transformation functions.
 *
 * @param action The transform action.
 * @param options The transform options.
 *
 * @returns A transformation functions.
 */
export const toCustom$ = implicit$FirstArg(toCustomQrl);
