import { FieldElement, Maybe, ValidateField } from '@modular-forms/shared';
import { Accessor, JSX, Setter } from 'solid-js';
import { FieldPath, FieldPathValue } from './path';

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
  | FileList;

/**
 * Value type of the form fields.
 */
export type FieldValues = {
  [name: string]: FieldValue | FieldValue[] | FieldValues | FieldValues[];
};

/**
 * Value type ot the field store.
 *
 * Notice: The initial value is used for resetting and may only be changed
 * during this process. It does not move when a field is moved. The start
 * value, on the other hand, is used to determine whether the field is dirty
 * and moves with it.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  internal: {
    getElements: Accessor<FieldElement[]>;
    setElements: Setter<FieldElement[]>;
    // TODO: Check if it is necessary that initial and start value is a signal
    getInitialValue: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
    setInitialValue: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
    getStartValue: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
    setStartValue: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
    setValue: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
    setError: Setter<string>;
    setActive: Setter<boolean>;
    setTouched: Setter<boolean>;
    setDirty: Setter<boolean>;
    validate: ValidateField<FieldPathValue<TFieldValues, TFieldName>>[];
    consumers: Set<number>;
  };
  name: TFieldName;
  value: Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};

/**
 * Value type of the external field state.
 * TODO: Remove me
 */
export type FieldState<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  props: {
    name: TFieldName;
    ref: (element: FieldElement) => void;
    onInput: JSX.EventHandler<FieldElement, InputEvent>;
    onChange: JSX.EventHandler<FieldElement, Event>;
    onBlur: JSX.EventHandler<FieldElement, FocusEvent>;
  };
  name: TFieldName;
  value: Maybe<FieldPathValue<TFieldValues, TFieldName>>;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};

/**
 * Value type of the internal raw field state.
 */
export type RawFieldState = {
  initialInput: Maybe<FieldValue>;
  input: Maybe<FieldValue>;
  error: string;
  touched: boolean;
  dirty: boolean;
};
