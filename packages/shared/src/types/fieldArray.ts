import type { FieldValues } from './field';
import type { FieldArrayPath } from './path';
import type { MaybePromise, MaybeQRL } from './utils';

/**
 * Function type to validate a field array.
 */
export type ValidateFieldArray<TFieldArrayItems> = MaybeQRL<
  (items: TFieldArrayItems) => MaybePromise<string>
>;

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
    validate: ValidateFieldArray<number[]>[];
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
 * Value type of the internal raw field array state.
 */
export type RawFieldArrayState = {
  startItems: number[];
  items: number[];
  error: string;
  touched: boolean;
  dirty: boolean;
};
