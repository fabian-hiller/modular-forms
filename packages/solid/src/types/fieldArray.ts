import {
  FieldArrayPath,
  FieldValues,
  ValidateFieldArray,
} from '@modular-forms/shared';
import { Accessor, Setter } from 'solid-js';
import { FieldValue } from './field';

/**
 * Value type ot the field array store.
 *
 * Notice: The initial items are used for resetting and may only be changed
 * during this process. They do not move when a field array is moved. The start
 * items, on the other hand, are used to determine whether the field array is
 * dirty and moves with it.
 */
export type FieldArrayStore<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  internal: {
    getInitialItems: Accessor<number[]>;
    setInitialItems: Setter<number[]>;
    getStartItems: Accessor<number[]>;
    setStartItems: Setter<number[]>;
    setItems: Setter<number[]>;
    setError: Setter<string>;
    setActive: Setter<boolean>;
    setTouched: Setter<boolean>;
    setDirty: Setter<boolean>;
    validate: ValidateFieldArray<number[]>[];
    consumers: Set<number>;
  };
  name: TFieldArrayName;
  items: number[];
  length: number;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};

/**
 * Value type of the external field array state.
 * TODO: Remove me
 */
export type FieldArrayState<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  name: TFieldArrayName;
  items: number[];
  length: number;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};
