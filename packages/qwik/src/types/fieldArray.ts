import type { QRL } from '@builder.io/qwik';
import type { MaybePromise, Maybe } from '@modular-forms/shared';
import type { FieldValues } from './field';
import type { FieldArrayPath } from './path';

/**
 * Function type to validate a field array.
 */
export type ValidateFieldArray<TFieldArrayItems> = (
  items: TFieldArrayItems
) => MaybePromise<string>;

/**
 * Value type ot the field array store.
 *
 * Notice: The initial items are used for resetting and may only be changed
 * during this process. They do not move when a field array is moved. The start
 * items, on the other hand, are used to determine whether the field array is
 * dirty and moves with it.
 */
export type FieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  internal: {
    initialItems: number[];
    startItems: number[];
    validate: QRL<ValidateFieldArray<number[]>>[];
    consumers: number[];
  };
  name: TFieldArrayName;
  items: number[];
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};

/**
 * Value type of the initial field array state.
 */
export type InitialFieldArrayState = {
  items: number[];
  initialItems?: number[];
  error?: Maybe<string>;
};

/**
 * Value type of the internal raw field array state.
 */
export type RawFieldArrayState = {
  startItems: number[];
  items: number[];
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};
