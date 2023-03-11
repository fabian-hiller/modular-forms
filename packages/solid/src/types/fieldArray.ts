import { Accessor, Setter } from 'solid-js';
import { FieldValues } from './field';
import { FieldArrayPath } from './path';
import { MaybePromise } from './utils';

/**
 * Function type to validate a field array.
 */
export type ValidateFieldArray<TFieldArrayItems> = (
  items: TFieldArrayItems
) => MaybePromise<string>;

/**
 * Value type ot the internal field array store.
 */
export type FieldArrayStore = {
  consumers: Set<number>;
  getInitialItems: Accessor<number[]>;
  setInitialItems: Setter<number[]>;
  getItems: Accessor<number[]>;
  setItems: Setter<number[]>;
  getError: Accessor<string>;
  setError: Setter<string>;
  getActive: Accessor<boolean>;
  setActive: Setter<boolean>;
  getTouched: Accessor<boolean>;
  setTouched: Setter<boolean>;
  getDirty: Accessor<boolean>;
  setDirty: Setter<boolean>;
  validate: ValidateFieldArray<number[]>[];
};

/**
 * Value type of the external field array state.
 */
export type FieldArrayState<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  name: TFieldArrayName;
  items: number[];
  length: number;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};

/**
 * Value type of the internal raw field array state.
 */
export type RawFieldArrayState = {
  initialItems: number[];
  items: number[];
  error: string;
  touched: boolean;
  dirty: boolean;
};
