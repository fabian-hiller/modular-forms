import type { Accessor, Setter } from 'solid-js';
import type { MaybePromise } from './utils';

/**
 * Function type to validate a field array.
 */
export type ValidateFieldArray<TFieldArrayItems> = (
  items: TFieldArrayItems
) => MaybePromise<string>;

/**
 * Value type ot the internal field array store.
 *
 * Notice: The initial items are used for resetting and may only be changed
 * during this process. They do not move when a field array is moved. The start
 * items, on the other hand, are used to determine whether the field array is
 * dirty and moves with it.
 */
export type InternalFieldArrayStore = {
  // Signals
  getInitialItems: Accessor<number[]>;
  setInitialItems: Setter<number[]>;
  getStartItems: Accessor<number[]>;
  setStartItems: Setter<number[]>;
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

  // Other
  validate: ValidateFieldArray<number[]>[];
  consumers: Set<number>;
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
