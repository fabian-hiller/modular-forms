import {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  MaybeValue,
  ValidateField,
} from '@modular-forms/shared';
import { Accessor, JSX, Setter } from 'solid-js';

/**
 * Value type of a field.
 */
export type FieldValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined
  | File
  | File[]
  | Date;

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
 * Value type ot the field store.
 *
 * Notice: The initial value is used for resetting and may only be changed
 * during this process. It does not move when a field is moved. The start
 * value, on the other hand, is used to determine whether the field is dirty
 * and moves with it.
 */
export type FieldStore<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
> = {
  internal: {
    getElements: Accessor<FieldElement[]>;
    setElements: Setter<FieldElement[]>;
    // TODO: Check if it is necessary that initial and start value is a signal
    getInitialValue: Accessor<
      Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
    >;
    setInitialValue: Setter<
      Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
    >;
    getStartValue: Accessor<
      Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
    >;
    setStartValue: Setter<
      Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
    >;
    setValue: Setter<
      Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
    >;
    setError: Setter<string>;
    setActive: Setter<boolean>;
    setTouched: Setter<boolean>;
    setDirty: Setter<boolean>;
    validate: ValidateField<
      FieldPathValue<TFieldValues, TFieldName, FieldValue>
    >[];
    consumers: Set<number>;
  };
  name: TFieldName;
  get value(): Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>;
  get error(): string;
  get active(): boolean;
  get touched(): boolean;
  get dirty(): boolean;
};

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
> = {
  name: TFieldName;
  autoFocus: boolean;
  ref: (element: FieldElement) => void;
  onInput: JSX.EventHandler<FieldElement, InputEvent>;
  onChange: JSX.EventHandler<FieldElement, Event>;
  onBlur: JSX.EventHandler<FieldElement, FocusEvent>;
};
