import { Accessor, JSX, Setter } from 'solid-js';
import { FieldPath, FieldPathValue } from './path';
import { Maybe, MaybePromise } from './utils';

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
 * HTML element type of a field.
 */
export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Function type to validate a field.
 */
export type ValidateField<TFieldValue> = (
  value: TFieldValue | undefined
) => MaybePromise<string>;

/**
 * Value type ot the internal field store.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  consumers: Set<number>;
  getElements: Accessor<FieldElement[]>;
  setElements: Setter<FieldElement[]>;
  getInitialInput: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  setInitialInput: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  getInput: Accessor<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  setInput: Setter<Maybe<FieldPathValue<TFieldValues, TFieldName>>>;
  getError: Accessor<string>;
  setError: Setter<string>;
  getActive: Accessor<boolean>;
  setActive: Setter<boolean>;
  getTouched: Accessor<boolean>;
  setTouched: Setter<boolean>;
  getDirty: Accessor<boolean>;
  setDirty: Setter<boolean>;
  validate: ValidateField<Maybe<FieldPathValue<TFieldValues, TFieldName>>>[];
};

/**
 * Value type of the external field state.
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
  elements: FieldElement[];
  initialInput: Maybe<FieldValue>;
  input: Maybe<FieldValue>;
  error: string;
  touched: boolean;
  dirty: boolean;
};
