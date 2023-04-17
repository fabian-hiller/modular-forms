import type { Accessor, Setter } from 'solid-js';
import type { FieldPath, FieldPathValue } from './path';
import type { MaybeValue, MaybePromise, Maybe } from './utils';

/**
 * Value type of a field.
 */
export type FieldValue = MaybeValue<
  string | string[] | number | boolean | File | File[] | Date
>;

/**
 * Value type of the field type.
 */
export type FieldType<T> = T extends MaybeValue<string>
  ? 'string'
  : T extends MaybeValue<string[]>
  ? 'string[]'
  : T extends MaybeValue<number>
  ? 'number'
  : T extends MaybeValue<boolean>
  ? 'boolean'
  : T extends MaybeValue<File>
  ? 'File'
  : T extends MaybeValue<File[]>
  ? 'File[]'
  : T extends MaybeValue<Date>
  ? 'Date'
  : never;

/**
 * HTML element type of a field.
 */
export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Value type of the form fields.
 */
export type FieldValues = {
  [name: string]: FieldValue | FieldValues | (FieldValue | FieldValues)[];
};

/**
 * Function type to validate a field.
 */
export type ValidateField<TFieldValue> = (
  value: TFieldValue | undefined
) => MaybePromise<string>;

/**
 * Value type ot the internal field store.
 *
 * Notice: The initial value is used for resetting and may only be changed
 * during this process. It does not move when a field is moved. The start
 * value, on the other hand, is used to determine whether the field is dirty
 * and moves with it.
 */
export type InternalFieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  // Signals
  getElements: Accessor<FieldElement[]>;
  setElements: Setter<FieldElement[]>;
  getInitialValue: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  setInitialValue: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  getStartValue: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  setStartValue: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  getValue: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  setValue: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  getError: Accessor<string>;
  setError: Setter<string>;
  getActive: Accessor<boolean>;
  setActive: Setter<boolean>;
  getTouched: Accessor<boolean>;
  setTouched: Setter<boolean>;
  getDirty: Accessor<boolean>;
  setDirty: Setter<boolean>;

  // Other
  validate: ValidateField<FieldPathValue<TFieldValues, TFieldName>>[];
  consumers: Set<number>;
};

/**
 * Value type of the internal raw field state.
 */
export type RawFieldState<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  startValue: Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  value: Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  error: string;
  touched: boolean;
  dirty: boolean;
};
